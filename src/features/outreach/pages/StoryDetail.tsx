import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  ShieldCheck, 
  ExternalLink,
  Share2,
  FileText,
  Lightbulb,
  Award
} from 'lucide-react';
import { mockStories } from '../data/mockStories';
import type { ScienceStory } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Breadcrumb } from '@/shared/ui/Breadcrumb';
import { useToast } from '@/shared/context/ToastContext';

export const StoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<ScienceStory | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const found = mockStories.find((s) => s.id === id || s.slug === id);
    setStory(found || mockStories[0]);
    window.scrollTo(0, 0);
  }, [id]);

  if (!story) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Story link copied to clipboard!', 'success');
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Outreach', path: '/outreach' },
          { label: story.title }
        ]}
      />

      {/* Editorial Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge region={story.region} />
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-cyan-500/30">
            {story.readingLevel} Reading Level
          </span>
          <span className="text-xs text-slate-600 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-sky-700" />
            {story.readingTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight leading-tight">
          {story.title}
        </h1>

        <p className="text-base sm:text-xl text-slate-700 font-normal leading-relaxed">
          {story.subtitle}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-sky-900/15 text-xs text-slate-600">
          <div>
            <span>By <strong className="text-slate-900">{story.author}</strong></span>
            <span className="mx-2">&bull;</span>
            <span>Published {story.publishedDate}</span>
          </div>

          <Button size="sm" variant="ghost" icon={<Share2 className="w-4 h-4" />} onClick={handleShare}>
            Share
          </Button>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-sky-900/15 max-h-[460px]">
        <img
          src={story.heroImage}
          alt={story.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Section 1: The Simple Explanation */}
      <div className="polar-glass-card rounded-2xl p-6 sm:p-8 space-y-3 border-l-4 border-l-cyan-400">
        <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-sky-700" />
          <span>The Simple Explanation</span>
        </div>
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
          {story.simpleExplanation}
        </p>
      </div>

      {/* Section 2: Scientific Context */}
      <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
          Scientific Context & Mechanism
        </h2>
        <p>{story.scientificContext}</p>
      </div>

      {/* Section 3: Key Findings */}
      <div className="polar-glass-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
          <Award className="w-4 h-4 text-emerald-700" />
          <span>Key Scientific Discoveries</span>
        </div>
        <ul className="space-y-3 text-xs sm:text-sm text-slate-800">
          {story.keyFindings.map((finding, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
              <span>{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 4: Why It Matters */}
      <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
        <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
          Why It Matters to India & the World
        </h2>
        <p>{story.whyItMatters}</p>
      </div>

      {/* Mandatory Scientific Grounding Panel (Problem Statement SIH Requirement) */}
      <div className="p-6 rounded-2xl bg-[#eaf4fa] border border-cyan-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5 text-sky-700" />
            <span>Verified Scientific Grounding Notice</span>
          </div>
          <span className="text-[11px] text-slate-600 font-mono">FAIR Repository Linkage</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed">
          This outreach article was authored directly from peer-reviewed scientific datasets and official expedition reports cataloged within the National Centre for Polar and Ocean Research repository.
        </p>

        <div className="space-y-2 pt-2">
          <span className="text-xs font-semibold text-slate-600 block">
            Original Repository Resources:
          </span>
          {story.groundedSources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white/90 border border-sky-900/10 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-700 shrink-0" />
                <span className="text-xs font-semibold text-slate-900 truncate max-w-sm">
                  {source.title}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-100/70 text-slate-700 font-mono">
                  {source.type}
                </span>
              </div>

              <Link
                to={`/repository/${source.id}`}
                className="text-xs font-bold text-sky-700 hover:text-sky-700 flex items-center gap-1 shrink-0 ml-3"
              >
                <span>Inspect Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
