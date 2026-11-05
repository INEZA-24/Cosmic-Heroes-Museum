import { Machine, PlanetData, DestinationArea } from './types';

export const machines: Machine[] = [
  {
    id: "surveyor-3",
    name: "Surveyor 3",
    place: "Moon",
    area: "moon",
    kind: "Robotic lunar lander",
    year: "1967",
    summary: "A pioneering robotic lander that examined the lunar surface and returned close-up television images.",
    location: "Ocean of Storms (Oceanus Procellarum)",
    detail: "Surveyor 3 landed in the Ocean of Storms. Apollo 12 astronauts later visited the spacecraft.",
    launchDate: "April 17, 1967",
    landingDate: "April 20, 1967",
    status: "Lunar Surface Artifact · Revisited by Apollo 12 in Nov 1969",
    engineering: [
      "Articulated soil mechanics surface sampler scoop arm extending up to 1.5 meters",
      "Surveyor television camera with 360-degree azimuth and elevation scanning mirror",
      "Three landing legs with crushable honeycomb aluminum footpads and strain gauges",
      "Solid-propellant retro-rocket motor and three throttleable liquid vernier engines"
    ],
    story: [
      {
        title: "The Mission & Human Purpose",
        content: "Before humanity could take 'one giant leap' onto the Moon, NASA engineers needed to answer a critical, terrifying question: would a heavy spacecraft sink into a deep layer of soft lunar dust like quicksand? Surveyor 3 was sent to touch down softly on the Moon, dig into the surface with a mechanical claw, and send back real-time visual proof of the terrain's bearing strength."
      },
      {
        title: "Engineering & The Three Bounces",
        content: "As Surveyor 3 descended into the Ocean of Storms inside a gentle crater, its radar detected highly reflective rocks, causing the vernier descent engines to remain firing after touchdown. The robotic craft bounced three times across the slope before safely settling. Its remote-controlled arm dug four trenches up to 17.5 cm deep, proving the lunar regolith was compact enough to support Apollo astronauts and the Lunar Module."
      },
      {
        title: "The Apollo 12 Human Revisit",
        content: "In November 1969, thirty-one months after Surveyor 3 landed, Apollo 12 astronauts Pete Conrad and Alan Bean executed a pinpoint landing of the Lunar Module Intrepid just 160 meters away. Walking down into the crater, they inspected the machine, took photographs, and removed its television camera and optical tubing to bring them back to Earth. It remains the only robotic probe ever revisited by human explorers on another celestial world."
      }
    ],
    discoveries: [
      "Demonstrated that lunar soil can support 0.7 kg/cm² bearing pressure—verifying the safety of Apollo human landings",
      "Returned 6,315 high-resolution television photographs of the lunar surface and crater walls",
      "Conducted the first mechanical trenching and bearing-strength experiments on extraterrestrial soil",
      "Provided crucial data on long-term solar radiation and micrometeoroid exposure when its parts were recovered by Apollo 12"
    ],
    timeline: [
      { date: "1967-04-17", title: "Launch", desc: "Launched atop an Atlas-Centaur rocket from Cape Canaveral Air Force Station." },
      { date: "1967-04-20", title: "Lunar Touchdown", desc: "Soft-landed inside a crater in Oceanus Procellarum after three gentle bounces." },
      { date: "1967-05-04", title: "Lunar Night", desc: "Completed prime surface television and mechanical trenching operations before sunset." },
      { date: "1969-11-19", title: "Apollo 12 Rendezvous", desc: "Astronauts Pete Conrad and Alan Bean walked to Surveyor 3 and retrieved its camera for return to Earth." }
    ],
    sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/lunar/surveyor.html",
    sourceLabel: "NASA Space Science Data Coordinated Archive — Surveyor 3"
  },
  {
    id: "apollo-15-lrv",
    name: "Apollo 15 Lunar Roving Vehicle",
    place: "Moon",
    area: "moon",
    kind: "Crewed lunar rover",
    year: "1971",
    summary: "The battery-powered rover that extended the range of astronauts exploring the lunar surface.",
    location: "Hadley–Apennine region, Moon",
    detail: "The rover carried astronauts David Scott and James Irwin across the Hadley–Apennine region.",
    launchDate: "July 26, 1971",
    landingDate: "July 30, 1971",
    status: "Parked on Lunar Surface at Hadley Rille (Caddy Site)",
    engineering: [
      "Foldable aluminum chassis designed by Boeing and GM, deployed from the Lunar Module descent stage",
      "Four 0.25-horsepower electric DC brush-type drive motors mounted directly inside each wheel hub",
      "Open-mesh woven zinc-coated steel wire tires with titanium chevron treads for gripping soft regolith",
      "High-gain steerable antenna and Houston-controlled color TV camera that televised Lunar Module lift-off"
    ],
    story: [
      {
        title: "Extending Humanity's Reach",
        content: "On Apollo 11, Neil Armstrong and Buzz Aldrin were restricted to a radius of approximately 60 meters on foot. To perform serious planetary geology, astronauts needed wheels. Apollo 15 brought 'LRV-1'—the first Lunar Roving Vehicle—tucked like origami against the side of the Lunar Module Falcon."
      },
      {
        title: "Driving Along the Precipice of Hadley Rille",
        content: "Astronauts David Scott and James Irwin drove the rover across 27.9 kilometers of dramatic lunar terrain, climbing the slopes of Mount Hadley Delta and parking right at the edge of the 300-meter-deep chasm of Hadley Rille. The rover allowed them to haul heavy core drills, sample bags, and rock tools far beyond the safety radius of walking back."
      },
      {
        title: "Finding the Genesis Rock",
        content: "At Spur Crater, Scott and Irwin spotted a white glimmering rock atop a dark boulder: sample 15415, the famous 'Genesis Rock'. Subsequent laboratory dating on Earth revealed it to be 4.1 billion years old—anorthosite from the Moon's primordial crust, confirming that the early Moon had once been covered in a global magma ocean."
      }
    ],
    discoveries: [
      "Enabled recovery of the 4.1-billion-year-old Genesis Rock (anorthosite sample 15415), unlocking lunar crustal history",
      "Covered 27.9 km across Hadley Rille, returning 77 kg of lunar geologic samples from diverse elevations",
      "Demonstrated electric wheel-motor traction and navigation in 1/6th gravity across craters and slopes up to 26 degrees",
      "Televised the live lift-off of an ascent stage from the Moon back to orbit for the first time in history"
    ],
    timeline: [
      { date: "1971-07-26", title: "Launch", desc: "Apollo 15 launched aboard the mighty Saturn V rocket from Launch Complex 39A." },
      { date: "1971-07-31", title: "First Rover Drive (EVA 1)", desc: "Rover deployed and driven 10.3 km to St. George Crater and Elbow Crater." },
      { date: "1971-08-01", title: "Genesis Rock Discovery (EVA 2)", desc: "Traversed 12.5 km to Mount Hadley Delta; discovered the primordial Genesis Rock." },
      { date: "1971-08-02", title: "Final Traverse & Parking (EVA 3)", desc: "Explored Hadley Rille edge; parked 90 m from the Lunar Module to broadcast lift-off." }
    ],
    sourceUrl: "https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_15_lrv.html",
    sourceLabel: "NASA Space Science Data Coordinated Archive — Apollo 15 LRV"
  },
  {
    id: "sojourner",
    name: "Sojourner",
    place: "Mars",
    area: "mars",
    kind: "Robotic rover",
    year: "1997",
    summary: "The first successful Mars rover, demonstrating mobile robotic exploration on another planet.",
    location: "Ares Vallis, Mars",
    detail: "Sojourner explored the Ares Vallis landing area as part of Mars Pathfinder.",
    launchDate: "December 4, 1996",
    landingDate: "July 4, 1997",
    status: "Mission Complete / Inactive at Ares Vallis (Operated 83 Sols)",
    engineering: [
      "Pioneering 6-wheel rocker-bogie mobility suspension system with independent drive motors",
      "Ultra-compact 10.6 kg flight mass with gallium arsenide solar panel and lithium backup batteries",
      "Alpha Proton X-ray Spectrometer (APXS) mounted on an active deployment mechanism for rock analysis",
      "Dual forward-facing stereo black-and-white cameras and hazard-avoidance laser proximity sensors"
    ],
    story: [
      {
        title: "The Pioneer of Planetary Wheels",
        content: "Named in honor of abolitionist and civil rights pioneer Sojourner Truth, this microwave-sized rover was the first wheeled vehicle ever to drive on another planet. Arriving inside the Mars Pathfinder lander enclosed in airbags, Sojourner drove down a deployment ramp onto the red plains of Ares Vallis on July 5, 1997."
      },
      {
        title: "Analyzing Alien Rocks",
        content: "Navigating autonomously around Martian hazards with laser proximity sensors, Sojourner nuzzled up to famous rocks nicknamed 'Barnacle Bill' and 'Yogi'. It pressed its APXS spectrometer against their surfaces, transmitting the first chemical spectra of rocks on the Martian surface."
      },
      {
        title: "The Legacy of Rocker-Bogie",
        content: "Originally built as a 7-day technology experiment, Sojourner survived 83 Martian days (sols). Its rocker-bogie suspension system proved so brilliant and dependable that it became the foundational chassis design for every subsequent NASA Mars rover: Spirit, Opportunity, Curiosity, and Perseverance."
      }
    ],
    discoveries: [
      "Demonstrated that mobile robotic exploration of planetary surfaces is feasible, reliable, and cost-effective",
      "Conducted 15 chemical analyses of Martian rocks and soils, proving rock 'Barnacle Bill' was rich in silica (andesite)",
      "Found rounded pebbles and conglomerate rocks confirming Ares Vallis was carved by catastrophic liquid water floods",
      "Provided 550 close-up images of Martian rock textures, sand drifts, and wheel interaction with Martian soil"
    ],
    timeline: [
      { date: "1996-12-04", title: "Launch", desc: "Launched atop a Delta II rocket from Cape Canaveral." },
      { date: "1997-07-04", title: "Touchdown at Ares Vallis", desc: "Pathfinder bounced to a halt on Mars cushioned by giant airbags." },
      { date: "1997-07-05", title: "Wheels on Mars", desc: "Sojourner rolled down the lander egress ramps and drove onto Martian soil." },
      { date: "1997-09-27", title: "Final Transmission", desc: "Completed 83 sols of exploration—12 times its planned design life." }
    ],
    sourceUrl: "https://science.nasa.gov/mission/mars-pathfinder/",
    sourceLabel: "NASA Science Mission Directorate — Mars Pathfinder & Sojourner"
  },
  {
    id: "opportunity",
    name: "Opportunity (MER-B)",
    place: "Mars",
    area: "mars",
    kind: "Robotic rover",
    year: "2004",
    summary: "A long-lived Mars rover that studied rocks and evidence of ancient water.",
    location: "Meridiani Planum to Endeavour Crater rim, Mars",
    detail: "Opportunity explored Meridiani Planum and continued operating for more than fourteen years.",
    launchDate: "July 7, 2003",
    landingDate: "January 25, 2004",
    status: "Mission Complete / Inactive in Perseverance Valley (Operated 5,111 Sols)",
    engineering: [
      "185-kilogram scientific laboratory rover equipped with a 5-degree-of-freedom robotic arm",
      "Rock Abrasion Tool (RAT) to grind away weathered outer rock layers and expose fresh interior mineralogy",
      "Panoramic Camera (Pancam), Miniature Thermal Emission Spectrometer (Mini-TES), and Mössbauer Spectrometer",
      "Triple-junction solar cell arrays with seasonal Martian wind cleaning events extending mission life"
    ],
    story: [
      {
        title: "The Hole-in-One Landing",
        content: "Opportunity bounced across Meridiani Planum inside its airbags and rolled right into the 22-meter-wide Eagle Crater—an interplanetary 'hole-in-one'. As its cameras opened, scientists were astonished to see exposed bedrock layers just steps away—the first sedimentary bedrock ever observed on Mars."
      },
      {
        title: "Hematite Blueberries & Ancient Seas",
        content: "Within weeks, Opportunity's microscopic imager revealed millions of tiny spherical mineral concretions dubbed 'blueberries'. Chemical analysis proved they were made of hematite that had precipitated inside standing acidic groundwater, giving humanity the first definitive proof that ancient Mars had been soaked in liquid water."
      },
      {
        title: "A Marathon Across Mars",
        content: "Designed for a 90-sol sprint, Opportunity embarked on an epic 14-year marathon. It climbed into the deep, exposed strata of Victoria Crater, drove across vast rippling sand dunes, and traversed 45.16 kilometers (28 miles) to reach the rim of giant Endeavour Crater before a planet-encircling dust storm darkened its solar panels in June 2018."
      }
    ],
    discoveries: [
      "Discovered hematite 'blueberries' and jarosite mineralogy, proving liquid water once stood on Mars for long periods",
      "Found bright veins of pure gypsum at Endeavour Crater, indicating neutral, pH-balanced ancient water hospitable to life",
      "Set the all-time off-world driving record: 45.16 kilometers (28.06 miles)—surpassing a full marathon distance on Mars",
      "Survived 5,111 Martian sols (nearly 15 Earth years) instead of the 90-sol design baseline, transmitting over 217,000 images"
    ],
    timeline: [
      { date: "2003-07-07", title: "Launch", desc: "Launched atop a Delta II Heavy rocket from Cape Canaveral." },
      { date: "2004-01-25", title: "Landing in Eagle Crater", desc: "Touched down inside Eagle Crater in Meridiani Planum." },
      { date: "2011-08-10", title: "Arrival at Endeavour Crater", desc: "Reached the 22-kilometer-wide Endeavour Crater after a multi-year cross-country drive." },
      { date: "2015-03-24", title: "Marathon Milestone", desc: "Passed the 42.195 km marathon distance mark on the rim of Endeavour Crater." },
      { date: "2018-06-10", title: "The Final Signal", desc: "Transmitted final telemetry before a catastrophic global dust storm blanketed Mars." }
    ],
    sourceUrl: "https://science.nasa.gov/mission/mer-opportunity/",
    sourceLabel: "NASA Science Mission Directorate — Mars Exploration Rover Opportunity"
  },
  {
    id: "insight",
    name: "InSight",
    place: "Mars",
    area: "mars",
    kind: "Robotic lander",
    year: "2018",
    summary: "A stationary lander that studied the deep interior of Mars.",
    location: "Elysium Planitia, Mars",
    detail: "InSight helped reveal the planet's internal structure using seismic and heat-flow measurements.",
    launchDate: "May 5, 2018",
    landingDate: "November 26, 2018",
    status: "Mission Complete / Inactive at Elysium Planitia (Operated 1,440 Sols)",
    engineering: [
      "Ultra-sensitive Seismic Experiment for Interior Structure (SEIS) capable of detecting ground motion smaller than a hydrogen atom",
      "Aerodynamic Wind and Thermal Shield (WTS) placed over SEIS to isolate it from Martian atmospheric winds",
      "Heat Flow and Physical Properties Package (HP3) probe designed to burrow up to 5 meters underground",
      "Twin 2.15-meter diameter deployable solar arrays producing up to 700 watts in clear Martian sunlight"
    ],
    story: [
      {
        title: "Listening to the Martian Heartbeat",
        content: "While earlier missions examined the Martian surface rocks and atmosphere, InSight (Interior Exploration using Seismic Investigations, Geodesy and Heat Transport) was built to take the vital signs of Mars: its pulse (seismology), temperature (heat flow), and reflexes (precision tracking of planetary wobble)."
      },
      {
        title: "Uncovering the Internal Anatomy",
        content: "Touchdown on the smooth basaltic plains of Elysium Planitia allowed InSight's robotic arm to place the SEIS seismometer directly onto Martian soil. Shielded from wind noise, the dome listened to the rumblings of Mars, detecting more than 1,318 distinct marsquakes and meteorite impact reverberations."
      },
      {
        title: "Mapping the Core and Crust",
        content: "By analyzing how seismic waves bounced through the planet, InSight revealed that Mars has a surprisingly large, liquid iron-nickel core with a radius of approximately 1,830 kilometers, a molten silicate mantle, and a crust measuring between 24 and 72 kilometers thick—vital clues to why Mars lost its protective magnetic dynamo."
      }
    ],
    discoveries: [
      "Detected and recorded 1,318 marsquakes, including a magnitude 4.7 monster quake on May 4, 2022 (Sol 1222)",
      "Determined the size and density of the Martian liquid metallic core (radius ~1,830 km) for the first time",
      "Recorded the acoustic thump of space meteoroids slamming into Mars and confirmed the resulting impact craters via satellite",
      "Measured the crustal thickness and discovered seismic evidence that ancient volcanic activity may still linger deep underground"
    ],
    timeline: [
      { date: "2018-05-05", title: "Launch", desc: "Launched aboard an Atlas V-401 rocket from Vandenberg Air Force Base in California." },
      { date: "2018-11-26", title: "Landing on Elysium Planitia", desc: "Executed a flawless supersonic parachute and retro-rocket touchdown." },
      { date: "2018-12-19", title: "Seismometer Deployment", desc: "Robotic arm placed the SEIS instrument on Martian soil—the first seismometer deployed on another planet." },
      { date: "2022-05-04", title: "Record Magnitude 4.7 Marsquake", desc: "SEIS recorded the largest seismic event ever detected on Mars." },
      { date: "2022-12-15", title: "Mission Completion", desc: "Transmitted final weather and seismic data after four years of groundbreaking geophysics." }
    ],
    sourceUrl: "https://science.nasa.gov/mission/insight/",
    sourceLabel: "NASA Science Mission Directorate — InSight Mars Lander"
  },
  {
    id: "pioneer-10",
    name: "Pioneer 10",
    place: "Deep Space",
    area: "deep-space",
    kind: "Space probe",
    year: "1972",
    summary: "The first spacecraft to make a close encounter with Jupiter and continue outward into deep space.",
    location: "Jupiter flyby & Interstellar Escape Trajectory",
    detail: "Pioneer 10 flew past Jupiter in 1973. It did not land on the planet.",
    launchDate: "March 2, 1972",
    landingDate: "December 4, 1973 (Jupiter Flyby)",
    status: "Interstellar Escape Trajectory · En route toward star Aldebaran in Taurus",
    engineering: [
      "Four SNAP-19 Radioisotope Thermoelectric Generators (RTGs) providing nuclear electrical power far from the Sun",
      "2.74-meter diameter parabolic dish antenna aligned toward Earth by spinning the craft at 4.8 rpm",
      "Cosmic ray telescopes, plasma analyzer, magnetometer, and imaging photopolarimeter",
      "Gold-anodized aluminum Pioneer Plaque engraved with symbolic diagrams of humanity, Earth, and the hydrogen atom"
    ],
    story: [
      {
        title: "The First to Brave the Asteroid Belt",
        content: "In 1972, no human machine had ever ventured beyond Mars. Many astronomers feared the Asteroid Belt was an impenetrable barrier of dust and rock fragments that would obliterate any spacecraft attempting to cross it. Pioneer 10 proved them wrong, sailing safely through the belt and opening the outer Solar System for all missions to come."
      },
      {
        title: "The Epic Jupiter Encounter",
        content: "On December 4, 1973, Pioneer 10 swept within 130,000 kilometers of Jupiter's cloud tops at a blistering speed of 132,000 km/h. It survived intense radiation belts ten thousand times stronger than Earth's Van Allen belts, sending back the first close-up photographs of the Great Red Spot and mapping the giant planet's immense magnetic field."
      },
      {
        title: "An Eternal Ambassador to the Stars",
        content: "Accelerated by Jupiter's massive gravity into solar escape trajectory, Pioneer 10 became the first spacecraft to pass beyond the orbits of Saturn, Uranus, and Neptune. Mounted on its antenna struts is the famous Pioneer Plaque, co-designed by Carl Sagan. Carrying this golden message from Earth, Pioneer 10 will drift silently among the stars for billions of years, passing near the star Aldebaran in about two million years."
      }
    ],
    discoveries: [
      "First spacecraft to traverse the Asteroid Belt, demonstrating safe passage for future outer-planet missions",
      "First close-up imaging and discovery that Jupiter is predominantly a fluid planet composed of hydrogen and helium",
      "Mapped Jupiter's magnetosphere, discovering it extends millions of kilometers into interplanetary space",
      "First human craft to cross the orbit of Neptune (June 1983) and begin escaping the Solar System entirely"
    ],
    timeline: [
      { date: "1972-03-02", title: "Launch", desc: "Launched atop Atlas-Centaur as the fastest human-made object at launch." },
      { date: "1972-07-15", title: "Entering the Asteroid Belt", desc: "Began its historic 7-month crossing of the Asteroid Belt without damage." },
      { date: "1973-12-04", title: "Closest Approach to Jupiter", desc: "Flew within 130,000 km of cloud tops, transmitting iconic close-up views of the Great Red Spot." },
      { date: "1983-06-13", title: "Beyond All Planets", desc: "Crossed Neptune's orbit, becoming the first human-built craft to leave the planetary system." },
      { date: "2003-01-23", title: "Final Faint Signal", desc: "Sent its last telemetry packet from a distance of 12.2 billion kilometers (82 AU) from Earth." }
    ],
    sourceUrl: "https://science.nasa.gov/mission/pioneer-10/",
    sourceLabel: "NASA Science Mission Directorate — Pioneer 10 Deep Space"
  }
];

export const destinationNames: Record<DestinationArea, string> = {
  moon: "The Moon",
  mars: "Mars",
  "deep-space": "Deep Space"
};

export const destinationDescriptions: Record<DestinationArea, string> = {
  moon: "Explore the machines that helped humanity reach, touch down, and travel across our celestial satellite.",
  mars: "Meet the robotic explorers, rovers, and geophysics landers that surveyed the Red Planet.",
  "deep-space": "Follow humanity's pioneering probe whose journey carried it beyond the planets into interstellar space."
};

export const planetDescriptions: Record<string, string> = {
  mercury: "The smallest planet, a cratered rocky world racing around the Sun.",
  venus: "A volcanic world wrapped in a dense atmosphere of carbon dioxide and clouds of sulfuric acid.",
  earth: "Our home world: oceans, continents, dynamic atmosphere, and the launchpad for all human space exploration.",
  moon: "Earth's natural satellite, bearing the footprints and left-behind machines of humanity's earliest off-world voyages.",
  mars: "A cold desert world explored by rovers and landers searching for ancient water and planetary history.",
  jupiter: "The largest planet, a gas giant with immense storms including the Great Red Spot.",
  saturn: "A gas giant surrounded by a spectacular system of icy rings.",
  uranus: "An ice giant that rotates on its side, with a faint ring system.",
  neptune: "A distant ice giant with powerful winds and a deep blue atmosphere.",
  pluto: "A distant icy dwarf world with towering glaciers and complex geology at the edge of the Solar System.",
  "deep-space": "Beyond the planetary realm lies deep space, where pioneering probes journey into interstellar horizons."
};

export const planetDataList: PlanetData[] = [
  { name: "Mercury", key: "mercury", radius: 0.38, distance: 7.2, texture: "2k_mercury.jpg", color: 0x9b9188, rotation: 0.0008, axialTilt: 0.0005, roughness: 0.95, metalness: 0.05 },
  { name: "Venus", key: "venus", radius: 0.62, distance: 10.1, texture: "2k_venus_surface.jpg", color: 0xc99b62, rotation: 0.00035, axialTilt: 3.09, roughness: 0.8, metalness: 0.0 },
  { name: "Earth", key: "earth", radius: 0.66, distance: 13.4, texture: "2k_earth_daymap.jpg", color: 0x4e83b9, rotation: 0.0018, clouds: "2k_earth_clouds.jpg", axialTilt: 0.409, roughness: 0.7, metalness: 0.1 },
  { name: "Mars", key: "mars", radius: 0.49, distance: 17.2, texture: "2k_mars.jpg", color: 0xb85e43, rotation: 0.0017, axialTilt: 0.439, roughness: 0.9, metalness: 0.05 },
  { name: "Jupiter", key: "jupiter", radius: 1.48, distance: 24.1, texture: "2k_jupiter.jpg", color: 0xc59a72, rotation: 0.0032, axialTilt: 0.054, roughness: 0.65, metalness: 0.0 },
  { name: "Saturn", key: "saturn", radius: 1.22, distance: 31.4, texture: "2k_saturn.jpg", color: 0xc9ad7d, rotation: 0.0027, rings: true, axialTilt: 0.466, roughness: 0.7, metalness: 0.0 },
  { name: "Uranus", key: "uranus", radius: 0.91, distance: 38.6, texture: "2k_uranus.jpg", color: 0x8fc9d0, rotation: 0.0021, rings: true, axialTilt: 1.706, roughness: 0.6, metalness: 0.0 },
  { name: "Neptune", key: "neptune", radius: 0.88, distance: 45.2, texture: "2k_neptune.jpg", color: 0x416fbd, rotation: 0.0022, axialTilt: 0.494, roughness: 0.6, metalness: 0.0 }
];
