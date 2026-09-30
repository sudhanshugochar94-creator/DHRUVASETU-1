// ====================================================================
// SIH26063: Content Studio & Editorial Service
// National Centre for Polar and Ocean Research (NCPOR) • MoES
// ====================================================================

import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';
import type { ContentDraft, Resource } from '@/shared/types/index';
import { initialReviewQueue } from '../data/mockReviewQueue';
import { mockResources } from '@/features/repository/data/mockResources';

// In-memory store initialized with initial mock items (persists during user session as offline fallback)
let memoryDrafts: ContentDraft[] = [...initialReviewQueue];

export interface GenerateDraftRequest {
  sourceResourceId: string;
  outputFormat: ContentDraft['outputFormat'];
  targetAudience: ContentDraft['targetAudience'];
  tone: ContentDraft['tone'];
  sourceTitle?: string;
  sourceDescription?: string;
  sourceType?: string;
  region?: string;
  additionalContext?: string;
}

const UI_TO_DB_FORMAT: Record<string, string> = {
  'Website Article': 'website_article',
  'Social Media Post': 'social_media',
  'Press Summary': 'press_summary',
  'Student Explanation': 'student_explanation',
  'Science Story': 'science_story',
  'Educational Summary': 'student_explanation',
  'Expedition Highlight': 'science_story',
  'Dataset Explanation': 'website_article',
  'Research Summary': 'website_article'
};

const DB_TO_UI_FORMAT: Record<string, ContentDraft['outputFormat']> = {
  'website_article': 'Website Article',
  'social_media': 'Social Media Post',
  'press_summary': 'Press Summary',
  'student_explanation': 'Student Explanation',
  'science_story': 'Science Story'
};

const UI_TO_DB_STATUS: Record<string, string> = {
  'Draft': 'draft',
  'Under Review': 'under_review',
  'Approved': 'approved',
  'Published': 'published'
};

const DB_TO_UI_STATUS: Record<string, ContentDraft['status']> = {
  'draft': 'Draft',
  'under_review': 'Under Review',
  'approved': 'Approved',
  'rejected': 'Draft',
  'published': 'Published'
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbToDraft(row: any): ContentDraft {
  const source = row.content_sources?.[0];
  return {
    id: row.id,
    title: row.title,
    sourceResourceId: source?.resource_id || 'res-rep-2024-01',
    sourceResourceTitle: source?.source_title || '43rd Indian Scientific Expedition to Antarctica Report',
    sourceResourceType: 'Expedition Report',
    outputFormat: DB_TO_UI_FORMAT[row.content_type] || 'Website Article',
    targetAudience: (row.audience ? (row.audience.charAt(0).toUpperCase() + row.audience.slice(1)) : 'General Public') as ContentDraft['targetAudience'],
    tone: (row.tone ? (row.tone.charAt(0).toUpperCase() + row.tone.slice(1)) : 'Public Friendly') as ContentDraft['tone'],
    summary: row.summary || '',
    body: row.body || '',
    sourceReferences: row.content_sources?.length
      ? row.content_sources.map((c: { source_title: string }) => c.source_title)
      : [
        `Primary NCPOR Archive (${source?.source_title || 'Expedition Report'})`,
        'Ministry of Earth Sciences (MoES) Verified Record'
      ],
    author: row.agent_run_id ? 'CrewAI multi-agent pipeline' : 'xAI Grok / NCPOR Science Dissemination Unit',
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '2024-02-15',
    status: DB_TO_UI_STATUS[row.status] || 'Draft',
    comments: row.content_reviews?.map((r: { comments?: string }) => r.comments).filter(Boolean) || [],
    socialCaption: row.social_caption || undefined,
    hashtags: row.hashtags?.length ? row.hashtags : undefined,
    agentGenerated: Boolean(row.agent_run_id),
    confidence: row.confidence ?? undefined,
    validationFlags: Array.isArray(row.validation_flags) ? row.validation_flags : undefined,
    publishAt: row.publish_at || undefined,
    revision: row.revision ?? undefined
  };
}

export const studioService = {
  /**
   * Generates scientifically grounded draft using Supabase Edge Function & xAI Grok
   */
  async generateDraft(req: GenerateDraftRequest, sourceResource?: Resource): Promise<ContentDraft> {
    const source = sourceResource || mockResources.find((r) => r.id === req.sourceResourceId) || mockResources[0];

    const payload = {
      sourceTitle: req.sourceTitle || source.title,
      sourceDescription: req.sourceDescription || source.fullDescription || source.shortDescription || '',
      sourceType: req.sourceType || source.type,
      region: req.region || source.region,
      contentType: req.outputFormat,
      targetAudience: req.targetAudience,
      tone: req.tone,
      platform: req.outputFormat === 'Social Media Post' ? 'Twitter/X & LinkedIn' : 'NCPOR Dissemination Gateway',
      additionalContext: req.additionalContext || ''
    };

    // Call live Supabase Edge Function dedicated to AI content generation
    const { data: edgeData, error: edgeError } = await supabase.functions.invoke('generate-content', {
      body: payload
    });

    if (edgeError) {
      let detailedMsg = edgeError.message;
      // Extract structured error from edge response if available
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errCtx = (edgeError as any).context;
      if (errCtx && typeof errCtx.json === 'function') {
        try {
          const errJson = await errCtx.json();
          if (errJson.error) {
            detailedMsg = errJson.error;
          }
        } catch {
          // ignore
        }
      }
      throw new Error(detailedMsg || 'AI generation failed');
    }

    if (!edgeData?.data) {
      throw new Error('No structured content returned from AI generation engine');
    }

    const ai = edgeData.data;
    const newDraft: ContentDraft = {
      id: `draft-${Date.now()}`,
      title: ai.title || source.title,
      sourceResourceId: source.id,
      sourceResourceTitle: source.title,
      sourceResourceType: source.type,
      outputFormat: req.outputFormat,
      targetAudience: req.targetAudience,
      tone: req.tone,
      summary: ai.short_summary || '',
      body: ai.main_content || '',
      socialCaption: ai.social_caption || undefined,
      hashtags: Array.isArray(ai.hashtags) ? ai.hashtags : undefined,
      sourceReferences: Array.isArray(ai.source_notes) && ai.source_notes.length > 0 ? ai.source_notes : [
        `Primary Source: ${source.title} (${source.institutions?.[0] || 'NCPOR'}, ${source.year})`,
        'Ministry of Earth Sciences (MoES) Verified Record'
      ],
      author: 'xAI Grok / NCPOR Science Dissemination Unit',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Draft',
      comments: []
    };

    return newDraft;
  },

  /**
   * Save or update draft in Supabase / memory
   */
  async saveDraft(draft: ContentDraft): Promise<ContentDraft> {
    if (isSupabaseConfigured()) {
      try {
        const dbFormat = UI_TO_DB_FORMAT[draft.outputFormat] || 'website_article';
        const dbStatus = UI_TO_DB_STATUS[draft.status] || 'draft';

        // Check if draft has a valid UUID
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(draft.id);

        let savedId = draft.id;
        if (isUUID) {
          await supabase.from('content_drafts').upsert({
            id: draft.id,
            title: draft.title,
            content_type: dbFormat as any,
            audience: draft.targetAudience.toLowerCase().replace(' ', '_') as any,
            tone: draft.tone.toLowerCase().replace(' ', '_') as any,
            summary: draft.summary,
            body: draft.body,
            status: dbStatus as any
          });
        } else {
          const { data } = await supabase.from('content_drafts').insert({
            title: draft.title,
            content_type: dbFormat as any,
            audience: draft.targetAudience.toLowerCase().replace(' ', '_') as any,
            tone: draft.tone.toLowerCase().replace(' ', '_') as any,
            summary: draft.summary,
            body: draft.body,
            status: dbStatus as any
          }).select().single();

          if (data) {
            savedId = data.id;
            // Record content source
            await supabase.from('content_sources').insert({
              content_draft_id: data.id,
              source_title: draft.sourceResourceTitle
            });
          }
        }
        draft.id = savedId;
      } catch (err) {
        console.warn('Supabase saveDraft failed, saving to local store:', err);
      }
    }

    const idx = memoryDrafts.findIndex((d) => d.id === draft.id);
    if (idx >= 0) {
      memoryDrafts[idx] = draft;
    } else {
      memoryDrafts.unshift(draft);
    }

    return draft;
  },

  /**
   * Retrieve all drafts in the editorial queue
   */
  async getDrafts(): Promise<ContentDraft[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('content_drafts')
          .select('*, content_sources(*), content_reviews(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map(mapDbToDraft);
        }
      } catch (err) {
        console.warn('Supabase getDrafts failed, fallback to local store:', err);
      }
    }

    return [...memoryDrafts];
  },

  async getDraftById(id: string): Promise<ContentDraft | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('content_drafts')
          .select('*, content_sources(*), content_reviews(*)')
          .eq('id', id)
          .single();

        if (!error && data) {
          return mapDbToDraft(data);
        }
      } catch (err) {
        console.warn('Supabase getDraftById failed, fallback to local store:', err);
      }
    }

    return memoryDrafts.find((d) => d.id === id) || null;
  },

  /**
   * Transition draft status in review workflow
   */
  async updateDraftStatus(
    draftId: string,
    status: ContentDraft['status'],
    note?: string
  ): Promise<ContentDraft | null> {
    if (isSupabaseConfigured()) {
      try {
        const dbStatus = UI_TO_DB_STATUS[status] || 'draft';
        await supabase
          .from('content_drafts')
          .update({ status: dbStatus as any })
          .eq('id', draftId);

        if (note) {
          await supabase.from('content_reviews').insert({
            content_draft_id: draftId,
            status: status === 'Approved' ? 'approved' : (status === 'Draft' ? 'changes_requested' : 'approved'),
            comments: note
          });
        }
      } catch (err) {
        console.warn('Supabase updateDraftStatus failed, updating local store:', err);
      }
    }

    const draft = memoryDrafts.find((d) => d.id === draftId);
    if (!draft) return null;

    draft.status = status;
    if (note) {
      draft.comments = draft.comments || [];
      draft.comments.push(note);
    }

    return { ...draft };
  },

  /**
   * Subscribe to real-time status updates in review queue
   */
  subscribeToReviewQueue(callback: (payload: any) => void) {
    if (!isSupabaseConfigured()) {
      return { unsubscribe: () => {} };
    }

    const channel = supabase
      .channel('realtime:content_drafts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_drafts' },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
};
