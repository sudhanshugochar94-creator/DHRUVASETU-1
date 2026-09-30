import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  X, 
  FileText, 
  Database, 
  BookOpen, 
  Camera, 
  Compass, 
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { mockResources } from '@/features/repository/data/mockResources';
import { mockExpeditions } from '@/features/expeditions/data/mockExpeditions';
import { mockStories } from '@/features/outreach/data/mockStories';
import { Badge } from '@/shared/ui/Badge';

interface GlobalSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchOverlay: React.FC<GlobalSearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Antarctica',
    'Sea Ice',
    'Maitri',
    'Kongsfjorden'
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularSearches = ['Antarctica', 'Sea Ice', 'Climate', 'Maitri', 'Arctic Expedition', 'Himadri', 'IndARC'];

  const trimmedQuery = query.toLowerCase().trim();

  // Search matches
  const matchingResources = trimmedQuery
    ? mockResources.filter(
        (r) =>
          r.title.toLowerCase().includes(trimmedQuery) ||
          r.shortDescription.toLowerCase().includes(trimmedQuery) ||
          r.region.toLowerCase().includes(trimmedQuery) ||
          r.theme.toLowerCase().includes(trimmedQuery)
      ).slice(0, 4)
    : [];

  const matchingExpeditions = trimmedQuery
    ? mockExpeditions.filter(
        (e) =>
          e.name.toLowerCase().includes(trimmedQuery) ||
          e.region.toLowerCase().includes(trimmedQuery) ||
          e.shortDescription.toLowerCase().includes(trimmedQuery) ||
          e.leader.toLowerCase().includes(trimmedQuery)
      ).slice(0, 3)
    : [];

  const matchingStories = trimmedQuery
    ? mockStories.filter(
        (s) =>
          s.title.toLowerCase().includes(trimmedQuery) ||
          s.simpleExplanation.toLowerCase().includes(trimmedQuery) ||
          s.category.toLowerCase().includes(trimmedQuery)
      ).slice(0, 2)
    : [];

  const totalResults = matchingResources.length + matchingExpeditions.length + matchingStories.length;

  const handleSelectQuery = (term: string) => {
    setQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)]);
    }
  };

  const handleNavigate = (path: string) => {
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-xl transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Modal */}
      <div className="relative w-full max-w-3xl bg-[#f4f9fc] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden z-10 animate-scale-up h-fit max-h-[85vh]">
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-4 border-b border-sky-900/15 gap-3">
          <Search className="w-5 h-5 text-sky-700 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reports, datasets, publications, expeditions, media..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-500 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-600 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-1 rounded bg-sky-50 text-[11px] text-slate-600 border border-sky-900/15 font-mono">
            ESC
          </kbd>
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto flex-1 space-y-6">
          {/* If No Query Yet: Show Suggestions & Recents */}
          {!trimmedQuery ? (
            <div className="space-y-5">
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-sky-700" />
                  <span>Popular Search Topics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => handleSelectQuery(item)}
                      className="px-3 py-1.5 rounded-xl bg-sky-50/80 hover:bg-cyan-500/20 text-xs text-slate-800 hover:text-sky-700 border border-sky-900/10 hover:border-cyan-500/30 transition-all cursor-pointer"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5">
                    <Clock className="w-3.5 h-3.5 text-sky-700" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleSelectQuery(item)}
                        className="px-3 py-1.5 rounded-xl bg-white text-xs text-slate-700 hover:text-slate-900 border border-sky-900/15 hover:border-sky-900/20 transition-all cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Navigation Cards */}
              <div className="pt-2 border-t border-sky-900/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <button
                  onClick={() => handleNavigate('/repository')}
                  className="p-3 rounded-xl bg-white/60 hover:bg-sky-50/80 border border-sky-900/10 hover:border-cyan-500/30 transition-colors"
                >
                  <FileText className="w-5 h-5 text-sky-700 mx-auto mb-1.5" />
                  <span className="text-slate-800 font-medium">All Reports</span>
                </button>
                <button
                  onClick={() => handleNavigate('/datasets')}
                  className="p-3 rounded-xl bg-white/60 hover:bg-sky-50/80 border border-sky-900/10 hover:border-cyan-500/30 transition-colors"
                >
                  <Database className="w-5 h-5 text-emerald-700 mx-auto mb-1.5" />
                  <span className="text-slate-800 font-medium">Datasets</span>
                </button>
                <button
                  onClick={() => handleNavigate('/expeditions')}
                  className="p-3 rounded-xl bg-white/60 hover:bg-sky-50/80 border border-sky-900/10 hover:border-cyan-500/30 transition-colors"
                >
                  <Compass className="w-5 h-5 text-blue-700 mx-auto mb-1.5" />
                  <span className="text-slate-800 font-medium">Expeditions</span>
                </button>
                <button
                  onClick={() => handleNavigate('/media')}
                  className="p-3 rounded-xl bg-white/60 hover:bg-sky-50/80 border border-sky-900/10 hover:border-cyan-500/30 transition-colors"
                >
                  <Camera className="w-5 h-5 text-amber-700 mx-auto mb-1.5" />
                  <span className="text-slate-800 font-medium">Media Gallery</span>
                </button>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-700">No results found for "{query}"</p>
              <p className="text-xs text-slate-600 mt-1">Try searching for terms like "Antarctica", "Sea Ice", or "IndARC"</p>
            </div>
          ) : (
            /* Results Categorized List */
            <div className="space-y-5">
              {/* Expeditions */}
              {matchingExpeditions.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-sky-700" />
                    <span>Expeditions ({matchingExpeditions.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingExpeditions.map((exp) => (
                      <div
                        key={exp.id}
                        onClick={() => handleNavigate(`/expeditions/${exp.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 cursor-pointer border border-transparent hover:border-sky-900/15 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={exp.heroImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <span className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 transition-colors block">
                              {exp.name}
                            </span>
                            <span className="text-xs text-slate-600">{exp.region} &bull; {exp.dates}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-700 transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scientific Resources & Datasets */}
              {matchingResources.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-700" />
                    <span>Scientific Resources & Datasets ({matchingResources.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingResources.map((res) => (
                      <div
                        key={res.id}
                        onClick={() => handleNavigate(`/repository/${res.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 cursor-pointer border border-transparent hover:border-sky-900/15 transition-colors group"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge size="sm" type={res.type} />
                            <Badge size="sm" region={res.region} />
                          </div>
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 transition-colors truncate block">
                            {res.title}
                          </span>
                          <span className="text-xs text-slate-600 truncate block">{res.shortDescription}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-700 transition-transform group-hover:translate-x-1 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Science Stories */}
              {matchingStories.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                    <span>Outreach Stories ({matchingStories.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchingStories.map((story) => (
                      <div
                        key={story.id}
                        onClick={() => handleNavigate(`/stories/${story.id}`)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-sky-50/80 cursor-pointer border border-transparent hover:border-sky-900/15 transition-colors group"
                      >
                        <div>
                          <span className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 transition-colors block">
                            {story.title}
                          </span>
                          <span className="text-xs text-slate-600">{story.category} &bull; {story.readingLevel}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-700 transition-transform group-hover:translate-x-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Repository Results Link */}
              <div className="pt-2 border-t border-sky-900/10 text-center">
                <button
                  onClick={() => handleNavigate(`/repository?search=${encodeURIComponent(query)}`)}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-700 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <span>View all repository results for "{query}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
