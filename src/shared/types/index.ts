export type ResourceType = 
  | 'Expedition Reports' 
  | 'Scientific Datasets' 
  | 'Publications' 
  | 'Photographs' 
  | 'Videos' 
  | 'Institutional Activities' 
  | 'Educational Resources';

export type PolarRegion = 'Antarctica' | 'Arctic' | 'Southern Ocean' | 'Himalaya';

export type ResearchTheme = 
  | 'Glaciology' 
  | 'Atmospheric Science' 
  | 'Oceanography' 
  | 'Cryosphere Dynamics' 
  | 'Paleoclimatology' 
  | 'Geophysics & Geology' 
  | 'Polar Biology & Ecology' 
  | 'Space Weather';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  year: number;
  date: string;
  region: PolarRegion;
  expeditionId?: string;
  expeditionName?: string;
  authors: string[];
  institutions: string[];
  theme: ResearchTheme;
  shortDescription: string;
  fullDescription: string;
  doi?: string;
  fileFormat: string;
  fileSize: string;
  license: string;
  language: string;
  viewCount: number;
  downloadCount: number;
  coverImage: string;
  coordinates?: { lat: number; lng: number };
  relatedResourceIds?: string[];
  sourceAttribution: string;
}

export interface Expedition {
  id: string;
  name: string;
  code: string;
  region: PolarRegion;
  year: number;
  dates: string;
  leader: string;
  station?: string;
  heroImage: string;
  shortDescription: string;
  objectives: string[];
  themes: ResearchTheme[];
  scientificTeams: { institution: string; role: string; membersCount: number }[];
  keyFindings: string[];
  status: 'Completed' | 'Ongoing' | 'Archived';
  vessel?: string;
  reportCount: number;
  datasetCount: number;
  publicationCount: number;
  mediaCount: number;
}

export interface Dataset {
  id: string;
  name: string;
  region: PolarRegion;
  domain: string;
  description: string;
  variables: string[];
  timeRange: string;
  format: string;
  size: string;
  doi: string;
  license: string;
  spatialCoverage: string;
  samplingFrequency: string;
  station?: string;
  sampleData: Array<Record<string, string | number>>;
  downloadCount: number;
  lastUpdated: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  institutions: string[];
  year: number;
  journal: string;
  volume?: string;
  doi: string;
  region: PolarRegion;
  field: string;
  abstract: string;
  keywords: string[];
  citationsCount: number;
  pdfSize: string;
  linkedDatasetId?: string;
  linkedExpeditionId?: string;
}

export interface MediaAsset {
  id: string;
  title: string;
  type: 'photo' | 'video' | 'documentary';
  thumbnail: string;
  highResUrl: string;
  region: PolarRegion;
  expedition: string;
  date: string;
  location: string;
  photographer: string;
  description: string;
  tags: string[];
  resolution?: string;
  duration?: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  region: PolarRegion;
  station?: string;
  description: string;
  details: string[];
  image: string;
  significance: string;
}

export interface ScienceStory {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  category: string;
  region: PolarRegion;
  readingLevel: 'School' | 'College' | 'General Public';
  readingTime: string;
  heroImage: string;
  simpleExplanation: string;
  scientificContext: string;
  keyFindings: string[];
  whyItMatters: string;
  groundedSources: { title: string; type: string; id: string; url?: string }[];
  publishedDate: string;
  author: string;
}

export interface LearnModule {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  topicsCount: number;
  estimatedTime: string;
  region: PolarRegion;
  description: string;
  iconName: string;
  lessons: { title: string; duration: string; summary: string }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface ContentDraft {
  id: string;
  title: string;
  sourceResourceId: string;
  sourceResourceTitle: string;
  sourceResourceType: string;
  outputFormat: 'Website Article' | 'Social Media Post' | 'Press Summary' | 'Student Explanation' | 'Science Story' | 'Educational Summary' | 'Expedition Highlight' | 'Dataset Explanation' | 'Research Summary';
  targetAudience: 'Researchers' | 'Students' | 'Teachers' | 'General Public';
  tone: 'Scientific' | 'Educational' | 'Public Friendly';
  summary: string;
  body: string;
  socialCaption?: string;
  hashtags?: string[];
  sourceReferences: string[];
  author: string;
  createdAt: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Published';
  comments?: string[];
  // Set for drafts produced by the multi-agent backend
  agentGenerated?: boolean;
  confidence?: number;
  validationFlags?: string[];
  publishAt?: string;
  revision?: number;
}

export type UserRole = 'Public Visitor' | 'Researcher' | 'Content Manager' | 'Administrator';
