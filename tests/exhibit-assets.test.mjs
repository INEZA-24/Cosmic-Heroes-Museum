import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, openSync, readSync, closeSync, statSync } from 'node:fs';

const ids = ['cassini-huygens', 'apollo-15-lrv', 'sojourner', 'opportunity', 'insight', 'pioneer-10'];

test('all six machine galleries are valid, future-ready and isolated', () => {
  for (const id of ids) {
    const path = `public/assets/exhibits/${id}/gallery.json`;
    assert.ok(existsSync(path), `Missing gallery: ${id}`);
    const gallery = JSON.parse(readFileSync(path, 'utf8'));
    assert.ok(Array.isArray(gallery.items), `Invalid gallery items: ${id}`);
    for (const item of gallery.items) {
      assert.ok(['image', 'video'].includes(item.type));
      assert.match(item.file, /^[A-Za-z0-9_.-]+\.(?:jpg|jpeg|png|webp|mp4|webm)$/);
      assert.equal(typeof item.caption, 'string');
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

test('each exhibition embeds the 3D viewer and the optional media archive', () => {
  const exhibit = readFileSync('src/components/ExhibitView.tsx', 'utf8');
  assert.match(exhibit, /<MachineModelViewer/);
  assert.match(exhibit, /<MachineVisualGallery/);
});

test('exhibition navigation retains collection, Moon, Mars and deep space', () => {
  const app = readFileSync('src/App.tsx', 'utf8');
  for (const view of ['solar', 'collection', 'destination', 'exhibit']) assert.ok(app.includes("'" + view + "'"));
  const data = readFileSync('src/data.ts', 'utf8');
  for (const id of ids) assert.ok(data.includes('id: "' + id + '"'), `Missing machine: ${id}`);
});

test('M6 uses Cassini at Saturn and displays the approved transparent emblem', () => {
  const code = readFileSync('src/data.ts', 'utf8');
  assert.match(code, /id: "cassini-huygens"/);
  assert.match(code, /area: "saturn"/);
  assert.doesNotMatch(code, /id: "surveyor-3"/);
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

test('model viewer uses white studio lighting and visible network progress', () => {
  const code = readFileSync('src/components/MachineModelViewer.tsx', 'utf8');
  assert.match(code, /RoomEnvironment/);
  assert.match(code, /scene\.background = new THREE\.Color\(0xffffff\)/);
  assert.match(code, /Loading 3D model/);
  const style = readFileSync('src/styles.css', 'utf8');
  assert.match(style, /M7: bright, museum-grade inspection studio/);
});
