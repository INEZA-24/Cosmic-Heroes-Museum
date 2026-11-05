import { type FC } from 'react';
import { machines } from '../data';

interface CollectionViewProps {
  onSelectExhibit: (machineId: string) => void;
}

export const CollectionView: FC<CollectionViewProps> = ({ onSelectExhibit }) => {
  return (
    <section className="view" id="collection-view">
      <div className="section-heading">
        <div>
          <p className="eyebrow">THE MUSEUM COLLECTION</p>
          <h2>Machines with a legacy.</h2>
        </div>
        <p className="section-note">
          Six remarkable explorers. Each one built to answer a different question.
        </p>
      </div>

      <div className="collection-grid" id="collection-grid">
        {machines.map((m, index) => (
          <article
            key={m.id}
            className="machine-card clickable-card"
            onClick={() => onSelectExhibit(m.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectExhibit(m.id);
              }
            }}
          >
            <span className="machine-index">
              MACHINE 0{index + 1} · {m.year}
            </span>
            <h3>{m.name}</h3>
            <p>{m.summary}</p>
            <div className="mission-card-footer">
              <span className="machine-type">
                {m.place} · {m.kind}
              </span>
              <span className="card-enter-action">Enter Exhibit ↗</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
