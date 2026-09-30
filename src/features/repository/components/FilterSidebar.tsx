import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import type { ResourceType, PolarRegion, ResearchTheme } from '@/shared/types/index';
import type { ResourceFilterParams } from '../services/repositoryService';

interface FilterSidebarProps {
  filters: ResourceFilterParams;
  onChange: (filters: ResourceFilterParams) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onChange, onReset }) => {
  const resourceTypes: (ResourceType | 'All')[] = [
    'All',
    'Expedition Reports',
    'Scientific Datasets',
    'Publications',
    'Photographs',
    'Videos',
    'Institutional Activities',
    'Educational Resources'
  ];

  const regions: (PolarRegion | 'All')[] = ['All', 'Antarctica', 'Arctic', 'Southern Ocean', 'Himalaya'];

  const years: (number | 'All')[] = ['All', 2024, 2023, 2022, 2021, 2020];

  const themes: (ResearchTheme | 'All')[] = [
    'All',
    'Glaciology',
    'Atmospheric Science',
    'Oceanography',
    'Cryosphere Dynamics',
    'Space Weather',
    'Polar Biology & Ecology'
  ];

  return (
    <aside className="polar-glass-card rounded-2xl p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sky-900/15">
        <div className="flex items-center gap-2 text-slate-900 font-bold font-['Bricolage_Grotesque',sans-serif]">
          <Filter className="w-4 h-4 text-sky-700" />
          <span>Repository Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-[11px] text-slate-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Search Terms
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Title, author, keywords..."
            className="w-full bg-white/90 border border-sky-900/15 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      {/* Resource Type */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Resource Type
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {resourceTypes.map((type) => {
            const isSelected = (filters.type || 'All') === type;
            return (
              <button
                key={type}
                onClick={() => onChange({ ...filters, type })}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-sky-700 font-bold border border-cyan-500/30'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-sky-50/70'
                }`}
              >
                <span>{type}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Region */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Polar Region
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {regions.map((region) => {
            const isSelected = (filters.region || 'All') === region;
            return (
              <button
                key={region}
                onClick={() => onChange({ ...filters, region })}
                className={`px-2 py-1.5 rounded-lg text-xs transition-colors text-center cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-white/80 text-slate-600 hover:text-slate-900 border border-sky-900/10'
                }`}
              >
                {region}
              </button>
            );
          })}
        </div>
      </div>

      {/* Research Theme */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Scientific Domain
        </label>
        <select
          value={filters.theme || 'All'}
          onChange={(e) => onChange({ ...filters, theme: e.target.value as ResearchTheme | 'All' })}
          className="w-full bg-white border border-sky-900/15 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 cursor-pointer"
        >
          {themes.map((theme) => (
            <option key={theme} value={theme} className="bg-white text-slate-900">
              {theme}
            </option>
          ))}
        </select>
      </div>

      {/* Year */}
      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Expedition Year
        </label>
        <div className="flex flex-wrap gap-1.5">
          {years.map((y) => {
            const isSelected = (filters.year || 'All') === y;
            return (
              <button
                key={y}
                onClick={() => onChange({ ...filters, year: y })}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-sky-700 font-bold border border-cyan-500/40'
                    : 'bg-white/80 text-slate-600 hover:text-slate-900 border border-sky-900/10'
                }`}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
