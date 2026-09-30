import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Compass, Search, Globe, Home, Library, Map, Database, FileText, Image,
  Megaphone, GraduationCap, Sparkles, ClipboardCheck, LayoutDashboard, Info, User, X, Bot,
} from 'lucide-react';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { useRole } from '@/features/auth/RoleContext';
import type { UserRole } from '@/shared/types/index';
import { MountainRange } from '@/shared/art/MountainRange';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
}

const groups = [
  {
    title: 'Discover',
    links: [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Repository', path: '/repository', icon: Library },
      { name: 'Expeditions', path: '/expeditions', icon: Map },
      { name: 'Datasets', path: '/datasets', icon: Database },
      { name: 'Publications', path: '/publications', icon: FileText },
    ],
  },
  {
    title: 'Engage',
    links: [
      { name: 'Media', path: '/media', icon: Image },
      { name: 'Outreach', path: '/outreach', icon: Megaphone },
      { name: 'Learn', path: '/learn', icon: GraduationCap },
    ],
  },
  {
    title: 'Manage',
    links: [
      { name: 'Content Studio', path: '/content-studio', icon: Sparkles },
      { name: 'Review queue', path: '/review', icon: ClipboardCheck },
      { name: 'AI Agents', path: '/agents', icon: Bot },
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'About NCPOR', path: '/about', icon: Info },
    ],
  },
];

const roles: UserRole[] = ['Public Visitor', 'Researcher', 'Content Manager', 'Administrator'];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose, onOpenSearch }) => {
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { currentRole, setRole } = useRole();
  const location = useLocation();

  useEffect(() => { onClose(); }, [location.pathname]); // close drawer on navigation

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:w-64 flex flex-col bg-white border-r border-sky-900/10 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-800 p-[1.5px]">
              <span className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                <Compass className="w-5 h-5 text-sky-700" />
              </span>
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">DhruvaSetu</span>
              <span className="block text-[11px] text-slate-600">NCPOR &bull; MoES</span>
            </span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-sky-50" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-900/10 text-sm text-slate-600 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 text-sky-700" />
            <span className="flex-1 text-left">Search archive</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-sky-900/10 font-mono">Ctrl K</kbd>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {groups.map((g) => (
            <div key={g.title}>
              <p className="px-3 pb-1.5 text-xs font-semibold text-slate-500">{g.title}</p>
              <ul className="space-y-0.5">
                {g.links.map(({ name, path, icon: Icon }) => (
                  <li key={path}>
                    <NavLink
                      to={path}
                      end={path === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive
                            ? 'bg-sky-100 text-sky-900 font-semibold'
                            : 'text-slate-700 hover:bg-sky-50 hover:text-slate-900'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-20 opacity-60 pointer-events-none overflow-hidden">
            <MountainRange variant="hero" base="#ffffff" />
          </div>
          <div className="relative px-4 pt-3 pb-4 space-y-2 bg-gradient-to-t from-transparent to-white">
            <label className="block text-xs text-slate-600">
              <span className="sr-only">Viewing as</span>
              <select
                value={currentRole}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-lg bg-white/90 border border-sky-900/15 text-sm text-slate-800 cursor-pointer"
              >
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold cursor-pointer"
              >
                <User className="w-4 h-4" /> Sign in
              </button>
              <button
                onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
                className="px-3 py-2 rounded-lg bg-white/90 border border-sky-900/15 text-sm font-semibold text-slate-800 flex items-center gap-1.5 cursor-pointer"
                title="Toggle language"
              >
                <Globe className="w-4 h-4 text-sky-700" /> {language}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};
