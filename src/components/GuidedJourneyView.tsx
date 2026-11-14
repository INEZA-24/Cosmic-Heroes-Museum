import { useEffect, useRef, useState, type FC } from 'react';
import { machines } from '../data';
import { exhibitHeroes } from '../exhibitHeroes';
import { MuseumGuideBubble, type MuseumGuidePose } from './MuseumGuideBubble';

const ordered = [...machines].sort((a,b) => (a.launchDate ? new Date(a.launchDate).getTime() : 0) - (b.launchDate ? new Date(b.launchDate).getTime() : 0));

const guideIntroductions: Record<string, string> = {
  'surveyor-3': "Before astronauts could walk on the Moon, robotic explorers tested the ground. Meet Surveyor 3, whose experiments helped prepare the way.",
  'apollo-15-lrv': "Our next stop is 1971. Apollo 15's Falcon lander carried the first lunar rover to the Moon, allowing astronauts to travel farther than ever before.",
  'pioneer-10': "Now we're heading much farther out. Pioneer 10 became the first spacecraft to explore Jupiter up close.",
  'viking-1': "In 1976, Viking 1 touched down on Mars with its own laboratory. What could its experiments reveal about the Red Planet?",
  'sojourner': "Let's meet the small rover that proved wheels could explore Mars. Sojourner opened a new era of robotic mobility.",
  'cassini-huygens': "Our next destination is Saturn. Cassini explored the ringed giant, while Huygens descended to the surface of Titan.",
  'opportunity': "Opportunity was supposed to explore Mars for just 90 sols. Instead, its extraordinary journey lasted almost fifteen years.",
  'insight': "For our final mission, we'll listen beneath the surface of Mars. InSight used marsquakes to investigate the planet's hidden interior."
};
const guidePoseByMission: Record<string, MuseumGuidePose> = {
  'surveyor-3': 'presenting-one-hand',
  'apollo-15-lrv': 'neutral-hands-clasped',
  'pioneer-10': 'explaining-two-hands',
  'viking-1': 'presenting-one-hand',
  'sojourner': 'explaining-two-hands',
  'cassini-huygens': 'presenting-one-hand',
  'opportunity': 'explaining-two-hands',
  'insight': 'neutral-hands-clasped'
};

interface GuidedJourneyProps { onExit: () => void; }

export const GuidedJourneyView: FC<GuidedJourneyProps> = ({onExit}) => {
  const [index, setIndex] = useState(0);
  const [guideVisible, setGuideVisible] = useState(true);
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
  useEffect(() => { setGuideVisible(true); }, [index]);
  useEffect(() => {
    if (!guideVisible) return;
    const timer = window.setTimeout(() => setGuideVisible(false), 10000);
    return () => window.clearTimeout(timer);
  }, [index, guideVisible]);
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
    setGuideVisible(false);
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
        {!guideVisible && <button type="button" className="guided-guide-reopen" onClick={() => setGuideVisible(true)}>Show guide</button>}
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
      {guideVisible && (
        <MuseumGuideBubble
          key={current.id}
          context="journey"
          side="right"
          pose={guidePoseByMission[current.id] ?? 'neutral-hands-clasped'}
          label={`YOUR MUSEUM GUIDE · CHAPTER ${index + 1}`}
          message={guideIntroductions[current.id] ?? 'Welcome to the next chapter of our exploration.'}
          onDismiss={() => setGuideVisible(false)}
        />
      )}
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
