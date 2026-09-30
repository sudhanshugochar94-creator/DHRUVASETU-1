import React, { useState } from 'react';
import { MapPin, Radio } from 'lucide-react';
import { polarStations } from '../services/expeditionService';
import type { PolarStation } from '../services/expeditionService';
import { Badge } from '@/shared/ui/Badge';

interface PolarMapSvgProps {
  onSelectStation?: (station: PolarStation) => void;
}

export const PolarMapSvg: React.FC<PolarMapSvgProps> = ({ onSelectStation }) => {
  const [activeTab, setActiveTab] = useState<'Antarctica' | 'Arctic' | 'Himalaya'>('Antarctica');
  const [selectedStation, setSelectedStation] = useState<PolarStation>(polarStations[0]);

  const handleStationClick = (st: PolarStation) => {
    setSelectedStation(st);
    if (onSelectStation) onSelectStation(st);
  };

  return (
    <div className="polar-glass-card rounded-3xl p-6 relative overflow-hidden border border-cyan-500/30">
      {/* Map Header with Region Projection Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-900/15">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-widest mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse text-sky-700" />
            <span>Interactive Polar Stations & Observatories</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
            India’s Polar Telemetry & Station Network
          </h3>
        </div>

        {/* Projection Switcher Tabs */}
        <div className="flex items-center bg-white/90 rounded-xl p-1 border border-sky-900/15 shrink-0">
          {(['Antarctica', 'Arctic', 'Himalaya'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                const matching = polarStations.find((s) => s.region === tab);
                if (matching) setSelectedStation(matching);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-sky-600 text-white font-bold shadow-md shadow-cyan-500/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        {/* SVG Stylized Projection (2 cols) */}
        <div className="lg:col-span-2 relative min-h-[360px] bg-[#e4f1f9] rounded-2xl border border-sky-900/10 flex items-center justify-center p-4 overflow-hidden group">
          {/* Radial Grid Coordinate Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            <div className="w-96 h-96 rounded-full border border-cyan-400/30" />
            <div className="absolute w-72 h-72 rounded-full border border-dashed border-cyan-400/40" />
            <div className="absolute w-48 h-48 rounded-full border border-cyan-400/50" />
            <div className="absolute w-24 h-24 rounded-full border border-cyan-400/60" />
            <div className="absolute h-full w-[1px] bg-cyan-400/20" />
            <div className="absolute w-full h-[1px] bg-cyan-400/20" />
          </div>

          {/* SVG Map Projection Based on Region */}
          <svg className="w-full h-80 max-w-lg transition-transform duration-700" viewBox="0 0 500 350" fill="none">
            {activeTab === 'Antarctica' && (
              <g>
                {/* Stylized Antarctic Continent Contour */}
                <path
                  d="M240,60 C320,50 410,100 420,170 C430,240 370,290 280,310 C210,325 120,290 85,220 C60,170 90,110 150,80 C180,65 210,65 240,60 Z"
                  fill="#e6f3fb"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  className="opacity-90"
                />
                <path
                  d="M230,85 C290,75 365,115 375,175 C385,230 330,265 260,280 C200,290 130,260 110,205 C95,165 120,120 170,100 Z"
                  fill="#cfe6f5"
                  stroke="#00d2ff"
                  strokeWidth="1.5"
                />

                {/* Ice Shelf Outlines (Ross & Ronne) */}
                <path d="M120,180 Q100,210 140,240" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                <path d="M330,190 Q380,220 350,260" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />

                {/* Station Pins: Maitri (Queen Maud Land) */}
                <g
                  onClick={() => handleStationClick(polarStations.find((s) => s.id === 'st-maitri')!)}
                  className="cursor-pointer group/pin"
                >
                  <circle cx="210" cy="95" r="8" fill="#00d2ff" className="animate-ping opacity-60" />
                  <circle cx="210" cy="95" r="5" fill="#00d2ff" stroke="#ffffff" strokeWidth="2" />
                  <text x="222" y="99" fill="#0c4a6e" fontSize="12" fontWeight="bold" fontFamily="system-ui">
                    Maitri (1988)
                  </text>
                </g>

                {/* Station Pin: Bharati (Larsemann Hills / Amery Ice Shelf) */}
                <g
                  onClick={() => handleStationClick(polarStations.find((s) => s.id === 'st-bharati')!)}
                  className="cursor-pointer group/pin"
                >
                  <circle cx="340" cy="150" r="8" fill="#38bdf8" className="animate-ping opacity-60" />
                  <circle cx="340" cy="150" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                  <text x="352" y="154" fill="#075985" fontSize="12" fontWeight="bold" fontFamily="system-ui">
                    Bharati (2012)
                  </text>
                </g>

                {/* Station Pin: Dakshin Gangotri (Historical) */}
                <g
                  onClick={() => handleStationClick(polarStations.find((s) => s.id === 'st-dakshin-gangotri')!)}
                  className="cursor-pointer group/pin opacity-70"
                >
                  <circle cx="190" cy="80" r="4" fill="#a855f7" stroke="#ffffff" strokeWidth="1" />
                  <text x="110" y="75" fill="#7e22ce" fontSize="10" fontStyle="italic" fontFamily="system-ui">
                    Dakshin Gangotri (1983)
                  </text>
                </g>
              </g>
            )}

            {activeTab === 'Arctic' && (
              <g>
                {/* Stylized Arctic Ocean Polar Basin & Svalbard Archipelago */}
                <circle cx="250" cy="175" r="140" fill="#e6f3fb" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 3" />
                {/* Greenland outline silhouette */}
                <path d="M120,120 C140,80 180,90 190,140 C195,180 160,240 130,220 C110,200 105,150 120,120 Z" fill="#cfe6f5" stroke="#60a5fa" />
                {/* Svalbard archipelago */}
                <path d="M290,130 Q305,120 315,135 Q325,150 310,165 Q295,155 290,130 Z" fill="#8fbbe0" stroke="#00d2ff" strokeWidth="2" />

                {/* Himadri Station Pin in Ny-Alesund */}
                <g
                  onClick={() => handleStationClick(polarStations.find((s) => s.id === 'st-himadri')!)}
                  className="cursor-pointer"
                >
                  <circle cx="305" cy="140" r="8" fill="#38bdf8" className="animate-ping opacity-60" />
                  <circle cx="305" cy="140" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                  <text x="320" y="145" fill="#0c4a6e" fontSize="12" fontWeight="bold">
                    Himadri Base (78°55'N)
                  </text>
                </g>

                {/* IndARC Moored Fjord Observatory */}
                <g
                  onClick={() => handleStationClick(polarStations.find((s) => s.id === 'st-indarc')!)}
                  className="cursor-pointer"
                >
                  <circle cx="285" cy="165" r="8" fill="#00f2a9" className="animate-ping opacity-60" />
                  <circle cx="285" cy="165" r="5" fill="#00f2a9" stroke="#ffffff" strokeWidth="2" />
                  <text x="160" y="170" fill="#047857" fontSize="11" fontWeight="bold">
                    IndARC Mooring (192m)
                  </text>
                </g>
              </g>
            )}

            {activeTab === 'Himalaya' && (
              <g>
                {/* Stylized Himalayan Mountain Arc */}
                <path
                  d="M80,240 Q250,140 420,180"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  className="opacity-40"
                />
                <path
                  d="M100,230 Q250,150 400,190"
                  stroke="#34d399"
                  strokeWidth="2"
                  fill="none"
                />
                {/* Peaks */}
                <polygon points="180,180 200,140 220,180" fill="#a7f3d0" stroke="#059669" />
                <polygon points="230,170 255,120 280,170" fill="#a7f3d0" stroke="#059669" />
                <polygon points="290,185 315,135 340,185" fill="#a7f3d0" stroke="#059669" />

                {/* Himansh Station Pin */}
                <g
                  onClick={() => handleStationClick(polarStations.find((s) => s.id === 'st-himansh')!)}
                  className="cursor-pointer"
                >
                  <circle cx="255" cy="120" r="8" fill="#10b981" className="animate-ping opacity-60" />
                  <circle cx="255" cy="120" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <text x="270" y="115" fill="#065f46" fontSize="12" fontWeight="bold">
                    Himansh Base (4,080m)
                  </text>
                </g>
              </g>
            )}
          </svg>

          {/* Coordinate indicator in corner */}
          <div className="absolute bottom-3 left-3 bg-white/85 px-3 py-1.5 rounded-lg border border-sky-900/15 text-[11px] font-mono text-sky-700 backdrop-blur-md">
            <span>Projection: </span>
            <span className="text-slate-900 font-bold">{activeTab} High-Latitude Grid</span>
          </div>
        </div>

        {/* Selected Station Inspector Panel (1 col) */}
        <div className="polar-glass p-5 rounded-2xl flex flex-col justify-between border border-sky-900/15">
          <div>
            <div className="flex items-center justify-between mb-3">
              <Badge region={selectedStation.region} size="sm" />
              <Badge status={selectedStation.status} size="sm" />
            </div>

            <h4 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
              {selectedStation.name}
            </h4>

            <p className="text-xs text-sky-700 mt-1 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {selectedStation.location}
            </p>

            <div className="my-4 p-3 rounded-xl bg-white/90 border border-sky-900/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Established:</span>
                <span className="text-slate-900 font-mono font-semibold">{selectedStation.established}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Altitude / Depth:</span>
                <span className="text-slate-900 font-mono">{selectedStation.elevation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Coordinates:</span>
                <span className="text-sky-700 font-mono">
                  {selectedStation.coordinates.lat.toFixed(2)}°, {selectedStation.coordinates.lng.toFixed(2)}°
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedStation.description}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-sky-900/10">
            <span className="text-[11px] font-semibold text-slate-600 block mb-2">
              Affiliated Missions:
            </span>
            <div className="space-y-1">
              {selectedStation.activeExpeditions.map((m) => (
                <div key={m} className="text-xs text-slate-700 flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                  <span className="truncate">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
