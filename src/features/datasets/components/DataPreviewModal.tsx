import React from 'react';
import { Download, Table, HardDrive, Calendar } from 'lucide-react';
import type { Dataset } from '@/shared/types/index';
import { Modal } from '@/shared/ui/Modal';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/context/ToastContext';

interface DataPreviewModalProps {
  dataset: Dataset | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DataPreviewModal: React.FC<DataPreviewModalProps> = ({ dataset, isOpen, onClose }) => {
  const { showToast } = useToast();

  if (!dataset) return null;

  const handleDownloadCsv = () => {
    // Generate CSV string from sampleData
    const headers = Object.keys(dataset.sampleData[0] || {}).join(',');
    const rows = dataset.sampleData.map((row) => Object.values(row).join(',')).join('\n');
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${dataset.id}_sample_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported sample dataset: ${dataset.name.slice(0, 30)}... (.CSV)`, 'success');
  };

  const columns = dataset.sampleData.length > 0 ? Object.keys(dataset.sampleData[0]) : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dataset.name}
      subtitle={`Domain: ${dataset.domain} • Spatial: ${dataset.spatialCoverage}`}
      maxWidth="4xl"
    >
      <div className="space-y-6">
        {/* Metadata summary chips */}
        <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl bg-white/90 border border-sky-900/15 text-xs">
          <Badge region={dataset.region} size="sm" />
          <span className="text-slate-600 flex items-center gap-1 font-mono">
            <Calendar className="w-3.5 h-3.5 text-sky-700" />
            {dataset.timeRange}
          </span>
          <span className="text-slate-600 flex items-center gap-1 font-mono">
            <HardDrive className="w-3.5 h-3.5 text-emerald-700" />
            {dataset.format} ({dataset.size})
          </span>
          <span className="text-slate-600 font-mono">
            Sampling: {dataset.samplingFrequency}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-700 leading-relaxed">
          {dataset.description}
        </p>

        {/* Variables Tags */}
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-2">
            Measured Variables:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {dataset.variables.map((v) => (
              <span
                key={v}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/10 text-sky-800 border border-cyan-500/20"
              >
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Data Table Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Table className="w-4 h-4 text-sky-700" />
              <span>In-Situ Scientific Records Preview</span>
            </div>
            <span className="text-[11px] text-slate-600 font-mono">
              Showing first {dataset.sampleData.length} calibrated records
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-sky-900/15 bg-sky-50/80 max-h-64 overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/90 sticky top-0 text-sky-700 border-b border-sky-900/15">
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                      {col.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-900/10">
                {dataset.sampleData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-cyan-500/5 transition-colors">
                    {columns.map((col) => (
                      <td key={col} className="px-3 py-2 text-slate-700 whitespace-nowrap">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-sky-900/15 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-600">
            <span>DOI: </span>
            <span className="text-sky-700 font-mono">{dataset.doi}</span>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon={<Download className="w-4 h-4" />}
              onClick={handleDownloadCsv}
            >
              Download Sample CSV
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
