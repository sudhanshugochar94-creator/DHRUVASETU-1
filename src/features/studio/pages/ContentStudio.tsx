import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  Save, 
  ShieldCheck,
  AlertCircle,
  Share2
} from 'lucide-react';
import { mockResources } from '@/features/repository/data/mockResources';
import { studioService } from '../services/studioService';
import type { GenerateDraftRequest } from '../services/studioService';
import type { ContentDraft, Resource } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/context/ToastContext';

export const ContentStudio: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const sourceIdFromUrl = searchParams.get('sourceId');
  const initialSource = mockResources.find((r) => r.id === sourceIdFromUrl) || mockResources[0];

  // Wizard state
  const [step, setStep] = useState<number>(1);
  const [selectedSource, setSelectedSource] = useState<Resource>(initialSource);
  const [outputFormat, setOutputFormat] = useState<GenerateDraftRequest['outputFormat']>('Website Article');
  const [targetAudience, setTargetAudience] = useState<GenerateDraftRequest['targetAudience']>('General Public');
  const [tone, setTone] = useState<GenerateDraftRequest['tone']>('Public Friendly');

  // Generator & Editor state
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draft, setDraft] = useState<ContentDraft | null>(null);
  const [editableTitle, setEditableTitle] = useState('');
  const [editableSummary, setEditableSummary] = useState('');
  const [editableBody, setEditableBody] = useState('');

  useEffect(() => {
    if (sourceIdFromUrl) {
      const found = mockResources.find((r) => r.id === sourceIdFromUrl);
      if (found) setSelectedSource(found);
    }
  }, [sourceIdFromUrl]);

  const outputFormats: GenerateDraftRequest['outputFormat'][] = [
    'Website Article',
    'Social Media Post',
    'Educational Summary',
    'Expedition Highlight',
    'Dataset Explanation',
    'Research Summary',
    'Press Summary',
    'Science Story'
  ];

  const audiences: GenerateDraftRequest['targetAudience'][] = [
    'Researchers',
    'Students',
    'Teachers',
    'General Public'
  ];

  const tones: GenerateDraftRequest['tone'][] = [
    'Scientific',
    'Educational',
    'Public Friendly'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const generated = await studioService.generateDraft({
        sourceResourceId: selectedSource.id,
        sourceTitle: selectedSource.title,
        sourceDescription: selectedSource.fullDescription || selectedSource.shortDescription,
        sourceType: selectedSource.type,
        region: selectedSource.region,
        outputFormat,
        targetAudience,
        tone
      }, selectedSource);
      setDraft(generated);
      setEditableTitle(generated.title);
      setEditableSummary(generated.summary);
      setEditableBody(generated.body);
      setStep(5); // Jump to editor view
      showToast('Generated outreach draft from verified scientific source with xAI Grok!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI generation request failed';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!draft) return;
    const updatedDraft: ContentDraft = {
      ...draft,
      title: editableTitle,
      summary: editableSummary,
      body: editableBody,
      status: 'Draft'
    };
    await studioService.saveDraft(updatedDraft);
    showToast('Draft successfully saved to local workspace!', 'info');
  };

  const handleSendToReview = async () => {
    if (!draft) return;
    const updatedDraft: ContentDraft = {
      ...draft,
      title: editableTitle,
      summary: editableSummary,
      body: editableBody,
      status: 'Under Review'
    };
    await studioService.saveDraft(updatedDraft);
    showToast('Draft sent to NCPOR Editorial Review Queue!', 'success');
    navigate('/review');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>AI Science Dissemination Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          Media & Content Studio
        </h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          Transform raw expedition logs, complex peer-reviewed papers, and in-situ polar datasets into engaging articles, press releases, and classroom stories grounded directly in verified NCPOR science.
        </p>
      </div>

      {/* 4-Step Progress Indicator */}
      <div className="polar-glass-card rounded-2xl p-4 sm:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: 1, label: 'Source Material', desc: selectedSource.title.slice(0, 24) + '...' },
            { num: 2, label: 'Output Format', desc: outputFormat },
            { num: 3, label: 'Target Audience', desc: targetAudience },
            { num: 4, label: 'Editorial Tone', desc: tone }
          ].map((s) => (
            <div
              key={s.num}
              onClick={() => {
                if (step === 5) setStep(s.num);
                else setStep(s.num);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                step === s.num
                  ? 'bg-indigo-50 border-indigo-500/50 shadow-md shadow-sky-900/10'
                  : 'bg-white/60 border-sky-900/10 hover:border-sky-900/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num ? 'bg-indigo-600 text-white' : 'bg-sky-50 text-slate-600'
                }`}>
                  {s.num}
                </span>
                <span className="text-xs font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
                  {s.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-600 block truncate font-mono">
                {s.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Studio Interactive Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Configuration Steps 1-4) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="polar-glass-card rounded-2xl p-6 space-y-6">
            {/* Step 1: Select Verified Source */}
            <div>
              <label className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-2 flex items-center justify-between">
                <span>1. Select Verified Source Asset:</span>
                <span className="text-[10px] text-slate-600 font-normal">({mockResources.length} available)</span>
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {mockResources.map((res) => {
                  const isSelected = selectedSource.id === res.id;
                  return (
                    <div
                      key={res.id}
                      onClick={() => setSelectedSource(res)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-sky-800'
                          : 'bg-white/80 border-sky-900/10 hover:bg-sky-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge type={res.type} size="sm" />
                        <span className="text-[10px] text-slate-600 font-mono">{res.year}</span>
                      </div>
                      <p className="font-semibold text-slate-900 line-clamp-1">{res.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Output Format */}
            <div>
              <label className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-2">
                2. Choose Output Format:
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {outputFormats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`px-3 py-2 rounded-xl text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                      outputFormat === fmt
                        ? 'bg-indigo-50 border border-indigo-500/40 text-indigo-700 font-bold'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-sky-900/10'
                    }`}
                  >
                    <span>{fmt}</span>
                    {outputFormat === fmt && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Audience */}
            <div>
              <label className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-2">
                3. Target Audience:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {audiences.map((aud) => (
                  <button
                    key={aud}
                    onClick={() => setTargetAudience(aud)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      targetAudience === aud
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-sky-900/10'
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Tone */}
            <div>
              <label className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-2">
                4. Tone of Voice:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-2 py-1.5 rounded-xl text-[11px] font-medium transition-all text-center cursor-pointer ${
                      tone === t
                        ? 'bg-purple-500 text-white font-bold'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-sky-900/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-2 space-y-3">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                icon={<Sparkles className="w-4 h-4" />}
                isLoading={isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? 'Synthesizing with xAI Grok...' : 'Generate Draft'}
              </Button>

              {/* Error Notice Banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-amber-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                    <span>AI Engine Status</span>
                  </div>
                  <p className="leading-relaxed text-[11px] text-amber-200/90 font-mono">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Editor & Scientific Grounding Card */}
        <div className="lg:col-span-2 space-y-6">
          {draft ? (
            <div className="polar-glass-card rounded-2xl p-6 sm:p-8 space-y-6 border border-indigo-500/30">
              {/* Scientific Grounding Badge Header */}
              <div className="p-4 rounded-xl bg-[#eaf4fa] border border-cyan-500/30 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                      Generated from Selected Scientific Sources
                    </span>
                    <span className="text-xs text-sky-700 block mt-0.5">
                      Source: {selectedSource.title}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-500/30">
                  Verified NCPOR Pipeline
                </span>
              </div>

              {/* Title Editor */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Headline / Title:
                </label>
                <input
                  type="text"
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  className="w-full bg-white border border-sky-900/15 rounded-xl px-4 py-2.5 text-base font-bold text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Summary Editor */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Executive Outreach Hook / Summary:
                </label>
                <textarea
                  rows={2}
                  value={editableSummary}
                  onChange={(e) => setEditableSummary(e.target.value)}
                  className="w-full bg-white border border-sky-900/15 rounded-xl p-3 text-xs text-slate-700 focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>

              {/* Body Editor */}
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Article / Dissemination Body:
                </label>
                <textarea
                  rows={10}
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  className="w-full bg-white border border-sky-900/15 rounded-xl p-4 text-xs font-mono text-slate-800 focus:outline-none focus:border-sky-500 leading-relaxed"
                />
              </div>

              {/* Social Caption & Hashtags Preview (if available) */}
              {draft.socialCaption && (
                <div className="p-4 rounded-xl bg-white/80 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Social Media Dissemination Copy</span>
                  </div>
                  <p className="text-xs text-slate-800 font-mono whitespace-pre-line leading-relaxed">
                    {draft.socialCaption}
                  </p>
                  {draft.hashtags && draft.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {draft.hashtags.map((tag, i) => (
                        <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Grounded Source References */}
              <div className="p-4 rounded-xl bg-white/60 border border-sky-900/10 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Mandatory Source Citations Included:
                </span>
                <ul className="space-y-1 text-xs text-slate-700 font-mono">
                  {draft.sourceReferences.map((ref, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      <span>{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-sky-900/15 flex flex-wrap items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  onClick={handleGenerate}
                >
                  Regenerate
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Save className="w-4 h-4" />}
                    onClick={handleSaveDraft}
                  >
                    Save Draft
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Send className="w-4 h-4" />}
                    onClick={handleSendToReview}
                  >
                    Send to Review Queue
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty Placeholder when no draft generated yet */
            <div className="polar-glass-card rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[460px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
                Ready to Synthesize Outreach Copy
              </h3>
              <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                Selected Source: <strong className="text-slate-900">{selectedSource.title}</strong>
              </p>
              <p className="text-xs text-slate-600 max-w-sm">
                Configure your format, audience, and tone on the left, then click <strong>"Generate Draft"</strong> to generate scientific outreach material via xAI Grok.
              </p>

              {errorMessage && (
                <div className="p-4 max-w-md text-left rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                    <span>Edge Function Notice</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-700 font-mono">
                    {errorMessage}
                  </p>
                </div>
              )}

              <Button
                variant="primary"
                icon={<Sparkles className="w-4 h-4" />}
                isLoading={isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? 'Synthesizing with xAI Grok...' : 'Generate Draft Now'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
