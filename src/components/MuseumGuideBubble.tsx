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
 * A corner-anchored speech bubble with one attached comic-style tail, not a
 * scalloped cloud or a new section in document flow.
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
    <div className="museum-guide-speech">
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
  </aside>
);
