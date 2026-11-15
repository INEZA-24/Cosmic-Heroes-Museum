# Realistic Planetary Surface Maps

The **Earth, Moon, Mars, Jupiter, Saturn, Mercury, Venus, Uranus, and Neptune**
surfaces are 2K equirectangular textures from **Solar System Scope**, under
**Creative Commons Attribution 4.0 International (CC BY 4.0)**.

- **Creator:** Solar System Scope / INOVE
- **Original download page:** https://www.solarsystemscope.com/textures/
- **License:** https://creativecommons.org/licenses/by/4.0/
- **Exact pinned file mirror:** https://github.com/Sanghel/solar-system-3d/tree/47c8bbc6b63f4c6c2310911238c2c4b6bff6d20b/public/textures
- **Modifications by our museum:** none to JPEG pixel data. Textures are applied to 3D spheres with lighting and a partially transparent, procedurally created Earth cloud layer.
- **Important:** These are **visual reconstructions informed by NASA data**, not scientifically precise/live imagery, and are **not NASA-authored textures**. The source notes that some unmapped regions are artistically filled.

## Building

`npm run dev` and `npm run build` first run
`scripts/sync-planet-textures.mjs` (Node 20+), which downloads the nine maps
into this directory with exact SHA1 Git-blob integrity verification.
The JPEGs are **generated build assets** and are excluded from Git; their
pinned source paths, sizes and hashes are in the script. This avoids external
image requests in the built museum after successful preparation.

If build-time downloads are unavailable, the client tries the same pinned
mirror over HTTPS. If that too fails, **the original self-contained canvas
textures remain visible**, ensuring no blank planets.

For NASA Space Apps submission, list this resource under **Other Data**, not
NASA Data. Cite Solar System Scope under the CC BY 4.0 license.
