import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from '@/features/home/pages/Home';
import { Repository } from '@/features/repository/pages/Repository';
import { ResourceDetail } from '@/features/repository/pages/ResourceDetail';
import { Expeditions } from '@/features/expeditions/pages/Expeditions';
import { ExpeditionDetail } from '@/features/expeditions/pages/ExpeditionDetail';
import { Datasets } from '@/features/datasets/pages/Datasets';
import { DatasetDetail } from '@/features/datasets/pages/DatasetDetail';
import { Publications } from '@/features/publications/pages/Publications';
import { PublicationDetail } from '@/features/publications/pages/PublicationDetail';
import { MediaGallery } from '@/features/media/pages/MediaGallery';
import { Outreach } from '@/features/outreach/pages/Outreach';
import { StoryDetail } from '@/features/outreach/pages/StoryDetail';
import { LearnPolar } from '@/features/learn/pages/LearnPolar';
import { AboutNCPOR } from '@/features/about/pages/AboutNCPOR';
import { ContentStudio } from '@/features/studio/pages/ContentStudio';
import { ReviewQueue } from '@/features/studio/pages/ReviewQueue';
import { AgentHub } from '@/features/agents/pages/AgentHub';
import { Dashboard } from '@/features/dashboard/pages/Dashboard';

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/repository" element={<Repository />} />
    <Route path="/repository/:id" element={<ResourceDetail />} />
    <Route path="/expeditions" element={<Expeditions />} />
    <Route path="/expeditions/:id" element={<ExpeditionDetail />} />
    <Route path="/datasets" element={<Datasets />} />
    <Route path="/datasets/:id" element={<DatasetDetail />} />
    <Route path="/publications" element={<Publications />} />
    <Route path="/publications/:id" element={<PublicationDetail />} />
    <Route path="/media" element={<MediaGallery />} />
    <Route path="/outreach" element={<Outreach />} />
    <Route path="/stories/:id" element={<StoryDetail />} />
    <Route path="/learn" element={<LearnPolar />} />
    <Route path="/about" element={<AboutNCPOR />} />
    <Route path="/content-studio" element={<ContentStudio />} />
    <Route path="/review" element={<ReviewQueue />} />
    <Route path="/agents" element={<AgentHub />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
);
