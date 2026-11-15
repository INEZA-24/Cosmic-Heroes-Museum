import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Moon and Mars explorer has six NASA-attributed landing-region records', () => {
  const sites = readFileSync('src/data/missionSites.ts', 'utf8');
  for (const id of ['surveyor-3', 'apollo-15-lrv', 'viking-1', 'sojourner', 'opportunity', 'insight']) {
    assert.match(sites, new RegExp("machineId: '" + id + "'"));
  }
  for (const year of [1967, 1971, 1976, 1997, 2004, 2018]) assert.match(sites, new RegExp(String(year)));
  assert.match(sites, /final parked position/);
  assert.match(sites, /nssdc.gsfc.nasa.gov/);
  assert.match(sites, /science.nasa.gov/);
});

test('Moon and Mars globes are NASA Trek sourced with honest fallback attribution', () => {
  const script = readFileSync('scripts/sync-nasa-globes.mjs', 'utf8');
  const doc = readFileSync('public/assets/nasa-maps/README.md', 'utf8');
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.match(script, /LRO_WAC_Mosaic_Global_303ppd_v02/);
  assert.match(script, /Mars_Viking_MDIM21_ClrMosaic_global_232m/);
  assert.match(script, /solar-system-scope/);
  assert.match(script, /sources.json/);
  assert.match(doc, /CC BY 4.0/);
  assert.match(packageJson.scripts.prebuild, /sync-nasa-globes/);
});

test('destination view adds the history explorer without removing the machine cards', () => {
  const destination = readFileSync('src/components/DestinationView.tsx', 'utf8');
  const explorer = readFileSync('src/components/PlanetarySiteExplorer.tsx', 'utf8');
  assert.match(destination, /PlanetarySiteExplorer/);
  assert.match(destination, /MuseumMachineCard/);
  assert.match(explorer, /new THREE.WebGLRenderer/);
  assert.match(explorer, /new THREE.SphereGeometry/);
  assert.match(explorer, /onSelectExhibit/);
  assert.match(explorer, /mission-site-year/);
  assert.match(explorer, /NASA/);
  assert.match(explorer, /textured globe/);
});
