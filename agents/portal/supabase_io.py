"""All Supabase access for the agent backend. Uses the service_role key (server side only)."""
import json
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import httpx
from supabase import Client, create_client

from . import config as cfg
from .publisher import slug
from .tools import DOC_EXT, IMG_EXT, VID_EXT

MAP_FILE = cfg.STORE / "resource_map.json"      # source_id -> resource uuid
_sb: Client | None = None


def sb() -> Client:
    global _sb
    if _sb is None:
        if not cfg.SUPABASE_URL or not cfg.SUPABASE_SERVICE_KEY:
            raise RuntimeError("Set SUPABASE_URL and SUPABASE_SERVICE_KEY")
        _sb = create_client(cfg.SUPABASE_URL, cfg.SUPABASE_SERVICE_KEY)
    return _sb


def now() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_map() -> dict:
    return json.loads(MAP_FILE.read_text()) if MAP_FILE.exists() else {}


def _save_map(m: dict):
    MAP_FILE.write_text(json.dumps(m, indent=1))


# ---------------- Data Ingestion Module (from the portal's own tables) ----------------
def pull_new_resources(limit: int = 25) -> int:
    """Copy not-yet-ingested published resources into data/inbox with their DB metadata as a sidecar.
    Files the agents can't read (e.g. NetCDF) become a text document built from the metadata."""
    rows = (sb().table("resources").select("*").eq("status", "published")
            .is_("agent_ingested_at", "null").limit(limit).execute().data)
    m, n = load_map(), 0
    for r in rows:
        base = f"{slug(r['title'])[:40]}-{r['id'][:8]}"
        meta = {k: r.get(k) for k in ("title", "resource_type", "region", "research_theme", "year",
                                      "author", "institution", "language", "license", "description")}
        url = r.get("file_url") or ""
        ext = Path(urlparse(url).path).suffix.lower()
        if url and ext in DOC_EXT | IMG_EXT | VID_EXT:
            try:
                data = httpx.get(url, follow_redirects=True, timeout=120).content
            except Exception as e:
                print(f"[warn] download failed for {r['title']}: {e}")
                continue                                   # stays un-ingested, retried next run
            target = cfg.INBOX / f"{base}{ext}"
            target.write_bytes(data)
        else:
            target = cfg.INBOX / f"{base}.md"
            target.write_text(f"# {r['title']}\n\n{r.get('description') or ''}\n\n"
                              f"Type: {r['resource_type']}. Region: {r['region']}. Theme: {r['research_theme']}. "
                              f"Year: {r['year']}. Author: {r['author']}.\n")
        target.with_name(target.name + ".meta.json").write_text(json.dumps(meta))
        m[slug(target.stem)] = r["id"]
        n += 1
    _save_map(m)
    return n


def mark_ingested(source_ids: list[str]):
    m = load_map()
    for sid in source_ids:
        if sid in m:
            sb().table("resources").update({"agent_ingested_at": now()}).eq("id", m[sid]).execute()


# ---------------- Human Approval = the portal's Review Queue ----------------
def create_or_update_draft(run_id, styled, confidence, issues, publish_at, source_ids, labels,
                           draft_id=None, revision=0):
    row = {
        "title": styled.topic, "content_type": "website_article", "audience": "general_public",
        "tone": "public_friendly", "summary": styled.x_post, "body": styled.article_md,
        "social_caption": styled.x_post, "hashtags": styled.hashtags, "status": "under_review",
        "agent_run_id": run_id, "confidence": round(confidence, 3), "validation_flags": issues,
        "publish_at": publish_at or now(), "revision": revision, "source_ids": source_ids,
        "agent_generated_at": now(),
    }
    if draft_id:
        sb().table("content_drafts").update(row).eq("id", draft_id).execute()
        sb().table("content_sources").delete().eq("content_draft_id", draft_id).execute()
    else:
        draft_id = sb().table("content_drafts").insert(row).execute().data[0]["id"]
    m = load_map()
    srcs = [{"content_draft_id": draft_id, "resource_id": m.get(s),
             "source_title": labels.get(s, s)} for s in source_ids]
    if srcs:
        sb().table("content_sources").insert(srcs).execute()
    return draft_id


# ---------------- Run tracking ----------------
def new_run(started_by=None) -> str:
    return sb().table("agent_runs").insert({"status": "queued", "started_by": started_by}).execute().data[0]["id"]


def set_run(run_id: str, **fields):
    if run_id:
        fields["updated_at"] = now()
        sb().table("agent_runs").update(fields).eq("id", run_id).execute()
