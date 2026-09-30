-- ====================================================================
-- SIH26063: Integrated Polar Science Outreach & Knowledge Repository
-- National Centre for Polar and Ocean Research (NCPOR) • MoES
-- Migration: 004_storage.sql
-- Description: Supabase Storage Buckets and Access Control Policies
-- ====================================================================

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('polar-reports', 'polar-reports', true),
    ('polar-datasets', 'polar-datasets', true),
    ('polar-publications', 'polar-publications', true),
    ('polar-photos', 'polar-photos', true),
    ('polar-videos', 'polar-videos', true),
    ('polar-thumbnails', 'polar-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- --------------------------------------------------------------------
-- 2. STORAGE POLICIES: PUBLIC READ ACCESS
-- --------------------------------------------------------------------
CREATE POLICY "Public Read Access for Reports"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'polar-reports');

CREATE POLICY "Public Read Access for Datasets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'polar-datasets');

CREATE POLICY "Public Read Access for Publications"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'polar-publications');

CREATE POLICY "Public Read Access for Photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'polar-photos');

CREATE POLICY "Public Read Access for Videos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'polar-videos');

CREATE POLICY "Public Read Access for Thumbnails"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'polar-thumbnails');

-- --------------------------------------------------------------------
-- 3. STORAGE POLICIES: AUTHENTICATED STAFF WRITE ACCESS
-- --------------------------------------------------------------------
CREATE POLICY "Authenticated Staff can Upload Reports"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'polar-reports' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated Staff can Upload Datasets"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'polar-datasets' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated Staff can Upload Publications"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'polar-publications' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated Staff can Upload Media"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id IN ('polar-photos', 'polar-videos', 'polar-thumbnails') 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Authenticated Staff can Update Their Media"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id IN ('polar-photos', 'polar-videos', 'polar-thumbnails') 
        AND auth.uid() = owner
    );

CREATE POLICY "Admins can Delete Objects"
    ON storage.objects FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'administrator'
        )
    );
