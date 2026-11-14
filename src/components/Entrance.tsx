import { BrandEmblem } from './BrandEmblem';
import { useEffect, useRef, useState, type FC } from 'react';

interface EntranceProps {
  onEnter: () => void;
}

/**
 * The curtain animation is decorative; everyone enters through the same
 * Welcome action (including users who scroll down to reveal the museum).
 */
export const Entrance: FC<EntranceProps> = ({ onEnter }) => {
  const [isOpening, setIsOpening] = useState(false);
  const openingRef = useRef(false);
  const enterTimer = useRef<number | null>(null);

  const handleEnter = () => {
    if (openingRef.current) return;
    openingRef.current = true;
    setIsOpening(true);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    enterTimer.current = window.setTimeout(onEnter, reduceMotion ? 140 : 1880);
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

  return (
    <section className={`entrance ${isOpening ? 'opening' : ''}`} id="entrance" aria-labelledby="museum-title">
      <div className="curtain curtain-left" aria-hidden="true" />
      <div className="curtain curtain-right" aria-hidden="true" />
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
            <span>{isOpening ? 'OPENING THE MUSEUM' : 'WELCOME · STEP INSIDE'}</span>
            <span className="entrance-welcome-arrow" aria-hidden="true">↗</span>
          </button>
        </div>
        <p className="entrance-scroll-hint">Or scroll down to open the curtains</p>
      </div>

      <p className="entrance-footer">HUMAN CURIOSITY · ENGINEERED TO EXPLORE</p>
    </section>
  );
};
