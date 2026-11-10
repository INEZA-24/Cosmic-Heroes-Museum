import { useEffect, useState, type FC } from 'react';
import type { Machine } from '../types';

/** One historical chapter at a time, with an optional spoken interpretation. */
export const MissionStory: FC<{ machine: Machine }> = ({ machine }) => {
  const chapters = machine.story ?? [];
  const [chapterIndex, setChapterIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [speechAvailable] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  useEffect(() => {
    if (speechAvailable) window.speechSynthesis.cancel();
    setSpeaking(false);
    return () => { if (speechAvailable) window.speechSynthesis.cancel(); };
  }, [machine.id, chapterIndex, speechAvailable]);

  if (!chapters.length) return null;
  const chapter = chapters[chapterIndex];
  const selectChapter = (index: number) => setChapterIndex(Math.max(0, Math.min(chapters.length - 1, index)));
  const toggleNarration = () => {
    if (!speechAvailable) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(chapter.title + '. ' + chapter.content);
    voice.rate = 0.9;
    voice.onend = () => setSpeaking(false);
    voice.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(voice);
    setSpeaking(true);
  };

  return (
    <section className="mission-story-experience" aria-label={machine.name + ' narrated history'}>
      <div className="section-label">
        <p className="eyebrow">THE MUSEUM STORY ROOM · INTERACTIVE NARRATIVE</p>
        <h2>Follow the mission.</h2>
        <p className="mission-story-prompt">Discover one chapter at a time, or listen while you explore.</p>
      </div>
      <div className="mission-story-shell">
        <div className="mission-story-index">
          {chapters.map((item, index) => (
            <button
              type="button" key={item.title} onClick={() => selectChapter(index)}
              className={'story-step' + (index === chapterIndex ? ' is-active' : '')}
              aria-current={index === chapterIndex ? 'step' : undefined}
            >
              <span>CHAPTER 0{index + 1}</span><strong>{item.title}</strong>
            </button>
          ))}
        </div>
        <div className="mission-story-stage">
          <div className="story-stage-label">EXHIBIT {machine.year} <span>·</span> PART {chapterIndex + 1} / {chapters.length}</div>
          <div key={machine.id + '-' + chapterIndex} className="story-stage-page" aria-live="polite">
            <h3>{chapter.title}</h3><p>{chapter.content}</p>
          </div>
          <div className="story-stage-controls">
            <button type="button" className="story-stage-nav" onClick={() => selectChapter(chapterIndex - 1)} disabled={chapterIndex === 0}>← Previous</button>
            {speechAvailable && <button type="button" className="story-stage-speak" onClick={toggleNarration}>{speaking ? '■ Stop narration' : '▶ Narrate this chapter'}</button>}
            <button type="button" className="story-stage-nav" onClick={() => selectChapter(chapterIndex + 1)} disabled={chapterIndex === chapters.length - 1}>Next chapter →</button>
          </div>
        </div>
      </div>
    </section>
  );
};
