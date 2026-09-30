import React, { useState, useEffect } from 'react';
import { Database, Search } from 'lucide-react';
import { datasetService } from '../services/datasetService';
import type { Dataset, PolarRegion } from '@/shared/types/index';
import { DatasetCard } from '../components/DatasetCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { CardSkeleton } from '@/shared/ui/Skeleton';

export const Datasets: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<PolarRegion | 'All'>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  useEffect(() => {
    const fetchDatasets = async () => {
      setIsLoading(true);
      try {
        const data = await datasetService.getDatasets({
          search,
          region: selectedRegion,
          domain: selectedDomain
        });
        setDatasets(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDatasets();
  }, [search, selectedRegion, selectedDomain]);

  const domains = [
    'All',
    'Sea Ice Observations',
    'Oceanographic Observations',
    'Glaciological Measurements',
    'Meteorological Data',
    'Biodiversity Observations'
  ];

  const regions: (PolarRegion | 'All')[] = ['All', 'Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest">
          <Database className="w-4 h-4" />
          <span>Open Scientific Data Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          Scientific Datasets
        </h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          Access high-resolution in-situ observations, deep mooring profiles, automatic weather station archives, and glaciological ablation records conforming to national and international FAIR data guidelines.
        </p>
      </div>

      {/* Search & Domain Filter Bar */}
      <div className="polar-glass-card rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search variables, coordinates or dataset names..."
              className="w-full bg-white border border-sky-900/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

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

        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-sky-900/10">
          <span className="text-xs text-slate-600 mr-1">Domain:</span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-emerald-500/20 text-emerald-700 font-semibold border border-emerald-500/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50/70'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="space-y-6">
        <div className="text-xs text-slate-600">
          Showing <strong className="text-slate-900">{datasets.length}</strong> scientific datasets
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : datasets.length === 0 ? (
          <EmptyState
            title="No datasets found"
            description="No scientific datasets matched your current search or domain filters. Try broadening your query."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch('');
              setSelectedRegion('All');
              setSelectedDomain('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {datasets.map((dat) => (
              <DatasetCard key={dat.id} dataset={dat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
