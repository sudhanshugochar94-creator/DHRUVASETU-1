import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Snowflake, Mountain, Waves } from 'lucide-react';

export const PolarRegionsGrid: React.FC = () => {
  const regions = [
    {
      id: 'Antarctica',
      title: 'Antarctica',
      subtitle: 'The White Continent & Ice Sheet Dynamics',
      description: 'Host to India’s permanent bases Maitri and Bharati. Scientific focus spans deep ice core drilling, space weather, and Amery Ice Shelf stability.',
      image: '/images/antarctic-ice-shelf.jpg',
      researchCount: '480+ Studies & Reports',
      stations: 'Maitri & Bharati',
      icon: <Snowflake className="w-5 h-5 text-sky-700" />,
      accentColor: 'from-cyan-500/20 to-blue-500/5'
    },
    {
      id: 'Arctic',
      title: 'Arctic',
      subtitle: 'High North Warming & Fjord Teleconnections',
      description: 'Headquartered at Himadri in Ny-Ålesund, Svalbard, alongside the deep-sea IndARC mooring. Investigating Arctic amplification and monsoon links.',
      image: '/images/aurora-ice-field.jpg',
      researchCount: '190+ Studies & Reports',
      stations: 'Himadri & IndARC',
      icon: <Compass className="w-5 h-5 text-sky-700" />,
      accentColor: 'from-sky-500/20 to-indigo-500/5'
    },
    {
      id: 'Himalaya',
      title: 'Himalaya',
      subtitle: 'The Third Pole & Water Security',
      description: 'Operating from the high-altitude Himansh station in Spiti Valley. Tracking glacier mass loss, meltwater runoff, and glacial lake outburst hazards.',
      image: '/images/himalaya-peaks.jpg',
      researchCount: '110+ Studies & Reports',
      stations: 'Himansh Observatory',
      icon: <Mountain className="w-5 h-5 text-emerald-700" />,
      accentColor: 'from-emerald-500/20 to-teal-500/5'
    },
    {
      id: 'Southern Ocean',
      title: 'Southern Ocean',
      subtitle: 'Global Carbon Sink & Oceanic Gateways',
      description: 'Shipboard transects from the Subtropical Front to Antarctic coast. Decoding iron fertilization, air-sea CO2 fluxes, and krill ecology.',
      image: '/images/glacier-valley.jpg',
      researchCount: '120+ Studies & Reports',
      stations: 'Shipboard Expeditions',
      icon: <Waves className="w-5 h-5 text-purple-700" />,
      accentColor: 'from-purple-500/20 to-blue-500/5'
    }
  ];

  return (
    <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs font-bold text-sky-700 tracking-widest uppercase block mb-1">
            Global Polar Geographies
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            India’s Polar Science Regions
          </h2>
        </div>
        <p className="text-sm text-slate-600 max-w-md">
          Explore research and real-time environmental data across Earth's four critical cryospheric and oceanic realms.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {regions.map((reg) => (
          <div
            key={reg.id}
            className="polar-glass-card rounded-2xl overflow-hidden group flex flex-col transition-all duration-300 hover:border-cyan-500/40 hover:-translate-y-1.5"
          >
            {/* Image Thumbnail */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={reg.image}
                alt={reg.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#eaf4fa] via-[#eaf4fa]/40 to-transparent" />
              <div className="absolute top-3 left-3 p-2 rounded-xl bg-white/80 backdrop-blur-md border border-sky-900/15">
                {reg.icon}
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                <span className="px-2 py-1 rounded-md bg-sky-50 border border-cyan-500/30 text-sky-700 font-semibold backdrop-blur-md">
                  {reg.stations}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif] group-hover:text-sky-700 transition-colors">
                  {reg.title}
                </h3>
                <p className="text-xs font-medium text-sky-700 mt-0.5">{reg.subtitle}</p>
                <p className="text-xs text-slate-700 mt-3 leading-relaxed line-clamp-3">
                  {reg.description}
                </p>
              </div>

              {/* Research Count & CTA */}
              <div className="mt-5 pt-4 border-t border-sky-900/10 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">
                  {reg.researchCount}
                </span>
                <Link
                  to={`/repository?region=${encodeURIComponent(reg.id)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-700 transition-colors group-hover:translate-x-0.5"
                >
                  <span>Explore</span>
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
