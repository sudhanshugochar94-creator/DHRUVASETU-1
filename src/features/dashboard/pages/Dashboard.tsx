import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  Database, 
  FileText, 
  Camera, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Compass
} from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardMetrics } from '../services/dashboardService';
import { StatCard } from '@/shared/ui/StatCard';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await dashboardService.getDashboardMetrics();
      setMetrics(data);
    };
    fetchMetrics();
  }, []);

  if (!metrics) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-widest mb-1">
            <SlidersHorizontal className="w-4 h-4" />
            <span>NCPOR Operations Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
            Institutional Knowledge Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-700 mt-1">
            Real-time analytics on repository ingest, editorial pipelines, and public dissemination metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/content-studio">
            <Button size="sm" variant="primary" icon={<Sparkles className="w-4 h-4" />}>
              Create Outreach Draft
            </Button>
          </Link>
          <Link to="/review">
            <Button size="sm" variant="outline">
              Review Queue ({metrics.pendingReviewCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Resources"
          value={metrics.totalResources.toLocaleString()}
          subtext="Cataloged Assets"
          icon={<FileText className="w-5 h-5" />}
          trend="+14% this quarter"
        />
        <StatCard
          label="Scientific Datasets"
          value={metrics.totalDatasets.toLocaleString()}
          subtext="FAIR Compliant"
          icon={<Database className="w-5 h-5 text-emerald-700" />}
          trend="+28 new series"
        />
        <StatCard
          label="Media Assets"
          value={metrics.totalMediaAssets.toLocaleString()}
          subtext="Photos & 4K Video"
          icon={<Camera className="w-5 h-5 text-amber-700" />}
          trend="4K Ultra HD"
        />
        <StatCard
          label="Expeditions"
          value={metrics.totalExpeditions.toLocaleString()}
          subtext="Historical & Active"
          icon={<Compass className="w-5 h-5 text-blue-700" />}
        />
        <StatCard
          label="Review Queue"
          value={metrics.pendingReviewCount.toLocaleString()}
          subtext="Awaiting Editorial Sign-off"
          icon={<Clock className="w-5 h-5 text-purple-700" />}
          trend="Action required"
          trendPositive={false}
        />
      </div>

      {/* Charts Section: Resources by Type & Region (Clean SVG / CSS Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Distribution by Resource Type */}
        <div className="polar-glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-sky-900/15 pb-4">
            <h3 className="text-base font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
              Repository Holdings by Resource Type
            </h3>
            <span className="text-xs text-sky-700 font-mono">100% Ingested</span>
          </div>

          <div className="space-y-4">
            {metrics.resourcesByType.map((item) => (
              <div key={item.type} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{item.type}</span>
                  <span className="text-sky-700 font-mono font-bold">
                    {item.count} ({item.percentage}%)
                  </span>
                </div>
                {/* Visual Bar */}
                <div className="h-2.5 w-full rounded-full bg-white overflow-hidden border border-sky-900/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-1000"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Distribution by Polar Geography */}
        <div className="polar-glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-sky-900/15 pb-4">
            <h3 className="text-base font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
              Scientific Coverage by Polar Geography
            </h3>
            <span className="text-xs text-emerald-700 font-mono">Global Footprint</span>
          </div>

          <div className="space-y-4">
            {metrics.resourcesByRegion.map((item) => (
              <div key={item.region} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{item.region}</span>
                  <span className="text-emerald-700 font-mono font-bold">
                    {item.count} items ({item.percentage}%)
                  </span>
                </div>
                {/* Visual Bar */}
                <div className="h-2.5 w-full rounded-full bg-white overflow-hidden border border-sky-900/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Institutional Operations Feed */}
      <div className="polar-glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-sky-900/15 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
              Recent Knowledge Base Operations
            </h3>
            <p className="text-xs text-slate-600">Audit log of uploads, editorial approvals, and DOI assignments</p>
          </div>
          <span className="text-xs text-emerald-700 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Live Synchronization
          </span>
        </div>

        <div className="divide-y divide-sky-900/10">
          {metrics.recentActivities.map((act) => (
            <div key={act.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-1.5 rounded-lg bg-white text-sky-700 border border-sky-900/15 shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900 block sm:inline mr-2">{act.action}:</span>
                  <span className="text-slate-700">{act.entity}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600 shrink-0">
                <span className="text-[11px] text-slate-600">{act.user}</span>
                <span>&bull;</span>
                <span className="font-mono text-[11px]">{act.timestamp}</span>
                <Badge status={act.status} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
