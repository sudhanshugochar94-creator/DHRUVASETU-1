-- ====================================================================
-- SIH26063: Integrated Polar Science Outreach & Knowledge Repository
-- National Centre for Polar and Ocean Research (NCPOR) • MoES
-- Migration: 002_indexes.sql
-- Description: Performance and Full-Text Search Indexes
-- ====================================================================

-- RESOURCES INDEXES
CREATE INDEX IF NOT EXISTS idx_resources_resource_type ON resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_region ON resources(region);
CREATE INDEX IF NOT EXISTS idx_resources_year ON resources(year);
CREATE INDEX IF NOT EXISTS idx_resources_research_theme ON resources(research_theme);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_expedition_id ON resources(expedition_id);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);

-- Full-Text Search Index for Resources (Title, Description, Author, Theme)
CREATE INDEX IF NOT EXISTS idx_resources_fts ON resources USING gin (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(author, '') || ' ' || coalesce(research_theme, ''))
);

-- EXPEDITIONS INDEXES
CREATE INDEX IF NOT EXISTS idx_expeditions_region ON expeditions(region);
CREATE INDEX IF NOT EXISTS idx_expeditions_year ON expeditions(year);
CREATE INDEX IF NOT EXISTS idx_expeditions_status ON expeditions(status);
CREATE INDEX IF NOT EXISTS idx_expeditions_slug ON expeditions(slug);

-- DATASETS INDEXES
CREATE INDEX IF NOT EXISTS idx_datasets_research_theme ON datasets(research_theme);
CREATE INDEX IF NOT EXISTS idx_datasets_region ON datasets(region);
CREATE INDEX IF NOT EXISTS idx_datasets_resource_id ON datasets(resource_id);

-- PUBLICATIONS INDEXES
CREATE INDEX IF NOT EXISTS idx_publications_year ON publications(year);
CREATE INDEX IF NOT EXISTS idx_publications_resource_id ON publications(resource_id);
CREATE INDEX IF NOT EXISTS idx_publications_doi ON publications(doi);

-- MEDIA ASSETS INDEXES
CREATE INDEX IF NOT EXISTS idx_media_assets_media_type ON media_assets(media_type);
CREATE INDEX IF NOT EXISTS idx_media_assets_expedition_id ON media_assets(expedition_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_resource_id ON media_assets(resource_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_year ON media_assets(year);

-- SCIENCE STORIES INDEXES
CREATE INDEX IF NOT EXISTS idx_science_stories_audience ON science_stories(audience);
CREATE INDEX IF NOT EXISTS idx_science_stories_status ON science_stories(status);
CREATE INDEX IF NOT EXISTS idx_science_stories_slug ON science_stories(slug);

-- CONTENT DRAFTS & REVIEWS INDEXES
CREATE INDEX IF NOT EXISTS idx_content_drafts_status ON content_drafts(status);
CREATE INDEX IF NOT EXISTS idx_content_drafts_content_type ON content_drafts(content_type);
CREATE INDEX IF NOT EXISTS idx_content_drafts_created_by ON content_drafts(created_by);
CREATE INDEX IF NOT EXISTS idx_content_sources_draft_id ON content_sources(content_draft_id);
CREATE INDEX IF NOT EXISTS idx_content_reviews_draft_id ON content_reviews(content_draft_id);

-- PROFILES INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
