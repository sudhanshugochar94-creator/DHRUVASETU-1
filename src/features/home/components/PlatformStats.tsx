import React, { useState, useEffect } from 'react';
import { Compass, BookOpen, Database, Camera, Users, Sparkles } from 'lucide-react';

/**
 * NOTE FOR PRODUCTION BACKEND / SUPABASE INTEGRATION:
 * The numeric values below are calibrated DEMO / MOCK values representing the National Centre
 * for Polar and Ocean Research cumulative statistics.
 * When connecting to Supabase / PostgreSQL:
 * Replace this static state with an asynchronous fetch from `dashboardService.getDashboardMetrics()`.
 */
const mockStatsData = [
  { label: 'Expeditions & Missions', target: 250, suffix: '+', icon: <Compass className="w-5 h-5 text-sky-700" />, subtext: 'Across Antarctica, Arctic & Southern Ocean' },
  { label: 'Research Publications', target: 1200, suffix: '+', icon: <BookOpen className="w-5 h-5 text-purple-700" />, subtext: 'Peer-reviewed high-impact papers' },
  { label: 'Scientific Resources', target: 850, suffix: '+', icon: <Database className="w-5 h-5 text-emerald-700" />, subtext: 'Open-access reports & verified datasets' },
  { label: 'Media Assets Archived', target: 4500, suffix: '+', icon: <Camera className="w-5 h-5 text-amber-700" />, subtext: 'High-res photos, 4K video & reels' },
  { label: 'Outreach Activities', target: 120, suffix: '+', icon: <Users className="w-5 h-5 text-blue-700" />, subtext: 'Nationwide student science workshops' }
];

export const PlatformStats: React.FC = () => {
  const [counts, setCounts] = useState<number[]>(mockStatsData.map(() => 0));

  useEffect(() => {
    // Smooth counter animation on mount
    const duration = 1600; // ms
    const steps = 40;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounts(
        mockStatsData.map((item) => Math.floor(item.target * ease))
      );

      if (step >= steps) {
        clearInterval(timer);
        setCounts(mockStatsData.map((item) => item.target));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 relative bg-[#eaf4fa] border-y border-sky-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-sky-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>National Scientific Impact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            India’s Polar Research at a Glance
          </h2>
          <p className="text-xs text-slate-600 mt-2">
            *Demonstration platform metrics compiled from four decades of Indian polar expeditions and institutional archives.
          </p>
        </div>

        {/* Counters Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {mockStatsData.map((stat, idx) => (
            <div
              key={stat.label}
              className="polar-glass-card rounded-2xl p-5 text-center flex flex-col items-center justify-between group hover:border-cyan-500/40 transition-all duration-300"
            >
              <div className="p-2.5 rounded-xl bg-white border border-sky-900/15 mb-3 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight group-hover:text-sky-700 transition-colors">
                {counts[idx].toLocaleString()}
                <span className="text-sky-700 font-semibold">{stat.suffix}</span>
              </div>

              <div className="text-xs font-bold text-slate-800 mt-2 uppercase tracking-wider">
                {stat.label}
              </div>

              <div className="text-[11px] text-slate-600 mt-1 leading-snug">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
