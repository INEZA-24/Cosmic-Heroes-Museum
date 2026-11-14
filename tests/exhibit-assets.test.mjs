import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, openSync, readSync, closeSync, statSync } from 'node:fs';

const ids = ['cassini-huygens', 'apollo-15-lrv', 'sojourner', 'opportunity', 'insight', 'pioneer-10'];

test('all six exhibit slide manifests reference image files that exist', () => {
  for (const id of ids) {
    const path = `public/assets/exhibits/${id}/slides.json`;
    assert.ok(existsSync(path), `Missing slideshow: ${id}`);
    const slideshow = JSON.parse(readFileSync(path, 'utf8'));
    assert.ok(Array.isArray(slideshow.items) && slideshow.items.length > 0, `No slides for ${id}`);
    for (const item of slideshow.items) {
      assert.equal(typeof item.src, 'string');
      assert.ok(item.src.startsWith(`/assets/exhibits/${id}/`), `Wrong machine image: ${item.src}`);
      assert.ok(existsSync(`public${item.src.split('?')[0]}`), `Image referenced in slides.json is missing: ${item.src}`);
      assert.equal(typeof item.description, 'string');
    }
    assert.ok(existsSync(`public/assets/models/${id}/.gitkeep`));
  }
});

test('3D viewer uses the static GLB convention and OrbitControls', () => {
  const code = readFileSync('src/components/MachineModelViewer.tsx', 'utf8');
  assert.match(code, /GLTFLoader/);
  assert.match(code, /OrbitControls/);
  assert.match(code, /model\.glb/);
  assert.match(code, /status === 'missing'/);
});

test('each exhibition embeds the 3D viewer without a separate image gallery', () => {
  const exhibit = readFileSync('src/components/ExhibitView.tsx', 'utf8');
  assert.match(exhibit, /<MachineModelViewer/);
  assert.doesNotMatch(exhibit, /<MachineVisualGallery/);
});

test('exhibition navigation retains collection, Moon, Mars and deep space', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  for (const view of ['solar', 'collection', 'destination', 'exhibit']) assert.ok(app.includes("'" + view + "'"));
  const data = readFileSync('src/data.ts', 'utf8');
  for (const id of ids) assert.ok(data.includes('id: "' + id + '"'), `Missing machine: ${id}`);
});

test('Cassini remains at Saturn and the approved emblem is preserved', () => {
  const code = readFileSync('src/data.ts', 'utf8');
  assert.match(code, /id: "cassini-huygens"/);
  assert.match(code, /area: "saturn"/);
  assert.match(code, /id: "surveyor-3"/);
  assert.match(code, /id: "viking-1"/);
  const solar = readFileSync('src/components/SolarSystem.tsx', 'utf8');
  assert.match(solar, /Explore Saturn & Titan/);
  assert.ok(existsSync('public/assets/branding/museum-emblem.svg'));
  const brand = readFileSync('src/components/BrandEmblem.tsx', 'utf8');
  assert.match(brand, /museum-emblem\.svg/);
});

test('all six uploaded models are real GLB 2.0 binary files', () => {
  for (const id of ids) {
    const path = `public/assets/models/${id}/model.glb`;
    assert.ok(existsSync(path), `Missing GLB for ${id}`);
    const fd = openSync(path, 'r');
    const header = Buffer.alloc(12);
    try {
      assert.equal(readSync(fd, header, 0, 12, 0), 12, `Truncated GLB: ${id}`);
    } finally {
      closeSync(fd);
    }
    assert.equal(header.toString('ascii', 0, 4), 'glTF', `Invalid GLB magic: ${id}`);
    assert.equal(header.readUInt32LE(4), 2, `GLB version must be 2: ${id}`);
    assert.equal(header.readUInt32LE(8), statSync(path).size, `Invalid GLB declared length: ${id}`);
  }
});

test('model viewer uses neutral-gray studio lighting and visible download diagnostics', () => {
  const code = readFileSync('src/components/MachineModelViewer.tsx', 'utf8');
  assert.match(code, /RoomEnvironment/);
  assert.match(code, /scene\.background = new THREE\.Color\(0xbac1c8\)/);
  assert.match(code, /Loading 3D model/);
  assert.match(code, /loader\.parseAsync\(/);
  assert.match(code, /response\.body\?\.getReader\(\)/);
  assert.match(code, /setLoadError/);
  const style = readFileSync('src/styles.css', 'utf8');
  assert.match(style, /M7: soft neutral-gray photography studio/);
});

test('NASA-compressed glTF models get Draco and Meshopt decoders', () => {
  const code = readFileSync('src/components/MachineModelViewer.tsx', 'utf8');
  assert.match(code, /import \{ DRACOLoader \}/);
  assert.match(code, /import \{ MeshoptDecoder \}/);
  assert.match(code, /loader\.setDRACOLoader\(draco\)/);
  assert.match(code, /loader\.setMeshoptDecoder\(MeshoptDecoder\)/);
  assert.match(code, /draco\?\.dispose\(\)/);
});

test('M8 provides six credited NASA hero images and a full-width exhibit entry', () => {
  const heroes = readFileSync('src/exhibitHeroes.ts', 'utf8');
  for (const id of ids) {
    assert.ok(heroes.includes("'"+id+"'") || heroes.includes(id + ':'), 'Missing hero: ' + id);
  }
  assert.match(heroes, /assets\.science\.nasa\.gov/);
  assert.match(heroes, /sourceUrl:/);
  assert.match(heroes, /NASA VISUAL COMPOSITE/);
  const hero = readFileSync('src/components/ExhibitHero.tsx', 'utf8');
  assert.match(hero, /exhibit-hero-image/);
  assert.match(hero, /onError/);
  assert.match(hero, /exhibit-hero-caption/);
  assert.match(hero, /slides\.json/);
  assert.match(hero, /300_000/);
  assert.match(hero, /Previous mission image/);
  assert.match(hero, /Next mission image/);
  assert.match(hero, /rel="noopener noreferrer"/);
  const exhibit = readFileSync('src/components/ExhibitView.tsx', 'utf8');
  assert.match(exhibit, /<ExhibitHero/);
  assert.match(exhibit, /<MachineModelViewer/);
  assert.doesNotMatch(exhibit, /<MachineVisualGallery/);
  const css = readFileSync('src/styles.css', 'utf8');
  assert.match(css, /M8 cinematic mission entrance/);
  assert.match(css, /prefers-reduced-motion/);
});


test('Opportunity hero points to the local uploaded rover illustration', () => {
  const file = 'public/assets/exhibits/opportunity/hero.webp';
  assert.ok(existsSync(file), 'Opportunity WebP hero missing');
  const manifestPath = 'public/assets/exhibits/opportunity/slides.json';
  assert.ok(existsSync(manifestPath), 'Opportunity slide manifest missing');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  assert.ok(Array.isArray(manifest.items) && manifest.items.length === 1);
  assert.equal(manifest.items[0].src, '/assets/exhibits/opportunity/hero.webp');
  assert.match(manifest.items[0].kind, /ILLUSTRATION/);
  const fallbacks = readFileSync('src/exhibitHeroes.ts', 'utf8');
  assert.ok(fallbacks.includes("src: '/assets/exhibits/opportunity/hero.webp'"));
});


test('M8 hero background spans the page while the spacecraft stays intact', () => {
  const css = readFileSync('src/styles.css', 'utf8');
  const imageStart = css.indexOf('.exhibit-hero-image{');
  assert.ok(imageStart !== -1);
  const imageStyle = css.slice(imageStart, css.indexOf('}', imageStart) + 1);
  assert.match(imageStyle, /object-fit:contain/);
  assert.match(imageStyle, /width:auto/);
  assert.match(imageStyle, /mask-image:/);
  const backdropStart = css.indexOf('.exhibit-hero-backdrop{');
  assert.ok(backdropStart !== -1);
  assert.match(css.slice(backdropStart, css.indexOf('}', backdropStart) + 1), /object-fit:cover/);
  const hero = readFileSync('src/components/ExhibitHero.tsx', 'utf8');
  assert.ok(hero.includes('className="exhibit-hero-backdrop"'));
  assert.ok(hero.includes('preload.decode()'));
  assert.ok(hero.includes('loadingNext'));
  assert.ok(hero.includes('localHero'));
  assert.ok(hero.includes('fetchPriority="high"'));
});


test('M8 InSight and Opportunity images are separate, versioned and never use blurred backdrops', () => {
  const insight = JSON.parse(readFileSync('public/assets/exhibits/insight/slides.json', 'utf8'));
  const opportunity = JSON.parse(readFileSync('public/assets/exhibits/opportunity/slides.json', 'utf8'));
  assert.equal(insight.items[0].src, '/assets/exhibits/insight/hero.webp?v=e37434c9');
  assert.equal(opportunity.items[0].src, '/assets/exhibits/opportunity/hero.webp');
  const insightFile = readFileSync('public/assets/exhibits/insight/hero.webp');
  const opportunityFile = readFileSync('public/assets/exhibits/opportunity/hero.webp');
  assert.notDeepEqual(insightFile, opportunityFile, 'InSight must not contain the Opportunity hero image');
  const heroes = readFileSync('src/exhibitHeroes.ts', 'utf8');
  assert.ok(heroes.includes("src: '/assets/exhibits/insight/hero.webp?v=e37434c9'"));
  const hero = readFileSync('src/components/ExhibitHero.tsx', 'utf8');
  assert.match(hero, /cache: 'no-store'/);
  assert.match(hero, /localHeroSource/);
  const css = readFileSync('src/styles.css', 'utf8');
  const backdropStart = css.indexOf('.exhibit-hero-backdrop{');
  assert.ok(backdropStart !== -1);
  const backdrop = css.slice(backdropStart, css.indexOf('}', backdropStart));
  assert.ok(!backdrop.includes('blur('), 'Backdrop must be sharp, without blur');
  assert.match(backdrop, /object-fit:cover/);
});

test('M8 image loading is guarded on unmount and full-width backgrounds have no blur', () => {
  const code = readFileSync('src/components/ExhibitHero.tsx', 'utf8');
  assert.ok(code.includes('imageRequest.current += 1'));
  assert.ok(code.includes('preload.decode()'));
  assert.ok(code.includes("cache: 'no-store'"));
  assert.ok(code.includes("imageState === 'failed'"));
  const styles = readFileSync('src/styles.css', 'utf8');
  const bgStart = styles.indexOf('.exhibit-hero-backdrop{');
  const bgStyle = styles.slice(bgStart, styles.indexOf('}', bgStart));
  assert.ok(bgStart > -1);
  assert.ok(bgStyle.includes('inset:0'));
  assert.ok(bgStyle.includes('object-fit:cover'));
  assert.ok(!bgStyle.includes('blur('));
  const imageStart = styles.indexOf('.exhibit-hero-image{');
  const imageStyle = styles.slice(imageStart, styles.indexOf('}', imageStart));
  assert.ok(imageStyle.includes('object-fit:contain'));
  assert.ok(imageStyle.includes('right:0'));
});


test('eight-exhibit expansion uses uploaded local assets with exact case-sensitive paths', () => {
  const data = readFileSync('src/data.ts', 'utf8');
  const idsNow = [...ids, 'surveyor-3', 'viking-1'];
  for (const id of idsNow) assert.ok(data.includes('id: "' + id + '"'), 'Missing machine: ' + id);

  const assets = [
    'public/assets/exhibits/surveyor-3/Surveyor3.webp',
    'public/assets/exhibits/apollo-15-lrv/Falcon.webp',
    'public/assets/exhibits/viking-1/hero.webp',
    'public/assets/models/viking-1/model.glb',
    'public/assets/models/apollo-lunar-module/model.glb',
    'public/assets/tour-guide/welcome-wave.webp',
    'public/assets/tour-guide/neutral-hands-clapseds.webp',
    'public/assets/tour-guide/presenting-one-hand.webp',
    'public/assets/tour-guide/explaining-two-hands.webp',
  ];
  for (const asset of assets) assert.ok(existsSync(asset), 'Missing uploaded asset: ' + asset);

  for (const id of ['surveyor-3', 'viking-1']) {
    const slideshow = JSON.parse(readFileSync(`public/assets/exhibits/${id}/slides.json`, 'utf8'));
    assert.ok(slideshow.items.length > 0, 'No images for: ' + id);
    for (const item of slideshow.items) {
      assert.ok(existsSync(`public${item.src.split('?')[0]}`), 'Broken slide link: ' + item.src);
    }
  }

  const apollo = JSON.parse(readFileSync('public/assets/exhibits/apollo-15-lrv/slides.json', 'utf8'));
  assert.ok(apollo.items.some(item => item.src === '/assets/exhibits/apollo-15-lrv/Falcon.webp'));
  const heroes = readFileSync('src/exhibitHeroes.ts', 'utf8');
  assert.ok(heroes.includes("src: '/assets/exhibits/surveyor-3/Surveyor3.webp'"));
  const guided = readFileSync('src/components/GuidedJourneyView.tsx', 'utf8');
  assert.match(guided, /guidePoseByMission/);
  assert.match(guided, /tour-guide/);

  for (const id of ['viking-1', 'apollo-lunar-module']) {
    const modelPath = `public/assets/models/${id}/model.glb`;
    const fd = openSync(modelPath, 'r');
    const header = Buffer.alloc(12);
    try { assert.equal(readSync(fd, header, 0, 12, 0), 12); }
    finally { closeSync(fd); }
    assert.equal(header.toString('ascii', 0, 4), 'glTF');
    assert.equal(header.readUInt32LE(4), 2);
    assert.equal(header.readUInt32LE(8), statSync(modelPath).size);
  }
});

test('museum guide is a floating white cloud using only the uploaded WebP poses', () => {
  const guide = readFileSync('src/components/MuseumGuideBubble.tsx', 'utf8');
  const solar = readFileSync('src/components/SolarSystem.tsx', 'utf8');
  const journey = readFileSync('src/components/GuidedJourneyView.tsx', 'utf8');
  const styles = readFileSync('src/styles.css', 'utf8');

  for (const name of [
    'welcome-wave.webp',
    'neutral-hands-clapseds.webp',
    'presenting-one-hand.webp',
    'explaining-two-hands.webp'
  ]) assert.ok(guide.includes(name), 'Missing guide WebP reference: ' + name);
  assert.match(guide, /museum-guide-cloud-shape/);
  assert.match(guide, /is-flipped/);
  assert.match(solar, /<MuseumGuideBubble/);
  assert.match(journey, /<MuseumGuideBubble/);
  assert.doesNotMatch(journey, /guided-guide-intro/);
  assert.doesNotMatch(solar, /welcome-wave\\.png/);
  assert.match(styles, /\\.museum-guide-float\\s*\\{[^}]*position:fixed/s);
  assert.match(styles, /\\.museum-guide-cloud-shape path\\s*\\{[^}]*fill:#fff/s);
  assert.match(styles, /prefers-reduced-motion/);
});
