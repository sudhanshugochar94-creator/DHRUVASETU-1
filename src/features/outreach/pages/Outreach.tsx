import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  School, 
  ArrowRight, 
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { mockStories } from '../data/mockStories';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

export const Outreach: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'School' | 'College' | 'General Public'>('All');

  const filteredStories = selectedLevel === 'All'
    ? mockStories
    : mockStories.filter((s) => s.readingLevel === selectedLevel);

  const levels: ('All' | 'School' | 'College' | 'General Public')[] = [
    'All',
    'School',
    'College',
    'General Public'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-widest">
          <BookOpen className="w-4 h-4" />
          <span>Public Outreach & Citizen Science</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          Polar Science for Everyone
        </h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          Demystifying extreme cryospheric environments. Discover editorial stories, classroom toolkits, and interactive explanations grounded directly in verified research from the National Centre for Polar and Ocean Research.
        </p>
      </div>

      {/* Reading Level Selector Pills */}
      <div className="polar-glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-sky-700" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Select Audience Reading Level:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-sky-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-sky-900/10'
              }`}
            >
              {lvl === 'School' && '🎒 '}
              {lvl === 'College' && '🎓 '}
              {lvl === 'General Public' && '🌍 '}
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Science Stories Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            Verified Science Stories
          </h2>
          <span className="text-xs text-slate-600">
            {filteredStories.length} stories available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="polar-glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-cyan-400/50 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={story.heroImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#eaf4fa] via-[#eaf4fa]/30 to-transparent" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Badge region={story.region} size="sm" />
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-cyan-500/30 backdrop-blur-md">
                    {story.readingLevel}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-800">
                  <span className="font-semibold text-sky-700">{story.category}</span>
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-sky-700" />
                    {story.readingTime}
                  </span>
                </div>
              </div>

              {/* Story Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                    {story.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {story.subtitle}
                  </p>

                  <p className="text-xs text-slate-700 mt-3 line-clamp-3 leading-relaxed">
                    {story.simpleExplanation}
                  </p>
                </div>

                {/* Grounded Sources Tag */}
                <div className="pt-4 border-t border-sky-900/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Grounded in {story.groundedSources.length} repository resources</span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-slate-500 font-mono">By {story.author}</span>
                    <Link
                      to={`/stories/${story.id}`}
                      className="text-xs font-bold text-sky-700 hover:text-sky-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For Educators & Students Resource Boxes */}
      <section className="pt-8 border-t border-sky-900/10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="polar-glass-card rounded-2xl p-8 space-y-4 border border-blue-500/20">
          <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
            <School className="w-5 h-5" />
            <span>FOR SCHOOLS & TEACHERS</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            Classroom Polar Explorer Kit
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Download modular 12-week lesson plans, hands-on experiments on albedo and sea ice dynamics, printable classroom posters, and video guides tailored for CBSE and ICSE curricula.
          </p>
          <Link to="/repository?type=Educational+Resources">
            <Button size="sm" variant="outline">
              Explore Educational Toolkits
            </Button>
          </Link>
        </div>

        <div className="polar-glass-card rounded-2xl p-8 space-y-4 border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
            <GraduationCap className="w-5 h-5" />
            <span>FOR COLLEGE STUDENTS & RESEARCHERS</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            Polar Learning Tracks & Quizzes
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Take structured learning modules covering Antarctic ice dynamics, Arctic teleconnections with the Indian Monsoon, and glacier mass balance with interactive quizzes.
          </p>
          <Link to="/learn">
            <Button size="sm" variant="primary">
              Launch Learning Hub
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
