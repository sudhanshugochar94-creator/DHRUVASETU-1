"""FastAPI service for the React portal. Run: python main.py serve"""
import threading
import time
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from portal import config as cfg
from portal.supabase_io import new_run, sb, set_run

_run_lock = threading.Lock()


def _sync_loop():
    from portal.sync import tick
    while True:
        try:
            tick()
        except Exception as e:
            print("[sync] error:", e)
        time.sleep(cfg.SYNC_INTERVAL)


@asynccontextmanager
async def lifespan(_: FastAPI):
    threading.Thread(target=_sync_loop, daemon=True).start()
    yield


app = FastAPI(title="DhruvaSetu agents", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=cfg.CORS_ORIGINS, allow_methods=["*"], allow_headers=["*"])


def staff(authorization: str = Header(default="")) -> str:
    """Only content managers / administrators (verified against the user's Supabase JWT) may run the pipeline."""
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(401, "Missing bearer token")
    try:
        uid = sb().auth.get_user(token).user.id
        role = sb().table("profiles").select("role").eq("id", uid).single().execute().data["role"]
    except Exception:
        raise HTTPException(401, "Invalid session")
    if role not in ("content_manager", "administrator"):
        raise HTTPException(403, "Content manager or administrator role required")
    return uid


def _run(run_id: str):
    from portal.flow import PortalFlow
    with _run_lock:
        try:
            flow = PortalFlow()
            flow.state.mode, flow.state.run_id = "supabase", run_id
            flow.kickoff()
            set_run(run_id, status="done")
        except Exception as e:
            set_run(run_id, status="failed", error=str(e)[:500])


@app.get("/health")
def health():
    return {"ok": True, "dry_run": cfg.DRY_RUN}


@app.post("/run")
def run(uid: str = Depends(staff)):
    if _run_lock.locked():
        raise HTTPException(409, "A pipeline run is already in progress")
    run_id = new_run(uid)
    threading.Thread(target=_run, args=(run_id,), daemon=True).start()
    return {"run_id": run_id}


@app.get("/runs")
def runs(_: str = Depends(staff)):
    return sb().table("agent_runs").select("*").order("created_at", desc=True).limit(10).execute().data


class ChatIn(BaseModel):
    question: str
    history: list[tuple[str, str]] = []


@app.post("/chat")
def chat(body: ChatIn):
    from portal.crews import chat_turn
    q = body.question.strip()[:1000]
    if not q:
        raise HTTPException(400, "Empty question")
    return {"answer": str(chat_turn(body.history, q))}
