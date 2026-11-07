import { useEffect, useRef, useState, type FC } from 'react';
import { type Machine } from '../types';
import { exhibitHeroes } from '../exhibitHeroes';

interface HeroScene {
  src: string;
  title: string;
  kind: string;
  description: string;
  credit: string;
  sourceUrl: string | null;
  lowResolution?: boolean;
}

const FIVE_MINUTES = 300_000;

/** An accessible slideshow: use locally hosted slides.json when present, with a NASA fallback. */
export const ExhibitHero: FC<{ machine: Machine }> = ({ machine }) => {
  const fallback = exhibitHeroes[machine.id];
  const fallbackScene: HeroScene | null = fallback ? {
    src: fallback.src,
    title: machine.name,
    kind: fallback.kind,
    description: fallback.description,
    credit: fallback.credit,
    sourceUrl: fallback.sourceUrl,
  } : null;

  const [scenes, setScenes] = useState<HeroScene[]>(fallbackScene ? [fallbackScene] : []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageState, setImageState] = useState<'local' | 'fallback' | 'failed'>('local');
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const prefix = `/assets/exhibits/${machine.id}/`;
    const loadManifest = async () => {
      try {
        const response = await fetch(`${prefix}slides.json`, { signal: controller.signal });
        // Some SPA hosts return index.html (HTTP 200) for missing JSON files.
        if (!response.ok || !(response.headers.get('content-type') || '').includes('json')) return;
        const manifest = await response.json() as { items?: HeroScene[] };
        if (!Array.isArray(manifest.items)) return;
        const valid = manifest.items.filter(item =>
          typeof item?.src === 'string' && item.src.startsWith(prefix) &&
          typeof item.title === 'string' && typeof item.description === 'string' &&
          typeof item.credit === 'string' && typeof item.kind === 'string'
        );
        if (valid.length > 0 && !controller.signal.aborted) {
          setScenes(valid);
          setActiveIndex(0);
          setImageState('local');
        }
      } catch (error) {
        if (!controller.signal.aborted) console.warn('Exhibit images unavailable; using NASA fallback', machine.id, error);
      }
    };
    void loadManifest();
    return () => controller.abort();
  }, [machine.id]);

  useEffect(() => {
    if (scenes.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const handle = window.setInterval(() => {
      if (!document.hidden) {
        setActiveIndex(index => (index + 1) % scenes.length);
        setImageState('local');
      }
    }, FIVE_MINUTES);
    return () => window.clearInterval(handle);
  }, [machine.id, scenes.length]);

  const changeScene = (next: number) => {
    if (scenes.length < 2) return;
    setActiveIndex(((next % scenes.length) + scenes.length) % scenes.length);
    setImageState('local');
  };

  const scene = scenes[activeIndex] ?? fallbackScene;
  const displayed = imageState === 'fallback' && fallbackScene ? fallbackScene : scene;
  const src = imageState === 'failed' ? null : displayed?.src;
  const showControls = scenes.length > 1;

  return (
    <header
      className="exhibit-header exhibit-photo-hero"
      onTouchStart={event => {
        const touch = event.touches[0];
        if (touch) touchStart.current = { x: touch.clientX, y: touch.clientY };
      }}
      onTouchEnd={event => {
        const start = touchStart.current;
        const touch = event.changedTouches[0];
        touchStart.current = null;
        if (!start || !touch || !showControls) return;
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) changeScene(activeIndex + (dx < 0 ? 1 : -1));
      }}
    >
      {src && (
        <img
          key={`backdrop-${machine.id}-${activeIndex}-${imageState}`}
          className="exhibit-hero-backdrop"
          src={src}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
      )}
      {src && (
        <img
          key={`${machine.id}-${activeIndex}-${imageState}`}
          className={`exhibit-hero-image${displayed?.lowResolution ? ' exhibit-hero-image--archival' : ''}`}
          src={src}
          alt=""
          loading="eager"
          decoding="async"
          onError={() => {
            if (imageState === 'local' && fallbackScene && scene?.src !== fallbackScene.src) {
              setImageState('fallback');
            } else {
              setImageState('failed');
            }
          }}
        />
      )}
      <div className="exhibit-hero-shade" aria-hidden="true" />
      <div className="exhibit-hero-content">
        <p className="eyebrow">THE COSMIC HEROES OF STEEL · MISSION EXHIBIT</p>
        <p className="exhibit-hero-destination">{machine.place.toUpperCase()} <span aria-hidden="true">/</span> {machine.year}</p>
        <h1 className="exhibit-title">{machine.name}</h1>
        <p className="exhibit-lead">{machine.summary}</p>
        {machine.status && (
          <div className="exhibit-status-pill">
            <span className="status-label">STATUS</span>
            <span className="status-value">{machine.status}</span>
          </div>
        )}
        <div className="exhibit-hero-actions">
          <a href="#exhibit-model" className="exhibit-hero-cta">Explore the 3D model <span aria-hidden="true">↓</span></a>
          {src && displayed?.sourceUrl ? (
            <a href={displayed.sourceUrl} target="_blank" rel="noopener noreferrer" className="exhibit-hero-source">
              Image credit: {displayed.credit} <span aria-hidden="true">↗</span>
            </a>
          ) : src && displayed ? (
            <span className="exhibit-hero-source">Image credit: {displayed.credit}</span>
          ) : null}
        </div>
        {src && displayed && <p className="exhibit-hero-caption">{displayed.kind} · {displayed.description}</p>}
        {showControls && (
          <nav className="exhibit-hero-slide-nav" aria-label={`Images of ${machine.name}`}>
            <button type="button" className="exhibit-hero-arrow" onClick={() => changeScene(activeIndex - 1)} aria-label="Previous mission image">←</button>
            <div className="exhibit-hero-slide-dots" role="group" aria-label="Choose a mission image">
              {scenes.map((item, index) => (
                <button
                  key={`${item.src}-${index}`}
                  type="button"
                  className={`exhibit-hero-dot${activeIndex === index ? ' is-active' : ''}`}
                  onClick={() => changeScene(index)}
                  aria-label={`Show image ${index + 1} of ${scenes.length}: ${item.title}`}
                  aria-current={activeIndex === index ? 'true' : undefined}
                />
              ))}
            </div>
            <button type="button" className="exhibit-hero-arrow" onClick={() => changeScene(activeIndex + 1)} aria-label="Next mission image">→</button>
            <span className="exhibit-hero-slide-count">{activeIndex + 1} / {scenes.length} · Auto-change every 5 min</span>
          </nav>
        )}
      </div>
    </header>
  );
};
