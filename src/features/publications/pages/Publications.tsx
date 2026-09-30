import React, { useState, useEffect } from 'react';
import { BookOpen, Search } from 'lucide-react';
import { publicationService } from '../services/publicationService';
import type { Publication, PolarRegion } from '@/shared/types/index';
import { PublicationCard } from '../components/PublicationCard';
import { EmptyState } from '@/shared/ui/EmptyState';
import { CardSkeleton } from '@/shared/ui/Skeleton';

export const Publications: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<PolarRegion | 'All'>('All');
  const [selectedYear, setSelectedYear] = useState<number | 'All'>('All');

  useEffect(() => {
    const fetchPublications = async () => {
      setIsLoading(true);
      try {
        const data = await publicationService.getPublications({
          search,
          region: selectedRegion,
          year: selectedYear
        });
        setPublications(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublications();
  }, [search, selectedRegion, selectedYear]);

  const regions: (PolarRegion | 'All')[] = ['All', 'Antarctica', 'Arctic', 'Himalaya', 'Southern Ocean'];
  const years: (number | 'All')[] = ['All', 2024, 2023, 2022];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-widest">
          <BookOpen className="w-4 h-4" />
          <span>Peer-Reviewed Science Literature</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          Research Publications
        </h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          Discover peer-reviewed polar science journal articles published by Indian researchers in collaboration with international institutions across glaciology, ocean dynamics, and space physics.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="polar-glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search papers by title, author, journal, or keywords..."
            className="w-full bg-white border border-sky-900/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Region Buttons */}
          <div className="flex flex-wrap items-center gap-1">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-sky-900/10'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value === 'All' ? 'All' : Number(e.target.value))}
            className="bg-white border border-sky-900/15 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y} className="bg-white text-slate-900">
                {y === 'All' ? 'All Years' : y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Publications List */}
      <div className="space-y-6">
        <div className="text-xs text-slate-600">
          Showing <strong className="text-slate-900">{publications.length}</strong> research publications
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <CardSkeleton key={n} />
            ))}
          </div>
        ) : publications.length === 0 ? (
          <EmptyState
            title="No research publications found"
            description="No articles match your query. Try clearing your search keyword or switching years."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearch('');
              setSelectedRegion('All');
              setSelectedYear('All');
            }}
          />
        ) : (
          <div className="space-y-6">
            {publications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
