/** Historical written snippets for the guided overview only.
 * Spoken narration is one uploaded MP3 per mission, mapped in audioTracks.ts.
 * Do not use these excerpts for automated speech synthesis.
 */
export interface MissionNarration {
  name: string;
  snapshot: [string,string,string];
  milestone: {date:string;title:string;text:string};
  opening: string;
  model: string;
  engineering: string;
  discoveries: string;
  chapters: [string,string,string];
  source: string;
}
export const missionNarrations: Record<string,MissionNarration> = {
  "surveyor-3": {
    "name": "Surveyor 3",
    "snapshot": [
      "Before people walked on the Moon, one enormous question remained. Would a spacecraft stand on the dusty surface, or sink into it?",
      "In 1967, Surveyor 3 bounced twice before landing safely. From Earth, engineers commanded its mechanical scoop to dig and test the lunar soil.",
      "Two years later, Apollo 12 astronauts actually walked up to this silent robot. Its extraordinary story starts with a scoop, a camera, and a second visit."
    ],
    "milestone": {
      "date": "November 19, 1969",
      "title": "Astronauts visit an old robot",
      "text": "Apollo 12 astronauts Pete Conrad and Alan Bean reached Surveyor 3 on the Moon and returned pieces of its camera and sampling equipment to Earth. It was an extraordinary encounter between two generations of spacecraft."
    },
    "opening": "Welcome to the Moon, where a small stationary lander helped answer a question that mattered to every Apollo astronaut: could a spacecraft touch down safely? Surveyor 3 photographed the ground, dug into the soil and, years later, received two very unexpected visitors.",
    "model": "We do not yet have a verified three-dimensional Surveyor 3 model. Instead, look closely at the real mission photographs. Find the three landing legs, the television camera and the robotic arm with its scoop. Each piece had a specific job on the Moon.",
    "engineering": "Surveyor 3 was a working robot, not simply a camera. Its three legs steadied the lander. Its adjustable television camera showed engineers what it was doing, and the robotic scoop tested the strength and texture of lunar soil using commands sent from Earth.",
    "discoveries": "Surveyor 3 helped show that lunar soil could support a lander. It dug trenches, pressed against the surface and sent thousands of images home. These findings strengthened the knowledge engineers needed for future crewed Moon landings.",
    "chapters": [
      "Imagine planning to land people on a world you have never touched. Engineers worried that the Moon's fine dust might be too soft to hold a spacecraft. Surveyor 3 was sent ahead to test the surface and show what it really looked like.",
      "After bouncing during its descent, Surveyor 3 settled safely into the Ocean of Storms. It then used a robotic scoop to dig trenches and test the ground. Every movement was commanded from Earth, across the distance between our planet and the Moon.",
      "The robot's story did not end when it stopped transmitting. In November 1969, Apollo 12 astronauts walked over to Surveyor 3 and removed parts for study. Scientists could now compare a spacecraft's condition before and after years on the lunar surface."
    ],
    "source": "https://science.nasa.gov/mission/surveyor-3/"
  },
  "apollo-15-lrv": {
    "name": "Apollo 15 Lunar Roving Vehicle",
    "snapshot": [
      "What if the Moon were more than a place to land? What if astronauts could drive across it?",
      "In 1971, Apollo 15 carried the first lunar rover to the surface aboard the Falcon lander. David Scott and James Irwin explored farther than they could on foot.",
      "One discovery, a rock from the Moon's ancient crust, helped scientists investigate its earliest history. Come closer and see how the rover made that possible."
    ],
    "milestone": {
      "date": "August 1, 1971",
      "title": "The Genesis Rock discovery",
      "text": "Apollo 15 astronauts collected the rock nicknamed Genesis Rock, a sample of the Moon's ancient crust. The rover enabled a wider scientific search across the Hadley–Apennine terrain."
    },
    "opening": "Here at Apollo 15, the story is about motion and discovery. Falcon landed the astronauts and the folded Lunar Roving Vehicle on the Moon. Once deployed, the electric rover became a scientific field vehicle, taking its crew across a remarkable landscape.",
    "model": "Rotate the Lunar Roving Vehicle and notice its four wheels, lightweight frame, seats and equipment mounts. It was not designed for roads or fuel stops. Then examine the Lunar Module design reference to see the type of spacecraft that brought the astronauts down.",
    "engineering": "The lunar rover was a compact electric vehicle built to fold into the Lunar Module and unfold on the Moon. Its wheels were engineered for loose soil, and its batteries powered long drives. Every kilogram mattered on a journey from Earth to another world.",
    "discoveries": "The rover enabled astronauts to explore more geological sites, collect diverse samples and investigate the Moon's history. The Genesis Rock was especially exciting: a piece of the ancient lunar crust that helped scientists understand how the Moon formed and changed.",
    "chapters": [
      "Apollo 15 was not only about landing. NASA wanted astronauts to travel greater distances and do more field science than earlier crews. That ambition required a new machine: a small vehicle that could survive launch and work on the Moon.",
      "Falcon carried the astronauts safely to the lunar surface. There, they unfolded their electric rover and set off across the Hadley–Apennine region. With a vehicle to carry tools and samples, they could investigate landscapes beyond a short walk from their lander.",
      "During their explorations, the astronauts found a pale rock that became known as Genesis Rock. Its mineral makeup offered clues about the Moon's earliest crust. The rover had helped turn a landing site into a much larger scientific expedition."
    ],
    "source": "https://science.nasa.gov/solar-system/moon/genesis-rock/"
  },
  "pioneer-10": {
    "name": "Pioneer 10",
    "snapshot": [
      "Beyond Mars lay the asteroid belt and Jupiter, a giant planet no spacecraft had explored up close.",
      "Launched in 1972, Pioneer 10 crossed the asteroid belt and approached Jupiter in 1973, returning precious pictures and measurements of its dangerous radiation environment.",
      "Its journey opened a path for the outer-planet explorers that followed. Look closer at the machine that went first."
    ],
    "milestone": {
      "date": "December 4, 1973",
      "title": "Humanity's first close encounter with Jupiter",
      "text": "Pioneer 10 flew past Jupiter and sent back the first close-up observations of the giant planet. Its measurements of Jupiter's intense radiation belts helped engineers plan future deep-space missions."
    },
    "opening": "This exhibit takes us past the worlds humans could visit and into deep space. Pioneer 10 was built to survive a journey no previous spacecraft had completed. It carried instruments and a large antenna to investigate Jupiter and send discoveries home.",
    "model": "Look at Pioneer 10's large dish antenna and the long booms holding its instruments away from the spacecraft body. A radioisotope power source supplied electricity far from the Sun. Its design reveals the engineering challenges of distant exploration.",
    "engineering": "Unlike a solar-powered vehicle near Earth, Pioneer 10 used nuclear electrical power for its distant flight. Its antenna had to send weak radio signals across immense distances. Long instrument booms helped keep sensitive measurements away from interference generated by the spacecraft.",
    "discoveries": "Pioneer 10 helped reveal Jupiter's radiation environment, magnetic field and atmosphere from close range. Its measurements were vital for planning later visits to the outer planets. The mission showed that crossing the asteroid belt and reaching Jupiter were possible.",
    "chapters": [
      "In the early 1970s, the region beyond Mars was largely unknown to spacecraft. Engineers had to prepare Pioneer 10 to cross the asteroid belt and survive near Jupiter. That meant designing a machine that could operate far from sunlight and human hands.",
      "The spacecraft carried a large communication antenna and instruments for measuring radiation, magnetic fields and particles. As it approached Jupiter, its observations revealed a much more challenging environment than had been seen from Earth.",
      "After its historic Jupiter encounter, Pioneer 10 continued outward. Its achievement was not just a set of photographs; it was a demonstration that robotic exploration could reach the giant planets and travel toward the outer reaches of the Solar System."
    ],
    "source": "https://science.nasa.gov/mission/pioneer-10/"
  },
  "viking-1": {
    "name": "Viking 1",
    "snapshot": [
      "Imagine sending a laboratory all the way to Mars, then asking it to land and investigate the soil.",
      "Viking 1 touched down in 1976 and began sending back detailed views of the Red Planet. Its robotic arm delivered soil to experiments designed to investigate possible signs of life.",
      "The results raised new questions rather than proving life existed. Discover why that uncertainty matters."
    ],
    "milestone": {
      "date": "July 20, 1976",
      "title": "A lasting laboratory on Mars",
      "text": "Viking 1 made the first fully successful, sustained landing on Mars, with cameras and instruments operating from the surface. Its biology experiments began a scientific debate that did not establish the presence of life."
    },
    "opening": "Welcome to the laboratory on Mars. Viking 1 arrived with cameras, weather instruments, a robotic sampling arm and experiments that probed the possibility of life. Its work helped define the scientific questions that later Mars missions would pursue.",
    "model": "Examine the three-legged Viking lander. Its body holds instruments and antennas, while the sampling arm collected soil for onboard experiments. Imagine designing a machine that must land and run a laboratory millions of kilometers away without a human technician.",
    "engineering": "Viking 1 used a protective heat shield, a parachute and retrorockets to make its descent. On the surface, its robotic arm collected soil. Cameras, weather sensors and laboratory instruments made it possible to examine Mars from one fixed location over an extended mission.",
    "discoveries": "Viking 1 photographed the Martian landscape and measured its cold, thin atmosphere. It tested soil samples for signs of biological activity, but the results did not confirm life. It helped scientists understand what future missions should look for and how to investigate it.",
    "chapters": [
      "For years, Mars was a distant red point seen through telescopes. Viking 1 changed that in 1976 when its lander touched down and began working on the surface. An orbiter above Mars helped survey the planet while the lander studied one place in extraordinary detail.",
      "Viking's robotic arm reached out to collect Martian soil and placed samples into experiments. Researchers searched for chemical activity that might offer clues about life. Some results were puzzling, but the mission did not demonstrate that life was present.",
      "Viking 1 kept studying Mars far beyond its original planned duration. Its photographs, weather readings and soil studies helped future explorers design better questions. Sometimes an important scientific mission does not deliver one final answer; it opens an entire field of research."
    ],
    "source": "https://science.nasa.gov/mission/viking-1/"
  },
  "sojourner": {
    "name": "Sojourner",
    "snapshot": [
      "What if a robot could leave its lander and explore Mars on six little wheels?",
      "In 1997, Sojourner rolled onto Martian soil and approached rocks named Barnacle Bill and Yogi. Its instruments studied the chemistry of this unfamiliar landscape.",
      "The rover proved that a small moving robot could become a planetary scientist. See what the next generation learned from it."
    ],
    "milestone": {
      "date": "July 5, 1997",
      "title": "The first successful rover drive on Mars",
      "text": "Sojourner rolled away from the Mars Pathfinder lander and began the first successful wheeled exploration of the Martian surface. Its small size did not limit the scale of its achievement."
    },
    "opening": "Meet a small robot that changed Mars exploration forever. Sojourner was designed as a technology demonstration, but it became a tiny field geologist, driving to nearby rocks and sending information back through the Mars Pathfinder lander.",
    "model": "Inspect Sojourner's six wheels and flexible rocker-bogie suspension. The unusual wheel arrangement helped the rover climb over small obstacles. Its cameras and rock-analysis instrument gave engineers a way to make careful scientific measurements on the move.",
    "engineering": "The six-wheel rocker-bogie suspension helped Sojourner move over uneven Martian ground. Cameras and proximity sensors supported navigation, while the rover's rock-analysis instrument measured the composition of nearby targets. Everything had to fit in a very small, lightweight vehicle.",
    "discoveries": "Sojourner examined rocks including Barnacle Bill and Yogi, returning chemical measurements and close views of the surface. Its greatest technical discovery was practical: a wheeled robot could navigate another planet and carry out useful science beyond a stationary lander.",
    "chapters": [
      "Mars Pathfinder reached Mars in 1997 using a landing system cushioned by airbags. Inside was a small rover named Sojourner. The rover then drove down a ramp and became the first successful wheeled explorer to move across the Red Planet.",
      "Sojourner was not a fast-moving vehicle. It approached rocks carefully, one small journey at a time. Targets such as Barnacle Bill and Yogi became famous as the rover examined their chemistry and helped scientists study the Martian landscape.",
      "The mission demonstrated that wheels, cameras and clever suspension could make mobile science practical on Mars. Later rovers became bigger and more capable, but Sojourner helped show engineers how to begin."
    ],
    "source": "https://science.nasa.gov/mission/mars-pathfinder/"
  },
  "cassini-huygens": {
    "name": "Cassini–Huygens",
    "snapshot": [
      "Saturn's rings are spectacular, but its moons hide discoveries of their own.",
      "Cassini orbited Saturn while Huygens descended through the thick atmosphere of Titan, landing there in 2005. Cassini also uncovered water-rich jets erupting from the icy moon Enceladus.",
      "From a distant moon's surface to a world spraying ice into space, the Saturn system held astonishing surprises."
    ],
    "milestone": {
      "date": "January 14, 2005",
      "title": "Huygens lands on Titan",
      "text": "The Huygens probe descended through Titan's atmosphere and reached its surface, becoming the first spacecraft to land on a world in the outer Solar System. Cassini relayed its data back to Earth."
    },
    "opening": "Saturn is more than a beautiful ringed planet. Cassini and Huygens explored its moons, atmosphere and icy surroundings. One part of the mission became an orbiter; the other became the first spacecraft to land in the distant outer Solar System.",
    "model": "Examine Cassini's instruments, antennas and spacecraft body. Then imagine the separate Huygens probe, released to fall through Titan's atmosphere. This mission used two very different robotic explorers, working together across an immense distance.",
    "engineering": "Cassini used a large antenna, scientific instruments and long-lived power systems to work at Saturn. Huygens carried a heat shield and parachutes for its descent into Titan's thick atmosphere. The two spacecraft were designed to exchange scientific data during this historic encounter.",
    "discoveries": "Huygens gave scientists their first views from Titan's surface. Cassini revealed details of Saturn's rings and weather and found jets of water-rich material rising from Enceladus. Together, they transformed the search for environments that might support life beyond Earth.",
    "chapters": [
      "Cassini and Huygens set out for Saturn in 1997. Years later, Cassini entered orbit around the giant planet, ready to study its rings and diverse moons. The mission would become a long exploration of an entire planetary system.",
      "Huygens separated from Cassini and descended toward Titan in January 2005. Its parachutes slowed the probe as instruments studied the atmosphere. After it landed, its observations offered humanity an unprecedented view of a moon far beyond Mars.",
      "Cassini continued exploring Saturn and made extraordinary observations of Enceladus, where icy jets vent material into space. In 2017, the orbiter ended its mission by entering Saturn's atmosphere, protecting potentially habitable moons from accidental contamination."
    ],
    "source": "https://science.nasa.gov/mission/cassini/"
  },
  "opportunity": {
    "name": "Opportunity",
    "snapshot": [
      "A rover designed for ninety Martian days began a journey that lasted nearly fifteen years.",
      "Opportunity landed on Mars in 2004 and found tiny mineral spheres nicknamed blueberries. They helped reveal that liquid water had shaped the planet's ancient rocks.",
      "It kept driving for more than forty-five kilometers. Discover how a small rover became a legend of endurance."
    ],
    "milestone": {
      "date": "Early 2004",
      "title": "The mysterious Martian blueberries",
      "text": "At Meridiani Planum, Opportunity investigated tiny, rounded hematite-rich spheres nicknamed blueberries. They became powerful evidence that liquid water had altered the rocks of ancient Mars."
    },
    "opening": "Opportunity was a robotic geologist with a mission to investigate ancient Martian water. It was built for ninety sols, yet continued operating for almost fifteen years, collecting evidence from rocks, craters and landscapes across Mars.",
    "model": "Inspect Opportunity's six wheels, camera mast, solar panels and robotic arm. The arm carried instruments for examining rocks up close. The rover needed to balance careful science, battery power and navigation on a changing Martian surface.",
    "engineering": "Opportunity's six wheels supported slow, careful drives across dusty terrain. Solar panels powered the spacecraft, a camera mast surveyed its surroundings, and instruments on the robotic arm inspected rocks. Engineers repeatedly adjusted their plans to keep the rover working through mechanical problems and dust.",
    "discoveries": "Opportunity found hematite-rich spheres and minerals that revealed the influence of ancient water. As it explored more terrain, its measurements helped reconstruct environments that may once have been suitable for microscopic life. Its lengthy mission also set remarkable distance records.",
    "chapters": [
      "Opportunity arrived on Mars in 2004 and landed inside a small crater. It was a lucky destination: exposed bedrock was visible almost immediately. The rover began studying the layers and minerals for signs of ancient water.",
      "Scientists noticed small round spheres scattered across the ground, nicknamed blueberries. Their mineral composition pointed to a history involving water. Opportunity then traveled to other craters and searched for more pieces of the Martian climate puzzle.",
      "The rover outlived its original plan by many years. It traveled more than forty-five kilometers before a major dust storm cut off communication in 2018. Opportunity's long journey showed what patient engineering and scientific curiosity could achieve."
    ],
    "source": "https://science.nasa.gov/mission/mer-opportunity/"
  },
  "insight": {
    "name": "InSight",
    "snapshot": [
      "Most Mars missions looked at the surface. InSight tried to listen beneath it.",
      "The lander placed a sensitive seismometer on Mars and detected marsquakes—vibrations traveling through the planet. Their patterns offered clues to the layers hidden underground.",
      "Imagine learning about a planet's core without drilling all the way there. Explore the machine that made Mars speak through science."
    ],
    "milestone": {
      "date": "April 6, 2019",
      "title": "The first likely marsquake",
      "text": "InSight recorded a seismic signal identified as the first likely marsquake detected on another planet. Scientists used this and many later vibrations to investigate Mars's interior. The vibrations were not directly audible to human ears."
    },
    "opening": "InSight is the quiet explorer of our museum. Instead of driving, it stayed in one place on Mars and used a sensitive seismometer to study shaking beneath the surface. It helped researchers investigate how a rocky planet is built from the inside.",
    "model": "Rotate the InSight lander to examine its solar arrays, robotic arm and instrument equipment. The arm deployed a seismometer onto the ground. From there, the instrument could detect vibrations too subtle for a person standing nearby to feel.",
    "engineering": "InSight's robotic arm placed its seismometer on the Martian surface. A protective cover helped shield it from wind and temperature changes. The sensitive equipment recorded tiny motions, while solar panels supplied power through changing conditions on Mars.",
    "discoveries": "InSight detected marsquakes and studied seismic waves passing through the planet. Those vibrations revealed information about the crust, mantle and core of Mars. Its measurements brought scientists closer to understanding how rocky planets form and change over time.",
    "chapters": [
      "InSight landed on Mars in 2018 with a different mission from the rovers. It would not drive toward new rocks. Instead, it would stay still and listen carefully to movements in the ground.",
      "Using its robotic arm, InSight placed a sensitive seismometer on the surface. The instrument detected faint vibrations from inside Mars. The first likely marsquake was recorded in April 2019, opening a new way to study the planet.",
      "As more seismic signals arrived, scientists began reconstructing the layers beneath the red surface. The data provided clues to Mars's crust and core without sending a drill deep into the planet. Quiet measurements could reveal a hidden world."
    ],
    "source": "https://science.nasa.gov/mission/insight/"
  }
};
