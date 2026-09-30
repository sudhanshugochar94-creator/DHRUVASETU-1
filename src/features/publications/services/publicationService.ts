// ====================================================================
// SIH26063: Publication Service
// National Centre for Polar and Ocean Research (NCPOR) • MoES
// ====================================================================

import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';
import { mockPublications } from '../data/mockPublications';
import type { Publication, PolarRegion } from '@/shared/types/index';

export interface PublicationFilterParams {
  region?: PolarRegion | 'All';
  year?: number | 'All';
  search?: string;
  field?: string | 'All';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbToPublication(row: any): Publication {
  const authors = row.authors ? row.authors.split(',').map((s: string) => s.trim()) : ['NCPOR Research Group'];
  const keywords = row.keywords ? row.keywords.split(',').map((s: string) => s.trim()) : ['Polar Science'];

  return {
    id: row.id,
    title: row.title,
    authors,
    institutions: ['National Centre for Polar and Ocean Research (NCPOR)'],
    year: row.year,
    journal: row.journal,
    volume: 'Vol. 48, Iss. 2',
    doi: row.doi || `10.1016/j.polar.${row.year}.102`,
    region: 'Antarctica',
    field: 'Glaciology & Cryospheric Changes',
    abstract: row.abstract || '',
    keywords,
    citationsCount: 24,
    pdfSize: '3.8 MB',
    linkedDatasetId: row.resource_id || undefined
  };
}

export const publicationService = {
  async getPublications(params: PublicationFilterParams = {}): Promise<Publication[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('publications').select('*');

        if (params.year && params.year !== 'All') {
          query = query.eq('year', Number(params.year));
        }

        if (params.search && params.search.trim() !== '') {
          const q = params.search.trim();
          query = query.or(`title.ilike.%${q}%,abstract.ilike.%${q}%,authors.ilike.%${q}%,journal.ilike.%${q}%`);
        }

        query = query.order('year', { ascending: false });

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(mapDbToPublication);
        }
      } catch (err) {
        console.warn('Supabase getPublications failed, fallback to local data:', err);
      }
    }

    // Fallback to local mock data
    let filtered = [...mockPublications];

    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.abstract.toLowerCase().includes(q) ||
          p.authors.some((a) => a.toLowerCase().includes(q)) ||
          p.journal.toLowerCase().includes(q) ||
          p.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    if (params.region && params.region !== 'All') {
      filtered = filtered.filter((p) => p.region === params.region);
    }

    if (params.year && params.year !== 'All') {
      filtered = filtered.filter((p) => p.year === Number(params.year));
    }

    if (params.field && params.field !== 'All') {
      filtered = filtered.filter((p) => p.field.toLowerCase().includes(params.field!.toLowerCase()));
    }

    return filtered;
  },

  async getPublicationById(id: string): Promise<Publication | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('publications')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return mapDbToPublication(data);
        }
      } catch (err) {
        console.warn('Supabase getPublicationById failed, checking local data:', err);
      }
    }

    return mockPublications.find((p) => p.id === id) || null;
  }
};
