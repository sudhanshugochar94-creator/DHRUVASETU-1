import React from 'react';
import { Link } from 'react-router-dom';
import { Library, Map, Database, FileText, Image, GraduationCap, ArrowUpRight } from 'lucide-react';

const tiles: { to: string; title: string; text: string; icon: React.ElementType; span: string; image?: string }[] = [
  { to: '/repository', title: 'Knowledge repository', text: 'Reports, papers and field notes in one searchable place.', icon: Library, span: 'sm:col-span-2 sm:row-span-2', image: '/images/glacier-valley.jpg' },
  { to: '/expeditions', title: 'Expeditions', text: 'Missions and stations, mapped.', icon: Map, span: '' },
  { to: '/datasets', title: 'Datasets', text: 'Open scientific data with previews.', icon: Database, span: '' },
  { to: '/publications', title: 'Publications', text: 'Peer-reviewed work by Indian polar teams.', icon: FileText, span: '' },
  { to: '/media', title: 'Media gallery', text: 'Photos and video from the field.', icon: Image, span: '' },
  { to: '/learn', title: 'Learn polar science', text: 'Guided tracks for students and teachers.', icon: GraduationCap, span: 'sm:col-span-2' },
];

export const QuickAccess: React.FC = () => (
  <section className="relative z-20 -mt-44 sm:-mt-56 max-w-6xl mx-auto px-4 sm:px-8">
    <div className="grid grid-cols-1 sm:grid-cols-4 auto-rows-[9rem] gap-4">
      {tiles.map(({ to, title, text, icon: Icon, span, image }) => (
        <Link
          key={to}
          to={to}
          className={`polar-glass-card group rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden ${span}`}
        >
          {image && (
            <>
              <img
                src={image}
                alt="Glacier valley in the polar region"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-white/10" />
            </>
          )}
          <div className="relative flex items-start justify-between">
            <span className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </span>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-sky-700" />
          </div>
          <div className="relative">
            <h3 className="text-base font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">{title}</h3>
            <p className="mt-1 text-sm text-slate-600 leading-snug">{text}</p>
          </div>
        </Link>
      ))}
    </div>
  </section>
);
