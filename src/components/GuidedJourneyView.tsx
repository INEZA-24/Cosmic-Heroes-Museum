import { useEffect, useRef, useState, type FC } from 'react';
import { machines } from '../data';
import { exhibitHeroes } from '../exhibitHeroes';
import { missionNarrations } from '../narrationScripts';
import { useMuseumNarration } from '../hooks/useMuseumNarration';
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

interface GuidedJourneyProps {
  onExit: () => void;
  onExploreMachine: (machineId: string) => void;
  initialMissionId?: string | null;
}

/**
 * The tour is deliberately a snapshot, not the complete exhibit story.
 * Visitors can hear three concise beats and a featured milestone, then
 * explore the full exhibit, model and chapter narration at their own pace.
 */
export const GuidedJourneyView: FC<GuidedJourneyProps> = ({
  onExit, onExploreMachine, initialMissionId
}) => {
  const [index, setIndex] = useState(() => Math.max(0, ordered.findIndex(m => m.id === initialMissionId)));
  const [guideVisible, setGuideVisible] = useState(true);
  const paragraphs = useRef<Array<HTMLParagraphElement | null>>([]);
  const milestoneRef = useRef<HTMLElement | null>(null);
  const narrator = useMuseumNarration();

  const current = ordered[index];
  const script = missionNarrations[current.id];
  const photo = exhibitHeroes[current.id];

  useEffect(() => {
    narrator.stop();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [index]);

  useEffect(() => { setGuideVisible(true); }, [index]);
  useEffect(() => {
    if (!guideVisible) return;
    const timer = window.setTimeout(() => setGuideVisible(false), 10000);
    return () => window.clearTimeout(timer);
  }, [index, guideVisible]);

  const change = (next: number) => {
    narrator.stop();
    setIndex(next);
  };

  const listenSnapshot = () => {
    if (narrator.playing && narrator.activeId?.startsWith('snapshot-')) { narrator.stop(); return; }
    setGuideVisible(false);
    narrator.play(script.snapshot.map((text,i) => ({
      id: `snapshot-${i}`,
      text,
      target: () => paragraphs.current[i],
    })));
  };
  const listenMilestone = () => {
    if (narrator.playing && narrator.activeId === 'milestone') { narrator.stop(); return; }
    setGuideVisible(false);
    narrator.play([{id:'milestone',text:script.milestone.text,target:()=>milestoneRef.current}]);
  };
  const leave = () => { narrator.stop(); onExit(); };
  const explore = () => { narrator.stop(); onExploreMachine(current.id); };

  return (
    <article className="guided-journey" aria-label="Short chronological guided museum tour">
      <div className="guided-topbar">
        <button type="button" onClick={leave} className="back-link">← Return to the Universe</button>
        <span className="eyebrow">THE GUIDED JOURNEY · CHAPTER {index + 1} OF {ordered.length}</span>
        {!guideVisible && <button type="button" className="guided-guide-reopen" onClick={() => setGuideVisible(true)}>Show guide</button>}
      </div>
      <div className="guided-progress" aria-label="Tour progress">
        {ordered.map((machine,i) => (
          <button type="button" key={machine.id}
            className={i===index?'is-current':''}
            aria-current={i===index?'step':undefined}
            title={machine.name}
            aria-label={`Go to chapter ${i+1}: ${machine.name}`}
            onClick={() => change(i)}
          />
        ))}
      </div>

      <header className="guided-cover">
        <div className="guided-cover-copy">
          <p className="eyebrow">{current.place.toUpperCase()} · LAUNCHED {current.launchDate ?? current.year}</p>
          <h1>{current.name}</h1>
          <p>{current.summary}</p>
          <button type="button" onClick={listenSnapshot} className="guided-audio"
            disabled={!narrator.available} aria-pressed={narrator.playing && narrator.activeId?.startsWith('snapshot-')}>
            {narrator.available
              ? (narrator.playing && narrator.activeId?.startsWith('snapshot-') ? '■ Stop snapshot' : '▶ Listen to the 30-second story')
              : 'Audio not supported in this browser'}
          </button>
          <p className="guided-audio-note">A short story, not the whole exhibit. Listening scrolls through the three moments; reading is always optional.</p>
        </div>
        {photo && <img src={photo.src} alt={current.name} className="guided-cover-image"/>}
      </header>

      {guideVisible && (
        <MuseumGuideBubble
          key={current.id} context="journey" side="right"
          pose={guidePoseByMission[current.id] ?? 'neutral-hands-clasped'}
          label={`YOUR MUSEUM GUIDE · CHAPTER ${index + 1}`}
          message={guideIntroductions[current.id] ?? 'Welcome to our next mission.'}
          onDismiss={() => setGuideVisible(false)}
        />
      )}

      <section className="guided-snapshot" aria-label="Three moments from the mission">
        <div className="guided-snapshot-heading">
          <div>
            <p className="eyebrow">THREE MOMENTS · ONE INCREDIBLE MISSION</p>
            <h2>The short story</h2>
            <p>Choose Listen or explore these moments in your own time.</p>
          </div>
          <button type="button" className="guided-snapshot-explore" onClick={explore}>
            Explore full exhibit & {current.id==='surveyor-3'?'archive':'3D model'} →
          </button>
        </div>
        <div className="guided-snapshot-beats">
          {script.snapshot.map((text,i) => (
            <div key={i}
              className={`guided-snapshot-beat${narrator.activeId === `snapshot-${i}` ? ' is-speaking' : ''}`}>
              <span className="guided-snapshot-number">0{i+1}</span>
              <p ref={el => { paragraphs.current[i] = el; }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <aside ref={milestoneRef} className={`guided-snapshot-spotlight${narrator.activeId==='milestone'?' is-speaking':''}`} aria-label="Defining mission milestone">
        <div className="guided-snapshot-spotlight-mark" aria-hidden="true">✦</div>
        <div>
          <p className="eyebrow">A MOMENT THAT CHANGED SPACE EXPLORATION · {script.milestone.date}</p>
          <h2>{script.milestone.title}</h2>
          <p>{script.milestone.text}</p>
          <button type="button" onClick={listenMilestone}
            disabled={!narrator.available} className="guided-snapshot-listen">
            {narrator.playing && narrator.activeId==='milestone' ? '■ Stop moment' : '▶ Hear this moment'}
          </button>
        </div>
      </aside>

      <div className="guided-snapshot-end">
        <p className="eyebrow">THE REST OF THE STORY IS WAITING</p>
        <p>Explore the real mission timeline, scientific discoveries and the machine itself.</p>
        <button type="button" className="button button-primary" onClick={explore}>
          Explore {current.name} in detail →
        </button>
      </div>
      <nav className="guided-navigation" aria-label="Guided tour chapter navigation">
        <button type="button" className="button button-quiet" onClick={()=>index===0?leave():change(index-1)}>
          {index===0?'← Exit tour':'← Previous mission'}
        </button>
        {index+1<ordered.length ? (
          <button type="button" className="button button-primary" onClick={()=>change(index+1)}>
            Next mission: {ordered[index+1].name} →
          </button>
        ) : (
          <button type="button" className="button button-primary" onClick={leave}>Finish tour · Return to Universe</button>
        )}
      </nav>
    </article>
  );
};
