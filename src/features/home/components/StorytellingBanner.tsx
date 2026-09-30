import React from 'react';
import { Compass, Microscope, Archive, Lightbulb, Share2, ArrowRight } from 'lucide-react';

export const StorytellingBanner: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'DISCOVER',
      subtitle: 'Pioneering Expeditions',
      description: 'Navigating extreme polar seas and frozen continents to establish scientific outposts.',
      icon: <Compass className="w-5 h-5 text-sky-700" />
    },
    {
      step: '02',
      title: 'RESEARCH',
      subtitle: 'Rigorous Field Science',
      description: 'Logging ice cores, atmospheric lasers, marine moorings, and satellite geodesy.',
      icon: <Microscope className="w-5 h-5 text-blue-700" />
    },
    {
      step: '03',
      title: 'ARCHIVE',
      subtitle: 'FAIR Knowledge Repository',
      description: 'Preserving raw data, official expedition reports, and peer-reviewed papers.',
      icon: <Archive className="w-5 h-5 text-emerald-700" />
    },
    {
      step: '04',
      title: 'UNDERSTAND',
      subtitle: 'Planetary Insights',
      description: 'Translating complex cryospheric changes into climate models and Monsoon forecasts.',
      icon: <Lightbulb className="w-5 h-5 text-amber-700" />
    },
    {
      step: '05',
      title: 'SHARE',
      subtitle: 'Outreach & Content Studio',
      description: 'Disseminating verified stories, classroom kits, and social media to inspire India.',
      icon: <Share2 className="w-5 h-5 text-purple-700" />
    }
  ];

  return (
    <section className="py-20 bg-[#eaf4fa] border-t border-sky-900/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-sky-700 tracking-widest uppercase block mb-1">
            Our Mission Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            The Polar Science Lifecycle
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            A unified digital ecosystem connecting field exploration to public outreach and education.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 relative">
          {steps.map((item, idx) => (
            <div
              key={item.title}
              className="polar-glass-card rounded-2xl p-5 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-slate-700 group-hover:text-sky-700 transition-colors font-mono">
                    {item.step}
                  </span>
                  <div className="p-2 rounded-xl bg-white border border-sky-900/15 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-wider">
                  {item.title}
                </h3>
                <h4 className="text-xs font-semibold text-sky-700 mt-0.5">{item.subtitle}</h4>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">{item.description}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-20 pointer-events-none">
                  <div className="w-6 h-6 rounded-full bg-[#f4f9fc] border border-cyan-500/30 flex items-center justify-center text-sky-700 shadow-md">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
