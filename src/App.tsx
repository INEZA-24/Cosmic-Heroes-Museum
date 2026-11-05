import { useState, useRef, type FC } from 'react';
import { ViewType, DestinationArea } from './types';
import { Entrance } from './components/Entrance';
import { Header } from './components/Header';
import { SolarSystem, SolarSystemHandle } from './components/SolarSystem';
import { CollectionView } from './components/CollectionView';
import { DestinationView } from './components/DestinationView';
import { ExhibitView } from './components/ExhibitView';

export const App: FC = () => {
  const [view, setView] = useState<ViewType>('entrance');
  const [selectedDestination, setSelectedDestination] = useState<DestinationArea>('moon');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('surveyor-3');
  const [previousView, setPreviousView] = useState<ViewType>('solar');
  const solarRef = useRef<SolarSystemHandle | null>(null);

  const handleOpenDestination = (area: DestinationArea) => {
    setSelectedDestination(area);
    setView('destination');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectExhibit = (machineId: string) => {
    setSelectedMachineId(machineId);
    setPreviousView(view);
    setView('exhibit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromExhibit = () => {
    if (previousView === 'destination') {
      setView('destination');
    } else if (previousView === 'collection') {
      setView('collection');
    } else {
      setView('solar');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSolar = () => {
    setView('solar');
    solarRef.current?.resetCamera();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetView = () => {
    solarRef.current?.resetCamera();
  };

  const handleReplayIntro = () => {
    setView('entrance');
  };

  return (
    <main>
      {view === 'entrance' ? (
        <Entrance onEnter={() => setView('solar')} />
      ) : (
        <section className="museum" id="museum">
          <Header
            currentView={view}
            onNavigate={(newView) => {
              setView(newView);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onResetView={handleResetView}
            onReplayIntro={handleReplayIntro}
          />

          <div className={view !== 'solar' ? 'hidden' : ''}>
            <SolarSystem ref={solarRef} onOpenDestination={handleOpenDestination} />
          </div>

          {view === 'collection' && (
            <CollectionView onSelectExhibit={handleSelectExhibit} />
          )}

          {view === 'destination' && (
            <DestinationView
              destinationId={selectedDestination}
              onBack={handleBackToSolar}
              onSelectExhibit={handleSelectExhibit}
            />
          )}

          {view === 'exhibit' && (
            <ExhibitView
              machineId={selectedMachineId}
              onBack={handleBackFromExhibit}
              onSelectMachine={(id) => {
                setSelectedMachineId(id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          <footer className="museum-footer">
            <span>COSMIC HEROES OF STEEL MUSEUM</span>
            <span>CELEBRATING THE MACHINES OF EXPLORATION</span>
          </footer>
        </section>
      )}
    </main>
  );
};

export default App;
