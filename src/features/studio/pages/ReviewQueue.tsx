import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Send, 
  Eye, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';
import { studioService } from '../services/studioService';
import type { ContentDraft } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import { useToast } from '@/shared/context/ToastContext';

export const ReviewQueue: React.FC = () => {
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [activeStatus, setActiveStatus] = useState<ContentDraft['status'] | 'All'>('All');
  const [inspectDraft, setInspectDraft] = useState<ContentDraft | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchQueue = async () => {
      const data = await studioService.getDrafts();
      setDrafts(data);
    };
    fetchQueue();
  }, []);

  const handleStatusChange = async (draftId: string, newStatus: ContentDraft['status']) => {
    const updated = await studioService.updateDraftStatus(
      draftId,
      newStatus,
      feedbackInput ? `Editor Note: ${feedbackInput}` : undefined
    );
    if (updated) {
      setDrafts((prev) => prev.map((d) => (d.id === draftId ? updated : d)));
      if (inspectDraft?.id === draftId) {
        setInspectDraft(updated);
      }
      showToast(`Content status transitioned to "${newStatus}"`, 'success');
      setFeedbackInput('');
    }
  };

  const filteredDrafts = activeStatus === 'All'
    ? drafts
    : drafts.filter((d) => d.status === activeStatus);

  const statuses: (ContentDraft['status'] | 'All')[] = [
    'All',
    'Draft',
    'Under Review',
    'Approved',
    'Published'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          <span>Editorial Workflow & Governance</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          Review & Publish Queue
        </h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          Ensure institutional accuracy, scientific rigor, and proper attribution before public dissemination. Review AI-synthesized outreach drafts and approve them for ministry web portals or social channels.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-white border border-sky-900/15 w-fit">
        {statuses.map((st) => {
          const isSelected = activeStatus === st;
          const count = st === 'All' ? drafts.length : drafts.filter((d) => d.status === st).length;
          return (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-sky-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{st}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isSelected ? 'bg-white text-sky-700' : 'bg-sky-50 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Drafts List */}
      <div className="space-y-4">
        {filteredDrafts.map((d) => (
          <div
            key={d.id}
            className="polar-glass-card rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group hover:border-cyan-500/40 transition-all duration-200"
          >
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge status={d.status} />
                <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-500/30 font-semibold">
                  {d.outputFormat}
                </span>
                <span className="text-[11px] text-slate-600 font-mono">
                  Audience: {d.targetAudience} &bull; Tone: {d.tone}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                {d.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {d.summary}
              </p>

              <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-3">
                <span>Author: <strong className="text-slate-700">{d.author}</strong></span>
                <span>&bull;</span>
                <span>Grounded Source: <strong className="text-sky-700">{d.sourceResourceTitle.slice(0, 40)}...</strong></span>
                <span>&bull;</span>
                <span className="font-mono">{d.createdAt}</span>
              </div>
            </div>

            {/* Actions for this Draft */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-sky-900/10">
              <Button
                size="sm"
                variant="outline"
                icon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => setInspectDraft(d)}
              >
                Inspect Draft
              </Button>

              {d.status === 'Draft' && (
                <Button
                  size="sm"
                  variant="primary"
                  icon={<Send className="w-3.5 h-3.5" />}
                  onClick={() => handleStatusChange(d.id, 'Under Review')}
                >
                  Submit for Review
                </Button>
              )}

              {d.status === 'Under Review' && (
                <>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    onClick={() => handleStatusChange(d.id, 'Approved')}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<XCircle className="w-3.5 h-3.5 text-rose-700" />}
                    onClick={() => handleStatusChange(d.id, 'Draft')}
                  >
                    Reject to Draft
                  </Button>
                </>
              )}

              {d.status === 'Approved' && (
                <Button
                  size="sm"
                  variant="primary"
                  icon={<ShieldCheck className="w-3.5 h-3.5" />}
                  onClick={() => handleStatusChange(d.id, 'Published')}
                >
                  Publish Publicly
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Inspect & Editorial Action Modal */}
      {inspectDraft && (
        <Modal
          isOpen={Boolean(inspectDraft)}
          onClose={() => setInspectDraft(null)}
          title={inspectDraft.title}
          subtitle={`Format: ${inspectDraft.outputFormat} • Audience: ${inspectDraft.targetAudience} • Status: ${inspectDraft.status}`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Attribution Notice */}
            <div className="p-3.5 rounded-xl bg-white/90 border border-cyan-500/30 flex items-start gap-3 text-xs text-sky-800">
              <ShieldCheck className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 font-semibold mb-0.5">Scientific Source Grounding:</strong>
                <span>{inspectDraft.sourceResourceTitle} ({inspectDraft.sourceResourceType})</span>
              </div>
            </div>

            {/* Multi-agent validation (only for agent-generated drafts) */}
            {inspectDraft.agentGenerated && (
              <div className="p-3.5 rounded-xl bg-white/90 border border-amber-500/30 text-xs text-slate-800 space-y-1.5">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <span><strong>Validation confidence:</strong> {Math.round((inspectDraft.confidence ?? 0) * 100)}%</span>
                  <span><strong>Revision:</strong> {inspectDraft.revision ?? 0}</span>
                  {inspectDraft.publishAt && <span><strong>Scheduled:</strong> {new Date(inspectDraft.publishAt).toLocaleString()}</span>}
                </div>
                {inspectDraft.socialCaption && <p className="font-mono">X post: {inspectDraft.socialCaption}</p>}
                {inspectDraft.validationFlags && inspectDraft.validationFlags.length > 0 && (
                  <ul className="list-disc pl-4 text-amber-800">
                    {inspectDraft.validationFlags.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                )}
              </div>
            )}

            {/* Summary */}
            <div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Summary Hook:
              </span>
              <p className="text-xs text-slate-800 leading-relaxed p-3 rounded-xl bg-white/60 border border-sky-900/10">
                {inspectDraft.summary}
              </p>
            </div>

            {/* Full Body */}
            <div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Full Dissemination Copy:
              </span>
              <div className="text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed p-4 rounded-xl bg-sky-50 border border-sky-900/15 max-h-72 overflow-y-auto">
                {inspectDraft.body}
              </div>
            </div>

            {/* Included Citations */}
            <div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
                Included Citations:
              </span>
              <ul className="space-y-1 text-xs text-slate-700 font-mono">
                {inspectDraft.sourceReferences.map((ref, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span>{ref}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Editorial Review Feedback Input */}
            <div className="space-y-2 pt-2 border-t border-sky-900/15">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-sky-700" />
                <span>Editorial Notes / Review Feedback:</span>
              </label>
              <input
                type="text"
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="e.g., Verified against oceanographic dataset. Approved for publishing."
                className="w-full bg-white border border-sky-900/15 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-sky-900/15 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Current status: <Badge status={inspectDraft.status} size="sm" />
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setInspectDraft(null)}>
                  Close
                </Button>

                {inspectDraft.status !== 'Approved' && (
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={() => handleStatusChange(inspectDraft.id, 'Approved')}
                  >
                    Approve Content
                  </Button>
                )}

                {inspectDraft.status === 'Approved' && (
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<ShieldCheck className="w-4 h-4" />}
                    onClick={() => handleStatusChange(inspectDraft.id, 'Published')}
                  >
                    Publish to Public Gateway
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
