import React, { useState, useEffect } from 'react';
import { Camera, Play, Search, MapPin } from 'lucide-react';
import { mediaService } from '../services/mediaService';
import type { MediaAsset, PolarRegion } from '@/shared/types/index';
import { Tabs } from '@/shared/ui/Tabs';
import type { TabItem } from '@/shared/ui/Tabs';
import { Badge } from '@/shared/ui/Badge';
import { MediaLightbox } from '../components/MediaLightbox';
import { VideoPlayerModal } from '../components/VideoPlayerModal';
import { EmptyState } from '@/shared/ui/EmptyState';

export const MediaGallery: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'video' | 'documentary'>('all');
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<PolarRegion | 'All'>('All');
  const [lightboxAsset, setLightboxAsset] = useState<MediaAsset | null>(null);
  const [videoModalAsset, setVideoModalAsset] = useState<MediaAsset | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      const data = await mediaService.getMedia({
        type: activeTab,
        region: selectedRegion,
        search
      });
      setMediaList(data);
    };
    fetchMedia();
  }, [activeTab, selectedRegion, search]);

  const tabs: TabItem[] = [
    { id: 'all', label: 'All Media Assets' },
    { id: 'photo', label: 'High-Res Photographs' },
    { id: 'video', label: 'Field Expedition Videos' },
    { id: 'documentary', label: 'Science Documentaries' }
  ];

  const regions: (PolarRegion | 'All')[] = ['All', 'Antarctica', 'Arctic', 'Southern Ocean', 'Himalaya'];

  const handleAssetClick = (asset: MediaAsset) => {
    if (asset.type === 'photo') {
      setLightboxAsset(asset);
    } else {
      setVideoModalAsset(asset);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-widest">
          <Camera className="w-4 h-4" />
          <span>Polar Multimedia Archive</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] tracking-tight">
          Visual Expedition Gallery
        </h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          High-definition photography, 4K field expedition footage, and full-length scientific documentaries capturing life, wildlife, and cutting-edge science at Bharati, Maitri, Himadri, and aboard research vessels.
        </p>
      </div>

      {/* Media Type Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as any)} />

      {/* Filter & Search Bar */}
      <div className="polar-glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-sky-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by tag, location, expedition, or photographer..."
            className="w-full bg-white border border-sky-900/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-sky-900/10'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Media Assets Grid */}
      <div className="space-y-6">
        <div className="text-xs text-slate-600">
          Showing <strong className="text-slate-900">{mediaList.length}</strong> media assets
        </div>

        {mediaList.length === 0 ? (
          <EmptyState
            title="No media assets found"
            description="Try changing your search keywords or switching media categories."
            actionLabel="Reset Search"
            onAction={() => {
              setSearch('');
              setSelectedRegion('All');
              setActiveTab('all');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mediaList.map((asset) => (
              <div
                key={asset.id}
                onClick={() => handleAssetClick(asset)}
                className="polar-glass-card rounded-2xl overflow-hidden group cursor-pointer hover:border-amber-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div className="relative h-56 overflow-hidden bg-black">
                  <img
                    src={asset.thumbnail}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#eaf4fa] via-[#eaf4fa]/20 to-transparent" />

                  {/* Type Badge & Duration */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge region={asset.region} size="sm" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/85 text-amber-700 border border-amber-500/30 font-mono">
                      {asset.type.toUpperCase()}
                    </span>
                  </div>

                  {asset.type !== 'photo' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-sky-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-800">
                    <span className="truncate max-w-[200px] flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-700 shrink-0" />
                      <span className="truncate">{asset.location}</span>
                    </span>
                    {asset.duration && (
                      <span className="font-mono px-1.5 py-0.5 rounded bg-black/60 font-semibold text-white">
                        {asset.duration}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                      {asset.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {asset.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-sky-900/10 flex items-center justify-between text-xs text-slate-600">
                    <span className="truncate max-w-[160px]">Photo: {asset.photographer}</span>
                    <span className="text-sky-700 font-semibold group-hover:underline">
                      {asset.type === 'photo' ? 'View Fullscreen' : 'Play Video'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox for Photos */}
      <MediaLightbox
        asset={lightboxAsset}
        isOpen={Boolean(lightboxAsset)}
        onClose={() => setLightboxAsset(null)}
      />

      {/* Video Modal for Videos & Documentaries */}
      <VideoPlayerModal
        asset={videoModalAsset}
        isOpen={Boolean(videoModalAsset)}
        onClose={() => setVideoModalAsset(null)}
      />
    </div>
  );
};
