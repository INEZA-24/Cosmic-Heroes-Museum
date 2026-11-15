/**
 * Prepare credited planet texture maps as local static assets at build time.
 * Downloads are verified against pinned Git blob SHA1 to detect changed input.
 * Not a runtime API: browsers load /assets/planet-textures/{planet}.jpg.
 * A failed download leaves the safe procedural / CDN fallbacks available.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';

const version = '47c8bbc6b63f4c6c2310911238c2c4b6bff6d20b';
const sourceRoot = `https://raw.githubusercontent.com/Sanghel/solar-system-3d/${version}/public/textures`;
const assets = {
  "earth": {
    "path": "earth.jpg",
    "size": 463087,
    "sha": "6cdcffea631a25e344e4ed68f3028fef1e554870"
  },
  "moon": {
    "path": "satellites/moon.jpg",
    "size": 1053869,
    "sha": "8a1de866732c0ca71d082e7a0c40bd111c9d0f56"
  },
  "mars": {
    "path": "mars.jpg",
    "size": 750547,
    "sha": "b3654a9b2d21c2910c38a0287423862650d54e1f"
  },
  "jupiter": {
    "path": "jupiter.jpg",
    "size": 498976,
    "sha": "21f1951026dc8e539f751ef55b559fa683869c63"
  },
  "saturn": {
    "path": "saturn.jpg",
    "size": 199916,
    "sha": "d8b23dfe7d959aae965be0ece559a25c75651b6b"
  },
  "mercury": {
    "path": "mercury.jpg",
    "size": 872555,
    "sha": "eebaed96c2a7fbae4f3effd97a345ac84e8aca99"
  },
  "venus": {
    "path": "venus.jpg",
    "size": 885075,
    "sha": "a26a410bd6856804a056d7c5c7b7771cc8499328"
  },
  "uranus": {
    "path": "uranus.jpg",
    "size": 77751,
    "sha": "d0abf4c1c95315a3168f5342712a8dfd3357160d"
  },
  "neptune": {
    "path": "neptune.jpg",
    "size": 241580,
    "sha": "30e7ac5540e5afb7d997034f5c51bc44a0d8d321"
  }
};
const outputDir = new URL('../public/assets/planet-textures/', import.meta.url);

const blobSha = bytes => createHash('sha1')
  .update(`blob ${bytes.length}\0`)
  .update(bytes)
  .digest('hex');

await mkdir(outputDir, { recursive: true });

const results = await Promise.all(Object.entries(assets).map(async ([name, spec]) => {
  const file = new URL(`${name}.jpg`, outputDir);
  let tempFile = null;
  try {
    const existing = await readFile(file).catch(() => null);
    if (existing && existing.length === spec.size && blobSha(existing) === spec.sha) {
      return { name, ok: true, cached: true };
    }

    const response = await fetch(`${sourceRoot}/${spec.path}`, {
      signal: AbortSignal.timeout(16000),
      headers: { 'User-Agent': 'CosmicHeroesMuseum-PlanetTextureBuild/1.0' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length !== spec.size || blobSha(bytes) !== spec.sha) {
      throw new Error('Downloaded image failed pinned source integrity check');
    }
    tempFile = new URL(`${name}.jpg.tmp-${process.pid}`, outputDir);
    await writeFile(tempFile, bytes);
    await rename(tempFile, file);
    return { name, ok: true, cached: false };
  } catch (err) {
    if (tempFile) await rm(tempFile, { force: true }).catch(() => {});
    console.warn(`[planet textures] ${name}: ${err.message}; browser will try CDN or procedural fallback`);
    return { name, ok: false };
  }
}));

const done = results.filter(r => r.ok);
console.log(`[planet textures] ${done.length}/${results.length} verified 2K images available locally (${done.filter(r=>r.cached).length} cached)`);
