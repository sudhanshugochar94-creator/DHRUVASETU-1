// ====================================================================
// SIH26063: Media Service
// National Centre for Polar and Ocean Research (NCPOR) • MoES
// ====================================================================

import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';
import { mockMedia } from '../data/mockMedia';
import type { MediaAsset, PolarRegion } from '@/shared/types/index';

export interface MediaFilterParams {
  type?: 'all' | 'photo' | 'video' | 'documentary';
  region?: PolarRegion | 'All';
  search?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbToMedia(row: any): MediaAsset {
  return {
    id: row.id,
    title: row.title,
    type: row.media_type as 'photo' | 'video' | 'documentary',
    thumbnail: row.thumbnail_url || row.file_url,
    highResUrl: row.file_url,
    region: 'Antarctica',
    expedition: '43rd Indian Scientific Expedition to Antarctica',
    date: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '2024-01-10',
    location: row.location || 'Larsemann Hills, Antarctica',
    photographer: row.photographer || 'NCPOR Outreach Documentation Team',
    description: row.caption || '',
    tags: ['Polar', 'NCPOR', row.media_type],
    resolution: row.media_type === 'photo' ? '4000x3000 (RAW)' : '4K Ultra HD (60fps)',
    duration: row.duration_seconds ? `${Math.floor(row.duration_seconds / 60)}:${(row.duration_seconds % 60).toString().padStart(2, '0')}` : undefined
  };
}

export const mediaService = {
  async getMedia(params: MediaFilterParams = {}): Promise<MediaAsset[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('media_assets').select('*');

        if (params.type && params.type !== 'all') {
          query = query.eq('media_type', params.type);
        }

        if (params.search && params.search.trim() !== '') {
          const q = params.search.trim();
          query = query.or(`title.ilike.%${q}%,caption.ilike.%${q}%,location.ilike.%${q}%`);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(mapDbToMedia);
        }
      } catch (err) {
        console.warn('Supabase getMedia failed, fallback to local data:', err);
      }
    }

    // Fallback to local mock data
    let filtered = [...mockMedia];

    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params.type && params.type !== 'all') {
      filtered = filtered.filter((m) => m.type === params.type);
    }

    if (params.region && params.region !== 'All') {
      filtered = filtered.filter((m) => m.region === params.region);
    }

    return filtered;
  },

  async getMediaById(id: string): Promise<MediaAsset | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('media_assets')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return mapDbToMedia(data);
        }
      } catch (err) {
        console.warn('Supabase getMediaById failed, fallback to local data:', err);
      }
    }

    return mockMedia.find((m) => m.id === id) || null;
  }
};
