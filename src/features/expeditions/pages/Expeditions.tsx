import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  Calendar, 
  ArrowRight
} from 'lucide-react';
import { expeditionService } from '../services/expeditionService';
import type { Expedition, PolarRegion } from '@/shared/types/index';
import { PolarMapSvg } from '../components/PolarMapSvg';
import { Badge } from '@/shared/ui/Badge';
import { CardSkeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';

export const Expeditions: React.FC = () => {
  const [expeditions, setExpeditions] = useState<Expedition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<PolarRegion | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  useEffect(() => {
    const fetchExpeditions = async () => {
      setIsLoading(true);
      try {
        const data = await expeditionService.getExpeditions({
          search,
          region: selectedRegion,
          status: selectedStatus
        });
        setExpeditions(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpeditions();
  }, [search, selectedRegion, selectedStatus]);

  const regions: (PolarRegion | 'All')[] = ['All', 'Antarctica', 'Arctic', 'Southern Ocean', 'Himalaya'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-widest">
          <Compass className="w-4 h-4" />
          <span>India’s Polar Missions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          Expedition Explorer
        </h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          Traverse four decades of Indian scientific missions across Antarctica, the high Arctic, the Southern Ocean, and the Himalayan cryosphere. Explore operational logistics, teams, and scientific discoveries.
        </p>
      </div>

      {/* Interactive Polar Map Visualization */}
      <PolarMapSvg />

      {/* Filter & Search Bar */}
      <div className="polar-glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expedition by name, code or leader..."
            className="w-full bg-white border border-sky-900/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Region Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-sky-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-sky-900/10'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Expeditions Grid */}
      <div className="space-y-6">
        <div className="text-xs text-slate-600">
          Showing <strong className="text-slate-900">{expeditions.length}</strong> expeditions
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))}
          </div>
        ) : expeditions.length === 0 ? (
          <EmptyState
            title="No expeditions match your criteria"
            description="Try changing the search term or switching the selected region."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch('');
              setSelectedRegion('All');
              setSelectedStatus('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expeditions.map((exp) => (
              <div
                key={exp.id}
                className="polar-glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300"
              >
                {/* Hero Banner */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={exp.heroImage}
                    alt={exp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#eaf4fa] via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge region={exp.region} size="sm" />
                    <Badge status={exp.status} size="sm" />
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-800">
                    <span className="font-mono text-[11px] font-bold bg-white/85 text-slate-800 px-2 py-0.5 rounded backdrop-blur-sm">
                      {exp.code}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[11px]">
                      <Calendar className="w-3 h-3 text-sky-700" />
                      {exp.dates}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                      {exp.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Lead: <span className="text-slate-700 font-medium">{exp.leader}</span>
                    </p>

                    <p className="text-xs text-slate-700 mt-3 line-clamp-3 leading-relaxed">
                      {exp.shortDescription}
                    </p>
                  </div>

                  {/* Themes */}
                  <div className="flex flex-wrap gap-1">
                    {exp.themes.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-sky-50/70 text-slate-600 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Footer Counts & Link */}
                  <div className="pt-3 border-t border-sky-900/10 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-slate-600 font-mono">
                      <span>{exp.reportCount} Reports</span>
                      <span>&bull;</span>
                      <span>{exp.datasetCount} Datasets</span>
                    </div>

                    <Link
                      to={`/expeditions/${exp.id}`}
                      className="text-xs font-bold text-sky-700 hover:text-sky-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
