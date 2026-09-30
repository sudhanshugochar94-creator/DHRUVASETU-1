FROM python:3.11-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg tesseract-ocr poppler-utils build-essential && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
# Code is bind-mounted (docker-compose.yml): edit and `docker compose restart`, no rebuild needed.
CMD ["python", "main.py", "serve"]
