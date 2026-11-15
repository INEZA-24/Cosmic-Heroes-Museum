/**
 * Build an independent, credited Moon/Mars globe pair from NASA's public Trek
 * WMTS mosaics. This code is original to Cosmic Heroes of Steel Museum.
 * NASA Trek service sources were researched, not copied from competitor code.
 *
 * Zoom 2 = eight columns x four rows of 256px tiles = a 2048x1024
 * equirectangular map; Three.js wraps this around a spherical mesh.
 *
 * If a live NASA tile source is temporarily unavailable we fall back to
 * Solar System Scope's CC BY 4.0 visual reconstructions, with correct
 * provenance recorded for the running museum.
 */
import sharp from 'sharp';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';

const outDir = new URL('../public/assets/nasa-maps/', import.meta.url);
const worlds = {
  moon: {
    name: 'Moon · LRO LROC WAC global mosaic',
    tileRoot: 'https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303ppd_v02/1.0.0/default/default028mm',
    sourceUrl: 'https://trek.nasa.gov/moon/',
    credit: 'NASA/GSFC/Arizona State University · LROC · JPL Moon Trek',
    fallback: 'https://raw.githubusercontent.com/Sanghel/solar-system-3d/47c8bbc6b63f4c6c2310911238c2c4b6bff6d20b/public/textures/satellites/moon.jpg',
  },
  mars: {
    name: 'Mars · Viking MDIM 2.1 global color mosaic',
    tileRoot: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0/default/default028mm',
    sourceUrl: 'https://trek.nasa.gov/mars/',
    credit: 'NASA/JPL · Viking VIS · JPL Mars Trek',
    fallback: 'https://raw.githubusercontent.com/Sanghel/solar-system-3d/47c8bbc6b63f4c6c2310911238c2c4b6bff6d20b/public/textures/mars.jpg',
  },
};
const concurrency = 8;

async function requestImage(url, timeout = 14000) {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeout), headers: { 'User-Agent': 'CosmicHeroesMuseum-NASA-Trek-Mosaic/1.0' } });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

async function buildNasaMosaic(world, config) {
  const tiles = Array.from({ length: 32 }, (_, index) => ({
    row: Math.floor(index / 8), col: index % 8,
  }));
  const output = new Array(tiles.length);
  let next = 0;
  const worker = async () => {
    while (next < tiles.length) {
      const i = next++;
      const tile = tiles[i];
      const url = `${config.tileRoot}/2/${tile.row}/${tile.col}.jpg`;
      let data;
      try { data = await requestImage(url); }
      catch { data = await requestImage(url); }
      const metadata = await sharp(data).metadata();
      if (metadata.width !== 256 || metadata.height !== 256) throw new Error(`Invalid tile size from ${url}`);
      output[i] = { input: data, left: tile.col * 256, top: tile.row * 256 };
    }
  };
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const mosaic = await sharp({ create: { width: 2048, height: 1024, channels: 3, background: '#121212' } })
    .composite(output)
    .webp({ quality: 84, effort: 4 }).toBuffer();
  return {
    bytes: mosaic, source: 'nasa-trek', sourceUrl: config.sourceUrl,
    credit: config.credit, name: config.name,
  };
}

async function prepare(world, config) {
  const dest = new URL(`${world}_2k.webp`, outDir);
  // Build output isn't committed; per-build downloads establish the data lineage.
  try {
    const nasa = await buildNasaMosaic(world, config);
    await writeFile(dest, nasa.bytes);
    console.log(`[NASA Trek] ${world}: ${nasa.bytes.length} bytes, NASA surface mosaic ready`);
    return { world, ...nasa, bytes: undefined };
  } catch (error) {
    console.warn(`[NASA Trek] ${world}: tile service unavailable (${error.message}). Trying credited 2K illustration fallback.`);
    try {
      const bytes = await requestImage(config.fallback);
      const image = sharp(bytes);
      const meta = await image.metadata();
      if (meta.width < 1024 || meta.height < 512) throw new Error('Insufficient image resolution');
      const output = await image.resize(2048, 1024).webp({ quality: 83, effort: 4 }).toBuffer();
      await writeFile(dest, output);
      return {
        world, source: 'solar-system-scope', sourceUrl: 'https://www.solarsystemscope.com/textures/',
        credit: 'Solar System Scope / INOVE · CC BY 4.0', name: 'Educational planetary texture (not NASA mosaic)',
      };
    } catch (otherError) {
      console.warn(`[NASA Trek] ${world}: source unavailable (${otherError.message}); app will show procedural globe instead.`);
      return { world, source: 'procedural', sourceUrl: '', credit: 'Procedural educational illustration' };
    }
  }
}

await mkdir(outDir, { recursive: true });
const results = [];
for (const [world, config] of Object.entries(worlds)) results.push(await prepare(world, config));
await writeFile(new URL('sources.json', outDir), JSON.stringify(Object.fromEntries(results.map(({ world, source, sourceUrl, credit, name }) =>
  [world, { source, sourceUrl, credit, name }])), null, 2));
console.log('[NASA Trek] globe source manifest ready: ' + results.map(r => r.world + '=' + r.source).join(', '));
