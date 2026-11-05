import { type FC } from 'react';
import { DestinationArea } from '../types';
import { destinationNames, destinationDescriptions, machines } from '../data';

interface DestinationViewProps {
  destinationId: DestinationArea;
  onBack: () => void;
  onSelectExhibit: (machineId: string) => void;
}

export const DestinationView: FC<DestinationViewProps> = ({
  destinationId,
  onBack,
  onSelectExhibit,
}) => {
  const title = destinationNames[destinationId] || 'Exploration Destination';
  const description =
    destinationDescriptions[destinationId] ||
    'Explore the robotic spacecraft and landers that expanded our knowledge.';
  const destinationMachines = machines.filter((m) => m.area === destinationId);

  return (
    <section className="destination-view" id="destination-view">
      <button className="back-link" id="back-to-solar" onClick={onBack}>
        ← Back to Solar System
      </button>

      <div className="destination-hero">
        <p className="eyebrow" id="destination-eyebrow">
          MISSION REGION / {title.toUpperCase()}
        </p>
        <h2 id="destination-title">{title}</h2>
        <p id="destination-description">{description}</p>
      </div>

      <div className="mission-grid" id="mission-grid">
        {destinationMachines.map((m, index) => (
          <article
            key={m.id}
            className="mission-card clickable-card"
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
              EXHIBIT 0{index + 1} · {m.year}
            </span>
            <h3>{m.name}</h3>
            <p>{m.summary}</p>
            <div className="mission-card-footer">
              <span className="machine-type">
                {m.kind} · {m.location}
              </span>
              <span className="card-enter-action">Enter Exhibit ↗</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
