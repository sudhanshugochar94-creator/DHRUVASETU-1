import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Eye, Sparkles, ExternalLink, Calendar } from 'lucide-react';
import type { Resource } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/context/ToastContext';

export interface ResourceCardProps {
  resource: Resource;
  viewMode?: 'grid' | 'list';
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`Downloading "${resource.title.slice(0, 30)}..." (${resource.fileSize})`, 'success');
  };

  const handleOpenStudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/content-studio?sourceId=${resource.id}`);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => navigate(`/repository/${resource.id}`)}
        className="polar-glass-card rounded-2xl p-5 cursor-pointer hover:border-cyan-500/40 transition-all duration-200 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between group"
      >
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge type={resource.type} size="sm" />
            <Badge region={resource.region} size="sm" />
            <span className="text-xs text-slate-600 flex items-center gap-1 font-mono">
              <Calendar className="w-3 h-3" />
              {resource.year}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
            {resource.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {resource.shortDescription}
          </p>

          <div className="text-[11px] text-slate-600 flex items-center gap-3">
            <span>By <strong className="text-slate-700">{resource.authors[0]}</strong></span>
            <span>&bull;</span>
            <span>{resource.institutions[0]}</span>
            <span>&bull;</span>
            <span className="text-sky-700 font-mono">{resource.fileFormat} ({resource.fileSize})</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-sky-900/10">
          <button
            onClick={handleOpenStudio}
            className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-500/30 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Generate Outreach in Studio"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Studio</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-slate-800 hover:text-slate-900 transition-colors"
            title="Download Resource"
          >
            <Download className="w-4 h-4" />
          </button>

          <Button size="sm" variant="outline" onClick={() => navigate(`/repository/${resource.id}`)}>
            View Details
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/repository/${resource.id}`)}
      className="polar-glass-card rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
    >
      {/* Cover Image & Badges */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={resource.coverImage}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#eaf4fa] via-[#eaf4fa]/30 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <Badge type={resource.type} size="sm" />
          <Badge region={resource.region} size="sm" />
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-700">
          <span className="px-2 py-0.5 rounded-md bg-white/85 text-slate-800 backdrop-blur-sm font-mono text-[10px]">
            {resource.fileFormat} &bull; {resource.fileSize}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
            <Eye className="w-3 h-3 text-sky-700" />
            {resource.viewCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-semibold text-sky-700 uppercase tracking-wider mb-1">
            {resource.theme}
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug">
            {resource.title}
          </h3>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {resource.shortDescription}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-sky-900/10">
          <div className="text-[11px] text-slate-600 truncate mb-3">
            {resource.authors.join(', ')}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleOpenStudio}
              className="text-[11px] px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-500/30 text-indigo-700 font-semibold flex items-center gap-1 transition-colors"
              title="Transform in Content Studio"
            >
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>Studio</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg bg-sky-50/90 hover:bg-sky-100 text-slate-700 hover:text-slate-900 transition-colors"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <span className="text-xs font-semibold text-sky-700 group-hover:text-sky-700 flex items-center gap-0.5">
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
