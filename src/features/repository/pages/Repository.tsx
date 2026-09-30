import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Grid, 
  List, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { repositoryService } from '../services/repositoryService';
import type { ResourceFilterParams } from '../services/repositoryService';
import type { Resource, ResourceType, PolarRegion } from '@/shared/types/index';
import { ResourceCard } from '../components/ResourceCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { CardSkeleton } from '@/shared/ui/Skeleton';
import { EmptyState } from '@/shared/ui/EmptyState';
import { Drawer } from '@/shared/ui/Drawer';
import { Button } from '@/shared/ui/Button';

export const Repository: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Initialize filters from URL params or defaults
  const initialType = (searchParams.get('type') as ResourceType) || 'All';
  const initialRegion = (searchParams.get('region') as PolarRegion) || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState<ResourceFilterParams>({
    type: initialType,
    region: initialRegion,
    year: 'All',
    theme: 'All',
    search: initialSearch,
    sortBy: 'newest'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const data = await repositoryService.getResources(filters);
        setResources(data);
        setCurrentPage(1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      type: 'All',
      region: 'All',
      year: 'All',
      theme: 'All',
      search: '',
      sortBy: 'newest'
    });
    setSearchParams({});
  };

  // Pagination calculation
  const totalPages = Math.ceil(resources.length / itemsPerPage) || 1;
  const paginatedResources = resources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-widest">
          <Layers className="w-4 h-4" />
          <span>Central Knowledge Repository</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          Polar Science Knowledge Repository
        </h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          Explore peer-reviewed scientific knowledge, verified expedition reports, in-situ oceanographic datasets, high-resolution multimedia, and educational materials archived by the National Centre for Polar and Ocean Research.
        </p>
      </div>

      {/* Main Search Bar & Top Controls */}
      <div className="polar-glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input with direct reactive binding */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search reports, datasets, publications, expeditions..."
            className="w-full bg-white border border-sky-900/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* View Switcher, Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 text-xs font-semibold text-slate-800 border border-sky-900/15"
          >
            <SlidersHorizontal className="w-4 h-4 text-sky-700" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-600 hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy || 'newest'}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="bg-white border border-sky-900/15 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostViewed">Most Viewed</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>

          {/* Grid / List Switcher */}
          <div className="hidden sm:flex items-center bg-white rounded-xl p-1 border border-sky-900/15">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-sky-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-sky-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Filter Sidebar (Desktop) + Results Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>

        {/* Results Column (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filter Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div>
              Showing <strong className="text-slate-900">{resources.length}</strong> scientific resources
              {filters.search && <span> matching "{filters.search}"</span>}
            </div>

            {(filters.type !== 'All' || filters.region !== 'All' || filters.year !== 'All' || filters.theme !== 'All' || filters.search) && (
              <button
                onClick={handleResetFilters}
                className="text-sky-700 hover:text-sky-700 font-semibold cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {[1, 2, 3, 4].map((n) => (
                <CardSkeleton key={n} />
              ))}
            </div>
          ) : resources.length === 0 ? (
            /* Empty State */
            <EmptyState
              title="No scientific resources found"
              description="No resources match your active filter criteria. Try clearing some filters or searching for broader terms such as 'Antarctica' or 'Glaciology'."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            /* Cards List / Grid */
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {paginatedResources.map((res) => (
                <ResourceCard key={res.id} resource={res} viewMode={viewMode} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && resources.length > itemsPerPage && (
            <div className="pt-8 border-t border-sky-900/10 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-mono">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<ChevronLeft className="w-4 h-4" />}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<ChevronRight className="w-4 h-4" />}
                  iconPosition="right"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Repository Filters"
      >
        <FilterSidebar
          filters={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
          }}
          onReset={() => {
            handleResetFilters();
            setMobileFiltersOpen(false);
          }}
        />
        <div className="mt-6 pt-4 border-t border-sky-900/15">
          <Button variant="primary" className="w-full" onClick={() => setMobileFiltersOpen(false)}>
            Apply Filters ({resources.length} Results)
          </Button>
        </div>
      </Drawer>
    </div>
  );
};
