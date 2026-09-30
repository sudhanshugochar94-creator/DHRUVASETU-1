import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Table, 
  Sparkles
} from 'lucide-react';
import { datasetService } from '../services/datasetService';
import type { Dataset } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Breadcrumb } from '@/shared/ui/Breadcrumb';
import { DataPreviewModal } from '../components/DataPreviewModal';
import { useToast } from '@/shared/context/ToastContext';

export const DatasetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataset = async () => {
      if (!id) return;
      const data = await datasetService.getDatasetById(id);
      setDataset(data);
    };
    fetchDataset();
    window.scrollTo(0, 0);
  }, [id]);

  if (!dataset) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-slate-600">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Dataset Not Found</h2>
        <Link to="/datasets">
          <Button variant="primary">Return to Scientific Datasets</Button>
        </Link>
      </div>
    );
  }

  const columns = dataset.sampleData.length > 0 ? Object.keys(dataset.sampleData[0]) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Breadcrumb
        items={[
          { label: 'Datasets', path: '/datasets' },
          { label: dataset.name }
        ]}
      />

      {/* Hero Header */}
      <div className="polar-glass-card rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge region={dataset.region} />
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-500/30 font-semibold font-mono">
              {dataset.domain}
            </span>
          </div>

          <span className="text-xs text-slate-600 font-mono">
            Updated: {dataset.lastUpdated} &bull; {dataset.downloadCount} Downloads
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-['Bricolage_Grotesque',sans-serif] leading-tight">
          {dataset.name}
        </h1>

        <p className="text-sm text-slate-700 leading-relaxed max-w-4xl">
          {dataset.description}
        </p>

        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-sky-900/15">
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              icon={<Table className="w-4 h-4" />}
              onClick={() => setIsPreviewOpen(true)}
            >
              Open Tabular Preview
            </Button>

            <Button
              variant="outline"
              icon={<Download className="w-4 h-4" />}
              onClick={() => showToast(`Exporting full dataset bundle (${dataset.size})`, 'success')}
            >
              Download Complete Archive ({dataset.size})
            </Button>
          </div>

          <button
            onClick={() => navigate(`/content-studio?sourceId=${dataset.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-500/40 text-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Transform in Content Studio</span>
          </button>
        </div>
      </div>

      {/* Dataset Details & Sample Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Measured Variables */}
          <div className="polar-glass-card rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-sky-700 uppercase tracking-wider">
              Measured Parameters & Environmental Variables
            </h3>
            <div className="flex flex-wrap gap-2">
              {dataset.variables.map((v) => (
                <span
                  key={v}
                  className="text-xs px-3 py-1.5 rounded-xl bg-white text-sky-800 border border-sky-900/15 font-mono"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* In-Situ Table Preview */}
          <div className="polar-glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
                In-Situ Calibrated Records
              </h3>
              <span className="text-xs text-slate-600 font-mono">
                Sampling Rate: {dataset.samplingFrequency}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-sky-900/15 bg-sky-50/80">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white text-sky-700 border-b border-sky-900/15">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="px-3 py-2 font-semibold whitespace-nowrap">
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
        </div>

        {/* Spatial-Temporal Bounds Panel */}
        <div className="space-y-6">
          <div className="polar-glass-card rounded-2xl p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-['Bricolage_Grotesque',sans-serif] border-b border-sky-900/15 pb-3">
              Spatial & Temporal Bounds
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-1 border-b border-sky-900/10">
                <span className="text-slate-600">Time Range:</span>
                <span className="text-slate-900 font-mono">{dataset.timeRange}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-900/10">
                <span className="text-slate-600">Coverage:</span>
                <span className="text-sky-700 font-mono">{dataset.spatialCoverage}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-900/10">
                <span className="text-slate-600">Format:</span>
                <span className="text-slate-900 font-mono">{dataset.format}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sky-900/10">
                <span className="text-slate-600">License:</span>
                <span className="text-emerald-700 font-medium">{dataset.license}</span>
              </div>
              <div className="flex flex-col py-1 gap-0.5">
                <span className="text-slate-600">Digital Object Identifier:</span>
                <span className="text-sky-700 font-mono text-[11px] break-all">{dataset.doi}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DataPreviewModal
        dataset={dataset}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};
