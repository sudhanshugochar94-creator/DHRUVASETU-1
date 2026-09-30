-- ====================================================================
-- SIH26063: Integrated Polar Science Outreach & Knowledge Repository
-- National Centre for Polar and Ocean Research (NCPOR) • MoES
-- Migration: 003_rls_policies.sql
-- Description: Row Level Security (RLS) and Role-Based Access Control
-- ====================================================================

-- Helper functions for secure role checking
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'administrator'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_content_manager()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('content_manager', 'administrator')
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_researcher()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('researcher', 'administrator')
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- --------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- --------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expeditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutional_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE science_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- --------------------------------------------------------------------
-- Anyone can view profiles (public researcher directory)
CREATE POLICY "Public profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" 
    ON profiles FOR ALL 
    USING (is_admin());

-- --------------------------------------------------------------------
-- 2. EXPEDITIONS POLICIES
-- --------------------------------------------------------------------
-- Public can view published expeditions
CREATE POLICY "Public can view published expeditions" 
    ON expeditions FOR SELECT 
    USING (status = 'published' OR is_researcher() OR is_content_manager());

-- Admin/Researcher can manage expeditions
CREATE POLICY "Researchers and Admins can insert expeditions" 
    ON expeditions FOR INSERT 
    WITH CHECK (is_researcher());

CREATE POLICY "Researchers and Admins can update expeditions" 
    ON expeditions FOR UPDATE 
    USING (is_researcher());

CREATE POLICY "Admins can delete expeditions" 
    ON expeditions FOR DELETE 
    USING (is_admin());

-- --------------------------------------------------------------------
-- 3. RESOURCES POLICIES (Central Repository)
-- --------------------------------------------------------------------
-- Public can view published resources
CREATE POLICY "Public can view published resources" 
    ON resources FOR SELECT 
    USING (status = 'published' OR auth.uid() = created_by OR is_admin());

-- Researchers can insert new resources
CREATE POLICY "Researchers can insert resources" 
    ON resources FOR INSERT 
    WITH CHECK (is_researcher() AND auth.uid() = created_by);

-- Authors and Admins can update resources
CREATE POLICY "Authors and Admins can update resources" 
    ON resources FOR UPDATE 
    USING (auth.uid() = created_by OR is_admin());

-- Admins can delete resources
CREATE POLICY "Admins can delete resources" 
    ON resources FOR DELETE 
    USING (is_admin());

-- --------------------------------------------------------------------
-- 4. DATASETS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Public can view datasets" 
    ON datasets FOR SELECT 
    USING (true);

CREATE POLICY "Researchers can insert datasets" 
    ON datasets FOR INSERT 
    WITH CHECK (is_researcher() AND auth.uid() = created_by);

CREATE POLICY "Authors and Admins can update datasets" 
    ON datasets FOR UPDATE 
    USING (auth.uid() = created_by OR is_admin());

CREATE POLICY "Admins can delete datasets" 
    ON datasets FOR DELETE 
    USING (is_admin());

-- --------------------------------------------------------------------
-- 5. PUBLICATIONS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Public can view publications" 
    ON publications FOR SELECT 
    USING (true);

CREATE POLICY "Researchers can insert publications" 
    ON publications FOR INSERT 
    WITH CHECK (is_researcher());

CREATE POLICY "Researchers and Admins can update publications" 
    ON publications FOR UPDATE 
    USING (is_researcher());

CREATE POLICY "Admins can delete publications" 
    ON publications FOR DELETE 
    USING (is_admin());

-- --------------------------------------------------------------------
-- 6. MEDIA ASSETS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Public can view media assets" 
    ON media_assets FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated staff can insert media assets" 
    ON media_assets FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff and Admins can update media assets" 
    ON media_assets FOR UPDATE 
    USING (auth.uid() = created_by OR is_admin());

CREATE POLICY "Admins can delete media assets" 
    ON media_assets FOR DELETE 
    USING (is_admin());

-- --------------------------------------------------------------------
-- 7. INSTITUTIONAL ACTIVITIES POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Public can view published activities" 
    ON institutional_activities FOR SELECT 
    USING (status = 'published' OR is_content_manager());

CREATE POLICY "Content Managers can manage institutional activities" 
    ON institutional_activities FOR ALL 
    USING (is_content_manager());

-- --------------------------------------------------------------------
-- 8. SCIENCE STORIES POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Public can view published science stories" 
    ON science_stories FOR SELECT 
    USING (status = 'published' OR is_content_manager());

CREATE POLICY "Content Managers can manage science stories" 
    ON science_stories FOR ALL 
    USING (is_content_manager());

-- --------------------------------------------------------------------
-- 9. CONTENT DRAFTS & REVIEWS POLICIES
-- --------------------------------------------------------------------
-- Content Managers and Admins can view and manage drafts
CREATE POLICY "Authorized staff can view content drafts" 
    ON content_drafts FOR SELECT 
    USING (auth.uid() = created_by OR is_content_manager());

CREATE POLICY "Authorized staff can insert content drafts" 
    ON content_drafts FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authorized staff can update content drafts" 
    ON content_drafts FOR UPDATE 
    USING (auth.uid() = created_by OR is_content_manager());

CREATE POLICY "Admins can delete content drafts" 
    ON content_drafts FOR DELETE 
    USING (is_admin());

-- Reviews
CREATE POLICY "Authorized staff can view content reviews" 
    ON content_reviews FOR SELECT 
    USING (is_content_manager());

CREATE POLICY "Content managers can insert reviews" 
    ON content_reviews FOR INSERT 
    WITH CHECK (is_content_manager());

-- Content Sources
CREATE POLICY "Staff can view content sources" 
    ON content_sources FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can insert content sources" 
    ON content_sources FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- --------------------------------------------------------------------
-- 10. LEARNING MODULES POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Public can view published learning modules" 
    ON learning_modules FOR SELECT 
    USING (status = 'published' OR is_content_manager());

CREATE POLICY "Content managers can manage learning modules" 
    ON learning_modules FOR ALL 
    USING (is_content_manager());
