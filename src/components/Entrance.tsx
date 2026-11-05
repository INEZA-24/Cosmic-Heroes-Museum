import { BrandEmblem } from './BrandEmblem';
import { useState, useEffect, useRef, type FC } from 'react';

interface EntranceProps {
  onEnter: () => void;
}

export const Entrance: FC<EntranceProps> = ({ onEnter }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
    return () => {
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleEnter = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlayingNarration(false);
    }
    setIsOpening(true);
    setTimeout(() => {
      onEnter();
    }, 650);
  };

  const handleSkip = () => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlayingNarration(false);
    }
    onEnter();
  };

  const toggleNarration = () => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlayingNarration(false);
      return;
    }

    const narrationText =
      "Welcome to the Cosmic Heroes of Steel Museum. Explore our Solar System and discover the extraordinary machines that carried humanity's curiosity beyond Earth.";
    const u = new SpeechSynthesisUtterance(narrationText);
    u.rate = 0.92;
    u.onend = () => setIsPlayingNarration(false);
    u.onerror = () => setIsPlayingNarration(false);
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
    setIsPlayingNarration(true);
  };

  return (
    <section className={`entrance ${isOpening ? 'opening' : ''}`} id="entrance" aria-labelledby="museum-title">
      <div className="curtain curtain-left"></div>
      <div className="curtain curtain-right"></div>
      <div className="entrance-glow"></div>

      <div className="entrance-content">
        <BrandEmblem className="museum-emblem" />
        <p className="eyebrow">A DIGITAL MUSEUM OF EXPLORATION</p>
        <h1 id="museum-title">
          COSMIC HEROES <span>OF STEEL MUSEUM</span>
        </h1>
        <p className="entrance-copy">Every machine has a story. Every journey leaves a legacy.</p>

        <div className="entrance-actions">
          <button className="button button-primary" id="enter-button" onClick={handleEnter}>
            Enter the museum ↗
          </button>
          <button className="button button-quiet" id="skip-button" onClick={handleSkip}>
            Skip intro
          </button>
        </div>

        <button
          className="audio-control"
          id="welcome-audio"
          onClick={toggleNarration}
          disabled={!speechSupported}
        >
          {!speechSupported
            ? 'Narration unavailable'
            : isPlayingNarration
            ? '■ Stop narration'
            : '▶ Play welcome narration'}
        </button>
      </div>

      <p className="entrance-footer">HUMAN CURIOSITY · ENGINEERED TO EXPLORE</p>
    </section>
  );
};
