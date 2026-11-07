import { useState, type FC } from 'react';
import { type Machine } from '../types';
import { exhibitHeroes } from '../exhibitHeroes';

export const ExhibitHero: FC<{ machine: Machine }> = ({ machine }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const hero = exhibitHeroes[machine.id];

  return (
    <header className="exhibit-header exhibit-photo-hero">
      {hero && !imageFailed && (
        <img
          key={machine.id}
          className="exhibit-hero-image"
          src={hero.src}
          alt=""
          loading="eager"
          decoding="async"
          onError={() => setImageFailed(true)}
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
          {hero && (
            <a href={hero.sourceUrl} target="_blank" rel="noopener noreferrer" className="exhibit-hero-source">
              Image source: {hero.credit} <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
        {hero && <p className="exhibit-hero-caption">{hero.kind} · {hero.description}</p>}
      </div>
    </header>
  );
};
