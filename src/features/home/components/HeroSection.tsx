import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Layers, ArrowRight, Shield, MapPin } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { MountainRange } from '@/shared/art/MountainRange';

const stations = [
  { name: 'Maitri', place: 'Antarctica' },
  { name: 'Bharati', place: 'Antarctica' },
  { name: 'Himadri', place: 'Arctic, Svalbard' },
  { name: 'Himansh', place: 'Himalaya, Spiti Valley' },
];

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#d6ebf8] via-[#e9f4fb] to-[#f4f9fc]" />
      <div className="absolute inset-0 polar-aurora-bg pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 h-72 sm:h-96 pointer-events-none">
        <MountainRange variant="hero" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-14 pb-64 sm:pb-80 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-sky-600/25 text-sky-800 text-xs font-semibold mb-6 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-sky-600" />
            <span>National Centre for Polar and Ocean Research &bull; MoES</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight font-['Bricolage_Grotesque',sans-serif] leading-[1.02]">
            DhruvaSetu
          </h1>
          <p className="mt-3 text-xl sm:text-2xl font-semibold text-sky-800 font-['Bricolage_Grotesque',sans-serif]">
            The bridge to India's polar science
          </p>
          <p className="mt-5 text-base sm:text-lg text-slate-700 max-w-xl leading-relaxed">
            Expeditions, research, datasets, publications and stories from India's work in Antarctica, the Arctic, the Southern Ocean and the Himalayas.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/repository">
              <Button size="lg" variant="primary" icon={<Layers className="w-5 h-5" />} className="w-full sm:w-auto whitespace-nowrap">
                Explore repository
              </Button>
            </Link>
            <Link to="/expeditions">
              <Button size="lg" variant="outline" icon={<Compass className="w-5 h-5" />} className="w-full sm:w-auto whitespace-nowrap">
                Discover expeditions
              </Button>
            </Link>
          </div>
        </div>

        <aside className="polar-glass rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Research stations</h2>
          <ul className="mt-3 divide-y divide-sky-900/10">
            {stations.map((s) => (
              <li key={s.name} className="flex items-center gap-3 py-2.5">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                  <p className="text-xs text-slate-600">{s.place}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/expeditions" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:text-sky-900">
            View station map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </aside>
      </div>
    </section>
  );
};
