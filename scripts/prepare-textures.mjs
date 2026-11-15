/**
 * Shared asset preparation entrypoint.
 * PR #40 may add sync-planet-textures.mjs; this script automatically runs it
 * alongside the NASA Moon/Mars mosaic builder whenever the two PRs coexist.
 */
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

for (const filename of ['sync-planet-textures.mjs', 'sync-nasa-globes.mjs']) {
  const script = new URL(filename, import.meta.url);
  if (!existsSync(script)) continue;
  const result = spawnSync(process.execPath, [fileURLToPath(script)], {
    stdio: 'inherit',
    env: process.env,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
