import React from 'react';
import { Building, MapPin, Layers } from 'lucide-react';
import { polarStations } from '@/features/expeditions/services/expeditionService';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Link } from 'react-router-dom';

export const AboutNCPOR: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-widest">
          <Building className="w-4 h-4" />
          <span>Institutional Profile</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          National Centre for Polar and Ocean Research
        </h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          An autonomous Research and Development institution under the Ministry of Earth Sciences (MoES), Government of India, entrusted with the nodal responsibility for coordinating and implementing the Indian Polar and Southern Ocean Scientific Programs.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="polar-glass-card rounded-2xl p-8 space-y-4 border-l-4 border-l-cyan-400">
          <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            Our Core Mandate & Mission
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            To spearhead India’s national polar scientific strategy by maintaining permanent year-round stations in Antarctica (*Maitri* and *Bharati*), an international base in the Arctic (*Himadri* at Svalbard), the high-altitude *Himansh* observatory in the Himalayas, and oceanographic research across the Southern Ocean.
          </p>
          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>Nodal agency for Antarctic Treaty Consultative Meetings (ATCM) representation.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>Operation of chartered polar ice-class research vessels and aerial support logistics.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>Stewardship of open scientific data archives for international climate research.</span>
            </li>
          </ul>
        </div>

        <div className="polar-glass-card rounded-2xl p-8 space-y-4 border-l-4 border-l-blue-500">
          <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            Strategic Scientific Divisions
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-sky-900/10 space-y-1">
              <strong className="text-sky-700 block">Cryosphere Sciences</strong>
              <span className="text-slate-600">Deep ice core drilling, firn chemistry, and glacier mass balance.</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-sky-900/10 space-y-1">
              <strong className="text-blue-700 block">Polar Oceanography</strong>
              <span className="text-slate-600">Deep mooring telemetry, CTD hydrography, and water mass tracking.</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-sky-900/10 space-y-1">
              <strong className="text-emerald-700 block">Atmospheric Sciences</strong>
              <span className="text-slate-600">Aerosols, space weather, ozone monitoring, and boundary layer radar.</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-sky-900/10 space-y-1">
              <strong className="text-purple-700 block">Polar Biology</strong>
              <span className="text-slate-600">Psychrophilic extremophiles, marine food webs, and bio-prospecting.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indian Research Stations Showcase */}
      <div className="space-y-6">
        <div className="border-b border-sky-900/15 pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
              Permanent Infrastructure
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
              India’s Polar Stations & Observatories
            </h2>
          </div>
          <Link to="/expeditions">
            <Button size="sm" variant="outline">
              View on Map
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polarStations.map((st) => (
            <div
              key={st.id}
              className="polar-glass-card rounded-2xl p-6 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge region={st.region} size="sm" />
                  <Badge status={st.status} size="sm" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
                  {st.name}
                </h3>
                <p className="text-xs text-sky-700 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {st.location}
                </p>

                <p className="text-xs text-slate-700 mt-3 leading-relaxed">
                  {st.description}
                </p>
              </div>

              <div className="pt-4 border-t border-sky-900/10 flex items-center justify-between text-xs text-slate-600 font-mono">
                <span>Commissioned {st.established}</span>
                <span>{st.elevation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HQ Details & Contact */}
      <div className="polar-glass-card rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-cyan-500/20">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            NCPOR Headquarters & Contact
          </h3>
          <p className="text-xs text-slate-700">
            Headland Sada, Vasco da Gama, Goa 403804, India &bull; Ministry of Earth Sciences, New Delhi
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-600 pt-2 font-mono">
            <span>Official Portal: ncpor.res.in</span>
            <span>&bull;</span>
            <span>Email: outreach@ncpor.res.in</span>
          </div>
        </div>

        <Link to="/repository">
          <Button variant="primary" icon={<Layers className="w-4 h-4" />}>
            Explore All Archives
          </Button>
        </Link>
      </div>
    </div>
  );
};
