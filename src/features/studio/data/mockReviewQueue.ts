import { ContentDraft } from '@/shared/types/index';

export const initialReviewQueue: ContentDraft[] = [
  {
    id: 'draft-001',
    title: 'How India’s Bharati Station Powers Polar Science via Satellite Direct-Downlink',
    sourceResourceId: 'res-rep-001',
    sourceResourceTitle: '42nd Indian Scientific Expedition to Antarctica: Comprehensive Scientific Report',
    sourceResourceType: 'Expedition Reports',
    outputFormat: 'Website Article',
    targetAudience: 'General Public',
    tone: 'Public Friendly',
    summary: 'An accessible explainer on the advanced telemetry systems at Bharati station linking remote Antarctic researchers with ISRO and MoES headquarters in India.',
    body: `Nestled among the rocky wind-swept ridges of Larsemann Hills in East Antarctica sits Bharati—one of the most technologically advanced research outposts on Earth. Constructed from 134 prefabricated shipping containers and elevated on aerodynamic stilts, this Indian station endures blizzards exceeding 150 km/h and winter temperatures plunging below -40°C.

What makes Bharati truly unique is its high-speed direct satellite link. Operating a dedicated downlink to ISRO's National Remote Sensing Centre (NRSC) in Shadnagar near Hyderabad, Bharati transmits critical earth observation data, meteorological logs, and space weather measurements back to Indian supercomputers in near real-time.

Over the 42nd Indian Scientific Expedition, scientists at Bharati logged over 4,000 hours of continuous geomagnetic observations and retrieved pristine ice cores that preserve hundreds of years of climate records. As India prepares for the future Maitri-II station, Bharati stands as a shining testament to Indian scientific engineering on the white continent.`,
    sourceReferences: [
      'Report: 42nd Indian Scientific Expedition to Antarctica (NCPOR/MoES, 2023)',
      'Dataset: Bharati Station Automated Weather Station Grid (DOI: 10.5281/zenodo.ncpor.isea42)'
    ],
    author: 'Sunil Nair (Content Editor)',
    createdAt: '2024-03-12 14:30',
    status: 'Under Review',
    comments: [
      'Reviewed by Scientific Officer: Clarify that the station was commissioned in 2012.',
      'Awaiting final sign-off from NCPOR Outreach Lead.'
    ]
  },
  {
    id: 'draft-002',
    title: 'Thread: 5 Surprising Facts About Kongsfjorden & IndARC (Arctic)',
    sourceResourceId: 'res-rep-002',
    sourceResourceTitle: 'IndARC Arctic Deep-Water Observatory: 10-Year Sustained Oceanographic Synthesis',
    sourceResourceType: 'Expedition Reports',
    outputFormat: 'Social Media Post',
    targetAudience: 'Students',
    tone: 'Educational',
    summary: 'Engaging 5-part social media carousel highlighting India’s underwater Arctic mooring observatory for National Science Day.',
    body: `1/5 🌊 Did you know India has a multi-sensor observatory stationed 192 meters deep underwater in the Arctic Ocean? Meet #IndARC! 🇮🇳❄️

2/5 📍 Deployed in Kongsfjorden, Svalbard (Norway) since 2014, IndARC listens to the ocean 24/7/365, surviving sub-zero waters and frozen winter fjords!

3/5 🌡️ Why is it there? It tracks warm Atlantic water surging into the Arctic. These warm pulses act like an underwater radiator, speeding up glacier melt!

4/5 🔬 Indian scientists recover the mooring annually aboard research vessels, swapping high-tech sensors measuring salinity, current speed, and marine plankton.

5/5 📚 Grounded in 10 years of verified NCPOR research. Learn more at the Polar Science Knowledge Gateway! 🔗 polar.ncpor.res.in #PolarScience #NCPOR #MoES`,
    sourceReferences: [
      'Synthesis: IndARC 10-Year Decadal Assessment (NCPOR Arctic Wing, 2024)',
      'Journal: Polar Science (Elsevier, Vol 37)'
    ],
    author: 'Priya Sharma (Social Media Specialist)',
    createdAt: '2024-03-14 10:15',
    status: 'Approved',
    comments: ['Approved for scheduled publishing on Twitter/X and LinkedIn.']
  },
  {
    id: 'draft-003',
    title: 'Press Release: Indian Scientists Uncover New Clues to Antarctic Ice Shelf Melting',
    sourceResourceId: 'res-pub-001',
    sourceResourceTitle: 'Accelerated Basal Melting of the Amery Ice Shelf Linked to Southern Ocean CDW',
    sourceResourceType: 'Publications',
    outputFormat: 'Press Summary',
    targetAudience: 'Researchers',
    tone: 'Scientific',
    summary: 'Official MoES press communique detailing newly published hydrographic findings in Journal of Polar Science.',
    body: `NEW DELHI / VASCO DA GAMA — In a significant peer-reviewed discovery published in the Journal of Polar Science, oceanographers from the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, have identified episodic pulses of warm modified Circumpolar Deep Water (mCDW) intruding beneath East Antarctica’s Amery Ice Shelf.

The investigation, conducted as part of the 12th Southern Ocean Expedition, utilized high-precision CTD rosette profiles and isotopic tracers. The researchers demonstrated that regional wind anomalies driven by the positive phase of the Southern Annular Mode (SAM) accelerate the shoreward transport of dense subsurface warm waters into sub-ice cavities.

Dr. Thamban Meloth, Director of NCPOR, noted: "Understanding the coupling between Southern Ocean wind dynamics and sub-shelf basal melting is vital for refining global sea-level rise projections in upcoming IPCC synthesis reports."`,
    sourceReferences: [
      'Publication: Journal of Polar Science, DOI: 10.1016/j.polar.2023.100982',
      'Data: Southern Ocean CTD Hydrographic Repository (NCPOR Open Data)'
    ],
    author: 'Dr. M. K. Rawat (Media Advisor)',
    createdAt: '2024-03-10 16:45',
    status: 'Published',
    comments: ['Disseminated to national press agencies (PTI, PIB, DD News).']
  }
];
