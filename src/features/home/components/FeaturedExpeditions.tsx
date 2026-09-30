import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Calendar, ArrowRight, FileText, Database } from 'lucide-react';
import { mockExpeditions } from '@/features/expeditions/data/mockExpeditions';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

export const FeaturedExpeditions: React.FC = () => {
  const featured = mockExpeditions.slice(0, 4);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-bold text-sky-700 tracking-widest uppercase block mb-1">
            Active & Archived Missions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            Featured Polar Expeditions
          </h2>
        </div>

        <Link to="/expeditions">
          <Button variant="outline" size="sm" icon={<Compass className="w-4 h-4" />}>
            View All Expeditions
          </Button>
        </Link>
      </div>

      {/* Grid of Expedition Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featured.map((exp) => (
          <div
            key={exp.id}
            className="polar-glass-card rounded-2xl overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:border-cyan-500/40"
          >
            {/* Image Header with Badge Overlay */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={exp.heroImage}
                alt={exp.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#eaf4fa] via-[#eaf4fa]/40 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge region={exp.region} />
                <Badge status={exp.status} />
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-800">
                <span className="flex items-center gap-1 font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-sky-700" />
                  {exp.dates}
                </span>
                {exp.station && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/80 border border-sky-900/15 text-sky-700 font-medium backdrop-blur-md">
                    {exp.station}
                  </span>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif] group-hover:text-sky-700 transition-colors">
                  {exp.name}
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-1">
                  Mission Leader: <span className="text-slate-700">{exp.leader}</span>
                </p>

                {/* Research Themes */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {exp.themes.map((theme) => (
                    <span
                      key={theme}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-sky-50/70 text-slate-700 border border-sky-900/10"
                    >
                      {theme}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-700 mt-4 leading-relaxed line-clamp-3">
                  {exp.shortDescription}
                </p>
              </div>

              {/* Counts & Button */}
              <div className="mt-6 pt-4 border-t border-sky-900/10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-sky-700" />
                    {exp.reportCount} Reports
                  </span>
                  <span className="flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-emerald-700" />
                    {exp.datasetCount} Datasets
                  </span>
                </div>

                <Link
                  to={`/expeditions/${exp.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-700 transition-colors group-hover:translate-x-1"
                >
                  <span>View Expedition</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
