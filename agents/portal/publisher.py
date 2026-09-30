"""Publish, Schedule & Archive. Deterministic on purpose: approved text is published byte-for-byte."""
import json
import os
import re
from datetime import datetime, timezone

from . import config as cfg
from .models import StyledContent

QUEUE = cfg.OUT / "scheduled.json"


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60] or "post"


def compose_x(c: StyledContent) -> str:
    text = c.x_post.strip()
    tags = " ".join("#" + t.lstrip("#") for t in c.hashtags[:3])
    if tags and len(text) + 1 + len(tags) <= 280:
        text += " " + tags
    return text if len(text) <= 280 else text[:277].rsplit(" ", 1)[0] + "..."


def _load():
    return json.loads(QUEUE.read_text()) if QUEUE.exists() else []


def _parse(ts: str) -> datetime:
    try:
        d = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)


def archive_and_schedule(c: StyledContent, publish_at: str, confidence: float):
    rec = {"content": c.model_dump(), "publish_at": publish_at, "confidence": confidence,
           "approved_at": datetime.now(timezone.utc).isoformat(), "status": "pending"}
    stamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")
    (cfg.ARCHIVE / f"{stamp}_{slug(c.topic)}.json").write_text(json.dumps(rec, indent=2))
    QUEUE.write_text(json.dumps(_load() + [rec], indent=2))


def _post_x(text: str) -> str:
    if cfg.DRY_RUN:
        print(f"[DRY_RUN] would post to X: {text}")
        return "dry-run"
    import tweepy
    client = tweepy.Client(consumer_key=os.environ["X_API_KEY"], consumer_secret=os.environ["X_API_SECRET"],
                           access_token=os.environ["X_ACCESS_TOKEN"],
                           access_token_secret=os.environ["X_ACCESS_SECRET"])
    return str(client.create_tweet(text=text).data["id"])


def publish_due() -> int:
    q, n, now = _load(), 0, datetime.now(timezone.utc)
    for rec in q:
        if rec["status"] != "pending" or _parse(rec["publish_at"]) > now:
            continue
        c = StyledContent(**rec["content"])
        (cfg.SITE / f"{slug(c.topic)}.md").write_text(c.article_md)
        rec["x_id"] = _post_x(c.x_post)
        rec["status"] = "published"
        n += 1
    QUEUE.write_text(json.dumps(q, indent=2))
    return n
