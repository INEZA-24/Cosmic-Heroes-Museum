import { type FC } from 'react';
import { machines } from '../data';
import { MuseumMachineCard } from './MuseumMachineCard';

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
          Eight robotic missions. Each one answered a different question.
        </p>
      </div>
      <div className="collection-grid" id="collection-grid">
        {machines.map((machine, index) => (
          <MuseumMachineCard
            key={machine.id}
            machine={machine}
            index={index}
            variant="collection"
            onExplore={onSelectExhibit}
          />
        ))}
      </div>
    </section>
  );
};
