import { useEffect, useRef, type FC } from 'react';
import type { CanvasTexture } from 'three';
import {
  createSunTexture, createMercuryTexture, createVenusTexture, createEarthTexture,
  createMoonTexture, createMarsTexture, createJupiterTexture, createSaturnTexture,
  createUranusTexture, createNeptuneTexture, createPlutoTexture,
} from '../utils/planetTextures';

/**
 * Illustrated planet portrait drawn with the existing museum texture system.
 * Static canvas artwork; does not create another WebGL context or make network requests.
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
    let texture: CanvasTexture | null = null;

    try {
      texture = factory();
      const source = texture.image as HTMLCanvasElement;
      const srcContext = source.getContext('2d', { willReadFrequently: true });
      const context = canvas.getContext('2d');
      if (!srcContext || !context) return;
      const sourceData = srcContext.getImageData(0, 0, source.width, source.height).data;
      const size = canvas.width;
      const output = context.createImageData(size, size);
      const r = size * (planetKey === 'saturn' ? .28 : .405);
      const cx = size / 2, cy = size / 2;
      const offset = planetKey === 'moon' ? .08 : .16;

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
          const v = Math.max(0, Math.min(0.999, .5 - latitude / Math.PI));
          const sx = Math.min(source.width - 1, Math.floor(u * source.width));
          const sy = Math.min(source.height - 1, Math.floor(v * source.height));
          const sourceIndex = (sy * source.width + sx) * 4;
          const outputIndex = (y * size + x) * 4;
          const light = Math.max(.12, .28 + .75 * Math.max(0, nx * -.52 + ny * .24 + nz * .78));
          output.data[outputIndex] = Math.min(255, sourceData[sourceIndex] * light);
          output.data[outputIndex + 1] = Math.min(255, sourceData[sourceIndex + 1] * light);
          output.data[outputIndex + 2] = Math.min(255, sourceData[sourceIndex + 2] * light);
          output.data[outputIndex + 3] = Math.floor(255 * Math.min(1, (1 - d) * r * .38));
        }
      }

      if (planetKey === 'saturn') {
        context.strokeStyle = 'rgba(209,191,153,.66)';
        context.lineWidth = size * .068;
        context.beginPath();
        context.ellipse(cx, cy, size * .45, size * .125, -.27, 0, Math.PI * 2);
        context.stroke();
      }
      context.putImageData(output, 0, 0);
      if (planetKey === 'saturn') {
        context.strokeStyle = 'rgba(230,211,177,.85)';
        context.lineWidth = size * .047;
        context.beginPath();
        context.ellipse(cx, cy, size * .45, size * .125, -.27, 0, Math.PI);
        context.stroke();
      }
    } catch {
      // The CSS gradient fallback remains visible if canvas is unavailable.
    } finally {
      texture?.dispose();
    }
  }, [planetKey]);

  return (
    <div className={`planet-artwork ${className}`} aria-hidden="true">
      <div className="planet-artwork-fallback" />
      <canvas ref={canvasRef} width={400} height={400} />
    </div>
  );
};
