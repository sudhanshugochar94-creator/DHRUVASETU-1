import React, { useState } from 'react';
import { ChevronRight, Award } from 'lucide-react';
import { mockTimelineEvents } from '../data/mockTimeline';
import type { TimelineEvent } from '@/shared/types/index';
import { Modal } from '@/shared/ui/Modal';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';

export const InteractiveTimeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  return (
    <section className="py-20 relative bg-[#eaf4fa] border-t border-sky-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-sky-700 tracking-widest uppercase block mb-1">
            Historical Milestones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            India’s Polar Research Journey
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Click any milestone along India's 40+ year odyssey from Operation Gangotri to modern cryogenic science observatories.
          </p>
        </div>

        {/* Timeline Horizontal / Stepper Display */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-cyan-400 to-blue-600/30 transform -translate-y-1/2 z-0" />

          {/* Stepper items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {mockTimelineEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="polar-glass-card rounded-2xl p-5 cursor-pointer group hover:border-cyan-400/50 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Year Pill & Region */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-lg font-extrabold text-sky-700 font-['Bricolage_Grotesque',sans-serif] px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    {evt.year}
                  </span>
                  <Badge region={evt.region} size="sm" />
                </div>

                {/* Event Image */}
                <div className="h-32 rounded-xl overflow-hidden mb-3 relative">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-50/90 to-transparent" />
                  {evt.station && (
                    <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-white/85 text-sky-700 border border-sky-900/15 backdrop-blur-sm">
                      {evt.station}
                    </span>
                  )}
                </div>

                {/* Title & Short Description */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {evt.subtitle}
                  </p>
                </div>

                {/* Action Link */}
                <div className="mt-4 pt-3 border-t border-sky-900/10 flex items-center justify-between text-xs text-sky-700 font-semibold">
                  <span>Explore Details</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Detail Modal */}
        {selectedEvent && (
          <Modal
            isOpen={Boolean(selectedEvent)}
            onClose={() => setSelectedEvent(null)}
            title={selectedEvent.title}
            subtitle={`${selectedEvent.year} • ${selectedEvent.region}`}
            maxWidth="2xl"
          >
            <div className="space-y-4">
              <div className="h-64 rounded-xl overflow-hidden relative">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f4f9fc] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="text-2xl font-black text-sky-700 font-['Bricolage_Grotesque',sans-serif]">
                    {selectedEvent.year}
                  </span>
                  <p className="text-sm font-medium text-slate-900">{selectedEvent.subtitle}</p>
                </div>
              </div>

              <div className="text-sm text-slate-800 leading-relaxed">
                {selectedEvent.description}
              </div>

              {/* Key Details List */}
              <div className="p-4 rounded-xl bg-white/80 border border-sky-900/15 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 block mb-2">
                  Historical Highlights & Operations
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {selectedEvent.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Significance Box */}
              <div className="p-3.5 rounded-xl bg-sky-50 border border-cyan-500/30 flex items-start gap-3">
                <Award className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div className="text-xs text-sky-800">
                  <strong className="block font-semibold text-slate-900 mb-0.5">National Significance:</strong>
                  {selectedEvent.significance}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" variant="outline" onClick={() => setSelectedEvent(null)}>
                  Close Milestone
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </section>
  );
};
