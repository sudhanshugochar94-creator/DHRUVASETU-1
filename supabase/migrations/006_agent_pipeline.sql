-- ====================================================================
-- Migration: 006_agent_pipeline.sql
-- Description: Columns + table used by the CrewAI multi-agent backend (agents/)
-- ====================================================================

CREATE TABLE IF NOT EXISTS agent_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'done', 'failed')),
    stage TEXT,
    detail JSONB NOT NULL DEFAULT '{}'::jsonb,
    error TEXT,
    started_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Content managers can view agent runs" ON agent_runs;
CREATE POLICY "Content managers can view agent runs" ON agent_runs FOR SELECT USING (is_content_manager());
-- Writes come only from the backend using the service_role key (bypasses RLS).

-- Which resources the agents have already ingested
ALTER TABLE resources ADD COLUMN IF NOT EXISTS agent_ingested_at TIMESTAMPTZ;

-- Agent-generated draft metadata (human approval still uses the existing review queue)
ALTER TABLE content_drafts
    ADD COLUMN IF NOT EXISTS social_caption TEXT,
    ADD COLUMN IF NOT EXISTS hashtags TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS agent_run_id UUID REFERENCES agent_runs(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS confidence NUMERIC(4,3),
    ADD COLUMN IF NOT EXISTS validation_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS publish_state TEXT NOT NULL DEFAULT 'none'
        CHECK (publish_state IN ('none', 'story_done', 'published')),
    ADD COLUMN IF NOT EXISTS x_post_id TEXT,
    ADD COLUMN IF NOT EXISTS revision INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS source_ids TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS agent_generated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_content_drafts_agent ON content_drafts (agent_run_id, status, publish_state);
