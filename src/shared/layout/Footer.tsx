import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck } from 'lucide-react';
import { MountainRange } from '@/shared/art/MountainRange';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#dcebf6] text-slate-700 text-sm mt-20 relative">
      <div className="absolute inset-x-0 -top-px -translate-y-full pointer-events-none">
        <MountainRange variant="divider" base="#dcebf6" />
      </div>
      {/* Top Banner with Ministry & Govt Recognition */}
      <div className="border-b border-sky-900/10 bg-white/50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-700 font-medium">DhruvaSetu, official polar science gateway</span>
            <span>&bull;</span>
            <span>National Centre for Polar and Ocean Research</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">Ministry of Earth Sciences, Govt. of India</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="hidden sm:inline">Smart India Hackathon 2026 (SIH26063)</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-800 p-[1.5px] shadow-md shadow-sky-600/20">
                <div className="w-full h-full bg-[#f4f9fc] rounded-[10px] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-sky-700" />
                </div>
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-sky-700 block">
                  NCPOR &bull; MoES
                </span>
                <span className="text-lg font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
                  DhruvaSetu
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-600 max-w-sm">
              Archiving over 40 years of Indian polar exploration across Antarctica, the Arctic, the Southern Ocean, and the Himalayan Third Pole, and disseminating verified scientific knowledge to researchers, students, and citizens.
            </p>

            <div className="pt-2 text-xs flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>FAIR Scientific Data Principles &bull; Open Access Repository</span>
            </div>
          </div>

          {/* Col 1: Knowledge Repository */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-800 mb-4 font-['Bricolage_Grotesque',sans-serif]">
              Knowledge Repository
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/repository?type=Expedition+Reports" className="hover:text-sky-700 transition-colors">
                  Expedition Reports
                </Link>
              </li>
              <li>
                <Link to="/datasets" className="hover:text-sky-700 transition-colors">
                  Scientific Datasets
                </Link>
              </li>
              <li>
                <Link to="/publications" className="hover:text-sky-700 transition-colors">
                  Peer-Reviewed Publications
                </Link>
              </li>
              <li>
                <Link to="/media" className="hover:text-sky-700 transition-colors">
                  Polar Photo & Video Archive
                </Link>
              </li>
              <li>
                <Link to="/repository" className="hover:text-sky-700 transition-colors">
                  Advanced Multi-facet Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Expeditions & Stations */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-800 mb-4 font-['Bricolage_Grotesque',sans-serif]">
              Expeditions & Stations
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/expeditions" className="hover:text-sky-700 transition-colors">
                  Interactive Polar Map
                </Link>
              </li>
              <li>
                <Link to="/expeditions/exp-isea-43" className="hover:text-sky-700 transition-colors">
                  43rd Antarctic Expedition
                </Link>
              </li>
              <li>
                <Link to="/expeditions/exp-arc-16" className="hover:text-sky-700 transition-colors">
                  16th Arctic Mission (Himadri)
                </Link>
              </li>
              <li>
                <Link to="/expeditions/exp-so-12" className="hover:text-sky-700 transition-colors">
                  Southern Ocean Voyages
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-sky-700 transition-colors">
                  Research Stations Overview
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Outreach & Tools */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-800 mb-4 font-['Bricolage_Grotesque',sans-serif]">
              Outreach & Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/outreach" className="hover:text-sky-700 transition-colors">
                  Science Stories & Explanations
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-sky-700 transition-colors">
                  Learn Polar Science (Tracks)
                </Link>
              </li>
              <li>
                <Link to="/content-studio" className="hover:text-sky-700 transition-colors flex items-center gap-1 text-indigo-700">
                  <span>Media Content Studio</span>
                  <span className="text-[10px] px-1 py-0.2 bg-indigo-500/20 rounded font-semibold">AI</span>
                </Link>
              </li>
              <li>
                <Link to="/review" className="hover:text-sky-700 transition-colors">
                  Editorial Review Queue
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-sky-700 transition-colors">
                  Institutional Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="mt-12 pt-8 border-t border-sky-900/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} NCPOR, Ministry of Earth Sciences, Govt. of India.</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-slate-700 cursor-pointer">Terms of Access</span>
            <span className="hover:text-slate-700 cursor-pointer">Data Privacy Policy</span>
            <span className="hover:text-slate-700 cursor-pointer">Web Accessibility</span>
            <span className="hover:text-slate-700 cursor-pointer">Hyperlinking Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
