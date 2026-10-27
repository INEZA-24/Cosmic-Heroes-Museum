# Museum Mission Source Pack — Research Milestone

**Research date:** October 27, 2026  
**Status:** Source-verified research; NOT application code.  
**Goal:** Establish credible data for six proposed exhibits and a wider Solar System archive.

## Coordinate policy

- Coordinates are *not* universal between celestial bodies. Store the body, latitude/longitude convention, reference frame where known, source and whether a coordinate is an exact artifact/site point or approximate region.
- A rover's **landing** and **final resting** points are different. Do not attach a final-state label to its landing coordinates.
- An orbiter or flyby spacecraft is not a stationary surface marker. Use an encounter/orbit representation, not a fictitious surface point.
- Use approximate coordinates only with an approximate/region tag, even when the map dot looks precise.

## Proposed six Heroes of Steel

### Moon

**1. Surveyor 3 — robotic lander**
- Destination/site: Oceanus Procellarum, Moon.
- NASA historical listing: **3.01° S, 336.66° E** (equivalent to approximately **23.34° W**). Approximate landing site, not a high-precision equipment coordinate.
- Story angle: Studying lunar terrain before crewed lunar landings.
- Source: https://nssdc.gsfc.nasa.gov/planetary/lunar/surveyor.html
- Assets to collect: lunar surface/lander photographs, engineering imagery and Apollo 12 revisit photographs.
- Check coordinate convention before using in a production 3D renderer.

**2. Apollo 15 — Lunar Roving Vehicle**
- Destination/site: Hadley–Apennine region, Moon.
- NASA coordinate for the **Apollo 15 Lunar Module**, **not the rover's parking spot**: **26.13239° N, 3.63330° E**. Use as **Apollo 15 mission landing-site marker only**.
- Story angle: Human exploration range and vehicle mobility in lunar gravity.
- Primary coordinate source: https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html
- Apollo landing context: https://nssdc.gsfc.nasa.gov/planetary/lunar/apolloland.html
- TODO: verify rover's own final parking location before adding a separate rover marker.

### Mars

**3. Mars Pathfinder — Sojourner**
- Destination/site: Ares Vallis, Mars.
- NASA historical project record: **19.33° N, 33.55° W** (326.45° E) as a **lander-site approximation**; do not present this as Sojourner's precise final location.
- Sources: https://nssdc.gsfc.nasa.gov/planetary/mesur.html and https://science.nasa.gov/resource/mars-pathfinder-landing-site/
- Important: historical NASA publications cite differing values/reference conventions; a 2026 NASA technical memorandum gives planetocentric **19.07° N, 326.48° E** for the lander. Do not silently mix these coordinate systems. Source: https://ntrs.nasa.gov/api/citations/20260002020/downloads/NASA-TM20260002020.pdf
- Story angle: First rover successfully operating on Mars, demonstrating mobile scientific exploration.
- Gallery: Pathfinder panorama, rover in action, route diagrams and engineering images.

**4. Opportunity — Mars Exploration Rover B**
- Destination/site: Mars, from Eagle Crater landing site to **Perseverance Valley, Endeavour Crater rim** (final resting location).
- **Do not use landing coordinates as a final-location marker.** For initial map, use a labeled broad geographic site pending verified final-point coordinates.
- Sources: https://science.nasa.gov/mission/mer-opportunity/ and https://science.nasa.gov/photojournal/opportunitys-final-traverse-map/
- Legacy Gallery: https://science.nasa.gov/resource/opportunity-rovers-final-mars-images/ (final panorama; look for original/true-color variants).
- 3D: https://science.nasa.gov/resource/spirit-and-opportunity-rover-3d-model/ (NASA glTF and USDZ model).
- Story angle: A 90-sol planned mission that operated for nearly 15 years; solar power, geology and the final dust storm.

**5. InSight — Mars lander**
- Destination/site: Elysium Planitia, Mars.
- NASA describes the site as centered approximately at **4.5° N, 135.9° E**. **This is a regional landing-site value, not a verified precise landed-object coordinate**.
- Sources: https://science.nasa.gov/mission/insight/ and https://science.nasa.gov/resource/insights-landing-site-elysium-planitia/
- 3D model: https://science.nasa.gov/resource/insight-3d-model/
- Story angle: Seismology and discovering the interior structure of Mars.

### Deep Space

**6. Pioneer 10 — deep-space probe (provisional selection)**
- Category: Jupiter flyby and deep-space escape trajectory. **No static surface marker on Jupiter.**
- NASA original GLB 3D model, approximately 1.95 MB: https://science.nasa.gov/3d-resources/pioneer/
- Story angle: Early exploration of the outer Solar System and a mission that has stopped communicating.
- Map representation: Jupiter encounter and then an outward path; trajectory is conceptual unless sourced ephemerides are used.
- Story facts, historical images and precise itinerary still require NASA mission-source review.
- This is a proposed replacement for the Apollo 11 Eagle exhibit to provide deep-space coverage; confirm with the team before locking the six.

## Additional archive-only mission sites

- Apollo 11 Lunar Module at 0.67416° N, 23.47314° E, **Moon/DE421** — https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_sites.html
- Apollo 16/17 landing sites, as listed in NASA Apollo coordinate archive above.
- Viking 1/2, Spirit and other Mars missions: research verified coordinate reference frames before adding pins.
- For Jupiter/Saturn flybys, use mission encounter cards, not surface landing dots.

## Content & gallery checklist per exhibit

- Mission goal and key verified dates
- Equipment description and scientific instruments
- Historical events, notable results, final contact and present status
- Correct representation of where the machine is, or is *not*
- 7-chapter narrative: Meet / Why / Engineering / Journey / Discovery / Fate / Legacy
- At least 3 sourced visual assets with caption, photographer/organization credit, media type (photo/illustration/diagram), original URL and reuse notes
- 3D model only when available, traced to a trusted source

## Important validation constraints

- NASA source links are references, **not automatically approved local media downloads**.
- Do not use NASA insignia in museum branding or suggest NASA endorses the app.
- Curate only authentic mission material and clearly distinguish artist illustrations.
- Before implementing the planet map, choose and document one coordinate convention per dataset and check marker placement against NASA maps.
- Check official Space Apps challenge statement and build-window rules before implementing the hackathon entry.

## Definition of research-ready

This pack is ready for team review when every listed URL is accessible and the source is relevant. Geographic coordinates remain qualified by stated limits, and the team must resolve TODOs before production map integration.
