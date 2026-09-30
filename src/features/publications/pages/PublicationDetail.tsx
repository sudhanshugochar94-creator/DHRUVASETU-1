import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Download, 
  ExternalLink, 
  Sparkles, 
  Database, 
  Compass, 
  Copy,
  Check
} from 'lucide-react';
import { publicationService } from '../services/publicationService';
import type { Publication } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Breadcrumb } from '@/shared/ui/Breadcrumb';
import { useToast } from '@/shared/context/ToastContext';

export const PublicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [publication, setPublication] = useState<Publication | null>(null);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPub = async () => {
      if (!id) return;
      const data = await publicationService.getPublicationById(id);
      setPublication(data);
    };
    fetchPub();
    window.scrollTo(0, 0);
  }, [id]);

  if (!publication) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-slate-600">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Publication Not Found</h2>
        <Link to="/publications">
          <Button variant="primary">Return to Research Publications</Button>
        </Link>
      </div>
    );
  }

  const handleCopyCitation = () => {
    const citation = `${publication.authors.join(', ')} (${publication.year}). ${publication.title}. ${publication.journal}, ${publication.volume || ''}. DOI: ${publication.doi}`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    showToast('Citation copied in APA format!', 'success');
    setTimeout(() => setCopiedCitation(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Publications', path: '/publications' },
          { label: publication.title }
        ]}
      />

      {/* Main Header Card */}
      <div className="polar-glass-card rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge region={publication.region} />
            <span className="text-xs font-bold text-purple-700 font-['Bricolage_Grotesque',sans-serif]">
              {publication.journal} {publication.volume && `(${publication.volume})`}
            </span>
          </div>

          <span className="text-xs text-slate-600 font-mono">
            Published {publication.year} &bull; {publication.citationsCount} CrossRef Citations
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] leading-tight">
          {publication.title}
        </h1>

        {/* Authors */}
        <div className="space-y-1 text-xs sm:text-sm text-slate-700">
          <div>
            <strong className="text-slate-900">Authors: </strong>
            <span>{publication.authors.join(', ')}</span>
          </div>
          <div className="text-slate-600 italic">
            <strong className="text-slate-700 not-italic">Institutions: </strong>
            <span>{publication.institutions.join('; ')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-sky-900/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              icon={<Download className="w-4 h-4" />}
              onClick={() => showToast(`Downloading PDF document (${publication.pdfSize})`, 'success')}
            >
              Download PDF ({publication.pdfSize})
            </Button>

            <Button
              variant="outline"
              icon={copiedCitation ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopyCitation}
            >
              {copiedCitation ? 'Citation Copied' : 'Copy Citation'}
            </Button>
          </div>

          <button
            onClick={() => navigate(`/content-studio?sourceId=${publication.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-500/40 text-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Generate Article in Studio</span>
          </button>
        </div>
      </div>

      {/* Abstract & Content */}
      <div className="polar-glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif] mb-3">
            Peer-Reviewed Abstract
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed font-serif">
            {publication.abstract}
          </p>
        </div>

        {/* Keywords */}
        <div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Index Keywords:
          </span>
          <div className="flex flex-wrap gap-2">
            {publication.keywords.map((kw) => (
              <span
                key={kw}
                className="text-xs px-2.5 py-1 rounded-lg bg-white text-sky-700 border border-sky-900/15 font-mono"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Linked Datasets and Expeditions */}
        <div className="pt-6 border-t border-sky-900/10 grid grid-cols-1 md:grid-cols-2 gap-4">
          {publication.linkedDatasetId && (
            <div className="p-4 rounded-xl bg-white/80 border border-emerald-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Database className="w-4 h-4 text-emerald-700" />
                <span className="text-slate-900 font-medium">Underlying In-Situ Dataset</span>
              </div>
              <Link
                to={`/datasets/${publication.linkedDatasetId}`}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>View Data</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {publication.linkedExpeditionId && (
            <div className="p-4 rounded-xl bg-white/80 border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <Compass className="w-4 h-4 text-blue-700" />
                <span className="text-slate-900 font-medium">Affiliated Mission</span>
              </div>
              <Link
                to={`/expeditions/${publication.linkedExpeditionId}`}
                className="text-xs font-bold text-blue-700 hover:text-blue-700 flex items-center gap-1"
              >
                <span>View Mission</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
