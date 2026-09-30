-- ====================================================================
-- SIH26063: Integrated Polar Science Outreach & Knowledge Repository
-- National Centre for Polar and Ocean Research (NCPOR) • MoES
-- Migration: 001_initial_schema.sql
-- Description: Core tables, foreign keys, check constraints, and triggers
-- ====================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- PROFILES (Users with specific institutional roles)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'researcher' CHECK (role IN ('researcher', 'content_manager', 'administrator')),
    institution TEXT DEFAULT 'National Centre for Polar and Ocean Research (NCPOR)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- EXPEDITIONS (Antarctic, Arctic, Southern Ocean, Himalayan Missions)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expeditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    region TEXT NOT NULL CHECK (region IN ('Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean')),
    start_date DATE,
    end_date DATE,
    year INTEGER NOT NULL,
    objectives TEXT,
    key_findings TEXT,
    hero_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- RESOURCES (Central Polar Knowledge Repository Catalog)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    resource_type TEXT NOT NULL CHECK (resource_type IN (
        'expedition_report', 
        'scientific_dataset', 
        'publication', 
        'photograph', 
        'video', 
        'institutional_activity', 
        'educational_resource'
    )),
    region TEXT NOT NULL CHECK (region IN ('Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean')),
    research_theme TEXT NOT NULL,
    year INTEGER NOT NULL,
    language TEXT NOT NULL DEFAULT 'English',
    author TEXT NOT NULL,
    institution TEXT NOT NULL DEFAULT 'National Centre for Polar and Ocean Research',
    expedition_id UUID REFERENCES expeditions(id) ON DELETE SET NULL,
    file_url TEXT,
    thumbnail_url TEXT,
    file_type TEXT,
    file_size BIGINT,
    license TEXT DEFAULT 'CC BY 4.0 (Open Access)',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    view_count INTEGER NOT NULL DEFAULT 0,
    download_count INTEGER NOT NULL DEFAULT 0,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- DATASETS (FAIR-Compliant Scientific Observations)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    region TEXT NOT NULL CHECK (region IN ('Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean')),
    research_theme TEXT NOT NULL,
    variables TEXT,
    time_range TEXT,
    format TEXT NOT NULL DEFAULT 'NetCDF/CSV',
    file_size BIGINT,
    download_url TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- PUBLICATIONS (Peer-Reviewed Science Literature)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    year INTEGER NOT NULL,
    journal TEXT NOT NULL,
    abstract TEXT,
    keywords TEXT,
    doi TEXT,
    publication_url TEXT,
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- MEDIA ASSETS (Photographs, Field Videos, Documentaries)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video', 'documentary')),
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    location TEXT,
    photographer TEXT,
    duration_seconds INTEGER,
    expedition_id UUID REFERENCES expeditions(id) ON DELETE SET NULL,
    year INTEGER,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- INSTITUTIONAL ACTIVITIES (Events, Workshops, Deployments)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS institutional_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    activity_type TEXT NOT NULL,
    date DATE NOT NULL,
    location TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- SCIENCE STORIES (Public Outreach Articles & Explanations)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS science_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    body TEXT,
    hero_image_url TEXT,
    research_theme TEXT,
    audience TEXT NOT NULL CHECK (audience IN ('school', 'college', 'general_public', 'researcher')),
    reading_time INTEGER NOT NULL DEFAULT 5,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- CONTENT DRAFTS (Content Studio Generated Dissemination)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN (
        'website_article', 
        'social_media', 
        'press_summary', 
        'student_explanation', 
        'science_story'
    )),
    audience TEXT NOT NULL CHECK (audience IN (
        'researchers', 
        'students', 
        'teachers', 
        'general_public'
    )),
    tone TEXT NOT NULL CHECK (tone IN (
        'scientific', 
        'educational', 
        'public_friendly'
    )),
    summary TEXT,
    body TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 
        'under_review', 
        'approved', 
        'rejected', 
        'published'
    )),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- CONTENT REVIEWS (Editorial Workflow Sign-off)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_draft_id UUID NOT NULL REFERENCES content_drafts(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('approved', 'rejected', 'changes_requested')),
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- CONTENT SOURCES (Traceability: Generated Copy -> Scientific Source)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS content_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_draft_id UUID NOT NULL REFERENCES content_drafts(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
    publication_id UUID REFERENCES publications(id) ON DELETE SET NULL,
    dataset_id UUID REFERENCES datasets(id) ON DELETE SET NULL,
    expedition_id UUID REFERENCES expeditions(id) ON DELETE SET NULL,
    source_title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- LEARNING MODULES (Educational Tracks & Citizen Science)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learning_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    topic TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- --------------------------------------------------------------------
-- AUTO-UPDATE TIMESTAMPS TRIGGER FUNCTION
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to relevant tables
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT unnest(ARRAY[
            'profiles', 
            'expeditions', 
            'resources', 
            'datasets', 
            'publications', 
            'institutional_activities', 
            'science_stories', 
            'content_drafts', 
            'learning_modules'
        ])
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trg_update_timestamp ON %I;
            CREATE TRIGGER trg_update_timestamp
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', tbl, tbl);
    END LOOP;
END;
$$;
