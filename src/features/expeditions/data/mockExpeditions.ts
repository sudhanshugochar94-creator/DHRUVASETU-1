import { Expedition } from '@/shared/types/index';

export const mockExpeditions: Expedition[] = [
  {
    id: 'exp-isea-43',
    name: '43rd Indian Scientific Expedition to Antarctica',
    code: '43-ISEA',
    region: 'Antarctica',
    year: 2024,
    dates: 'Nov 2023 – Mar 2024',
    leader: 'Dr. Yogesh Ray & Dr. B. L. Redkar',
    station: 'Maitri & Bharati',
    heroImage: '/images/antarctic-ice-shelf.jpg',
    shortDescription: 'Active interdisciplinary expedition executing 44 research objectives across glaciology, space weather, atmospheric profiling, and environmental baseline assessments.',
    objectives: [
      'Recover 150m ice cores from the Amery Ice Shelf coastal ice cap for high-resolution paleoclimate reconstruction.',
      'Deploy autonomous GPS geodetic arrays to quantify bedrock crustal uplift and ice discharge rates.',
      'Maintain continuous atmospheric boundary layer sodar and radiometer arrays at Maitri and Bharati stations.',
      'Execute biogeochemical sampling of Schirmacher Oasis perennially ice-covered freshwater lakes (Lake Priyadarshini).'
    ],
    themes: ['Glaciology', 'Atmospheric Science', 'Space Weather', 'Cryosphere Dynamics'],
    scientificTeams: [
      { institution: 'National Centre for Polar and Ocean Research (NCPOR)', role: 'Lead Operations & Cryospheric Dynamics', membersCount: 18 },
      { institution: 'Geological Survey of India (GSI)', role: 'Bedrock Geology & Topographic Mapping', membersCount: 6 },
      { institution: 'India Meteorological Department (IMD)', role: 'Continuous Weather & Ozone Profiling', membersCount: 8 },
      { institution: 'Survey of India (SOI)', role: 'Satellite Geodesy & Tide Gauge Measurements', membersCount: 4 },
      { institution: 'Indian Institute of Geomagnetism (IIG)', role: 'Magnetometer & Ionospheric Scintillation', membersCount: 5 }
    ],
    keyFindings: [
      'Successfully retrieved 124 meters of undisturbed coastal ice core preserving 400+ years of regional precipitation history.',
      'Detected anomalies in ionospheric TEC (Total Electron Content) correlating directly with solar coronal mass ejections.',
      'Completed drone-based thermal imaging of blue-ice ablation zones across Larsemann Hills.'
    ],
    status: 'Ongoing',
    vessel: 'MV Vasiliy Golovnin (Chartered Polar Class)',
    reportCount: 8,
    datasetCount: 14,
    publicationCount: 22,
    mediaCount: 148
  },
  {
    id: 'exp-isea-42',
    name: '42nd Indian Scientific Expedition to Antarctica',
    code: '42-ISEA',
    region: 'Antarctica',
    year: 2023,
    dates: 'Nov 2022 – Apr 2023',
    leader: 'Dr. Shailendra Saini & Dr. Amit Dhar',
    station: 'Maitri & Bharati',
    heroImage: '/images/aurora-ice-field.jpg',
    shortDescription: 'Completed comprehensive summer campaign focusing on deep ice core drilling, space weather monitoring, and green energy retrofits at Bharati.',
    objectives: [
      'Commissioned hybrid renewable solar-wind power auxiliary nodes at Bharati station.',
      'Completed shallow seismic refraction surveys along the Schirmacher Oasis continental margin.',
      'Sampled microbial extremophiles from supraglacial cryoconite holes.'
    ],
    themes: ['Cryosphere Dynamics', 'Glaciology', 'Polar Biology & Ecology', 'Space Weather'],
    scientificTeams: [
      { institution: 'NCPOR Goa', role: 'Expedition Command & Paleoclimate', membersCount: 16 },
      { institution: 'National Geophysical Research Institute (CSIR-NGRI)', role: 'Broadband Seismology', membersCount: 5 },
      { institution: 'Indian Army Corps of Engineers', role: 'Station Maintenance & Heavy Vehicle Transit', membersCount: 12 }
    ],
    keyFindings: [
      'Recorded baseline acoustic emission signatures of calving events near the Polar Record Glacier.',
      'Demonstrated 22% reduction in fuel consumption at Bharati via smart thermal insulation upgrades.'
    ],
    status: 'Completed',
    vessel: 'MV Vasiliy Golovnin',
    reportCount: 12,
    datasetCount: 18,
    publicationCount: 31,
    mediaCount: 215
  },
  {
    id: 'exp-arc-16',
    name: '16th Indian Arctic Expedition (Himadri, Ny-Ålesund)',
    code: '16-ARC',
    region: 'Arctic',
    year: 2024,
    dates: 'Jun 2023 – Mar 2024',
    leader: 'Dr. K. P. Krishnan',
    station: 'Himadri Station (Svalbard, Norway)',
    heroImage: '/images/antarctic-ice-shelf.jpg',
    shortDescription: 'India’s flagship northern high-latitude research mission in Svalbard examining Arctic amplification, fjord dynamics, and Atlantic water intrusion.',
    objectives: [
      'Maintain continuous data acquisition from the underwater IndARC mooring observatory at 192m depth.',
      'Investigate mass balance and velocity fluctuations of the Midtre Lovénbreen and Austre Brøggerbreen glaciers.',
      'Sample atmospheric black carbon and persistent organic pollutants at the Zeppelin Mountain station partnership.'
    ],
    themes: ['Oceanography', 'Glaciology', 'Atmospheric Science', 'Polar Biology & Ecology'],
    scientificTeams: [
      { institution: 'NCPOR Ny-Ålesund Operations', role: 'Lead Science Coordination', membersCount: 8 },
      { institution: 'National Institute of Oceanography (CSIR-NIO)', role: 'Marine Hydrography', membersCount: 4 },
      { institution: 'Bose Institute, Kolkata', role: 'Atmospheric Aerosols & Bioaerosols', membersCount: 3 }
    ],
    keyFindings: [
      'Documented anomalous warming pulses of modified Atlantic Water in Kongsfjorden during winter months.',
      'Isolated cold-active lipases from Arctic marine sediments with potential biodetergent activity.'
    ],
    status: 'Completed',
    reportCount: 9,
    datasetCount: 11,
    publicationCount: 19,
    mediaCount: 130
  },
  {
    id: 'exp-so-12',
    name: '12th Southern Ocean Expedition',
    code: '12-SOE',
    region: 'Southern Ocean',
    year: 2023,
    dates: 'Jan 2023 – Mar 2023',
    leader: 'Dr. Anoop Mahajan',
    station: 'Oceanographic Shipboard Campaign',
    heroImage: '/images/glacier-valley.jpg',
    shortDescription: 'Comprehensive hydrographic transect from 40°S (Subtropical Front) to 67°S (Antarctic margin) investigating the Southern Ocean carbon sink.',
    objectives: [
      'Quantify air-sea fluxes of carbon dioxide, nitrous oxide, and dimethyl sulfide (DMS).',
      'Measure trace metal distributions (dissolved iron and zinc) limiting primary productivity in High-Nutrient Low-Chlorophyll (HNLC) zones.',
      'Collect continuous biophysical profiles of Antarctic Krill (Euphausia superba) swarms using multi-frequency echosounders.'
    ],
    themes: ['Oceanography', 'Atmospheric Science', 'Polar Biology & Ecology'],
    scientificTeams: [
      { institution: 'NCPOR, Goa', role: 'Biogeochemistry & Air-Sea Gas Transfer', membersCount: 12 },
      { institution: 'Centre for Marine Living Resources and Ecology (CMLRE)', role: 'Zooplankton & Pelagic Fisheries', membersCount: 6 },
      { institution: 'Indian Institute of Science (IISc)', role: 'Trace Metal Isotope Geochemistry', membersCount: 4 }
    ],
    keyFindings: [
      'Identified localized iron fertilization from shallow banks near the Kerguelen Plateau stimulating phytoplankton blooms.',
      'Observed deepening of the mixed layer driven by intensified circumpolar westerly wind stress.'
    ],
    status: 'Completed',
    vessel: 'SA Agulhas / Vasiliy Golovnin',
    reportCount: 6,
    datasetCount: 16,
    publicationCount: 24,
    mediaCount: 94
  },
  {
    id: 'exp-him-23',
    name: 'Chandra Basin Himalayan Cryospheric Expedition 2023',
    code: 'HIM-2023',
    region: 'Himalaya',
    year: 2023,
    dates: 'Jul 2023 – Oct 2023',
    leader: 'Dr. Parmanand Sharma',
    station: 'Himansh High-Altitude Station (Spiti Valley)',
    heroImage: '/images/himalaya-peaks.jpg',
    shortDescription: 'Long-term monitoring of benchmark glaciers in the Western Himalayas to assess climate change impacts on India’s freshwater reservoirs.',
    objectives: [
      'Benchmark glaciological mass balance measurements across Chhota Shigri, Sutri Dhaka, and Batal glaciers.',
      'Ground-penetrating radar profiling to map bed topography and ice volume changes.',
      'Maintain real-time telemetry from automated weather stations in Chandra-Bhaga headwaters.'
    ],
    themes: ['Glaciology', 'Atmospheric Science', 'Cryosphere Dynamics'],
    scientificTeams: [
      { institution: 'NCPOR Cryosphere Division', role: 'Glacial Dynamics & Radar Surveys', membersCount: 10 },
      { institution: 'Wadia Institute of Himalayan Geology (WIHG)', role: 'Geomorphology & Moraine Stability', membersCount: 4 },
      { institution: 'Jawaharlal Nehru University (JNU)', role: 'Hydrochemical Stream Tracing', membersCount: 3 }
    ],
    keyFindings: [
      'Recorded continued negative mass balance (-0.68 m w.e.) on Chhota Shigri glacier consistent with regional warming trends.',
      'Quantified debris cover retardation of ablation rates up to 45% on lower tongue sectors.'
    ],
    status: 'Completed',
    reportCount: 5,
    datasetCount: 9,
    publicationCount: 15,
    mediaCount: 88
  },
  {
    id: 'exp-isea-01',
    name: '1st Indian Scientific Expedition to Antarctica (Operation Gangotri)',
    code: '01-ISEA',
    region: 'Antarctica',
    year: 1981,
    dates: 'Dec 1981 – Feb 1982',
    leader: 'Dr. Syed Zahoor Qasim',
    station: 'Historical Ice Shelf Camp',
    heroImage: '/images/iceberg-sea.jpg',
    shortDescription: 'The historic pioneering mission that placed India among the elite group of polar research nations, landing in Queen Maud Land on January 9, 1982.',
    objectives: [
      'Conduct the first scientific landing of an Indian research team on continental Antarctica.',
      'Carry out preliminary geological, meteorological, and marine magnetic observations in the Princess Astrid Coast sector.',
      'Identify an optimal permanent site for establishing India’s first scientific research station.'
    ],
    themes: ['Geophysics & Geology', 'Oceanography', 'Atmospheric Science'],
    scientificTeams: [
      { institution: 'Department of Ocean Development (DOD)', role: 'National Mission Leadership', membersCount: 7 },
      { institution: 'National Institute of Oceanography (CSIR-NIO)', role: 'Marine Biology & Ocean Acoustics', membersCount: 6 },
      { institution: 'Indian Navy & Survey of India', role: 'Navigation, Hydrography & Air Support', membersCount: 8 }
    ],
    keyFindings: [
      'Successfully hoisted the Indian Tricolour on Antarctica on January 9, 1982.',
      'Identified the Dakshin Gangotri ice shelf zone which enabled India to establish its first wintering station in 1983 and accede to the Antarctic Treaty.'
    ],
    status: 'Archived',
    vessel: 'MV Polar Circle (Chartered Icebreaker)',
    reportCount: 4,
    datasetCount: 5,
    publicationCount: 12,
    mediaCount: 75
  }
];
