# Moon and Mars mission landing-site globe imagery

The Moon/Mars history section uses **spherical 3D visualization with a 2D
equirectangular texture**, not a digital elevation model or an exact
terrain-relief reconstruction.

## Primary, NASA-backed data (preferred build output)
- **Moon:** NASA/JPL Moon Trek, Lunar Reconnaissance Orbiter (LROC WAC)
  global mosaic v2, layer `LRO_WAC_Mosaic_Global_303ppd_v02`.
  Source: https://trek.nasa.gov/moon/
  Credits: NASA/GSFC/Arizona State University; LROC Team, JPL Trek.
- **Mars:** NASA/JPL Mars Trek, Viking VIS global color mosaic MDIM 2.1,
  layer `Mars_Viking_MDIM21_ClrMosaic_global_232m`.
  Source: https://trek.nasa.gov/mars/
  Credits: NASA/JPL, Viking team, JPL Trek.

The original `scripts/sync-nasa-globes.mjs` script independently requests
64 NASA image tiles at zoom 2 (32 per world), reprojects neither body, and
composites into 2048x1024 WebP maps using Sharp. The documented tile matrix
is equirectangular (plate carrée) covering the full world.

## Fallback imagery and disclosures
If NASA tile services are unavailable during a build, the script uses
Solar System Scope's own licensed 2K maps (CC BY 4.0) from a pinned,
public source mirror. Source and license:
https://www.solarsystemscope.com/textures/
https://creativecommons.org/licenses/by/4.0/

`sources.json` records *which source the actual production build used*.
UI explicitly shows that source, so our website never mislabels fallback
imagery as official NASA data. If neither image source is available, the
existing painted/procedural Moon or Mars texture remains, with a clear label.

## Historical mission site coordinates
`src/data/missionSites.ts` holds independently curated NASA/NSSDCA
coordinates for six missions. Rover markers represent the landing region,
**not** their final parked positions; InSight is the approximate target
landing region. Coordinates are rounded and published reference frames
can differ. These are educational location markers, not precise geodesy.

## Build
`npm run build` (and `npm run dev`) generates the two maps and the
metadata manifest before TypeScript/Vite run. Generated WebPs are ignored
in Git, so no unreviewed binary media enters the repository.

Original dataset facts/code are attributed to NASA, while the user-facing
layout and new globe/timeline UI code are independently authored for
Cosmic Heroes of Steel Museum.
