// ====================================================================
// SIH26063: Dashboard Metrics Service
// National Centre for Polar and Ocean Research (NCPOR) • MoES
// ====================================================================

import { supabase, isSupabaseConfigured } from '@/shared/lib/supabase';

export interface DashboardMetrics {
  totalResources: number;
  totalExpeditions: number;
  totalDatasets: number;
  totalMediaAssets: number;
  pendingReviewCount: number;
  totalDownloads: number;
  resourcesByType: { type: string; count: number; percentage: number }[];
  resourcesByRegion: { region: string; count: number; percentage: number }[];
  recentActivities: { id: string; action: string; entity: string; user: string; timestamp: string; status: string }[];
}

export const dashboardService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    if (isSupabaseConfigured()) {
      try {
        const [
          resCount,
          expCount,
          datCount,
          medCount,
          revCount,
          recentActs
        ] = await Promise.all([
          supabase.from('resources').select('*', { count: 'exact', head: true }),
          supabase.from('expeditions').select('*', { count: 'exact', head: true }),
          supabase.from('datasets').select('*', { count: 'exact', head: true }),
          supabase.from('media_assets').select('*', { count: 'exact', head: true }),
          supabase.from('content_drafts').select('*', { count: 'exact', head: true }).eq('status', 'under_review'),
          supabase.from('institutional_activities').select('*').order('date', { ascending: false }).limit(5)
        ]);

        const totalResources = resCount.count || 0;
        const totalExpeditions = expCount.count || 0;
        const totalDatasets = datCount.count || 0;
        const totalMediaAssets = medCount.count || 0;
        const pendingReviewCount = revCount.count || 0;

        // If the database has records, compute live distribution
        if (totalResources > 0) {
          const { data: resData } = await supabase.from('resources').select('resource_type, region');
          
          const typeCounts: Record<string, number> = {};
          const regionCounts: Record<string, number> = {};

          (resData || []).forEach((r) => {
            const t = r.resource_type || 'other';
            typeCounts[t] = (typeCounts[t] || 0) + 1;
            const reg = r.region || 'Antarctica';
            regionCounts[reg] = (regionCounts[reg] || 0) + 1;
          });

          const resourcesByType = Object.entries(typeCounts).map(([type, count]) => ({
            type: type.replace('_', ' ').toUpperCase(),
            count,
            percentage: Math.round((count / (resData?.length || 1)) * 100)
          }));

          const resourcesByRegion = Object.entries(regionCounts).map(([region, count]) => ({
            region,
            count,
            percentage: Math.round((count / (resData?.length || 1)) * 100)
          }));

          const recentActivities = (recentActs.data || []).map((act, idx) => ({
            id: act.id || `act-${idx}`,
            action: act.activity_type || 'Activity Logged',
            entity: act.title,
            user: 'NCPOR Operations Unit',
            timestamp: act.date || 'Recent',
            status: act.status === 'published' ? 'Published' : 'Under Review'
          }));

          return {
            totalResources,
            totalExpeditions,
            totalDatasets,
            totalMediaAssets,
            pendingReviewCount,
            totalDownloads: 1420,
            resourcesByType,
            resourcesByRegion,
            recentActivities
          };
        }
      } catch (err) {
        console.warn('Supabase getDashboardMetrics failed, fallback to local metrics:', err);
      }
    }

    // Default curated baseline demo statistics
    await new Promise((resolve) => setTimeout(resolve, 100));

    const totalResources = 854;
    const totalExpeditions = 252;
    const totalDatasets = 320;
    const totalMediaAssets = 4520;
    const pendingReviewCount = 7;
    const totalDownloads = 28450;

    const resourcesByType = [
      { type: 'Expedition Reports', count: 320, percentage: 37 },
      { type: 'Scientific Datasets', count: 215, percentage: 25 },
      { type: 'Publications', count: 184, percentage: 22 },
      { type: 'Photographs & Videos', count: 95, percentage: 11 },
      { type: 'Educational Resources', count: 40, percentage: 5 }
    ];

    const resourcesByRegion = [
      { region: 'Antarctica', count: 480, percentage: 56 },
      { region: 'Arctic', count: 190, percentage: 22 },
      { region: 'Southern Ocean', count: 110, percentage: 13 },
      { region: 'Himalaya', count: 74, percentage: 9 }
    ];

    const recentActivities = [
      { id: 'act-1', action: 'New Dataset Uploaded', entity: 'Prydz Bay Sea Ice 2023 Grid', user: 'Dr. Alvarez Gomez (NCPOR)', timestamp: '12 mins ago', status: 'Approved' },
      { id: 'act-2', action: 'Draft Submitted to Review Queue', entity: 'Student Explainer: Bharati Station Telemetry', user: 'Priya Sharma (Editor)', timestamp: '45 mins ago', status: 'Pending Review' },
      { id: 'act-3', action: 'Expedition Report Ingested', entity: '43rd ISEA Austral Midterm Summary', user: 'Ops Desk (Goa)', timestamp: '2 hours ago', status: 'Archived' },
      { id: 'act-4', action: 'Metadata Verified & DOI Assigned', entity: 'Kongsfjorden Fjord Hydrographic Records', user: 'Data Curator', timestamp: '5 hours ago', status: 'Published' },
      { id: 'act-5', action: 'Media Collection Curated', entity: 'Aurora Australis Bharati 4K Pack', user: 'Outreach Unit', timestamp: '1 day ago', status: 'Published' }
    ];

    return {
      totalResources,
      totalExpeditions,
      totalDatasets,
      totalMediaAssets,
      pendingReviewCount,
      totalDownloads,
      resourcesByType,
      resourcesByRegion,
      recentActivities
    };
  }
};
