import { useEffect, useRef, useState, type FC } from 'react';
import { machines } from '../data';
import { exhibitHeroes } from '../exhibitHeroes';

const ordered = [...machines].sort((a,b) => (a.launchDate ? new Date(a.launchDate).getTime() : 0) - (b.launchDate ? new Date(b.launchDate).getTime() : 0));

interface GuidedJourneyProps { onExit: () => void; }

export const GuidedJourneyView: FC<GuidedJourneyProps> = ({onExit}) => {
  const [index, setIndex] = useState(0);
  const [activeParagraph, setActiveParagraph] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speechAvailable] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const paragraphRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const current = ordered[index];
  const paragraphs = (current.story ?? []).map(c => c.content);
  const stop = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setPlaying(false);
    setActiveParagraph(-1);
  };
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); },[]);
  useEffect(() => {
    stop();
    window.scrollTo({top:0,behavior:'smooth'});
  },[index]);
  const speakParagraph = (position:number) => {
    if (position >= paragraphs.length || !('speechSynthesis' in window)) {
      setPlaying(false);
      setActiveParagraph(-1);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(paragraphs[position]);
    utterance.lang = 'en-US';
    utterance.rate = 0.91;
    utterance.onstart = () => {
      setActiveParagraph(position);
      paragraphRefs.current[position]?.scrollIntoView({behavior:'smooth',block:'center'});
    };
    utterance.onend = () => speakParagraph(position + 1);
    utterance.onerror = () => { setPlaying(false); setActiveParagraph(-1); };
    window.speechSynthesis.speak(utterance);
  };
  const play = () => {
    if (!speechAvailable) return;
    if (playing) { stop(); return; }
    window.speechSynthesis.cancel();
    setPlaying(true);
    speakParagraph(0);
  };
  const change = (next:number) => {
    stop();
    setIndex(next);
  };
  const photo = exhibitHeroes[current.id];
  return (
    <article className="guided-journey" aria-label="Chronological guided museum tour">
      <div className="guided-topbar">
        <button type="button" onClick={() => {stop(); onExit();}} className="back-link">← Return to the Universe</button>
        <span className="eyebrow">THE GUIDED JOURNEY · CHAPTER {index + 1} OF {ordered.length}</span>
      </div>
      <div className="guided-progress" aria-label="Tour progress">{ordered.map((m,i)=><button type="button" key={m.id} className={i===index?'is-current':''} aria-current={i===index?'step':undefined} onClick={()=>change(i)} title={m.name} aria-label={`Go to chapter ${i+1}: ${m.name}`}/>)}</div>
      <header className="guided-cover">
        <div className="guided-cover-copy">
          <p className="eyebrow">{current.place.toUpperCase()} · LAUNCHED {current.launchDate ?? current.year}</p>
          <h1>{current.name}</h1>
          <p>{current.summary}</p>
          <button type="button" onClick={play} className="guided-audio" disabled={!speechAvailable} aria-pressed={playing}>
            {speechAvailable ? (playing ? '■ Stop narration' : '▶ Listen to this chapter') : 'Narration is unavailable in this browser'}
          </button>
          <p className="guided-audio-note">You can read at your own pace. Narration follows each passage when started.</p>
        </div>
        {photo && <img src={photo.src} alt={current.name} className="guided-cover-image"/>}
      </header>
      <div className="guided-body">
        <section className="guided-story" aria-label="Narrated mission story">
          <p className="eyebrow">A STORY OF DISCOVERY</p>
          {(current.story ?? []).map((chapter,i)=>(
            <div key={i} className="guided-story-chapter">
              <h2>{chapter.title}</h2>
              <p ref={element => { paragraphRefs.current[i] = element; }} className={activeParagraph===i?'is-speaking':''}>{chapter.content}</p>
            </div>
          ))}
        </section>
        <aside className="guided-details">
          <p className="eyebrow">MISSION AT A GLANCE</p>
          <dl>
            <div><dt>LAUNCH</dt><dd>{current.launchDate ?? current.year}</dd></div>
            <div><dt>DESTINATION</dt><dd>{current.place}</dd></div>
            <div><dt>TYPE</dt><dd>{current.kind}</dd></div>
            <div><dt>ARRIVAL / ENCOUNTER</dt><dd>{current.landingDate ?? '—'}</dd></div>
          </dl>
          <h3>What this explorer achieved</h3>
          <ul>{(current.discoveries ?? []).map((achievement,i)=><li key={i}>{achievement}</li>)}</ul>
        </aside>
      </div>
      <section className="guided-milestones">
        <p className="eyebrow">THE MISSION CHRONICLE</p>
        <h2>Moments that shaped the journey</h2>
        <ol>{(current.timeline ?? []).map((moment,i)=><li key={i}><time>{moment.date}</time><strong>{moment.title}</strong><p>{moment.desc}</p></li>)}</ol>
      </section>
      <nav className="guided-navigation" aria-label="Guided tour chapter navigation">
        <button type="button" className="button button-quiet" onClick={()=>index===0?onExit():change(index-1)}>{index===0?'← Exit tour':'← Previous chapter'}</button>
        {index+1<ordered.length ? <button type="button" className="button button-primary" onClick={()=>change(index+1)}>Next exhibit: {ordered[index+1].name} →</button> : <button type="button" className="button button-primary" onClick={()=>{stop();onExit();}}>Finish tour · Return to Universe ↗</button>}
      </nav>
    </article>
  );
};
