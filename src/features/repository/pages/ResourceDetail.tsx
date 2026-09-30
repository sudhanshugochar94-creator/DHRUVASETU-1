import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Share2, 
  Bookmark, 
  Sparkles, 
  Calendar, 
  ShieldCheck, 
  Compass
} from 'lucide-react';
import { repositoryService } from '../services/repositoryService';
import type { Resource } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Breadcrumb } from '@/shared/ui/Breadcrumb';
import { ResourceCard } from '../components/ResourceCard';
import { Skeleton } from '@/shared/ui/Skeleton';
import { useToast } from '@/shared/context/ToastContext';

export const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await repositoryService.getResourceById(id);
        setResource(data);
        if (data) {
          const related = await repositoryService.getRelatedResources(data.id);
          setRelatedResources(related);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Resource Not Found</h2>
        <p className="text-sm text-slate-600">The requested polar science asset could not be located in the archive.</p>
        <Link to="/repository">
          <Button variant="primary">Return to Knowledge Repository</Button>
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Direct permanent resource link copied to clipboard!', 'success');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    showToast(isSaved ? 'Removed from saved repository resources' : 'Saved to personal research collection', 'info');
  };

  const handleDownload = () => {
    showToast(`Initiating download for "${resource.title}" (${resource.fileSize})`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: 'Repository', path: '/repository' },
          { label: resource.region, path: `/repository?region=${encodeURIComponent(resource.region)}` },
          { label: resource.title }
        ]}
      />

      {/* Main Header Card */}
      <div className="polar-glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden space-y-6">
        {/* Badges & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge type={resource.type} />
            <Badge region={resource.region} />
            <span className="text-xs text-slate-600 font-mono flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-700" />
              {resource.date}
            </span>
          </div>

          {resource.expeditionName && (
            <Link
              to={`/expeditions/${resource.expeditionId || 'exp-isea-43'}`}
              className="text-xs text-sky-700 hover:text-sky-700 font-semibold flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{resource.expeditionName}</span>
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight leading-snug">
          {resource.title}
        </h1>

        {/* Authors & Institutions */}
        <div className="space-y-1 text-xs sm:text-sm text-slate-700 border-b border-sky-900/15 pb-6">
          <div>
            <strong className="text-slate-800">Investigators: </strong>
            <span>{resource.authors.join(', ')}</span>
          </div>
          <div className="text-slate-600">
            <strong className="text-slate-700">Affiliations: </strong>
            <span>{resource.institutions.join('; ')}</span>
          </div>
        </div>

        {/* Action Bar (Download, Read, Share, Save, Open in Studio) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownload}
            >
              Download Resource ({resource.fileSize})
            </Button>

            <Button
              variant="outline"
              icon={<Share2 className="w-4 h-4" />}
              onClick={handleShare}
            >
              Share Link
            </Button>

            <Button
              variant="ghost"
              icon={<Bookmark className={`w-4 h-4 ${isSaved ? 'fill-cyan-400 text-sky-700' : ''}`} />}
              onClick={handleSave}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>

          {/* Differentiating Feature: Push to Content Studio */}
          <button
            onClick={() => navigate(`/content-studio?sourceId=${resource.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 via-sky-50 to-purple-50 border border-indigo-500/40 text-indigo-800 hover:text-slate-900 hover:border-indigo-400 text-xs font-bold transition-all shadow-lg shadow-sky-900/10 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>Generate Outreach in Content Studio</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout: Description + Metadata Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Full Abstract / Description */}
        <div className="lg:col-span-2 space-y-6">
          <div className="polar-glass-card rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif] mb-3">
                Executive Summary & Operational Context
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {resource.shortDescription}
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif] mb-3">
                Scientific Scope & Observations
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {resource.fullDescription}
              </p>
            </div>

            {/* Source Attribution Notice */}
            <div className="p-4 rounded-xl bg-white/90 border border-cyan-500/20 flex items-start gap-3 text-xs text-sky-800">
              <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Verified Scientific Source:</strong>
                <span>{resource.sourceAttribution}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata Details Panel */}
        <div className="space-y-6">
          <div className="polar-glass-card rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Bricolage_Grotesque',sans-serif] border-b border-sky-900/15 pb-3">
              Technical Metadata
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-sky-900/10">
                <span className="text-slate-600">File Format:</span>
                <span className="text-slate-900 font-mono font-bold">{resource.fileFormat}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-900/10">
                <span className="text-slate-600">File Size:</span>
                <span className="text-slate-900 font-mono">{resource.fileSize}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-900/10">
                <span className="text-slate-600">Language:</span>
                <span className="text-slate-900">{resource.language}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-900/10">
                <span className="text-slate-600">Access License:</span>
                <span className="text-emerald-700 font-medium">{resource.license}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-900/10">
                <span className="text-slate-600">Year of Survey:</span>
                <span className="text-slate-900 font-mono">{resource.year}</span>
              </div>
              {resource.doi && (
                <div className="flex flex-col py-1 border-b border-sky-900/10 gap-0.5">
                  <span className="text-slate-600">Permanent DOI:</span>
                  <span className="text-sky-700 font-mono text-[11px] break-all">{resource.doi}</span>
                </div>
              )}
              {resource.coordinates && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Coordinates:</span>
                  <span className="text-sky-700 font-mono">
                    {resource.coordinates.lat.toFixed(2)}°, {resource.coordinates.lng.toFixed(2)}°
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Resources Carousel / Grid */}
      {relatedResources.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-sky-900/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
              Related Scientific Resources
            </h3>
            <Link to="/repository" className="text-xs font-semibold text-sky-700 hover:text-sky-700">
              Browse All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedResources.map((rel) => (
              <ResourceCard key={rel.id} resource={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
