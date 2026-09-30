"""Background loop: Reject/Edit -> regenerate, Approved -> Publish, Schedule & Archive."""
import re
from datetime import datetime, timezone

from . import config as cfg
from . import crews, publisher
from .flow import evaluate
from .knowledge import get_store
from .supabase_io import create_or_update_draft, now, sb


def _ts(s):
    try:
        d = datetime.fromisoformat(s.replace("Z", "+00:00"))
        return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)


def revise_rejected() -> int:
    """Reviewer sent an agent draft back with a note -> Content agent regenerates using that feedback."""
    rows = (sb().table("content_drafts").select("*, content_reviews(*)")
            .not_.is_("agent_run_id", "null").in_("status", ["draft", "rejected"])
            .lt("revision", cfg.MAX_REVISIONS).execute().data)
    n, store = 0, get_store()
    for d in rows:
        since = _ts(d["agent_generated_at"] or d["created_at"])
        notes = sorted((r for r in d["content_reviews"]
                        if r["status"] in ("changes_requested", "rejected") and r.get("comments")
                        and _ts(r["created_at"]) > since), key=lambda r: r["created_at"])
        if not notes:
            continue
        feedback = re.sub(r"^Editor Note:\s*", "", notes[-1]["comments"])
        try:
            _, report, styled = crews.run_content(d["title"], feedback)
        except Exception as e:
            print(f"[warn] revision failed for {d['title']}: {e}")
            continue
        conf, issues = evaluate(report, store)
        styled.x_post = publisher.compose_x(styled)
        ids = sorted({s for c in report.verified_claims for s in c.source_ids})
        labels = {s: store.g.nodes.get(f"src::{s}", {}).get("label", s) for s in ids}
        create_or_update_draft(d["agent_run_id"], styled, conf, issues, d["publish_at"], ids, labels,
                               draft_id=d["id"], revision=d["revision"] + 1)
        n += 1
    return n


def publish_approved() -> int:
    rows = (sb().table("content_drafts").select("*").not_.is_("agent_run_id", "null")
            .in_("status", ["approved", "published"]).in_("publish_state", ["none", "story_done"])
            .execute().data)
    n = 0
    for d in rows:
        if _ts(d["publish_at"] or now()) > datetime.now(timezone.utc):
            continue                                            # scheduled for later
        try:
            if d["publish_state"] == "none":
                words = len((d["body"] or "").split())
                sb().table("science_stories").insert({
                    "title": d["title"], "slug": f"{publisher.slug(d['title'])}-{d['id'][:6]}",
                    "summary": d["summary"], "body": d["body"], "audience": "general_public",
                    "reading_time": max(1, words // 200), "status": "published"}).execute()
                sb().table("content_drafts").update({"publish_state": "story_done"}).eq("id", d["id"]).execute()
            x_id = publisher._post_x((d["social_caption"] or d["summary"] or "")[:280])
            sb().table("content_drafts").update(
                {"status": "published", "publish_state": "published", "x_post_id": x_id}).eq("id", d["id"]).execute()
            n += 1
        except Exception as e:
            print(f"[warn] publish failed for {d['title']}: {e}")
    return n


def tick():
    return revise_rejected(), publish_approved()
