// ====================================================================
// SIH26063: Supabase Database TypeScript Schema Definition
// ====================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          avatar_url: string | null;
          role: 'researcher' | 'content_manager' | 'administrator';
          institution: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          avatar_url?: string | null;
          role?: 'researcher' | 'content_manager' | 'administrator';
          institution?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          avatar_url?: string | null;
          role?: 'researcher' | 'content_manager' | 'administrator';
          institution?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      expeditions: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          region: 'Antarctica' | 'Arctic' | 'Himalaya' | 'Southern Ocean';
          start_date: string | null;
          end_date: string | null;
          year: number;
          objectives: string | null;
          key_findings: string | null;
          hero_image_url: string | null;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          region: 'Antarctica' | 'Arctic' | 'Himalaya' | 'Southern Ocean';
          start_date?: string | null;
          end_date?: string | null;
          year: number;
          objectives?: string | null;
          key_findings?: string | null;
          hero_image_url?: string | null;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          region?: 'Antarctica' | 'Arctic' | 'Himalaya' | 'Southern Ocean';
          start_date?: string | null;
          end_date?: string | null;
          year?: number;
          objectives?: string | null;
          key_findings?: string | null;
          hero_image_url?: string | null;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          description: string | null;
          resource_type: string;
          region: 'Antarctica' | 'Arctic' | 'Himalaya' | 'Southern Ocean';
          research_theme: string;
          year: number;
          language: string;
          author: string;
          institution: string;
          expedition_id: string | null;
          file_url: string | null;
          thumbnail_url: string | null;
          file_type: string | null;
          file_size: number | null;
          license: string | null;
          status: 'draft' | 'published' | 'archived';
          view_count: number;
          download_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string | null;
          description?: string | null;
          resource_type: string;
          region: 'Antarctica' | 'Arctic' | 'Himalaya' | 'Southern Ocean';
          research_theme: string;
          year: number;
          language?: string;
          author: string;
          institution?: string;
          expedition_id?: string | null;
          file_url?: string | null;
          thumbnail_url?: string | null;
          file_type?: string | null;
          file_size?: number | null;
          license?: string | null;
          status?: 'draft' | 'published' | 'archived';
          view_count?: number;
          download_count?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string | null;
          description?: string | null;
          resource_type?: string;
          region?: 'Antarctica' | 'Arctic' | 'Himalaya' | 'Southern Ocean';
          research_theme?: string;
          year?: number;
          language?: string;
          author?: string;
          institution?: string;
          expedition_id?: string | null;
          file_url?: string | null;
          thumbnail_url?: string | null;
          file_type?: string | null;
          file_size?: number | null;
          license?: string | null;
          status?: 'draft' | 'published' | 'archived';
          view_count?: number;
          download_count?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      datasets: {
        Row: {
          id: string;
          resource_id: string | null;
          name: string;
          description: string | null;
          region: 'Antarctica' | 'Arctic' | 'Himalaya' | 'Southern Ocean';
          research_theme: string;
          variables: string | null;
          time_range: string | null;
          format: string;
          file_size: number | null;
          download_url: string | null;
          metadata: Json;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          resource_id?: string | null;
          name: string;
          description?: string | null;
          region: 'Antarctica' | 'Arctic' | 'Himalaya' | 'Southern Ocean';
          research_theme: string;
          variables?: string | null;
          time_range?: string | null;
          format?: string;
          file_size?: number | null;
          download_url?: string | null;
          metadata?: Json;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          resource_id?: string | null;
          name?: string;
          description?: string | null;
          region?: 'Antarctica' | 'Arctic' | 'Himalaya' | 'Southern Ocean';
          research_theme?: string;
          variables?: string | null;
          time_range?: string | null;
          format?: string;
          file_size?: number | null;
          download_url?: string | null;
          metadata?: Json;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      publications: {
        Row: {
          id: string;
          resource_id: string | null;
          title: string;
          authors: string;
          year: number;
          journal: string;
          abstract: string | null;
          keywords: string | null;
          doi: string | null;
          publication_url: string | null;
          pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          resource_id?: string | null;
          title: string;
          authors: string;
          year: number;
          journal: string;
          abstract?: string | null;
          keywords?: string | null;
          doi?: string | null;
          publication_url?: string | null;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          resource_id?: string | null;
          title?: string;
          authors?: string;
          year?: number;
          journal?: string;
          abstract?: string | null;
          keywords?: string | null;
          doi?: string | null;
          publication_url?: string | null;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      media_assets: {
        Row: {
          id: string;
          resource_id: string | null;
          title: string;
          media_type: 'photo' | 'video' | 'documentary';
          file_url: string;
          thumbnail_url: string | null;
          caption: string | null;
          location: string | null;
          photographer: string | null;
          duration_seconds: number | null;
          expedition_id: string | null;
          year: number | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          resource_id?: string | null;
          title: string;
          media_type: 'photo' | 'video' | 'documentary';
          file_url: string;
          thumbnail_url?: string | null;
          caption?: string | null;
          location?: string | null;
          photographer?: string | null;
          duration_seconds?: number | null;
          expedition_id?: string | null;
          year?: number | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          resource_id?: string | null;
          title?: string;
          media_type?: 'photo' | 'video' | 'documentary';
          file_url?: string;
          thumbnail_url?: string | null;
          caption?: string | null;
          location?: string | null;
          photographer?: string | null;
          duration_seconds?: number | null;
          expedition_id?: string | null;
          year?: number | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      institutional_activities: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          activity_type: string;
          date: string;
          location: string | null;
          image_url: string | null;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          activity_type: string;
          date: string;
          location?: string | null;
          image_url?: string | null;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          activity_type?: string;
          date?: string;
          location?: string | null;
          image_url?: string | null;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
      science_stories: {
        Row: {
          id: string;
          title: string;
          slug: string;
          summary: string | null;
          body: string | null;
          hero_image_url: string | null;
          research_theme: string | null;
          audience: 'school' | 'college' | 'general_public' | 'researcher';
          reading_time: number;
          status: 'draft' | 'published' | 'archived';
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          summary?: string | null;
          body?: string | null;
          hero_image_url?: string | null;
          research_theme?: string | null;
          audience: 'school' | 'college' | 'general_public' | 'researcher';
          reading_time?: number;
          status?: 'draft' | 'published' | 'archived';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          summary?: string | null;
          body?: string | null;
          hero_image_url?: string | null;
          research_theme?: string | null;
          audience?: 'school' | 'college' | 'general_public' | 'researcher';
          reading_time?: number;
          status?: 'draft' | 'published' | 'archived';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_drafts: {
        Row: {
          id: string;
          title: string;
          content_type: 'website_article' | 'social_media' | 'press_summary' | 'student_explanation' | 'science_story';
          audience: 'researchers' | 'students' | 'teachers' | 'general_public';
          tone: 'scientific' | 'educational' | 'public_friendly';
          summary: string | null;
          body: string | null;
          status: 'draft' | 'under_review' | 'approved' | 'rejected' | 'published';
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content_type: 'website_article' | 'social_media' | 'press_summary' | 'student_explanation' | 'science_story';
          audience: 'researchers' | 'students' | 'teachers' | 'general_public';
          tone: 'scientific' | 'educational' | 'public_friendly';
          summary?: string | null;
          body?: string | null;
          status?: 'draft' | 'under_review' | 'approved' | 'rejected' | 'published';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content_type?: 'website_article' | 'social_media' | 'press_summary' | 'student_explanation' | 'science_story';
          audience?: 'researchers' | 'students' | 'teachers' | 'general_public';
          tone?: 'scientific' | 'educational' | 'public_friendly';
          summary?: string | null;
          body?: string | null;
          status?: 'draft' | 'under_review' | 'approved' | 'rejected' | 'published';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_reviews: {
        Row: {
          id: string;
          content_draft_id: string;
          reviewer_id: string | null;
          status: 'approved' | 'rejected' | 'changes_requested';
          comments: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          content_draft_id: string;
          reviewer_id?: string | null;
          status: 'approved' | 'rejected' | 'changes_requested';
          comments?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          content_draft_id?: string;
          reviewer_id?: string | null;
          status?: 'approved' | 'rejected' | 'changes_requested';
          comments?: string | null;
          created_at?: string;
        };
      };
      content_sources: {
        Row: {
          id: string;
          content_draft_id: string;
          resource_id: string | null;
          publication_id: string | null;
          dataset_id: string | null;
          expedition_id: string | null;
          source_title: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          content_draft_id: string;
          resource_id?: string | null;
          publication_id?: string | null;
          dataset_id?: string | null;
          expedition_id?: string | null;
          source_title: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          content_draft_id?: string;
          resource_id?: string | null;
          publication_id?: string | null;
          dataset_id?: string | null;
          expedition_id?: string | null;
          source_title?: string;
          created_at?: string;
        };
      };
      learning_modules: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          level: 'beginner' | 'intermediate' | 'advanced';
          topic: string;
          content: string | null;
          image_url: string | null;
          status: 'draft' | 'published' | 'archived';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          level: 'beginner' | 'intermediate' | 'advanced';
          topic: string;
          content?: string | null;
          image_url?: string | null;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          level?: 'beginner' | 'intermediate' | 'advanced';
          topic?: string;
          content?: string | null;
          image_url?: string | null;
          status?: 'draft' | 'published' | 'archived';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
