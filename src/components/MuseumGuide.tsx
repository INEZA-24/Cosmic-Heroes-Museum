import { useEffect, useRef, useState, type FC } from 'react';
import { machines, destinationNames, planetDescriptions } from '../data';
import type { Machine, ViewType, DestinationArea } from '../types';

interface MuseumGuideProps {
  view: ViewType;
  machine: Machine | null;
  destination: DestinationArea;
  planetKey: string | null;
  onSelectExhibit: (id: string) => void;
  onFocusPlanet: (key: string) => void;
  onNavigate: (view: ViewType) => void;
}

export const MuseumGuide: FC<MuseumGuideProps> = ({
  view, machine, destination, planetKey, onSelectExhibit, onFocusPlanet, onNavigate,
}) => {
  // Every entrance opens the guide, including returning through "Museum entrance".
  const [open, setOpen] = useState(true);
  const [tourActive, setTourActive] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speechAvailable] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const tourIndex = machine ? machines.findIndex(item => item.id === machine.id) : -1;

  // Let the planet mission portal take priority over the floating guide on
  // narrow screens. The visitor can reopen Stella at any time.
  useEffect(() => {
    if (view === 'solar' && planetKey) setOpen(false);
  }, [view, planetKey]);

  const stopSpeech = () => {
    if (speechAvailable) window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeaking(false);
  };

  useEffect(() => {
    if (speechAvailable) window.speechSynthesis.cancel();
    setSpeaking(false);
    return () => {
      if (speechAvailable) window.speechSynthesis.cancel();
    };
  }, [view, machine?.id, planetKey, speechAvailable]);

  let title = 'Welcome to the museum';
  let message = 'You are in our Exploration Hall. Drag to rotate the Solar System, scroll to zoom, and click a planet to open its mission portal. Or begin our guided six-machine journey.';
  if (view === 'collection') {
    title = 'The Collection Hall';
    message = 'These six explorers each have a story. Select any machine to enter its 3D gallery, listen to a chapter, and discover its legacy.';
  } else if (view === 'destination') {
    title = destinationNames[destination];
    message = 'You have reached a mission region. Choose one of the explorers below to see its model and follow its journey in short chapters.';
  } else if (view === 'exhibit' && machine) {
    title = machine.name;
    message = machine.summary + ' Start with the 3D model, then explore the story chapters at your own pace. You can listen to each chapter without leaving the museum.';
  } else if (view === 'solar' && planetKey) {
    title = planetKey === 'deep-space' ? 'Deep Space' : planetKey.charAt(0).toUpperCase() + planetKey.slice(1);
    message = (planetDescriptions[planetKey] || 'A world in our Solar System.') + ' Open the Missions tab in the planet window to enter a featured exhibit.';
  }

  const toggleSpeech = () => {
    if (!speechAvailable) return;
    if (speaking) { stopSpeech(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(title + '. ' + message);
    utterance.rate = 0.93;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const startTour = () => {
    stopSpeech();
    setTourActive(true);
    onSelectExhibit(machines[0].id);
    setOpen(true);
  };

  const nextStop = () => {
    stopSpeech();
    if (tourIndex < 0) return startTour();
    if (tourIndex < machines.length - 1) {
      onSelectExhibit(machines[tourIndex + 1].id);
    } else {
      setTourActive(false);
      onNavigate('collection');
    }
  };

  return (
    <aside className={'museum-guide' + (open ? ' is-open' : '')} aria-label="Interactive museum tour guide">
      {!open ? (
        <button className="museum-guide-launcher" type="button" onClick={() => setOpen(true)} aria-expanded={false}>
          <span className="guide-orbit" aria-hidden="true">✦</span> Ask your guide
        </button>
      ) : (
        <div className="museum-guide-panel" role="complementary" aria-label="Museum guide instructions">
          <div className="museum-guide-head">
            <span className="guide-orbit" aria-hidden="true">✦</span>
            <div><span className="guide-eyebrow">YOUR MUSEUM GUIDE</span><strong>Stella · Mission Navigator</strong></div>
            <button type="button" className="museum-guide-dismiss" aria-label="Minimize museum guide" onClick={() => { stopSpeech(); setOpen(false); }}>×</button>
          </div>
          <div className="museum-guide-body" aria-live="polite">
            <h3>{title}</h3>
            <p>{message}</p>
            {tourActive && view === 'exhibit' && <span className="guide-progress">GUIDED TOUR · STOP {Math.max(1, tourIndex + 1)} OF {machines.length}</span>}
          </div>
          <div className="museum-guide-actions">
            {speechAvailable && (
              <button type="button" onClick={toggleSpeech} className="guide-secondary">
                {speaking ? '■ Stop audio' : '▶ Listen to guide'}
              </button>
            )}
            {!tourActive ? (
              <button type="button" onClick={startTour} className="guide-primary">Begin guided tour ↗</button>
            ) : view === 'exhibit' ? (
              <button type="button" onClick={nextStop} className="guide-primary">
                {tourIndex === machines.length - 1 ? 'Finish tour ↗' : 'Next exhibit →'}
              </button>
            ) : (
              <button type="button" onClick={() => { setTourActive(false); stopSpeech(); }} className="guide-secondary">End guided tour</button>
            )}
            {view === 'solar' && (
              <button type="button" className="guide-text-action" onClick={() => { onFocusPlanet('mars'); }}>Show me Mars ↗</button>
            )}
          </div>
          <p className="guide-audio-note">Audio plays only when you choose Listen.</p>
        </div>
      )}
    </aside>
  );
};
