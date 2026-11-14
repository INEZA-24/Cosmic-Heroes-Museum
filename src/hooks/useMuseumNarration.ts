import { useCallback, useEffect, useRef, useState } from 'react';

export interface MuseumSpeechSegment {
  id: string;
  text: string;
  /** Returning an element here lets narration scroll to the passage in sync. */
  target?: () => HTMLElement | null;
}

const canSpeak = () => typeof window !== 'undefined' &&
  'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

/**
 * Visitor-initiated browser narration. A later audio-file upgrade can use the
 * same scripts and segment IDs, without modifying the museum's visible copy.
 *
 * Only the active passage is highlighted. Scrolling stops when speech stops,
 * and all pending utterances are canceled on view change/unmount.
 */
export function useMuseumNarration() {
  const [available] = useState(canSpeak);
  const [playing, setPlaying] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const session = useRef(0);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    session.current += 1;
    currentUtterance.current = null;
    if (canSpeak()) window.speechSynthesis.cancel();
    setPlaying(false);
    setActiveId(null);
  }, []);

  useEffect(() => () => {
    session.current += 1;
    currentUtterance.current = null;
    if (canSpeak()) window.speechSynthesis.cancel();
  }, []);

  const play = useCallback((segments: MuseumSpeechSegment[]) => {
    stop();
    if (!available || segments.length === 0) return;
    const run = ++session.current;
    setPlaying(true);

    const speakAt = (index: number) => {
      if (run !== session.current) return;
      if (index >= segments.length) {
        currentUtterance.current = null;
        setPlaying(false);
        setActiveId(null);
        return;
      }

      const segment = segments[index];
      const utterance = new SpeechSynthesisUtterance(segment.text);
      currentUtterance.current = utterance;
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (run !== session.current) return;
        setActiveId(segment.id);
        const target = segment.target?.();
        if (target) target.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'center',
        });
      };
      utterance.onend = () => speakAt(index + 1);
      utterance.onerror = () => {
        if (run !== session.current) return;
        setPlaying(false);
        setActiveId(null);
        currentUtterance.current = null;
      };
      window.speechSynthesis.speak(utterance);
    };

    speakAt(0);
  }, [available, stop]);

  return { available, playing, activeId, play, stop };
}
