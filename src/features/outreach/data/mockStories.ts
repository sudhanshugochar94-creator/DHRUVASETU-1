import { ScienceStory } from '@/shared/types/index';

export const mockStories: ScienceStory[] = [
  {
    id: 'story-sea-ice',
    title: 'Why Polar Sea Ice Matters More Than You Think',
    slug: 'why-polar-sea-ice-matters',
    subtitle: 'From solar mirrors to the global ocean conveyor belt, how polar ice keeps our planet habitable.',
    category: 'Climate Science',
    region: 'Antarctica',
    readingLevel: 'General Public',
    readingTime: '6 min read',
    heroImage: '/images/aurora-ice-field.jpg',
    simpleExplanation: 'Imagine Earth wearing a shiny white helmet that reflects 80% of the Sun’s harsh heat back into outer space. That is what polar sea ice does! When that white ice melts and exposes dark blue ocean water, the ocean absorbs 90% of solar radiation instead of reflecting it—acting like a giant heater.',
    scientificContext: 'Sea ice thermodynamics play a critical role in Earth\'s planetary albedo and thermohaline circulation. In polar regions like East Antarctica’s Prydz Bay and Svalbard’s fjords, the freezing of ocean surface waters expels dense, highly saline brine. This dense water sinks to the ocean abyss, driving the global conveyor belt that distributes heat and nutrients across all seven seas.',
    keyFindings: [
      'Fresh snow atop sea ice reflects up to 85% of incoming solar shortwave radiation, compared to just 7% for open water.',
      'Indian Antarctic expeditions have measured over 1.7 meters of winter fast-ice thickness in Prydz Bay using in-situ electromagnetic sounding.',
      'Declines in polar sea ice weaken the polar jet stream, leading to prolonged heatwaves and intense precipitation anomalies in mid-latitudes.'
    ],
    whyItMatters: 'If polar sea ice disappears, global climate stability is destabilized. Changes in polar ocean temperatures also directly modulate the strength and timing of the Indian Southwest Monsoon.',
    groundedSources: [
      { id: 'res-dat-001', title: 'High-Resolution Sea Ice Extent: Prydz Bay (2018–2023)', type: 'Scientific Dataset' },
      { id: 'res-pub-001', title: 'Accelerated Basal Melting of Amery Ice Shelf', type: 'Research Publication' }
    ],
    publishedDate: '2024-02-18',
    author: 'NCPOR Science Communication Cell'
  },
  {
    id: 'story-polar-vortex',
    title: 'Demystifying the Polar Vortex: The Arctic\'s Frozen Whirlwind',
    slug: 'demystifying-the-polar-vortex',
    subtitle: 'What happens when the stratosphere\'s cold crown destabilizes and spills into continents?',
    category: 'Atmospheric Physics',
    region: 'Arctic',
    readingLevel: 'School',
    readingTime: '4 min read',
    heroImage: '/images/antarctic-ice-shelf.jpg',
    simpleExplanation: 'Think of the polar vortex as a giant spinning top of freezing arctic air high up in the sky above the North Pole. When the spinning top is strong and fast, it keeps all the freezing cold air trapped tightly in the Arctic. But when it wobbles, icy blasts spill southward!',
    scientificContext: 'The stratospheric polar vortex is a persistent, large-scale low-pressure cyclonic circulation spanning 15 to 50 km altitude during the winter hemisphere. Sudden Stratospheric Warming (SSW) events can break or split this vortex, inducing negative Arctic Oscillation phases that send severe sub-zero cold waves across North America, Europe, and northern Asia.',
    keyFindings: [
      'The vortex is held together by sharp thermal gradients between the cold polar cap and warmer mid-latitudes.',
      'IndARC and Himadri observations confirm that anomalous heat fluxes into the high Arctic are increasing the frequency of vortex instability.',
      'Studying upper-level vortex dynamics gives meteorologists up to 3 to 4 weeks of advance notice for extreme winter weather.'
    ],
    whyItMatters: 'Understanding how Arctic warming influences the polar vortex helps farmers, city planners, and disaster management agencies prepare for sudden winter cold snaps and disrupted precipitation cycles.',
    groundedSources: [
      { id: 'res-rep-002', title: 'IndARC Arctic Deep-Water Observatory Synthesis', type: 'Expedition Report' },
      { id: 'res-pub-001', title: 'Warm Water Intrusion into Kongsfjorden', type: 'Research Publication' }
    ],
    publishedDate: '2024-01-25',
    author: 'Dr. Sourav Chatterjee, NCPOR Arctic Division'
  },
  {
    id: 'story-life-at-bharati',
    title: 'How Do Indian Scientists Live and Work in Antarctica?',
    slug: 'life-inside-bharati-station',
    subtitle: 'Behind the airlocks of Bharati and Maitri: Survival, science, and camaraderie in sub-zero isolation.',
    category: 'Expedition Life',
    region: 'Antarctica',
    readingLevel: 'School',
    readingTime: '5 min read',
    heroImage: '/images/antarctic-ice-shelf.jpg',
    simpleExplanation: 'Imagine living inside a futuristic spaceship perched on steel stilts surrounded by ice, where the winter temperature drops to -40°C and blizzards blow at 150 km/h! Inside Bharati Station, Indian scientists have warm cozy bedrooms, a hospital, a gym, a library, and delicious hot Indian food like dal, parathas, and gulab jamun.',
    scientificContext: 'Bharati Station in Larsemann Hills is an architectural marvel built out of 134 prefabricated shipping container modules clad in an aerodynamic insulated shell. The station utilizes thermal energy recovery from its generators to heat living spaces, purifies wastewater through reverse osmosis, and features a redundant satellite telecommunication array linking scientists directly with India.',
    keyFindings: [
      'The station is elevated on stilts to prevent snow accumulation from burying the structure.',
      'During the austral winter, a core team of approximately 24 researchers ("winter-overs") spend 8 to 9 months in total physical isolation.',
      'Scientists monitor space weather, atmospheric ozone, seismic tremors, and glacier movement 24 hours a day, 365 days a year.'
    ],
    whyItMatters: 'Indian polar stations are not just science labs—they are strategic national assets demonstrating India’s high-tech engineering capabilities, extreme environment medicine, and commitment to global environmental treaties.',
    groundedSources: [
      { id: 'res-rep-001', title: '42nd Indian Scientific Expedition to Antarctica Report', type: 'Expedition Report' },
      { id: 'res-pho-001', title: 'Aurora Australis Over Bharati Station', type: 'Photographs' }
    ],
    publishedDate: '2023-12-10',
    author: 'NCPOR Outreach Team'
  },
  {
    id: 'story-third-pole',
    title: 'The Third Pole: Why Himalayan Glaciers Are India\'s Water Towers',
    slug: 'the-third-pole-himalayan-glaciers',
    subtitle: 'Connecting the cryosphere of the Arctic and Antarctica with India’s freshwater lifeline.',
    category: 'Glaciology',
    region: 'Himalaya',
    readingLevel: 'College',
    readingTime: '7 min read',
    heroImage: '/images/himalaya-peaks.jpg',
    simpleExplanation: 'The Hindu Kush-Himalayan region stores more snow and ice than anywhere on Earth outside the North and South Poles—earning it the title of Earth\'s "Third Pole". These glaciers feed ten of Asia’s largest river systems, sustaining over 1.9 billion people with drinking water, agriculture, and hydropower.',
    scientificContext: 'Field monitoring by NCPOR at the high-altitude Himansh station (4,080 m a.s.l.) in Spiti Valley tracks the mass balance of benchmark glaciers including Chhota Shigri and Sutri Dhaka. Results demonstrate accelerated negative mass balances over recent decades, with clean-ice sectors losing up to 0.7 meters water equivalent per year. Pre-monsoon black carbon dust deposits lower surface albedo, accelerating summer melting.',
    keyFindings: [
      'Himalayan glaciers have lost mass at an accelerated rate since the year 2000 compared to the late 20th century.',
      'Glacial lake outburst floods (GLOFs) pose increasing downstream hazards as proglacial moraine-dammed lakes expand.',
      'NCPOR’s automated weather stations provide vital real-time inputs for hydrological runoff models and disaster early-warning networks.'
    ],
    whyItMatters: 'Changes in Himalayan glacier mass directly threaten water security for northern India’s fertile agricultural belts and hydropower generation.',
    groundedSources: [
      { id: 'res-rep-003', title: 'Himalayan Cryosphere Program: Chhota Shigri Mass Balance Report', type: 'Expedition Report' },
      { id: 'res-dat-003', title: 'Western Himalaya Glacier Mass Balance Grid (2015–2023)', type: 'Scientific Dataset' }
    ],
    publishedDate: '2023-11-04',
    author: 'Dr. Parmanand Sharma, Cryosphere Sciences Group'
  }
];
