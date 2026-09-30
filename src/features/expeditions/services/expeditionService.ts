// ====================================================================
// SIH26063: Expedition Service
// National Centre for Polar and Ocean Research (NCPOR) • MoES
// ====================================================================

import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';
import { mockExpeditions } from '../data/mockExpeditions';
import type { Expedition, PolarRegion, ResearchTheme } from '@/shared/types/index';

export interface ExpeditionFilterParams {
  region?: PolarRegion | 'All';
  year?: number | 'All';
  search?: string;
  status?: string;
}

export interface PolarStation {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  established: number;
  region: PolarRegion;
  status: 'Active' | 'Decommissioned' | 'Seasonal';
  elevation: string;
  description: string;
  activeExpeditions: string[];
}

export const polarStations: PolarStation[] = [
  {
    id: 'st-maitri',
    name: 'Maitri Research Station',
    location: 'Schirmacher Oasis, Queen Maud Land',
    coordinates: { lat: -70.7667, lng: 11.7333 },
    established: 1988,
    region: 'Antarctica',
    status: 'Active',
    elevation: '117 m a.s.l.',
    description: 'Inland rocky oasis station with continuous year-round operations supporting meteorology, geomagnetism, and glaciology.',
    activeExpeditions: ['43rd Indian Scientific Expedition to Antarctica', '42nd Indian Scientific Expedition to Antarctica']
  },
  {
    id: 'st-bharati',
    name: 'Bharati Research Station',
    location: 'Larsemann Hills, East Antarctica',
    coordinates: { lat: -69.4078, lng: 76.1872 },
    established: 2012,
    region: 'Antarctica',
    status: 'Active',
    elevation: '35 m a.s.l.',
    description: 'Futuristic green building elevated on stilts with direct satellite tracking link to ISRO and state-of-the-art oceanographic labs.',
    activeExpeditions: ['43rd Indian Scientific Expedition to Antarctica', '42nd Indian Scientific Expedition to Antarctica']
  },
  {
    id: 'st-dakshin-gangotri',
    name: 'Dakshin Gangotri (Historic Landmark)',
    location: 'Princess Astrid Coast Ice Shelf',
    coordinates: { lat: -70.0983, lng: 12.0000 },
    established: 1983,
    region: 'Antarctica',
    status: 'Decommissioned',
    elevation: 'Floating ice shelf',
    description: 'India\'s first permanent Antarctic base. Preserved as an international Antarctic Historic Site and Monument (HSM No. 44).',
    activeExpeditions: ['1st Indian Scientific Expedition to Antarctica']
  },
  {
    id: 'st-himadri',
    name: 'Himadri Arctic Station',
    location: 'Ny-Ålesund, Spitsbergen, Svalbard',
    coordinates: { lat: 78.9236, lng: 11.9099 },
    established: 2008,
    region: 'Arctic',
    status: 'Active',
    elevation: '15 m a.s.l.',
    description: 'International high-latitude Arctic research base dedicated to fjord oceanography, atmospheric physics, and aerosol dynamics.',
    activeExpeditions: ['16th Indian Arctic Expedition']
  },
  {
    id: 'st-indarc',
    name: 'IndARC Underwater Observatory',
    location: 'Kongsfjorden Fjord, Svalbard',
    coordinates: { lat: 78.9840, lng: 11.8300 },
    established: 2014,
    region: 'Arctic',
    status: 'Active',
    elevation: '192 m underwater',
    description: 'India\'s autonomous multi-sensor deep-sea moored observatory capturing year-round hydrographic and current measurements in Arctic waters.',
    activeExpeditions: ['16th Indian Arctic Expedition']
  },
  {
    id: 'st-himansh',
    name: 'Himansh High-Altitude Station',
    location: 'Spiti Valley, Himachal Pradesh',
    coordinates: { lat: 32.2891, lng: 77.5192 },
    established: 2016,
    region: 'Himalaya',
    status: 'Active',
    elevation: '4,080 m a.s.l.',
    description: 'Third Pole research facility dedicated to benchmark Himalayan glacier mass balance, snow chemistry, and hydrological runoff.',
    activeExpeditions: ['Chandra Basin Cryospheric Expedition 2023']
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbToExpedition(row: any): Expedition {
  const dates = row.start_date && row.end_date 
    ? `${new Date(row.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} – ${new Date(row.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : `${row.year}`;

  const objectives = row.objectives ? row.objectives.split(';').map((s: string) => s.trim()) : [
    'Execute seasonal scientific sampling across stations',
    'Maintain continuous meteorological telemetry'
  ];

  const keyFindings = row.key_findings ? row.key_findings.split(';').map((s: string) => s.trim()) : [
    'Maintained continuous polar observation networks'
  ];

  return {
    id: row.id,
    name: row.name,
    code: row.slug?.toUpperCase() || `${row.year}-${row.region.slice(0, 3).toUpperCase()}`,
    region: row.region as PolarRegion,
    year: row.year,
    dates,
    leader: 'Dr. Yogesh Ray (NCPOR Operations)',
    station: row.region === 'Antarctica' ? 'Maitri & Bharati' : (row.region === 'Arctic' ? 'Himadri' : 'Himansh'),
    heroImage: row.hero_image_url || '/images/antarctic-ice-shelf.jpg',
    shortDescription: row.description || '',
    objectives,
    themes: ['Glaciology', 'Atmospheric Science', 'Oceanography'] as ResearchTheme[],
    scientificTeams: [
      { institution: 'National Centre for Polar and Ocean Research (NCPOR)', role: 'Lead Operations', membersCount: 18 },
      { institution: 'India Meteorological Department (IMD)', role: 'Atmospheric Physics', membersCount: 6 }
    ],
    keyFindings,
    status: row.status === 'published' ? 'Completed' : (row.status === 'draft' ? 'Ongoing' : 'Archived'),
    vessel: 'Chartered Polar Class Research Vessel',
    reportCount: 8,
    datasetCount: 14,
    publicationCount: 22,
    mediaCount: 45
  };
}

export const expeditionService = {
  async getExpeditions(params: ExpeditionFilterParams = {}): Promise<Expedition[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('expeditions').select('*');

        if (params.region && params.region !== 'All') {
          query = query.eq('region', params.region);
        }

        if (params.year && params.year !== 'All') {
          query = query.eq('year', Number(params.year));
        }

        if (params.search && params.search.trim() !== '') {
          const q = params.search.trim();
          query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
        }

        query = query.order('year', { ascending: false });

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map(mapDbToExpedition);
        }
      } catch (err) {
        console.warn('Supabase getExpeditions failed, fallback to local data:', err);
      }
    }

    // Fallback to local mock data
    let filtered = [...mockExpeditions];

    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.leader.toLowerCase().includes(q) ||
          e.shortDescription.toLowerCase().includes(q) ||
          e.region.toLowerCase().includes(q)
      );
    }

    if (params.region && params.region !== 'All') {
      filtered = filtered.filter((e) => e.region === params.region);
    }

    if (params.year && params.year !== 'All') {
      filtered = filtered.filter((e) => e.year === Number(params.year));
    }

    if (params.status && params.status !== 'All') {
      filtered = filtered.filter((e) => e.status === params.status);
    }

    return filtered;
  },

  async getExpeditionById(id: string): Promise<Expedition | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('expeditions')
          .select('*')
          .or(`id.eq.${id},slug.eq.${id}`)
          .single();

        if (!error && data) {
          return mapDbToExpedition(data);
        }
      } catch (err) {
        console.warn('Supabase getExpeditionById failed, fallback to local data:', err);
      }
    }

    return mockExpeditions.find((e) => e.id === id || e.code.toLowerCase() === id.toLowerCase()) || null;
  },

  async getStations(): Promise<PolarStation[]> {
    return polarStations;
  }
};
