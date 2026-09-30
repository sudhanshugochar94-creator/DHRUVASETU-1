import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

ROOT = Path(__file__).resolve().parent.parent
IS_VERCEL = os.getenv("VERCEL") == "1"
DATA = Path(os.getenv("DATA_DIR", "/tmp/dhruvasetu-data" if IS_VERCEL else ROOT / "data"))
INBOX = DATA / "inbox"          # drop reports, images, videos, datasets here
STORE = DATA / "store"          # graph.json + chroma vector index
OUT = DATA / "output"
SITE = OUT / "site"             # "website" output (markdown articles)
ARCHIVE = OUT / "archive"       # approved records
for _p in (INBOX, STORE, SITE, ARCHIVE):
    _p.mkdir(parents=True, exist_ok=True)

LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
VERBOSE = os.getenv("VERBOSE", "false").lower() == "true"
DRY_RUN = os.getenv("DRY_RUN", "true").lower() != "false"
MAX_PARALLEL = int(os.getenv("MAX_PARALLEL", "3"))
MAX_REVISIONS = int(os.getenv("MAX_REVISIONS", "3"))
AUTO_APPROVE_CONFIDENCE = float(os.getenv("AUTO_APPROVE_CONFIDENCE", "0"))
MAX_CHARS = 12000               # per-file text sent to an agent

# ---- Supabase / API ----
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
SYNC_INTERVAL = int(os.getenv("SYNC_INTERVAL", "60"))
