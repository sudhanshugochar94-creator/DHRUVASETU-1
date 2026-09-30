import React from 'react';
import { Play, Download, Calendar, Compass, Film } from 'lucide-react';
import type { MediaAsset } from '@/shared/types/index';
import { Modal } from '@/shared/ui/Modal';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/context/ToastContext';

interface VideoPlayerModalProps {
  asset: MediaAsset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ asset, isOpen, onClose }) => {
  const { showToast } = useToast();

  if (!asset) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={asset.title}
      subtitle={`Duration: ${asset.duration || 'Feature'} • Resolution: ${asset.resolution || '4K UHD'}`}
      maxWidth="4xl"
    >
      <div className="space-y-5">
        {/* Simulated Video Player Screen */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/10 flex items-center justify-center group">
          <img
            src={asset.thumbnail}
            alt={asset.title}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Large Simulated Play Button */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-400/50 group-hover:scale-110 transition-transform cursor-pointer">
            <Play className="w-8 h-8 ml-1 fill-current" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white z-10 bg-black/60 px-4 py-2 rounded-xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              <span>NCPOR Documentary Archives</span>
            </div>
            <span className="font-mono">{asset.duration} &bull; 4K Ultra HD</span>
          </div>
        </div>

        {/* Video Info Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge region={asset.region} size="sm" />
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              {asset.expedition}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {asset.date}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {asset.description}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
          <span className="text-xs text-slate-400">Produced by NCPOR Outreach Division</span>
          <Button
            size="sm"
            variant="outline"
            icon={<Download className="w-4 h-4" />}
            onClick={() => showToast(`Initiating stream download for "${asset.title}"`, 'info')}
          >
            Download Video
          </Button>
        </div>
      </div>
    </Modal>
  );
};
