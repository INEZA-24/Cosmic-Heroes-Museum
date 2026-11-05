import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const ids = ['surveyor-3', 'apollo-15-lrv', 'sojourner', 'opportunity', 'insight', 'pioneer-10'];

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
