import { type FC } from 'react';
import { DestinationArea } from '../types';
import { destinationNames, destinationDescriptions, machines } from '../data';
import { PlanetArtwork } from './PlanetArtwork';
import { MuseumMachineCard } from './MuseumMachineCard';

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
  const description = destinationDescriptions[destinationId] ||
    'Explore the robotic spacecraft and landers that expanded our knowledge.';
  const destinationMachines = machines.filter((m) => m.area === destinationId);
  const planetKey = destinationId === 'deep-space' ? 'jupiter' : destinationId;

  return (
    <section className={`destination-view destination-view--${destinationId}`} id="destination-view">
      <button className="back-link" id="back-to-solar" onClick={onBack}>
        ← Back to Solar System
      </button>
      <header className="destination-hero">
        <PlanetArtwork planetKey={planetKey} className="planet-artwork--destination" />
        <div className="destination-hero-copy">
          <p className="eyebrow" id="destination-eyebrow">MISSION REGION / {title.toUpperCase()}</p>
          <h2 id="destination-title">{title}</h2>
          <p id="destination-description">{description}</p>
          <span className="destination-count">{destinationMachines.length} missions to explore</span>
        </div>
      </header>
      <div className="destination-list-header">
        <p className="eyebrow">THE EXHIBITS</p>
        <h3>Explore the machines</h3>
      </div>
      <div className="mission-grid" id="mission-grid">
        {destinationMachines.map((machine, index) => (
          <MuseumMachineCard
            key={machine.id}
            machine={machine}
            index={index}
            variant="destination"
            onExplore={onSelectExhibit}
          />
        ))}
      </div>
    </section>
  );
};
