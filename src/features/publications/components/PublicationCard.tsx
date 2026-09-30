import React, { useState } from 'react';
import { Download, ExternalLink, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import type { Publication } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/context/ToastContext';
import { useNavigate } from 'react-router-dom';

interface PublicationCardProps {
  publication: Publication;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`Downloading peer-reviewed article PDF (${publication.pdfSize})`, 'success');
  };

  return (
    <div className="polar-glass-card rounded-2xl p-6 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300">
      <div>
        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Badge region={publication.region} size="sm" />
            <span className="text-xs font-semibold text-sky-700 font-['Bricolage_Grotesque',sans-serif]">
              {publication.journal} {publication.volume && `(${publication.volume})`}
            </span>
          </div>
          <span className="text-xs text-slate-600 font-mono">
            {publication.year} &bull; {publication.citationsCount} citations
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
          {publication.title}
        </h3>

        {/* Authors */}
        <p className="text-xs text-slate-700 mt-2 font-medium">
          {publication.authors.join(', ')}
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5 italic">
          {publication.institutions.join('; ')}
        </p>

        {/* Abstract */}
        <div className="mt-4 text-xs text-slate-700 leading-relaxed">
          <p className={isExpanded ? '' : 'line-clamp-3'}>
            {publication.abstract}
          </p>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sky-700 hover:text-sky-700 mt-1 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>{isExpanded ? 'Show less' : 'Read full abstract'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Keywords */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {publication.keywords.map((kw) => (
            <span
              key={kw}
              className="text-[11px] px-2 py-0.5 rounded bg-white/90 text-slate-700 border border-sky-900/10"
            >
              #{kw}
            </span>
          ))}
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="mt-6 pt-4 border-t border-sky-900/10 flex flex-wrap items-center justify-between gap-3">
        <div className="text-[11px] text-slate-600 font-mono">
          <span>DOI: </span>
          <span className="text-sky-700">{publication.doi}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/content-studio?sourceId=${publication.id}`)}
            className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-500/30 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Create Outreach Story from this Paper"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Studio</span>
          </button>

          <Button
            size="sm"
            variant="outline"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleDownload}
          >
            Download PDF
          </Button>

          <Button
            size="sm"
            variant="primary"
            icon={<ExternalLink className="w-3.5 h-3.5" />}
            onClick={() => navigate(`/publications/${publication.id}`)}
          >
            Read Article
          </Button>
        </div>
      </div>
    </div>
  );
};
