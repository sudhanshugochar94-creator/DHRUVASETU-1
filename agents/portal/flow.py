"""Top-level pipeline that mirrors the diagram, built on a CrewAI Flow.
mode="cli"      -> data/inbox + terminal approval (standalone)
mode="supabase" -> resources table in, drafts into the portal's Review Queue (human approval in the UI)
"""
from concurrent.futures import ThreadPoolExecutor

from crewai.flow.flow import Flow, listen, start
from pydantic import BaseModel, Field

from . import approval, crews, publisher
from . import config as cfg
from .knowledge import get_store
from .models import ExtractionResult
from .publisher import slug
from .tools import DOC_EXT, IMG_EXT, VID_EXT


class PortalState(BaseModel):
    mode: str = "cli"
    run_id: str = ""
    force: bool = False
    manifest: list[dict] = Field(default_factory=list)
    extractions: list[ExtractionResult] = Field(default_factory=list)
    topics: list[str] = Field(default_factory=list)
    schedule: dict[str, str] = Field(default_factory=dict)
    drafts: int = 0


def scan_inbox(force: bool) -> list[dict]:
    """Classify files, attach optional <file>.meta.json sidecar metadata."""
    store, items = get_store(), []
    for p in sorted(cfg.INBOX.iterdir()):
        ext = p.suffix.lower()
        kind = "document" if ext in DOC_EXT else "image" if ext in IMG_EXT else "video" if ext in VID_EXT else None
        if not kind:
            continue
        sid = slug(p.stem)
        if store.has_source(sid) and not force:
            continue
        side = p.with_name(p.name + ".meta.json")
        items.append({"path": str(p), "type": kind, "source_id": sid,
                      "meta": side.read_text() if side.exists() else ""})
    return items


def evaluate(report, store):
    """Confidence = share of claims that passed. Claims citing unknown sources never pass."""
    issues = [f"{c.text} ({c.note})" for c in report.checks if not c.supported]
    for cl in report.verified_claims:
        if any(not store.has_source(s) for s in cl.source_ids):
            issues.append(f"unknown source cited: {cl.text}")
    total = len(report.checks)
    return ((total - len(issues)) / total if total else 0.0), issues


class PortalFlow(Flow[PortalState]):

    def _stage(self, stage: str, **detail):
        print(f"[{stage}] {detail or ''}")
        if self.state.mode == "supabase" and self.state.run_id:
            from .supabase_io import set_run
            set_run(self.state.run_id, status="running", stage=stage, detail=detail)

    @start()
    def ingest(self):
        if self.state.mode == "supabase":
            from .supabase_io import pull_new_resources
            pull_new_resources()
        self.state.manifest = scan_inbox(self.state.force)
        self._stage("ingest", new_files=len(self.state.manifest))

    @listen(ingest)
    def specialized_agents(self):
        """Document / Image / Video agents -> Information Extraction, files processed in parallel."""
        def work(item):
            try:
                return crews.run_extraction(crews.run_media(item))
            except Exception as e:
                print(f"[warn] {item['source_id']} failed: {e}")
                return None
        with ThreadPoolExecutor(max_workers=cfg.MAX_PARALLEL) as pool:
            self.state.extractions = [r for r in pool.map(work, self.state.manifest) if r]
        self._stage("extract", processed=len(self.state.extractions), failed=len(self.state.manifest) - len(self.state.extractions))

    @listen(specialized_agents)
    def link_and_build_knowledge(self):
        """Cross-Media Linking Agent -> Knowledge Agent (graph + vector writes)."""
        store, exs = get_store(), self.state.extractions
        for ex in exs:
            store.add_extraction(ex)
        if len(exs) > 1:
            try:
                store.add_links(crews.run_links(exs))
            except Exception as e:
                print(f"[warn] cross-media linking failed: {e}")
        store.save()
        if self.state.mode == "supabase":
            from .supabase_io import mark_ingested
            mark_ingested([e.source_id for e in exs])
        self._stage("knowledge", sources_in_graph=len(store.source_summaries()))

    @listen(link_and_build_knowledge)
    def orchestrate_and_schedule(self):
        summaries = get_store().source_summaries()
        if not summaries:
            self._stage("stopped", reason="knowledge base is empty")
            return
        self.state.topics = crews.run_orchestrator(summaries).topics
        plan = crews.run_schedule(self.state.topics, summaries)
        self.state.schedule = {i.topic: i.publish_at for i in plan.items}
        self._stage("plan", topics=self.state.topics)

    @listen(orchestrate_and_schedule)
    def content_pipeline(self):
        store = get_store()
        for topic in self.state.topics:
            feedback = ""
            for _ in range(cfg.MAX_REVISIONS):
                try:
                    _, report, styled = crews.run_content(topic, feedback)
                except Exception as e:
                    print(f"[warn] content for '{topic}' failed: {e}")
                    break
                confidence, issues = evaluate(report, store)
                styled.x_post = publisher.compose_x(styled)
                ids = sorted({s for c in report.verified_claims for s in c.source_ids})
                when = self.state.schedule.get(topic, "")

                if self.state.mode == "supabase":       # human approval happens in the portal's Review Queue
                    from .supabase_io import create_or_update_draft
                    labels = {s: store.g.nodes.get(f"src::{s}", {}).get("label", s) for s in ids}
                    create_or_update_draft(self.state.run_id, styled, confidence, issues, when, ids, labels)
                    self.state.drafts += 1
                    break

                if cfg.AUTO_APPROVE_CONFIDENCE and confidence >= cfg.AUTO_APPROVE_CONFIDENCE and not issues:
                    d = approval.Decision("approve", content=styled)
                else:
                    d = approval.review(styled, confidence, issues)
                if d.action == "approve":
                    publisher.archive_and_schedule(d.content, when, confidence)
                    break
                if d.action == "skip":
                    break
                feedback = d.feedback                   # Reject/Edit loop back to Content Generation
        if self.state.mode == "cli":
            n = publisher.publish_due()
            print(f"[publish] {n} item(s) published now; the rest are queued in data/output/scheduled.json")
        else:
            self._stage("awaiting_review", drafts=self.state.drafts)
