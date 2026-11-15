import { useEffect, useRef, type FC } from 'react';
import type { CanvasTexture } from 'three';
import { planetTextureUrls } from '../planetTextureAssets';
import {
  createSunTexture, createMercuryTexture, createVenusTexture, createEarthTexture,
  createMoonTexture, createMarsTexture, createJupiterTexture, createSaturnTexture,
  createUranusTexture, createNeptuneTexture, createPlutoTexture,
} from '../utils/planetTextures';

/**
 * Illustrated planet portrait drawn with the existing museum texture system.
 * Static canvas artwork without another WebGL context. Uses local 2K maps when
 * present; falls back to an attributed CDN, then the previous procedural map.
 */
const textureFactories: Record<string, () => CanvasTexture> = {
  sun: createSunTexture, mercury: createMercuryTexture, venus: createVenusTexture,
  earth: createEarthTexture, moon: createMoonTexture, mars: createMarsTexture,
  jupiter: createJupiterTexture, saturn: createSaturnTexture,
  uranus: createUranusTexture, neptune: createNeptuneTexture,
  pluto: createPlutoTexture, 'deep-space': createJupiterTexture,
};

interface PlanetArtworkProps {
  planetKey: string;
  className?: string;
}

export const PlanetArtwork: FC<PlanetArtworkProps> = ({ planetKey, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const factory = textureFactories[planetKey];
    if (!canvas || !factory) return;
    let cancelled = false;
    let image: HTMLImageElement | null = null;
    let procedural: CanvasTexture | null = null;

    // Preserve the visual treatment of the original card while a real map
    // loads. A failed image request must never leave a blank planet.
    const paint = (source: CanvasImageSource, width: number, height: number) => {
      if (cancelled) return;
      const context = canvas.getContext('2d');
      const sample = document.createElement('canvas');
      sample.width = width;
      sample.height = height;
      const srcContext = sample.getContext('2d', { willReadFrequently: true });
      if (!srcContext || !context) return;
      srcContext.drawImage(source, 0, 0, width, height);
      const sourceData = srcContext.getImageData(0, 0, width, height).data;
      const size = canvas.width;
      const output = context.createImageData(size, size);
      const r = size * (planetKey === 'saturn' ? .28 : .405);
      const cx = size / 2, cy = size / 2;
      // Aim the Earth image toward Europe and Africa, not the Pacific.
      const offset = planetKey === 'moon' ? .08 : planetKey === 'earth' ? .02 : .16;

      for (let y = 0; y < size; y++) {
        const ny = (cy - y) / r;
        for (let x = 0; x < size; x++) {
          const nx = (x - cx) / r;
          const d = nx * nx + ny * ny;
          if (d >= 1) continue;
          const nz = Math.sqrt(1 - d);
          const longitude = Math.atan2(nx, nz);
          const latitude = Math.asin(ny);
          const u = ((.5 + longitude / (2 * Math.PI) + offset) % 1 + 1) % 1;
          const v = Math.max(0, Math.min(.999, .5 - latitude / Math.PI));
          const sx = Math.min(width - 1, Math.floor(u * width));
          const sy = Math.min(height - 1, Math.floor(v * height));
          const sourceIndex = (sy * width + sx) * 4;
          const outIndex = (y * size + x) * 4;
          const light = Math.max(.16, .30 + .75 * Math.max(0, nx * -.52 + ny * .24 + nz * .78));
          output.data[outIndex] = Math.min(255, sourceData[sourceIndex] * light);
          output.data[outIndex + 1] = Math.min(255, sourceData[sourceIndex + 1] * light);
          output.data[outIndex + 2] = Math.min(255, sourceData[sourceIndex + 2] * light);
          output.data[outIndex + 3] = Math.floor(255 * Math.min(1, (1 - d) * r * .38));
        }
      }
      context.clearRect(0, 0, size, size);
      context.putImageData(output, 0, 0);
      if (planetKey === 'saturn') {
        context.strokeStyle = 'rgba(226,209,179,.82)';
        context.lineWidth = size * .047;
        context.beginPath();
        context.ellipse(cx, cy, size * .45, size * .125, -.27, 0, Math.PI);
        context.stroke();
      }
    };

    try {
      procedural = factory();
      const base = procedural.image as HTMLCanvasElement;
      paint(base, base.width, base.height);
    } catch {
      // CSS gradient remains available if canvas is unsupported.
    } finally {
      procedural?.dispose();
    }

    const urls = planetTextureUrls(planetKey);
    let next = 0;
    const tryNext = () => {
      if (cancelled || next >= urls.length) return;
      image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        if (!cancelled && image) {
          try { paint(image, image.naturalWidth, image.naturalHeight); }
          catch { /* CORS or canvas restriction: keep procedural map */ }
        }
      };
      image.onerror = () => { if (!cancelled) tryNext(); };
      image.src = urls[next++];
    };
    tryNext();

    return () => {
      cancelled = true;
      if (image) { image.onload = null; image.onerror = null; }
    };
  }, [planetKey]);

  return (
    <div className={`planet-artwork ${className}`} aria-hidden="true">
      <div className="planet-artwork-fallback" />
      <canvas ref={canvasRef} width={400} height={400} />
    </div>
  );
};
