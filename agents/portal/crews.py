"""Crews/tasks. Formatting avoids curly braces because CrewAI treats {x} as a template variable."""
from datetime import datetime, timezone

from crewai import Crew, Process, Task

from . import agents as A
from . import config as cfg
from .models import (ContentPlan, CrossLinks, Draft, ExtractionResult, MediaResult,
                     SchedulePlan, StyledContent, ValidationReport)


def run_task(agent, description, expected, model=None):
    task = Task(description=description, expected_output=expected, agent=agent, output_pydantic=model)
    out = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=cfg.VERBOSE).kickoff()
    if model is None:
        return out.raw
    if out.pydantic is None:
        raise RuntimeError(f"{agent.role}: no structured output")
    return out.pydantic


# ---- Specialized agents (run in parallel by the flow) ----
def run_media(item: dict) -> MediaResult:
    agent = {"document": A.document_agent, "image": A.image_agent, "video": A.video_agent}[item["type"]]()
    tool = {"document": "read_document", "image": "analyze_image", "video": "analyze_video"}[item["type"]]
    meta = f"\nSidecar metadata: {item['meta']}" if item.get("meta") else ""
    return run_task(
        agent,
        f"Call the {tool} tool on path {item['path']}.{meta}\n"
        f"Use source_id = {item['source_id']} and media_type = {item['type']}. "
        f"Return a faithful summary, a title and up to 10 key facts (each short and self-contained). "
        f"If the tool reports missing capabilities, say so in the summary rather than guessing.",
        "A MediaResult with summary and key facts", MediaResult)


def run_extraction(media: MediaResult) -> ExtractionResult:
    facts = "\n".join(f"- {f}" for f in media.key_facts)
    ex = run_task(
        A.extraction_agent(),
        f"Source {media.source_id} ({media.media_type}), title: {media.title}\n"
        f"Summary: {media.summary}\nKey facts:\n{facts}\n\n"
        f"Extract atomic facts (each understandable alone), entities (with a type such as Person, Place, "
        f"Expedition, Instrument, Species, Date) and relations between entities. Use consistent entity names.",
        "An ExtractionResult", ExtractionResult)
    ex.source_id, ex.media_type = media.source_id, media.media_type
    return ex


def _fmt(exs):
    return "\n".join(f"[{e.source_id}] ({e.media_type}) {e.summary} | entities: "
                     f"{', '.join(x.name for x in e.entities)}" for e in exs)


def run_links(exs: list[ExtractionResult]) -> CrossLinks:
    return run_task(
        A.linking_agent(),
        "Find sources that are about the same expedition, place, event, date or entity, "
        "including across media types (document<->image<->video). Only use these source_ids:\n" + _fmt(exs),
        "CrossLinks", CrossLinks)


def run_orchestrator(summaries: list[tuple[str, str, str]]) -> ContentPlan:
    lines = "\n".join(f"[{s}] ({m}) {t}" for s, m, t in summaries)
    return run_task(
        A.orchestrator(),
        f"Knowledge base contents:\n{lines}\n\nChoose 1 to 4 distinct outreach topics that the "
        f"evidence supports well. Each topic is a short phrase.", "ContentPlan", ContentPlan)


def run_schedule(topics: list[str], summaries) -> SchedulePlan:
    lines = "\n".join(f"[{s}] {t}" for s, _, t in summaries)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    return run_task(
        A.schedule_agent(),
        f"Now: {now}\nTopics: {topics}\nSources:\n{lines}\n\nAssign an ISO-8601 UTC publish_at to every "
        f"topic. Use dates found in the sources when relevant; otherwise space posts about a day apart "
        f"starting now. Never schedule in the past.", "SchedulePlan", SchedulePlan)


# ---- Content pipeline: Content Gen -> Validation -> Persona Styling (one sequential crew) ----
def run_content(topic: str, feedback: str = ""):
    fb = f"\nA human reviewer rejected the previous version with this feedback, address it: {feedback}" if feedback else ""
    ca, va, pa = A.content_agent(), A.validation_agent(), A.persona_agent()
    t1 = Task(
        description=f"Topic: {topic}.{fb}\nUse graphrag_search (query several times if needed) and write 4 to 8 "
                    f"claims. Each claim is one factual sentence with the source_ids that support it, "
                    f"copied exactly from the [brackets] in search results.",
        expected_output="A Draft of cited claims", agent=ca, output_pydantic=Draft)
    t2 = Task(
        description="For each claim in the draft, call get_source_facts for each cited source_id and decide if "
                    "the facts support the claim. Return every check, and verified_claims containing ONLY "
                    "supported claims, unchanged.",
        expected_output="A ValidationReport", agent=va, context=[t1], output_pydantic=ValidationReport)
    t3 = Task(
        description="Using ONLY verified_claims from the validation report, write: an X post (max 250 "
                    "characters, no hashtags in the text), a 250-400 word website article in Markdown with a "
                    "title, up to 3 hashtags without # and a one-sentence image_prompt for an illustrative visual. "
                    "Add nothing that is not in the verified claims.",
        expected_output="StyledContent", agent=pa, context=[t2], output_pydantic=StyledContent)
    Crew(agents=[ca, va, pa], tasks=[t1, t2, t3], process=Process.sequential, verbose=cfg.VERBOSE).kickoff()
    return t1.output.pydantic, t2.output.pydantic, t3.output.pydantic


# ---- Knowledge Agent: chat with conversational refinement ----
def chat_turn(history: list[tuple[str, str]], question: str) -> str:
    past = "\n".join(f"User: {q}\nAssistant: {a}" for q, a in history[-4:]) or "(none)"
    return run_task(
        A.knowledge_agent(),
        f"Conversation so far:\n{past}\n\nNew question: {question}\n\nRewrite the question as a standalone "
        f"query if it refers to earlier turns, call graphrag_search (re-query with different wording if the "
        f"evidence is thin), then answer using only retrieved evidence and cite [source_id]s. If there is "
        f"no evidence, say you do not know.", "A cited answer")
