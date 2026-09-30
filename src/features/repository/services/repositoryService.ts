// ====================================================================
// SIH26063: Repository Service
// National Centre for Polar and Ocean Research (NCPOR) • MoES
// ====================================================================

import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';
import { mockResources } from '../data/mockResources';
import type { Resource, ResourceType, PolarRegion, ResearchTheme } from '@/shared/types/index';

export interface ResourceFilterParams {
  type?: ResourceType | 'All';
  region?: PolarRegion | 'All';
  year?: number | 'All';
  theme?: ResearchTheme | 'All';
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'mostViewed' | 'title';
}

const UI_TO_DB_TYPE: Record<ResourceType, string> = {
  'Expedition Reports': 'expedition_report',
  'Scientific Datasets': 'scientific_dataset',
  'Publications': 'publication',
  'Photographs': 'photograph',
  'Videos': 'video',
  'Institutional Activities': 'institutional_activity',
  'Educational Resources': 'educational_resource'
};

const DB_TO_UI_TYPE: Record<string, ResourceType> = {
  'expedition_report': 'Expedition Reports',
  'scientific_dataset': 'Scientific Datasets',
  'publication': 'Publications',
  'photograph': 'Photographs',
  'video': 'Videos',
  'institutional_activity': 'Institutional Activities',
  'educational_resource': 'Educational Resources'
};

/**
 * Maps PostgreSQL resource record to frontend Resource interface
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbToResource(row: any): Resource {
  const uiType: ResourceType = DB_TO_UI_TYPE[row.resource_type] || 'Expedition Reports';
  const sizeMb = row.file_size ? `${(Number(row.file_size) / (1024 * 1024)).toFixed(1)} MB` : '12.4 MB';

  return {
    id: row.id,
    title: row.title,
    type: uiType,
    year: row.year || new Date(row.created_at).getFullYear(),
    date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '2024-01-15',
    region: (row.region as PolarRegion) || 'Antarctica',
    expeditionId: row.expedition_id || undefined,
    expeditionName: row.expeditions?.name || undefined,
    authors: row.author ? row.author.split(',').map((s: string) => s.trim()) : ['NCPOR Research Team'],
    institutions: row.institution ? row.institution.split(';').map((s: string) => s.trim()) : ['National Centre for Polar and Ocean Research'],
    theme: (row.research_theme as ResearchTheme) || 'Glaciology',
    shortDescription: row.description || '',
    fullDescription: row.description || '',
    doi: row.slug ? `10.5061/ncpor.${row.slug}` : undefined,
    fileFormat: row.file_type || 'PDF',
    fileSize: sizeMb,
    license: row.license || 'CC BY 4.0 (Open Access)',
    language: row.language || 'English',
    viewCount: row.view_count || 0,
    downloadCount: row.download_count || 0,
    coverImage: row.thumbnail_url || '/images/antarctic-ice-shelf.jpg',
    sourceAttribution: 'National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences'
  };
}

/**
 * Repository Service - abstracts data access for scientific resources.
 * Interacts with Supabase PostgreSQL backend with fallback to offline data.
 */
export const repositoryService = {
  async getResources(params: ResourceFilterParams = {}): Promise<Resource[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase
          .from('resources')
          .select('*, expeditions(name)')
          .eq('status', 'published');

        if (params.search && params.search.trim() !== '') {
          const q = params.search.trim();
          query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,author.ilike.%${q}%,research_theme.ilike.%${q}%`);
        }

        if (params.type && params.type !== 'All') {
          const dbType = UI_TO_DB_TYPE[params.type];
          if (dbType) query = query.eq('resource_type', dbType);
        }

        if (params.region && params.region !== 'All') {
          query = query.eq('region', params.region);
        }

        if (params.year && params.year !== 'All') {
          query = query.eq('year', Number(params.year));
        }

        if (params.theme && params.theme !== 'All') {
          query = query.eq('research_theme', params.theme);
        }

        // Sorting
        switch (params.sortBy) {
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          case 'mostViewed':
            query = query.order('view_count', { ascending: false });
            break;
          case 'title':
            query = query.order('title', { ascending: true });
            break;
          case 'newest':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(mapDbToResource);
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local seed data:', err);
      }
    }

    // Fallback to local mock data
    let filtered = [...mockResources];

    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.shortDescription.toLowerCase().includes(q) ||
          r.authors.some((a) => a.toLowerCase().includes(q)) ||
          r.theme.toLowerCase().includes(q) ||
          r.region.toLowerCase().includes(q)
      );
    }

    if (params.type && params.type !== 'All') {
      filtered = filtered.filter((r) => r.type === params.type);
    }

    if (params.region && params.region !== 'All') {
      filtered = filtered.filter((r) => r.region === params.region);
    }

    if (params.year && params.year !== 'All') {
      filtered = filtered.filter((r) => r.year === Number(params.year));
    }

    if (params.theme && params.theme !== 'All') {
      filtered = filtered.filter((r) => r.theme === params.theme);
    }

    // Sort
    switch (params.sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'mostViewed':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    return filtered;
  },

  async getResourceById(id: string): Promise<Resource | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*, expeditions(name)')
          .eq('id', id)
          .single();

        if (!error && data) {
          // Increment view count asynchronously
          supabase.from('resources').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id).then();
          return mapDbToResource(data);
        }
      } catch (err) {
        console.warn('Supabase getResourceById failed, checking local data:', err);
      }
    }

    return mockResources.find((r) => r.id === id) || null;
  },

  async getRelatedResources(resourceId: string): Promise<Resource[]> {
    const current = await this.getResourceById(resourceId);
    if (!current) return [];

    if (current.relatedResourceIds && current.relatedResourceIds.length > 0) {
      return mockResources.filter((r) => current.relatedResourceIds?.includes(r.id));
    }

    // Fallback to matching region or theme
    return mockResources
      .filter((r) => r.id !== resourceId && (r.region === current.region || r.theme === current.theme))
      .slice(0, 3);
  }
};
