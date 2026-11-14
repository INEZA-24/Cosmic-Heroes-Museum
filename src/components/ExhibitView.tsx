import { useEffect, useRef, type FC } from 'react';
import { machines } from '../data';
import { MachineModelViewer } from './MachineModelViewer';
import { ExhibitHero } from './ExhibitHero';
import { missionNarrations } from '../narrationScripts';
import { useMuseumNarration } from '../hooks/useMuseumNarration';

interface ExhibitViewProps {
  machineId: string;
  onBack: () => void;
  onSelectMachine: (machineId: string) => void;
}

export const ExhibitView: FC<ExhibitViewProps> = ({
  machineId,
  onBack,
  onSelectMachine,
}) => {
  const currentIndex = machines.findIndex((m) => m.id === machineId);
  const machine = machines[currentIndex >= 0 ? currentIndex : 0];

  const prevIndex = (currentIndex - 1 + machines.length) % machines.length;
  const nextIndex = (currentIndex + 1) % machines.length;
  const prevMachine = machines[prevIndex];
  const nextMachine = machines[nextIndex];

  const script = missionNarrations[machine.id];
  const narrator = useMuseumNarration();
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const milestoneRef = useRef<HTMLElement | null>(null);

  useEffect(() => { narrator.stop(); }, [machineId]);

  const listen = (id: string, text: string, target: () => HTMLElement | null) => {
    if (narrator.playing && narrator.activeId === id) {
      narrator.stop();
      return;
    }
    narrator.play([{ id, text, target }]);
  };

  const listenAllChapters = () => {
    if (narrator.playing && narrator.activeId?.startsWith('chapter-')) {
      narrator.stop();
      return;
    }
    narrator.play(script.chapters.map((text,index) => ({
      id: `chapter-${index}`, text, target: () => chapterRefs.current[index]
    })));
  };


  return (
    <article className="exhibit-view" id="exhibit-view">
      <div className="exhibit-nav-bar">
        <button className="back-link" onClick={onBack}>
          ← Back
        </button>
        <span className="exhibit-counter">
          MACHINE 0{currentIndex + 1} OF 0{machines.length}
        </span>
      </div>

      <ExhibitHero key={machine.id} machine={machine}
        narrationAvailable={narrator.available}
        introPlaying={narrator.playing && narrator.activeId==='opening'}
        onListenIntro={() => listen('opening',script.opening,() => document.querySelector<HTMLElement>('.exhibit-hero-content'))}
      />

      <div className="exhibit-audio-choice" role="note">
        <span aria-hidden="true">♫</span>
        <p><strong>Your visit, your pace.</strong> Select Listen in any section to hear its short story, or read and explore freely. Audio never starts automatically.</p>
        {narrator.playing && <button type="button" onClick={narrator.stop}>■ Stop audio</button>}
      </div>

      {machine.id === 'surveyor-3' ? (
        <section id="exhibit-model" className="exhibit-model-section" aria-label="Surveyor 3 mission archive">
          <div className="section-label">
            <p className="eyebrow">THE ENGINEERING HALL · LUNAR ARCHIVE</p>
            <h2>Explore the original lunar lander.</h2>
            <p className="viewer-introduction">Surveyor 3 is presented through historical photographs while we look for an accurate 3D reconstruction. Its scoop and camera helped engineers understand the lunar surface before Apollo.</p>
            <button type="button" className="exhibit-listen-btn" disabled={!narrator.available} onClick={() => listen('model',script.model,() => document.getElementById('exhibit-model'))}>▶ Listen to the machine's story</button>
            <a className="button button-primary" href="https://science.nasa.gov/resource/apollo-12-and-surveyor-3/" target="_blank" rel="noopener noreferrer">See NASA's Surveyor 3 photograph ↗</a>
          </div>
        </section>
      ) : (
        <section id="exhibit-model" className="exhibit-model-section" aria-label={machine.name + ' 3D model'}>
          <div className="section-label">
            <p className="eyebrow">THE ENGINEERING HALL · INTERACTIVE 3D</p>
            <h2>Examine the machine.</h2>
            <p className="viewer-introduction">Rotate, zoom and inspect the structure of {machine.name} from every side.</p>
            <button type="button" className="exhibit-listen-btn" disabled={!narrator.available} onClick={() => listen('model',script.model,() => document.getElementById('exhibit-model'))}>▶ Hear how this machine works</button>
          </div>
          <MachineModelViewer machineId={machine.id} machineName={machine.name} />
        </section>
      )}
      {machine.id === 'apollo-15-lrv' && (
        <section className="exhibit-model-section" aria-label="Apollo 15 Falcon Lunar Module">
          <div className="section-label">
            <p className="eyebrow">APOLLO 15 · THE LANDING SPACECRAFT</p>
            <h2>Meet Falcon, the rover's ride to the Moon.</h2>
            <p className="viewer-introduction">Before Apollo 15 astronauts could drive the lunar rover, the Lunar Module Falcon carried them down to the surface. The descent stage remained on the Moon when the astronauts lifted off. This interactive NASA model depicts the Apollo Lunar Module design, not an exact reconstruction of Falcon.</p>
            <figure className="falcon-archive-photo">
              <img src="/assets/exhibits/apollo-15-lrv/Falcon.webp" alt="Museum reference image of the Apollo 15 Lunar Module Falcon" loading="lazy" decoding="async" />
              <figcaption>Falcon image from the museum collection · Original image credit pending verification.</figcaption>
            </figure>
            <a href="https://www.nasa.gov/image-article/apollo-15-lunar-module-rover/" target="_blank" rel="noopener noreferrer" className="exhibit-hero-source">View NASA's documented Falcon and rover photograph ↗</a>
          </div>
          <MachineModelViewer machineId="apollo-lunar-module" machineName="Apollo Lunar Module (Falcon design reference)" />
        </section>
      )}

      {/* Key Quick Facts Grid */}
      <section className="exhibit-facts-grid" aria-label="Key Machine Specifications">
        <div className="fact-card">
          <span className="fact-label">LOCATION</span>
          <strong className="fact-value">{machine.location}</strong>
        </div>
        <div className="fact-card">
          <span className="fact-label">MACHINE TYPE</span>
          <strong className="fact-value">{machine.kind}</strong>
        </div>
        <div className="fact-card">
          <span className="fact-label">LAUNCH DATE</span>
          <strong className="fact-value">{machine.launchDate || machine.year}</strong>
        </div>
        <div className="fact-card">
          <span className="fact-label">TOUCHDOWN / ENCOUNTER</span>
          <strong className="fact-value">{machine.landingDate || 'Deep Space Trajectory'}</strong>
        </div>
      </section>

      {/* Story Chapters */}
      {machine.story && machine.story.length > 0 && (
        <section className="exhibit-story-section">
          <div className="section-label">
            <p className="eyebrow">EXHIBIT CHAPTERS</p>
            <h2>The Journey & Legacy</h2>
            <p className="exhibit-audio-description">Hear the short narrated version of each chapter, or keep reading the complete story.</p>
            <button type="button" className="exhibit-listen-btn" disabled={!narrator.available} onClick={listenAllChapters}> {narrator.playing && narrator.activeId?.startsWith('chapter-') ? '■ Stop story' : '▶ Listen to the complete story'}</button>
          </div>
          <div className="story-chapters-list">
            {machine.story.map((chap, idx) => (
              <div key={idx} ref={el => { chapterRefs.current[idx]=el; }} className={`story-chapter-card${narrator.activeId===`chapter-${idx}`?' is-speaking':''}`}>
                <span className="chapter-number">CHAPTER 0{idx + 1}</span>
                <h3>{chap.title}</h3>
                <button type="button" className="exhibit-chapter-listen" disabled={!narrator.available} onClick={() => listen(`chapter-${idx}`,script.chapters[idx] ?? chap.content,() => chapterRefs.current[idx])}> {narrator.playing && narrator.activeId===`chapter-${idx}`?'■ Stop':'▶ Listen to chapter'}</button>
                <p>{chap.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Engineering Highlights */}
      {machine.engineering && machine.engineering.length > 0 && (
        <section className="exhibit-engineering-section">
          <div className="section-label">
            <p className="eyebrow">AEROSPACE ARCHITECTURE</p>
            <h2>Engineering of Steel</h2>
            <button type="button" className="exhibit-listen-btn" disabled={!narrator.available} onClick={() => listen('engineering',script.engineering,() => document.querySelector<HTMLElement>('.exhibit-engineering-section'))}>▶ Listen to the engineering story</button>
          </div>
          <ul className="engineering-specs-list">
            {machine.engineering.map((spec, idx) => (
              <li key={idx} className="spec-item">
                <span className="spec-bullet">✳</span>
                <span>{spec}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Scientific Discoveries */}
      {machine.discoveries && machine.discoveries.length > 0 && (
        <section className="exhibit-discoveries-section">
          <div className="section-label">
            <p className="eyebrow">SCIENTIFIC IMPACT</p>
            <h2>Major Discoveries</h2>
            <button type="button" className="exhibit-listen-btn" disabled={!narrator.available} onClick={() => listen('discoveries',script.discoveries,() => document.querySelector<HTMLElement>('.exhibit-discoveries-section'))}>▶ Listen to the discoveries</button>
          </div>
          <div className="discoveries-grid">
            {machine.discoveries.map((disc, idx) => (
              <div key={idx} className="discovery-card">
                <span className="discovery-num">0{idx + 1}</span>
                <p>{disc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section ref={milestoneRef} className={`exhibit-mission-moment${narrator.activeId==='milestone'?' is-speaking':''}`} aria-label="Mission-defining milestone">
        <span className="exhibit-moment-symbol" aria-hidden="true">✦</span>
        <div>
          <p className="eyebrow">THE MOMENT THAT CHANGED THE MISSION · {script.milestone.date}</p>
          <h2>{script.milestone.title}</h2>
          <p>{script.milestone.text}</p>
          <button type="button" className="exhibit-listen-btn" disabled={!narrator.available}
            onClick={() => listen('milestone', script.milestone.text, () => milestoneRef.current)}>
            {narrator.playing && narrator.activeId==='milestone'?'■ Stop highlight':'▶ Hear this moment'}
          </button>
        </div>
      </section>

      {/* Mission Timeline */}
      {machine.timeline && machine.timeline.length > 0 && (
        <section className="exhibit-timeline-section">
          <div className="section-label">
            <p className="eyebrow">HISTORICAL CHRONOLOGY</p>
            <h2>Mission Milestones</h2>
          </div>
          <div className="timeline-track">
            {machine.timeline.map((evt, idx) => (
              <div key={idx} className="timeline-event">
                <div className="timeline-point" />
                <div className="timeline-content">
                  <span className="timeline-date">{evt.date}</span>
                  <h4>{evt.title}</h4>
                  <p>{evt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Verified NASA Sources */}
      {machine.sourceUrl && (
        <section className="exhibit-source-card">
          <div>
            <span className="source-tag">VERIFIED ARCHIVAL SOURCE</span>
            <h3>{machine.sourceLabel || 'NASA Mission Archives'}</h3>
            <p>
              Primary mission records, scientific papers, and telemetry archived by the National Aeronautics and Space Administration.
            </p>
          </div>
          <a
            href={machine.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-primary"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Read NASA Mission Record ↗
          </a>
        </section>
      )}

      {/* Previous / Next Machine Navigation */}
      <footer className="exhibit-footer-nav">
        <button
          className="nav-machine-btn prev-btn"
          onClick={() => onSelectMachine(prevMachine.id)}
        >
          <span className="nav-arrow">←</span>
          <div>
            <small>PREVIOUS EXHIBIT</small>
            <strong>{prevMachine.name}</strong>
          </div>
        </button>

        <button
          className="nav-machine-btn next-btn"
          onClick={() => onSelectMachine(nextMachine.id)}
        >
          <div>
            <small>NEXT EXHIBIT</small>
            <strong>{nextMachine.name}</strong>
          </div>
          <span className="nav-arrow">→</span>
        </button>
      </footer>
    </article>
  );
};
