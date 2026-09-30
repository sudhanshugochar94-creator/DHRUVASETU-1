"""Tools the agents can call. Heavy models are optional and degrade gracefully."""
import re
import subprocess
from pathlib import Path

try:
    from crewai.tools import tool
except ImportError:
    def tool(name=None):
        def decorator(func):
            return func
        return decorator

from . import config as cfg
from .knowledge import get_store

DOC_EXT = {".pdf", ".docx", ".txt", ".md", ".csv", ".xlsx"}
IMG_EXT = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}
VID_EXT = {".mp4", ".mov", ".mkv", ".avi", ".mp3", ".wav", ".m4a"}


def _ocr_pdf(p: Path) -> str:
    try:
        import pytesseract
        from pdf2image import convert_from_path
        return "\n".join(pytesseract.image_to_string(i) for i in convert_from_path(str(p), dpi=200)[:15])
    except Exception:
        return "[PDF has no text layer and OCR is unavailable]"


@tool("read_document")
def read_document(path: str) -> str:
    """Read a PDF, DOCX, TXT, MD, CSV or XLSX file and return its text (datasets return a profile)."""
    p, ext = Path(path), Path(path).suffix.lower()
    try:
        if ext == ".pdf":
            from pypdf import PdfReader
            text = "\n".join((pg.extract_text() or "") for pg in PdfReader(str(p)).pages)
            text = text if text.strip() else _ocr_pdf(p)
        elif ext == ".docx":
            import docx
            text = "\n".join(x.text for x in docx.Document(str(p)).paragraphs)
        elif ext in (".csv", ".xlsx"):
            import pandas as pd
            df = pd.read_csv(p) if ext == ".csv" else pd.read_excel(p)
            text = (f"DATASET {p.name}: {len(df)} rows, columns={list(df.columns)}\n"
                    f"HEAD:\n{df.head(8).to_string()}\nSTATS:\n{df.describe(include='all').to_string()}")
        else:
            text = p.read_text(errors="ignore")
    except Exception as e:
        return f"[could not read {p.name}: {e}]"
    return text[:cfg.MAX_CHARS]


_yolo = None


@tool("analyze_image")
def analyze_image(path: str) -> str:
    """Analyze an image: size, EXIF date, OCR text and (if available) YOLO object detections."""
    global _yolo
    from PIL import Image
    out = []
    try:
        im = Image.open(path)
        out.append(f"size={im.size} mode={im.mode}")
        dt = im.getexif().get(306)
        if dt:
            out.append(f"exif_datetime={dt}")
    except Exception as e:
        return f"[could not open image: {e}]"
    try:
        import pytesseract
        txt = pytesseract.image_to_string(im).strip()
        out.append(f"ocr_text={txt[:1500] or '(none)'}")
    except Exception:
        out.append("ocr_text=(pytesseract unavailable)")
    try:
        from ultralytics import YOLO
        _yolo = _yolo or YOLO("yolov8n.pt")
        r = _yolo(path, verbose=False)[0]
        names = sorted({r.names[int(c)] for c in r.boxes.cls})
        out.append(f"detected_objects={names or '(none)'}")
    except Exception:
        out.append("detected_objects=(ultralytics not installed)")
    return "\n".join(out)


@tool("analyze_video")
def analyze_video(path: str) -> str:
    """Analyze a video/audio file: duration, scene-change timestamps and (if available) a Whisper transcript."""
    out = []
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "default=nw=1:nk=1", path], capture_output=True, text=True)
    out.append(f"duration_seconds={r.stdout.strip() or 'unknown'}")
    r = subprocess.run(["ffmpeg", "-i", path, "-vf", "select='gt(scene,0.4)',showinfo",
                        "-f", "null", "-"], capture_output=True, text=True)
    scenes = re.findall(r"pts_time:([\d.]+)", r.stderr)[:30]
    out.append(f"scene_changes_at_seconds={scenes or '(none / audio only)'}")
    try:
        from faster_whisper import WhisperModel
        segs, _ = WhisperModel("base", compute_type="int8").transcribe(path)
        out.append("transcript=" + " ".join(f"[{s.start:.0f}s] {s.text.strip()}" for s in segs)[:cfg.MAX_CHARS])
    except Exception:
        out.append("transcript=(faster-whisper not installed)")
    return "\n".join(out)


@tool("graphrag_search")
def graphrag_search(query: str) -> str:
    """Search the knowledge base (vector search + graph traversal). Returns facts tagged with [source_id]."""
    return get_store().query(query)


@tool("get_source_facts")
def get_source_facts(source_id: str) -> str:
    """Return every stored fact for one source_id, for verifying a claim."""
    facts = get_store().source_facts(source_id)
    return "\n".join(f"- {f}" for f in facts) or "UNKNOWN SOURCE"
