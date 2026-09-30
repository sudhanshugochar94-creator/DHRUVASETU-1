import React, { useState } from 'react';
import { Table, Download, Calendar } from 'lucide-react';
import type { Dataset } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { DataPreviewModal } from './DataPreviewModal';
import { useToast } from '@/shared/context/ToastContext';

interface DatasetCardProps {
  dataset: Dataset;
}

export const DatasetCard: React.FC<DatasetCardProps> = ({ dataset }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { showToast } = useToast();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`Downloading dataset package: ${dataset.name.slice(0, 30)}... (${dataset.size})`, 'success');
  };

  return (
    <>
      <div className="polar-glass-card rounded-2xl p-6 flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300">
        <div>
          {/* Header Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Badge region={dataset.region} size="sm" />
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-sky-50/70 text-slate-700 border border-sky-900/10 font-mono">
                {dataset.domain}
              </span>
            </div>
            <span className="text-xs text-slate-600 font-mono">
              {dataset.format} &bull; {dataset.size}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
            {dataset.name}
          </h3>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
            {dataset.description}
          </p>

          {/* Measured Variables Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {dataset.variables.slice(0, 4).map((v) => (
              <span
                key={v}
                className="text-[10px] px-2 py-0.5 rounded bg-white text-sky-700 border border-sky-900/10 font-mono"
              >
                {v}
              </span>
            ))}
            {dataset.variables.length > 4 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600">
                +{dataset.variables.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer info & action buttons */}
        <div className="mt-6 pt-4 border-t border-sky-900/10 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[11px] text-slate-600 flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5 text-sky-700" />
            <span>{dataset.timeRange}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              icon={<Table className="w-3.5 h-3.5" />}
              onClick={() => setIsPreviewOpen(true)}
            >
              Preview Data
            </Button>

            <Button
              size="sm"
              variant="secondary"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={handleDownload}
            >
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* Embedded Data Preview Modal */}
      <DataPreviewModal
        dataset={dataset}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
};
