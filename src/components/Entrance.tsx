import { BrandEmblem } from './BrandEmblem';
import { EntranceEarth } from './EntranceEarth';
import { MuseumGuideBubble } from './MuseumGuideBubble';
import { useEffect, useRef, useState, type FC } from 'react';

interface EntranceProps {
  onEnter: () => void;
}

/**
 * Opening retains the original curtain slide; the single Begin Tour action
 * and wheel gesture enter through the same guarded transition.
 */
export const Entrance: FC<EntranceProps> = ({ onEnter }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showStella, setShowStella] = useState(true);
  const openingRef = useRef(false);
  const enterTimer = useRef<number | null>(null);

  const handleEnter = () => {
    if (openingRef.current) return;
    openingRef.current = true;
    setIsOpening(true);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    enterTimer.current = window.setTimeout(onEnter, reduceMotion ? 140 : 1400);
  };

  useEffect(() => {
    const scrollToEnter = (event: WheelEvent) => {
      if (event.deltaY > 22 && !openingRef.current) handleEnter();
    };
    window.addEventListener('wheel', scrollToEnter, { passive: true });
    return () => {
      window.removeEventListener('wheel', scrollToEnter);
      if (enterTimer.current !== null) window.clearTimeout(enterTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!showStella || isOpening) return;
    const timer = window.setTimeout(() => setShowStella(false), 10000);
    return () => window.clearTimeout(timer);
  }, [showStella, isOpening]);

  return (
    <section className={`entrance ${isOpening ? 'opening' : ''}`} id="entrance" aria-labelledby="museum-title">
      <div className="curtain curtain-left" aria-hidden="true" />
      <div className="curtain curtain-right" aria-hidden="true" />
      <EntranceEarth />
      <div className="entrance-glow" aria-hidden="true" />

      <div className="entrance-content">
        <div className="entrance-heading">
          <BrandEmblem className="museum-emblem" />
          <p className="eyebrow">A DIGITAL MUSEUM OF EXPLORATION</p>
          <h1 id="museum-title">
            COSMIC HEROES <span>OF STEEL MUSEUM</span>
          </h1>
          <p className="entrance-copy">Every machine has a story. Every journey leaves a legacy.</p>
        </div>

        <div className="entrance-actions">
          <button
            className="entrance-welcome-button"
            id="enter-button"
            type="button"
            disabled={isOpening}
            onClick={handleEnter}
          >
            <span>{isOpening ? 'OPENING THE MUSEUM' : 'BEGIN TOUR'}</span>
          </button>
        </div>
        <p className="entrance-scroll-hint">Or scroll down to open the curtains</p>
      </div>

      {showStella && !isOpening ? (
        <MuseumGuideBubble
          context="entrance"
          side="left"
          pose="welcome-wave"
          label="STELLA · YOUR MUSEUM GUIDE"
          message="Hi, I’m Stella, your guide through the Cosmic Heroes of Steel Museum. Click Begin Tour to step inside and discover the robotic explorers and stories waiting for you."
          onDismiss={() => setShowStella(false)}
        />
      ) : !isOpening ? (
        <button type="button" className="entrance-stella-reopen" onClick={() => setShowStella(true)}>
          Meet Stella
        </button>
      ) : null}

      <p className="entrance-footer">HUMAN CURIOSITY · ENGINEERED TO EXPLORE</p>
    </section>
  );
};
