import { TimelineEvent } from '@/shared/types/index';

export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: 'tl-1981',
    year: '1981',
    title: 'First Indian Antarctic Expedition (Operation Gangotri)',
    subtitle: 'India lands on continental Antarctica',
    region: 'Antarctica',
    description: 'Under the visionary leadership of Dr. S. Z. Qasim, a team of 21 scientists and navy personnel aboard the chartered icebreaker MV Polar Circle successfully landed on the frozen continent on January 9, 1982, hoisting the Indian Tricolour.',
    details: [
      'Departed from Marmagao Port, Goa on December 6, 1981.',
      'Conducted 10 days of intense geological, magnetic, and meteorological surveys.',
      'Paved the way for India to become a Consultative Party to the Antarctic Treaty in 1983.'
    ],
    image: '/images/iceberg-sea.jpg',
    significance: 'Historic inception of India’s national polar science program.'
  },
  {
    id: 'tl-1983',
    year: '1983',
    title: 'Establishment of Dakshin Gangotri',
    subtitle: 'India’s first permanent Antarctic base',
    region: 'Antarctica',
    station: 'Dakshin Gangotri',
    description: 'Constructed on the Princess Astrid Coast ice shelf in Queen Maud Land during the 3rd Indian Antarctic Expedition in a record span of eight weeks. Supported India’s first winter-over team.',
    details: [
      'Two-story prefabricated wooden structure built entirely over the floating ice shelf.',
      'Housed 12 scientists over the harsh 1984 austral winter.',
      'Subsequently decommissioned in 1990 as ice buried the structure; now preserved as a designated Antarctic Historic Site (HSM No. 44).'
    ],
    image: '/images/aurora-ice-field.jpg',
    significance: 'Positioned India as the first developing nation to sustain a permanent Antarctic station.'
  },
  {
    id: 'tl-1988',
    year: '1988',
    title: 'Commissioning of Maitri Research Station',
    subtitle: 'Permanent rocky oasis base',
    region: 'Antarctica',
    station: 'Maitri',
    description: 'Constructed on the ice-free rocky terrain of the Schirmacher Oasis. Maitri replaced Dakshin Gangotri as India’s primary inland wintering base, situated adjacent to pristine Lake Priyadarshini.',
    details: [
      'Equipped with modern laboratories for geomagnetism, atmospheric science, and human biology.',
      'Sustains an average of 25 winter-over researchers and 65 summer scientists continuously.',
      'A new state-of-the-art replacement facility (Maitri-II) is currently under development by MoES/NCPOR.'
    ],
    image: '/images/glacier-valley.jpg',
    significance: 'Provided over 35 years of unbroken scientific data on atmospheric chemistry and ozone hole recovery.'
  },
  {
    id: 'tl-2008',
    year: '2008',
    title: 'Himadri Station & Arctic Research Initiatives',
    subtitle: 'India expands into the High North',
    region: 'Arctic',
    station: 'Himadri',
    description: 'Inaugurated on July 1, 2008 at the international research base in Ny-Ålesund, Svalbard, Norway (78°55\'N), making India one of only a handful of nations with permanent research stations in both the Arctic and Antarctic.',
    details: [
      'Focuses on Arctic warming amplification, glacier retreats, and teleconnections with the Indian Monsoon.',
      'Collaborates with international consortiums (Kings Bay, AWIPEV, NPI).',
      'Supported India gaining Observer status in the Arctic Council in 2013.'
    ],
    image: '/images/antarctic-ice-shelf.jpg',
    significance: 'Solidified India’s bi-polar polar research capabilities.'
  },
  {
    id: 'tl-2012',
    year: '2012',
    title: 'Commissioning of Bharati Research Station',
    subtitle: 'Futuristic, eco-friendly Antarctic facility',
    region: 'Antarctica',
    station: 'Bharati',
    description: 'Located in the Larsemann Hills (-69°24\'S, 76°11\'E). Built from 134 prefabricated shipping containers elevated on aerodynamic stilts, Bharati is one of the greenest and most architecturally advanced stations in Antarctica.',
    details: [
      'Self-contained, automated thermal recovery heating and gray-water treatment.',
      'Dedicated direct satellite link to the National Remote Sensing Centre (NRSC/ISRO) in Shadnagar.',
      'Strategic gateway for glaciological investigations of the massive Amery Ice Shelf.'
    ],
    image: '/images/antarctic-ice-shelf.jpg',
    significance: 'Elevated India’s Antarctic presence with modern telemetry and year-round satellite tracking.'
  },
  {
    id: 'tl-2014',
    year: '2014',
    title: 'IndARC Underwater Moored Observatory',
    subtitle: 'Deep-ocean Arctic telemetry',
    region: 'Arctic',
    station: 'IndARC (Kongsfjorden)',
    description: 'Deployed at 192 m depth in Kongsfjorden fjord, Svalbard. IndARC was India’s first autonomous multi-sensor underwater observatory deployed in the Arctic Ocean.',
    details: [
      'Monitors year-round water mass exchanges between the North Atlantic and the Arctic basin.',
      'Captures extreme winter freeze-up and melting dynamics unreachable by shipboard surveys.',
      'Operated successfully for over a decade with annual sensor recoveries and re-deployments.'
    ],
    image: '/images/iceberg-sea.jpg',
    significance: 'World-renowned contribution to Arctic oceanographic and climate observation.'
  },
  {
    id: 'tl-2016',
    year: '2016',
    title: 'Himansh High-Altitude Himalayan Station',
    subtitle: 'Third Pole cryospheric monitoring',
    region: 'Himalaya',
    station: 'Himansh',
    description: 'Established at 4,080 m altitude in the Chandra Basin (Spiti Valley, Himachal Pradesh). Himansh connects polar cryospheric science directly with Himalayan water resources.',
    details: [
      'Continuous mass balance and automatic weather station monitoring of Siachen, Chhota Shigri, and Batal glaciers.',
      'Quantifies meltwater discharge providing water security data for the Indus and Ganga basins.'
    ],
    image: '/images/himalaya-peaks.jpg',
    significance: 'Integrates India’s Third Pole scientific agenda with the Polar regions.'
  },
  {
    id: 'tl-present',
    year: 'Present',
    title: 'Modern Integrated Polar & Southern Ocean Program',
    subtitle: 'Integrated digital repository and advanced missions',
    region: 'Antarctica',
    description: 'Operating the 43rd Antarctic Expedition, 16th Arctic Expedition, Southern Ocean campaigns, and the development of India’s next-generation Maitri-II station alongside the Polar Science digital gateway.',
    details: [
      'Unifying 40+ years of polar knowledge into open FAIR-compliant scientific repositories.',
      'Empowering the next generation of Indian polar scientists through national education outreach.',
      'Direct contribution to global climate change negotiations and IPCC assessments.'
    ],
    image: '/images/southern-ocean.jpg',
    significance: 'Consolidating India’s leadership in global polar science and environmental stewardship.'
  }
];
