import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Target, 
  Award, 
  Ship
} from 'lucide-react';
import { expeditionService } from '../services/expeditionService';
import { repositoryService } from '@/features/repository/services/repositoryService';
import { datasetService } from '@/features/datasets/services/datasetService';
import { publicationService } from '@/features/publications/services/publicationService';
import { mediaService } from '@/features/media/services/mediaService';
import type { Expedition, Resource, Dataset, Publication, MediaAsset } from '@/shared/types/index';
import { Badge } from '@/shared/ui/Badge';
import { Tabs } from '@/shared/ui/Tabs';
import type { TabItem } from '@/shared/ui/Tabs';
import { Button } from '@/shared/ui/Button';
import { Breadcrumb } from '@/shared/ui/Breadcrumb';
import { ResourceCard } from '@/features/repository/components/ResourceCard';
import { DatasetCard } from '@/features/datasets/components/DatasetCard';
import { PublicationCard } from '@/features/publications/components/PublicationCard';
import { MediaLightbox } from '@/features/media/components/MediaLightbox';

export const ExpeditionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [expedition, setExpedition] = useState<Expedition | null>(null);
  const [reports, setReports] = useState<Resource[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [lightboxAsset, setLightboxAsset] = useState<MediaAsset | null>(null);

  useEffect(() => {
    const loadExpedition = async () => {
      if (!id) return;
      const data = await expeditionService.getExpeditionById(id);
      setExpedition(data);

      if (data) {
        // Load associated resources, datasets, publications & media
        const [repData, datData, pubData, medData] = await Promise.all([
          repositoryService.getResources({ region: data.region, type: 'Expedition Reports' }),
          datasetService.getDatasets({ region: data.region }),
          publicationService.getPublications({ region: data.region }),
          mediaService.getMedia({ region: data.region })
        ]);
        setReports(repData);
        setDatasets(datData);
        setPublications(pubData);
        setMediaList(medData);
      }
    };
    loadExpedition();
    window.scrollTo(0, 0);
  }, [id]);

  if (!expedition) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-slate-600">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Expedition Record Not Found</h2>
        <Link to="/expeditions">
          <Button variant="primary">Return to Expedition Explorer</Button>
        </Link>
      </div>
    );
  }

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview & Objectives' },
    { id: 'teams', label: 'Scientific Teams & Stations' },
    { id: 'reports', label: 'Expedition Reports', badgeCount: reports.length },
    { id: 'datasets', label: 'Datasets', badgeCount: datasets.length },
    { id: 'publications', label: 'Publications', badgeCount: publications.length },
    { id: 'media', label: 'Multimedia', badgeCount: mediaList.length }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Expeditions', path: '/expeditions' },
          { label: expedition.name }
        ]}
      />

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[340px] flex items-end p-6 sm:p-10 border border-sky-900/15 shadow-2xl">
        <img
          src={expedition.heroImage}
          alt={expedition.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#eaf4fa] via-[#eaf4fa]/80 to-transparent" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge region={expedition.region} />
            <Badge status={expedition.status} />
            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white/85 text-sky-700 border border-sky-900/15 font-bold backdrop-blur-md">
              {expedition.code}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-['Bricolage_Grotesque',sans-serif] leading-tight">
            {expedition.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-700">
            <span className="flex items-center gap-1.5 font-semibold">
              <Calendar className="w-4 h-4 text-sky-700" />
              {expedition.dates}
            </span>
            <span>&bull;</span>
            <span>Mission Leader: <strong className="text-slate-900">{expedition.leader}</strong></span>
            {expedition.vessel && (
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Ship className="w-4 h-4 text-blue-700" />
                  {expedition.vessel}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview & Objectives */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Mission Summary */}
              <div className="polar-glass-card rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
                  Mission Overview
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {expedition.shortDescription}
                </p>
              </div>

              {/* Research Objectives */}
              <div className="polar-glass-card rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif] flex items-center gap-2">
                  <Target className="w-5 h-5 text-sky-700" />
                  <span>Strategic Scientific Objectives</span>
                </h3>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  {expedition.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/60 border border-sky-900/10">
                      <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Findings */}
              <div className="polar-glass-card rounded-2xl p-6 sm:p-8 space-y-4">
                <h3 className="text-xl font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif] flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700" />
                  <span>Key Findings & Milestones</span>
                </h3>
                <div className="space-y-2">
                  {expedition.keyFindings.map((finding, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-emerald-50 border border-emerald-500/20 text-xs sm:text-sm text-emerald-800">
                      &bull; {finding}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Panel */}
            <div className="space-y-6">
              <div className="polar-glass-card rounded-2xl p-6 space-y-4">
                <h4 className="text-xs uppercase font-bold text-slate-600 tracking-wider">
                  Expedition Yield
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-sky-900/10">
                    <span className="text-slate-600">Reports Ingested:</span>
                    <span className="text-slate-900 font-mono font-bold">{expedition.reportCount}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-sky-900/10">
                    <span className="text-slate-600">Datasets Archived:</span>
                    <span className="text-slate-900 font-mono font-bold">{expedition.datasetCount}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-sky-900/10">
                    <span className="text-slate-600">Publications:</span>
                    <span className="text-slate-900 font-mono font-bold">{expedition.publicationCount}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-sky-900/10">
                    <span className="text-slate-600">Multimedia Assets:</span>
                    <span className="text-slate-900 font-mono font-bold">{expedition.mediaCount}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link to={`/repository?search=${encodeURIComponent(expedition.name)}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Search Repository Assets
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Teams */}
      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expedition.scientificTeams.map((team, idx) => (
            <div key={idx} className="polar-glass-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-700">
                  {team.membersCount} Scientists & Engineers
                </span>
                <Users className="w-4 h-4 text-slate-600" />
              </div>
              <h4 className="text-base font-bold text-slate-900 font-['Bricolage_Grotesque',sans-serif]">
                {team.institution}
              </h4>
              <p className="text-xs text-slate-700">
                <strong className="text-slate-600">Research Focus: </strong>
                {team.role}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Reports */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((rep) => (
              <ResourceCard key={rep.id} resource={rep} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Datasets */}
      {activeTab === 'datasets' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {datasets.map((dat) => (
              <DatasetCard key={dat.id} dataset={dat} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Publications */}
      {activeTab === 'publications' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {publications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Media */}
      {activeTab === 'media' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mediaList.map((m) => (
            <div
              key={m.id}
              onClick={() => setLightboxAsset(m)}
              className="polar-glass-card rounded-2xl overflow-hidden cursor-pointer group hover:border-cyan-400/50 transition-all duration-300"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={m.thumbnail}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-white px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                  {m.type.toUpperCase()}
                </span>
              </div>
              <div className="p-4">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                  {m.title}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1">{m.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <MediaLightbox
        asset={lightboxAsset}
        isOpen={Boolean(lightboxAsset)}
        onClose={() => setLightboxAsset(null)}
      />
    </div>
  );
};
