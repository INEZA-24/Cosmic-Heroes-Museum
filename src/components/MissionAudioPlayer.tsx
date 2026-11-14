import { useEffect, useRef, useState, type FC } from 'react';
import { getMissionAudioSrc } from '../audioTracks';

type Waypoint = () => HTMLElement | null;

interface MissionAudioPlayerProps {
  missionId: string;
  /** Optional broad story sections, not word-level transcript timestamps. */
  waypoints?: Waypoint[];
  onStart?: () => void;
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const time = Math.floor(seconds);
  return `${Math.floor(time / 60)}:${String(time % 60).padStart(2, '0')}`;
};

/** One visitor-initiated, recorded Stella story per mission. */
export const MissionAudioPlayer: FC<MissionAudioPlayerProps> = ({
  missionId, waypoints = [], onStart
}) => {
  const src = getMissionAudioSrc(missionId);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastWaypoint = useRef(-1);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [follow, setFollow] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lastWaypoint.current = -1;
    return () => { audioRef.current?.pause(); };
  }, [missionId]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (!audio.paused) { audio.pause(); return; }
    setError(null);
    try {
      await audio.play();
      onStart?.();
    } catch {
      setPlaying(false);
      setError('This recording could not be played. Check the audio file and try again.');
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    lastWaypoint.current = -1;
    setPlaying(false);
    setElapsed(0);
  };

  const updateTime = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setElapsed(audio.currentTime);
    if (!follow || audio.paused || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    // The final recordings have no word-level timestamp track.
    // Follow three approximate story phases rather than claiming exact sync.
    const fraction = audio.currentTime / audio.duration;
    const thresholds = [0.16, 0.43, 0.71];
    let current = -1;
    for (let i = 0; i < Math.min(waypoints.length, thresholds.length); i += 1) {
      if (fraction >= thresholds[i]) current = i;
    }
    if (current !== -1 && current !== lastWaypoint.current) {
      lastWaypoint.current = current;
      const target = waypoints[current]?.();
      target?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(value, audio.duration));
    lastWaypoint.current = -1;
    setElapsed(audio.currentTime);
  };

  if (!src) return null;

  return (
    <section className="mission-audio" aria-label="Stella's recorded mission story">
      <audio
        key={src}
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); lastWaypoint.current = -1; }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onTimeUpdate={updateTime}
        onError={() => setError('Recording unavailable. Please check the uploaded MP3.')}
      />
      <div className="mission-audio-heading">
        <span className="mission-audio-eyebrow">Museum audio guide · Stella</span>
        <p>Hear the mission story</p>
      </div>
      <div className="mission-audio-controls">
        <button type="button" className="mission-audio-primary"
          onClick={toggle} aria-label={playing ? 'Pause Stella narration' : 'Play Stella narration'}>
          {playing ? 'Pause' : elapsed > 0 && elapsed < duration ? 'Resume' : 'Listen to Stella'}
        </button>
        {(playing || elapsed > 0) && (
          <button type="button" className="mission-audio-secondary" onClick={stop}>Stop</button>
        )}
      </div>
      <div className="mission-audio-footer">
        <input
          className="mission-audio-timeline" type="range"
          min={0} max={Math.max(1, duration)} step={1}
          value={Math.min(elapsed, Math.max(1, duration))}
          aria-label="Seek within narration"
          onChange={event => seek(Number(event.currentTarget.value))}
        />
        <span className="mission-audio-time">{formatTime(elapsed)} / {formatTime(duration)}</span>
        {waypoints.length > 0 && (
          <button className="mission-audio-follow" type="button"
            aria-pressed={follow} onClick={() => { setFollow(value => !value); lastWaypoint.current = -1; }}>
            Follow text: {follow ? 'On' : 'Off'}
          </button>
        )}
      </div>
      {error && <p className="mission-audio-error" role="alert">{error}</p>}
    </section>
  );
};
