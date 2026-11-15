import { useState, type FC } from 'react';
import type { Machine } from '../types';
import { exhibitHeroes } from '../exhibitHeroes';

const localImages: Record<string, string> = {
  'surveyor-3': '/assets/exhibits/surveyor-3/Surveyor3.webp',
  'apollo-15-lrv': '/assets/exhibits/apollo-15-lrv/hero.webp',
  'pioneer-10': '/assets/exhibits/pioneer-10/hero.webp',
  'viking-1': '/assets/exhibits/viking-1/hero.webp',
  'sojourner': '/assets/exhibits/sojourner/hero.webp',
  'cassini-huygens': '/assets/exhibits/cassini-huygens/hero.webp',
  opportunity: '/assets/exhibits/opportunity/hero.webp',
  insight: '/assets/exhibits/insight/hero.webp',
};

const shortNames: Record<string, string> = {
  'apollo-15-lrv': 'Apollo 15 Rover',
  'cassini-huygens': 'Cassini–Huygens',
  opportunity: 'Opportunity',
};

interface MuseumMachineCardProps {
  machine: Machine;
  index: number;
  variant: 'collection' | 'destination';
  onExplore: (id: string) => void;
}

/** Image-led museum catalog entry with one real button (no nested click targets). */
export const MuseumMachineCard: FC<MuseumMachineCardProps> = ({
  machine, index, variant, onExplore,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const image = imageFailed ? exhibitHeroes[machine.id]?.src : localImages[machine.id];
  return (
    <article className={`${variant === 'collection' ? 'machine-card' : 'mission-card'} museum-exhibit-card`}>
      <div className="museum-card-media">
        {image && (
          <img src={image} alt={`Visual of the ${machine.name} mission`}
            loading="lazy" decoding="async"
            onError={() => { if (!imageFailed) setImageFailed(true); }} />
        )}
        <span className="museum-card-index">EXHIBIT {String(index + 1).padStart(2, '0')} · {machine.year}</span>
      </div>
      <div className="museum-card-copy">
        <h3>{machine.name}</h3>
        <p>{machine.summary}</p>
        <div className="museum-card-bottom">
          <span className="museum-card-location">{machine.place} · {machine.kind}</span>
          <button className="museum-card-explore" type="button"
            onClick={() => onExplore(machine.id)}>
            Explore {shortNames[machine.id] || machine.name}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  );
};
