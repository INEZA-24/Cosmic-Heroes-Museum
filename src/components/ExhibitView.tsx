import { type FC } from 'react';
import { machines } from '../data';
import { MachineModelViewer } from './MachineModelViewer';
import { ExhibitHero } from './ExhibitHero';

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

      <ExhibitHero key={machine.id} machine={machine} />

      {/* Machine first: real 3D structure, without blocking exhibition content if no model has been uploaded. */}
      <section id="exhibit-model" className="exhibit-model-section" aria-label={machine.name + ' 3D model'}>
        <div className="section-label">
          <p className="eyebrow">THE ENGINEERING HALL · INTERACTIVE 3D</p>
          <h2>Examine the machine.</h2>
          <p className="viewer-introduction">Rotate, zoom and inspect the structure of {machine.name} from every side.</p>
        </div>
        <MachineModelViewer machineId={machine.id} machineName={machine.name} />
      </section>

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
          </div>
          <div className="story-chapters-list">
            {machine.story.map((chap, idx) => (
              <div key={idx} className="story-chapter-card">
                <span className="chapter-number">CHAPTER 0{idx + 1}</span>
                <h3>{chap.title}</h3>
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
