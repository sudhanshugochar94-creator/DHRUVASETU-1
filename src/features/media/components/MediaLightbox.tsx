import React, { useEffect } from 'react';
import { X, Download, MapPin, Calendar, Camera, Compass } from 'lucide-react';
import type { MediaAsset } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/context/ToastContext';

interface MediaLightboxProps {
  asset: MediaAsset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({ asset, isOpen, onClose }) => {
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !asset) return null;

  const handleDownload = () => {
    showToast(`Downloading high-resolution photo: ${asset.title} (${asset.resolution || 'High Res'})`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-[#091222] border border-white/15 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button Top-Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/60 text-white hover:bg-black/90 transition-colors"
          aria-label="Close image modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* High Res Image Section */}
        <div className="md:w-3/5 bg-black flex items-center justify-center relative overflow-hidden min-h-[300px]">
          <img
            src={asset.highResUrl}
            alt={asset.title}
            className="w-full h-full object-contain max-h-[75vh]"
          />
        </div>

        {/* Metadata & Attribution Panel */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto border-t md:border-t-0 md:border-l border-white/10 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge region={asset.region} size="sm" />
              <span className="text-xs text-slate-400 font-mono">
                {asset.resolution || 'RAW High-Res'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-['Outfit',sans-serif] leading-tight">
              {asset.title}
            </h3>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {asset.description}
            </p>

            {/* Photo Metadata Details */}
            <div className="mt-5 space-y-2.5 text-xs text-slate-300 border-t border-white/5 pt-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{asset.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{asset.expedition}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Captured on {asset.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Photographer: {asset.photographer}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {asset.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">CC-BY 4.0 NCPOR</span>
            <Button
              size="sm"
              variant="primary"
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownload}
            >
              Download Full Res
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
