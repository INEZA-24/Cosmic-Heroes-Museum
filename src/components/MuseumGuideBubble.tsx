import { type FC } from 'react';

export type MuseumGuidePose =
  | 'welcome-wave'
  | 'neutral-hands-clasped'
  | 'presenting-one-hand'
  | 'explaining-two-hands';

interface MuseumGuideBubbleProps {
  message: string;
  secondary?: string;
  pose: MuseumGuidePose;
  side?: 'left' | 'right';
  context?: 'solar' | 'journey';
  label?: string;
  onDismiss: () => void;
}

// These are the exact case-sensitive WebP files already uploaded to GitHub.
// The neutral pose is currently named "clapseds" in the repository.
const imageByPose: Record<MuseumGuidePose, string> = {
  'welcome-wave': '/assets/tour-guide/welcome-wave.webp',
  'neutral-hands-clasped': '/assets/tour-guide/neutral-hands-clapseds.webp',
  'presenting-one-hand': '/assets/tour-guide/presenting-one-hand.webp',
  'explaining-two-hands': '/assets/tour-guide/explaining-two-hands.webp',
};

/**
 * A corner-anchored speech/thought bubble, not a new section in document flow.
 * The character is mirrored only for the one-hand pose when appearing on the
 * right, so the hand points back toward the dialogue and the exhibit content.
 */
export const MuseumGuideBubble: FC<MuseumGuideBubbleProps> = ({
  message, secondary, pose, side = 'left', context = 'journey',
  label = 'YOUR MUSEUM GUIDE', onDismiss,
}) => (
  <aside
    className={`museum-guide-float museum-guide-float--${side} museum-guide-float--${context}`}
    role="status"
    aria-label="Your museum guide"
  >
    <img
      className={`museum-guide-avatar${side === 'right' && pose === 'presenting-one-hand' ? ' is-flipped' : ''}`}
      src={imageByPose[pose]}
      alt="Illustrated museum guide"
      loading={context === 'solar' ? 'eager' : 'lazy'}
      decoding="async"
      width={120}
      height={170}
    />
    <div className="museum-guide-cloud">
      <svg className="museum-guide-cloud-shape" viewBox="0 0 540 295" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M77 73 C49 43 17 78 36 114 C8 140 20 179 55 190 C44 226 75 255 111 243 C138 282 190 273 212 247 C251 282 294 267 307 248 C343 279 397 266 415 232 C456 246 497 221 489 187 C535 178 535 128 503 108 C518 68 482 35 440 48 C422 8 361 8 339 44 C311 5 250 10 232 42 C198 10 145 17 130 56 C106 48 88 59 77 73 Z" />
      </svg>
      <div className="museum-guide-cloud-content">
        <button
          type="button"
          className="museum-guide-close"
          aria-label="Dismiss museum guide"
          onClick={onDismiss}
        >
          ×
        </button>
        <span className="museum-guide-eyebrow">{label}</span>
        <p>{message}</p>
        {secondary && <p className="museum-guide-secondary">{secondary}</p>}
      </div>
    </div>
  </aside>
);
