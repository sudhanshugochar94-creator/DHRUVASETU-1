import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Menu, Search } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { GlobalSearchOverlay } from './GlobalSearchOverlay';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f9fc] text-slate-800 selection:bg-sky-600 selection:text-white">
      <ScrollToTop />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} onOpenSearch={() => { setMenuOpen(false); setSearchOpen(true); }} />

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white/90 backdrop-blur border-b border-sky-900/10">
        <button onClick={() => setMenuOpen(true)} className="p-2 -ml-2 rounded-lg text-slate-700 hover:bg-sky-50" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
          <Compass className="w-5 h-5 text-sky-700" /> DhruvaSetu
        </Link>
        <button onClick={() => setSearchOpen(true)} className="p-2 -mr-2 rounded-lg text-slate-700 hover:bg-sky-50" aria-label="Search">
          <Search className="w-5 h-5" />
        </button>
      </header>

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>

      <GlobalSearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
