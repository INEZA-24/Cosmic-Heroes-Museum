# M1 — Homepage Visual Specification

**Project:** Cosmic Heroes of Steel Museum  
**Milestone:** M1 — Museum Entrance  
**Design direction:** B — Modern Science Museum  
**Status:** Approved design handoff; implementation is reserved for the official build window.

## 1. Experience objective

Create the feeling of entering a carefully curated space-exploration museum. The entrance should be elegant, cinematic, welcoming, and educational. It must not resemble a game menu, generic technology landing page, or science-fiction dashboard.

The entrance introduces the museum identity, offers an optional welcome narration, and opens into the solar-system exploration experience.

## 2. Exact museum identity

The displayed museum name must be:

**COSMIC HEROES**  
**OF STEEL MUSEUM**

Keep the complete name together as one identity. Do not omit “MUSEUM” and do not use the misspelling “STELL”.

Suggested supporting line:

*A Museum of Humanity's Robotic Explorers*

Suggested invitation:

*Every machine has a story. Every mission leaves a legacy.*

The museum emblem and name should be the first visual information visitors recognize.

## 3. Original museum emblem

Create a simple, recognizable, original emblem featuring:

- A small Surveyor 3-style lunar lander at the center.
- Two or three clean orbital rings surrounding the lander.
- A few small planetary dots placed along the orbital paths.
- A restrained copper-gold or warm-metal finish.
- A dark navy or transparent background so it works on the entrance and elsewhere in the site.

### Accuracy and visual constraints

The central machine must read as a **lander**, not a wheeled rover. Surveyor 3 had a compact body supported by landing legs; it was not a four-wheeled vehicle. Keep the silhouette simplified enough to remain legible at small sizes.

The emblem must be original artwork. Do not use NASA's insignia, mission patches, or marks that imply NASA endorsement. Avoid excessive detail, gradients, tiny stars, or complex planetary illustrations. Prefer a clean vector-style mark that can later be exported as SVG.

## 4. Color system

Use these colors as the initial design tokens:

| Token | Hex | Intended use |
|---|---|---|
| Midnight Navy | `#071321` | Primary page background |
| Deep Charcoal | `#101820` | Architectural surfaces and panels |
| Warm White | `#F2EEE7` | Main headings and body text on dark surfaces |
| Muted Silver | `#A9B2BC` | Supporting text and secondary labels |
| Copper Gold | `#C58B55` | Emblem, fine borders, highlights, primary action |
| Velvet Red | `#791F2B` | Main curtain fabric |
| Deep Velvet | `#45131D` | Curtain folds and shadows |

Use copper gold sparingly. Warm white should carry most important text. Muted silver is for secondary content, not essential instructions. Ensure all text and controls have sufficient contrast.

## 5. Typography

Recommended initial pairing:

- **Display headings:** Playfair Display, preferably a refined regular or medium weight.
- **Body and interface:** Inter.
- **Small metadata:** Inter with modest letter spacing.

The complete museum title should be prominent, with deliberate line breaks:

COSMIC HEROES  
OF STEEL MUSEUM

Avoid excessive tracking that makes the title hard to read on mobile. Use responsive font sizing and preserve the hierarchy at narrow widths. Load fonts efficiently and provide sensible system fallbacks.

## 6. Entrance composition

### Desktop

- Full-viewport entrance composition.
- Deep navy/charcoal architectural setting.
- Closed or slightly parted deep-red velvet curtains framing the central stage.
- Emblem centered above the museum title.
- Museum title directly beneath the emblem.
- Short invitation below the title.
- Primary and secondary actions in the lower central area.
- Subtle warm light visible through or behind the curtains.

The central content must remain readable against the background. Curtains should frame the identity, not cover it.

### Tablet

- Preserve the centered composition.
- Scale the emblem and title proportionally.
- Keep actions comfortably separated and easy to activate.
- Simplify decorative architecture before shrinking essential content.

### Mobile

- Use a vertical composition with the emblem above the title.
- Keep “COSMIC HEROES” and “OF STEEL MUSEUM” readable without awkward wrapping.
- Stack the primary and secondary actions when needed.
- Simplify curtain artwork and reduce decorative detail.
- Make narration controls touch-friendly.
- Prevent horizontal scrolling.

## 7. Entrance atmosphere

Use restrained cinematic details:

- Soft warm illumination behind the curtains.
- Gentle highlights on velvet folds.
- Subtle depth in the surrounding architecture.
- Optional low-density dust motes only if performance permits.

Avoid neon, heavy gradients, excessive stars, strong lens flares, glassmorphism-heavy panels, and constant movement. The entrance should feel like a real museum with a cosmic theme.

## 8. Welcome copy and narration

Suggested welcome narration:

> Welcome to the Cosmic Heroes of Steel Museum. Here, we celebrate the machines that carried humanity's curiosity beyond Earth. Some explored distant worlds, some uncovered secrets beneath alien skies, and some continued their journeys long after their final signals. Take a moment, open the curtains, and discover the stories behind these extraordinary machines.

Provide a visible **Play Welcome** control and a readable transcript or captions. Include pause/stop and mute controls where audio is active.

Browser autoplay may be blocked. Audio must never be required to enter the museum. If playback cannot start automatically, show the manual playback control clearly. Do not repeatedly replay the narration after the visitor has dismissed it. No background music is required for M1.

## 9. Primary actions

### Primary: ENTER THE MUSEUM

- Clear, high-contrast action.
- Restrained copper-gold outline or fill treatment.
- Rectangular or lightly rounded shape; avoid oversized pill styling.
- Keyboard accessible with a visible focus state.

### Secondary: SKIP INTRO

- Visually quieter than the primary action but still easy to find.
- Immediately takes the visitor into the museum experience.
- Must remain available without waiting for narration or animation to finish.

## 10. Curtain transition

When the visitor chooses **ENTER THE MUSEUM**:

1. The entrance copy and controls fade or move out gently.
2. Left and right curtains move outward from the center.
3. Warm light reveals the next gallery.
4. The transition hands off to the solar-system experience.

Target duration: approximately 2–3 seconds. Use natural easing, avoid excessive camera movement, and allow the visitor to skip or interrupt the transition. Respect the reduced-motion preference; in reduced-motion mode, use a short fade or immediate transition.

## 11. Accessibility and resilience

- Full keyboard navigation.
- Visible focus indicators.
- Semantic headings and buttons.
- Sufficient color contrast.
- Accessible labels for audio controls.
- Captions or transcript for narration.
- Reduced-motion support.
- No audio-only instructions.
- No blocked path into the museum if audio, animation, or decorative media fails.

## 12. Technical implementation guidance

- Use responsive HTML, CSS, and JavaScript for the entrance.
- Use CSS for the curtain transition where practical.
- Keep the emblem as a lightweight vector asset when finalized.
- Optimize any background images and audio.
- Keep audio controls independent from navigation.
- Avoid loading Three.js just to render the entrance; reserve the 3D library for the solar-system experience.
- Keep the entrance modular so it can hand off cleanly to the next gallery.
- Provide a lightweight fallback for lower-powered devices.

## 13. M1 acceptance checklist

- [ ] The exact name reads “COSMIC HEROES OF STEEL MUSEUM”.
- [ ] The original emblem features orbital rings and a simplified Surveyor 3-style lander.
- [ ] The central emblem machine is clearly a lander, not a rover.
- [ ] The approved color tokens are used consistently.
- [ ] Display and body typography have a clear hierarchy.
- [ ] Desktop, tablet, and mobile compositions are defined.
- [ ] Red velvet curtains frame the entrance.
- [ ] Enter and Skip Intro actions are available.
- [ ] Welcome narration has manual playback, mute/stop behavior, and transcript/captions.
- [ ] Audio failure or autoplay blocking does not prevent entry.
- [ ] Curtain transition is short, interruptible, and reduced-motion aware.
- [ ] The entrance can connect to the solar-system experience.
- [ ] No NASA insignia or implied endorsement is used.

## 14. Build boundary

This document is a design and implementation handoff only. It does not add competition application code or media assets. Implement the homepage during the official event build window and in accordance with the event's rules.

---

**Design statement:** Visitors are not simply opening a website. They are entering a museum dedicated to the machines that carried humanity's curiosity beyond Earth.
