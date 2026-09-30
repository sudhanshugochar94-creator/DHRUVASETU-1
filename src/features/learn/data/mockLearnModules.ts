import { LearnModule } from '@/shared/types/index';

export const mockLearnModules: LearnModule[] = [
  {
    id: 'mod-polar-intro',
    title: 'Earth’s Cryosphere & Polar Regions 101',
    level: 'Beginner',
    topicsCount: 4,
    estimatedTime: '30 mins',
    region: 'Antarctica',
    description: 'Fundamental concepts of polar geography, the cryosphere, key differences between the Arctic ocean and the Antarctic continent, and why poles are Earth’s refrigerators.',
    iconName: 'Compass',
    lessons: [
      { title: 'The Arctic vs. Antarctic: Ice over Ocean vs. Land under Ice', duration: '8 min', summary: 'Understanding the fundamental tectonic and oceanographic difference between the Arctic and Antarctic.' },
      { title: 'The Global Heat Engine & Planetary Albedo', duration: '7 min', summary: 'How polar white surfaces reflect solar energy and keep equatorial regions from overheating.' },
      { title: 'Indian Polar Stations: Maitri, Bharati, and Himadri', duration: '9 min', summary: 'The historical timeline and operations of India’s research facilities.' },
      { title: 'Polar Extremophiles: Surviving at Sub-Zero', duration: '6 min', summary: 'Biological adaptations of mosses, lichens, krill, and penguins in extreme climates.' }
    ],
    quiz: [
      {
        question: 'What is the primary geographical difference between the Arctic and Antarctic?',
        options: [
          'The Arctic is a frozen continent surrounded by ocean, while Antarctica is an ocean surrounded by continents.',
          'The Arctic is an ocean surrounded by continents, while Antarctica is a continent covered by an ice sheet surrounded by ocean.',
          'The Arctic has no ice in winter, while Antarctica is always covered by ice.',
          'The Arctic is located in the Southern Hemisphere, while Antarctica is in the Northern Hemisphere.'
        ],
        correctIndex: 1,
        explanation: 'Correct! The Arctic is primarily an ocean basin covered by sea ice and encircled by landmasses, whereas Antarctica is a massive continental landmass buried beneath kilometers of glacial ice and encircled by the Southern Ocean.'
      },
      {
        question: 'What is the name of India\'s first permanent research station in Antarctica (established in 1983)?',
        options: ['Maitri', 'Bharati', 'Dakshin Gangotri', 'Himadri'],
        correctIndex: 2,
        explanation: 'Correct! Dakshin Gangotri was established in 1983 on the ice shelf during the 3rd Indian Antarctic Expedition.'
      },
      {
        question: 'What happens to planetary albedo when bright polar sea ice melts into open ocean water?',
        options: [
          'Albedo increases, reflecting more sunlight into space.',
          'Albedo decreases, absorbing more solar heat and warming the ocean.',
          'Albedo remains unchanged because the temperature stays at 0°C.',
          'The ocean turns into ice immediately due to evaporative cooling.'
        ],
        correctIndex: 1,
        explanation: 'Correct! Snow-covered sea ice reflects up to 85% of solar radiation (high albedo), while dark open ocean absorbs approximately 90% (low albedo), causing positive climate feedback warming.'
      }
    ]
  },
  {
    id: 'mod-antarctic-dynamics',
    title: 'Antarctic Glaciology & Ice Sheet Dynamics',
    level: 'Intermediate',
    topicsCount: 5,
    estimatedTime: '45 mins',
    region: 'Antarctica',
    description: 'Explore the mechanics of ice shelves, grounding lines, basal melting, and ice core paleoclimate proxies derived from East Antarctic drilling.',
    iconName: 'MountainSnow',
    lessons: [
      { title: 'Anatomy of an Ice Sheet: From Firn to Flowing Glaciers', duration: '10 min', summary: 'How fallen snowflakes compress into blue glacier ice over thousands of years.' },
      { title: 'The Amery Ice Shelf and Grounding Line Stability', duration: '10 min', summary: 'Why floating ice shelves act as protective buttresses preventing continental ice from surging into the sea.' },
      { title: 'Basal Melt & Circumpolar Deep Water', duration: '9 min', summary: 'How warm ocean currents melt ice shelves from underneath.' },
      { title: 'Ice Core Science: Trapped Atmospheric Bubbles', duration: '10 min', summary: 'How scientists extract ancient air to reconstruct greenhouse gas levels over 800,000 years.' },
      { title: 'Geodesy & Satellite Radar Interferometry', duration: '6 min', summary: 'Using satellites and GPS to measure ice velocity in millimeters per year.' }
    ],
    quiz: [
      {
        question: 'Why are ice shelves critical to global sea-level rise even though they are already floating on water?',
        options: [
          'Because when floating ice melts it immediately raises sea level by 100 meters.',
          'Because ice shelves act as physical buttresses that hold back grounded ice sheets from sliding rapidly into the ocean.',
          'Because ice shelves produce fresh oxygen for marine ecosystems.',
          'Because ice shelves keep penguins from swimming into the Southern Ocean.'
        ],
        correctIndex: 1,
        explanation: 'Correct! While melting of floating ice itself does not directly raise sea level significantly (Archimedes’ principle), removing the ice shelf unplugs the bottleneck, allowing inland grounded glaciers to accelerate into the ocean, which causes major sea-level rise.'
      },
      {
        question: 'What do tiny gas bubbles trapped inside polar ice cores represent?',
        options: [
          'Volcanic ash from ancient eruptions.',
          'Direct pristine samples of Earth’s prehistoric atmosphere.',
          'Chemical reactions produced by sub-ice bacteria.',
          'Seawater salt crystals crystallized under high pressure.'
        ],
        correctIndex: 1,
        explanation: 'Correct! As firn compacts into dense glacial ice, ambient air bubbles become sealed off, preserving physical samples of ancient atmospheres that reveal historical CO2 and methane concentrations.'
      }
    ]
  },
  {
    id: 'mod-arctic-teleconnections',
    title: 'Arctic Warming & Indian Monsoon Teleconnections',
    level: 'Advanced',
    topicsCount: 4,
    estimatedTime: '50 mins',
    region: 'Arctic',
    description: 'Advanced climate science exploring Arctic amplification, Rossby planetary waves, and the teleconnections linking Barents-Kara sea-ice retreat with Indian Southwest Monsoon variability.',
    iconName: 'Waves',
    lessons: [
      { title: 'Arctic Amplification: Feedback Loops in the High North', duration: '12 min', summary: 'Why the Arctic is warming nearly four times faster than the global planetary average.' },
      { title: 'Atmospheric Jet Stream Meandering & Planetary Waves', duration: '14 min', summary: 'The dynamics of Rossby waves and persistent blocking highs causing extreme weather.' },
      { title: 'The IndARC Deep Ocean Observatory in Kongsfjorden', duration: '12 min', summary: 'Decadal oceanographic monitoring of Atlantic Water intrusions into Arctic fjords.' },
      { title: 'Teleconnections to India: Rain, Drought, and Upper Tropospheric Winds', duration: '12 min', summary: 'How Arctic sea-ice loss modulates mid-latitude pressure and Indian monsoon rainfall patterns.' }
    ],
    quiz: [
      {
        question: 'What is "Arctic Amplification"?',
        options: [
          'The amplification of radio signals near the North Magnetic Pole.',
          'The phenomenon where the Arctic warms at more than double the global rate due to positive climate feedbacks like ice-albedo feedback.',
          'The acoustic reverberation of whale songs in icy fjords.',
          'The increase in tectonic earthquakes under the Arctic Ocean.'
        ],
        correctIndex: 1,
        explanation: 'Correct! Arctic Amplification refers to the accelerated warming of northern polar latitudes relative to the rest of the planet, driven by loss of sea ice, increased ocean heat absorption, and atmospheric heat transport.'
      },
      {
        question: 'Where is India’s autonomous underwater moored observatory "IndARC" deployed?',
        options: [
          'Schirmacher Oasis, Antarctica',
          'Kongsfjorden Fjord, Svalbard (Arctic)',
          'Prydz Bay, Southern Ocean',
          'Chandra Basin, Western Himalayas'
        ],
        correctIndex: 1,
        explanation: 'Correct! IndARC is deployed at approximately 192 m water depth in Kongsfjorden, Svalbard, monitoring Atlantic Water inflows into the Arctic.'
      }
    ]
  },
  {
    id: 'mod-himalayan-cryo',
    title: 'Himalayan Glaciology & The Third Pole Water Security',
    level: 'Intermediate',
    topicsCount: 4,
    estimatedTime: '40 mins',
    region: 'Himalaya',
    description: 'Field glaciology at Himansh station, benchmark glacier monitoring in the Chandra-Bhaga basin, debris cover dynamics, and glacial lake outburst flood hazards.',
    iconName: 'Activity',
    lessons: [
      { title: 'The "Third Pole": Geography of Asian Water Towers', duration: '10 min', summary: 'How the Hindu Kush-Himalayan cryosphere feeds ten major river basins supporting 1.9 billion people.' },
      { title: 'Measuring Glacier Mass Balance at Himansh Station', duration: '10 min', summary: 'Ablation stakes, snow pits, and geodetic methods used by NCPOR glaciologists in Spiti Valley.' },
      { title: 'Debris Cover vs. Clean Ice: Melt Dynamics', duration: '10 min', summary: 'Why thin debris enhances melting while thick rocky mantles insulate ice.' },
      { title: 'Glacial Lake Outburst Floods (GLOFs) & Disaster Mitigation', duration: '10 min', summary: 'Monitoring expanding proglacial lakes with satellite radar to safeguard downstream valleys.' }
    ],
    quiz: [
      {
        question: 'What role does thick debris cover (>0.5 m) play on the surface of a Himalayan glacier?',
        options: [
          'It accelerates melting by absorbing more solar radiation.',
          'It insulates the underlying ice, slowing down melting rates.',
          'It causes the glacier to turn into an active volcano.',
          'It makes the ice flow backwards up the mountain.'
        ],
        correctIndex: 1,
        explanation: 'Correct! While very thin layers of dust or soot accelerate melt by darkening the surface, thick debris mantles (>0.5 m) act as an insulating blanket, substantially retarding solar heat conduction to the ice.'
      }
    ]
  }
];
