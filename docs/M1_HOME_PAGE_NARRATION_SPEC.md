# M1 — Museum Entry & Welcome Narration Specification

**State:** Pre-hackathon design specification only  
**Target:** NASA Space Apps Kigali, November 14–15, 2026  
**Implementation:** During the officially permitted competition build window

## Visitor experience

The entry should feel like arriving at a small, carefully curated science museum. It introduces the collection, gives visitors control over sound, and then opens the curtain to the museum.

1. The visitor lands on a dark, restrained theatre-like entrance with closed red velvet curtains.
2. The museum title and a short invitation are visible immediately.
3. A brief welcome narration may play only when browser policy and the visitor's prior audio permission allow it.
4. If playback is blocked or unavailable, a clearly visible **Play Welcome** control lets the visitor start it. Do not make entry depend on audio.
5. **Enter the Museum** opens the curtains and reveals the next experience. **Skip Intro** bypasses the animation.
6. After entry, keep a persistent sound control available. A longer narrated museum overview is a later enhancement, not part of the first milestone.

## Welcome narration — proposed script

"Welcome to the Cosmic Heroes of Steel Museum. Here, we celebrate the machines that carried humanity's curiosity beyond Earth. Some explored distant worlds, some uncovered secrets beneath alien skies, and some continued their journeys long after their final signals. Take a moment, open the curtains, and discover the stories behind these extraordinary machines."

The final script should be reviewed against the six confirmed exhibits and the official challenge framing before recording.

## Audio behavior and accessibility

- Never assume autoplay will work. Modern browsers commonly block audible media until a visitor interacts with the page.
- Attempting autoplay must be non-blocking and must gracefully fall back to a visible **Play Welcome** control.
- Provide mute/stop controls and a clear indication when narration is playing.
- Never replay the welcome automatically on every route change or page revisit.
- No background music in M1; narration is enough for the first release.
- The complete experience must work with sound disabled, unavailable, or blocked.
- Provide captions/transcript for narration and avoid relying on audio for instructions.
- Respect reduced-motion preferences; **Skip Intro** must always be available and keyboard accessible.
- Avoid delaying the curtain transition while audio finishes. The visitor controls the pace.

## Visual and motion direction

- Closed red velvet curtains frame the first screen; use restrained folds and lighting rather than heavy visual effects.
- Keep the museum title and invitation legible against the curtain.
- On **Enter the Museum**, the two curtain panels move apart to reveal the next scene.
- Keep the transition short and interruptible; do not force scroll-jacking or a long intro.
- The red-curtain treatment is an entry-only theatrical device. The wider museum retains the established calm editorial science-museum design system.

## M1 acceptance checklist

- [ ] Responsive entry screen works on mobile and desktop.
- [ ] Title, short invitation, Enter and Skip controls are visible.
- [ ] Welcome narration has a transcript and user-controlled playback.
- [ ] If autoplay is blocked, Play Welcome works after a user gesture.
- [ ] Muting or disabling audio never blocks museum entry.
- [ ] Curtain transition can be skipped and respects reduced motion.
- [ ] No NASA insignia or implication of formal NASA endorsement.
- [ ] No competition-specific implementation code is committed before the permitted build window.

## Scope boundary

This file records the proposed experience and acceptance criteria only. It intentionally does not include HTML, CSS, JavaScript, audio assets, or prebuilt competition functionality. Confirm the event's current official rules and local organizer guidance before beginning implementation.
