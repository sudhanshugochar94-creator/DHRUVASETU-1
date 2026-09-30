# DhruvaSetu agent backend (CrewAI)

    cp .env.example .env          # LLM key + SUPABASE_SERVICE_KEY (server only); keep DRY_RUN=true first
    docker compose build          # once; code is bind-mounted afterwards, `docker compose restart` picks up edits
    docker compose up             # API on :8000 + background review/publish loop

Apply `supabase/migrations/006_agent_pipeline.sql` first. Set VITE_AGENT_API_URL in the frontend .env.

Flow: portal `resources` -> agents -> `content_drafts` (status under_review) -> Review Queue in the UI
-> approve => science_stories + X post at publish_at | send back with a note => agents regenerate.
Standalone (no Supabase): `docker compose run --rm agents python main.py run`.
