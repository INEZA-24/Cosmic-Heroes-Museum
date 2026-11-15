/** Equirectangular 2K planet maps: Solar System Scope, CC BY 4.0.
 * Original source: https://www.solarsystemscope.com/textures/
 * Mirrored with hashes at https://raw.githubusercontent.com/Sanghel/solar-system-3d/47c8bbc6b63f4c6c2310911238c2c4b6bff6d20b/public/textures
 * See public/assets/planet-textures/README.md for attribution and build steps.
 */
export const planetImagePaths: Record<string, string> = {
  "earth": "earth.jpg",
  "moon": "satellites/moon.jpg",
  "mars": "mars.jpg",
  "jupiter": "jupiter.jpg",
  "saturn": "saturn.jpg",
  "mercury": "mercury.jpg",
  "venus": "venus.jpg",
  "uranus": "uranus.jpg",
  "neptune": "neptune.jpg"
};

const sourceBase = 'https://raw.githubusercontent.com/Sanghel/solar-system-3d/47c8bbc6b63f4c6c2310911238c2c4b6bff6d20b/public/textures';

export function planetTextureUrls(planetKey: string): string[] {
  const sourcePath = planetImagePaths[planetKey === 'deep-space' ? 'jupiter' : planetKey];
  if (!sourcePath) return [];
  const name = planetKey === 'deep-space' ? 'jupiter' : planetKey;
  return [`/assets/planet-textures/${name}.jpg`, `${sourceBase}/${sourcePath}`];
}
