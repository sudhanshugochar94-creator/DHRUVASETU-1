import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { QuickAccess } from '../components/QuickAccess';
import { PolarRegionsGrid } from '../components/PolarRegionsGrid';
import { PlatformStats } from '../components/PlatformStats';
import { FeaturedExpeditions } from '../components/FeaturedExpeditions';
import { InteractiveTimeline } from '../components/InteractiveTimeline';
import { StorytellingBanner } from '../components/StorytellingBanner';
import { PolarMapSvg } from '@/features/expeditions/components/PolarMapSvg';
import { Button } from '@/shared/ui/Button';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-4">
      <HeroSection />
      <QuickAccess />

      {/* Animated Platform Statistics */}
      <PlatformStats />

      {/* Interactive Polar Station Map Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PolarMapSvg />
      </section>

      {/* Featured Expeditions Showcase */}
      <FeaturedExpeditions />

      {/* Four science regions */}
      <PolarRegionsGrid />

      {/* Interactive 1981-Present Research Timeline */}
      <InteractiveTimeline />

      {/* Conceptual Identity: Discover -> Research -> Archive -> Understand -> Share */}
      <StorytellingBanner />

      {/* High-Impact Content Studio Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="polar-glass-card rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-indigo-500/30 bg-gradient-to-r from-indigo-50 via-[#eaf4fa] to-sky-100">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 border border-indigo-500/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Smart India Hackathon 2026 Core Feature</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
              Transform Polar Science into Public Knowledge
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Use our verified Content Dissemination Studio to turn complex scientific reports and raw datasets into accessible website articles, classroom stories, press summaries, and social media threads with verifiable citations.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link to="/content-studio">
                <Button variant="primary" icon={<Sparkles className="w-4 h-4" />}>
                  Open Content Studio
                </Button>
              </Link>
              <Link to="/review">
                <Button variant="outline">
                  View Editorial Review Queue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
