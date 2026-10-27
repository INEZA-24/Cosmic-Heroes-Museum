# M2 — Solar System Explorer: Implementation Contract

**State:** Design / planning — no competition application code  
**Dependency:** M1 entry experience and documented data contract  
**Target:** Build on NASA Space Apps competition weekend, November 14–15, 2026.

## Intended user experience

1. Visitor chooses **Enter Museum**.
2. A lightweight whole-Solar-System diagram appears. The museum name remains centered above it.
3. Sun and all eight planets are labeled. Earth includes an explicit Moon access point; a **Beyond / Deep Space** destination is also available.
4. Visitors select a planet, Moon, or Deep Space, revealing an information panel. Nothing on the screen looks clickable without actually responding to input.
5. Each destination has a defined result: an interactive surface map, an orbital/flyby mission list, or an honest archive summary.
6. “Explore Destination” navigates to the relevant view; “Back to Solar System” returns without resetting all context.
7. If an archive or full exhibit is not ready, visitors receive a short factual summary and a source link, never a dead end.

## Content and geographic model

| Destination | Main-level representation | Destination behavior in MVP |
|---|---|---|
| Sun | Central visual anchor | Information only; not an abandoned-equipment site |
| Mercury | Selectable planet | Archive/mission encounter preview |
| Venus | Selectable planet | Archive/mission encounter preview |
| Earth | Selectable planet | Earth context; access Moon separately |
| Moon | Earth satellite, clear selectable control | Detailed lunar landing-site map |
| Mars | Selectable planet | Detailed Mars landing/final-location map |
| Jupiter | Selectable planet | Probe encounter/orbiter records, **not** surface pins |
| Saturn | Selectable planet | Probe encounter/orbiter records, **not** surface pins |
| Uranus | Selectable planet | Archive/flyby preview |
| Neptune | Selectable planet | Archive/flyby preview |
| Beyond | Separate region in overview | Deep-space missions and conceptual routes |

The Sun is not counted as a planet. The Moon is a satellite of Earth. Sizes, spacing, and orbits on the overview are for navigation and are **not to scale**; do not suggest the planets are shown at their real present positions.

## Information contract

```ts
type Destination = {
  id: "sun" | "mercury" | "venus" | "earth" | "moon" | "mars"
    | "jupiter" | "saturn" | "uranus" | "neptune" | "deep-space";
  label: string;
  kind: "star" | "planet" | "moon" | "region";
  exploration: "surface-map" | "encounter-list" | "archive" | "overview";
  shortDescription: string;
  relatedMissionIds: string[];
  featuredHeroIds: string[];
};
```

Store featured/archived state in the content records; do not couple it to how a planet is drawn. Each mission marker has an explicit location/encounter type so flybys never appear as fictional stationary surface objects. Consult `docs/MISSION_SOURCE_PACK.md` for source and coordinate caveats.

## Layout behavior

**Desktop:** Original orange Cosmic Heroes emblem at left; **COSMIC HEROES OF STEEL MUSEUM** centered in the top header; small, uncluttered navigation. Solar System occupies the main field; information panel only appears after selection or is clearly unselected by default. Thin orbit lines optional.

**Mobile:** Vertically scrollable or horizontally panning sequence with visible labels, adequate tap targets, and a dedicated destination list alternative. No tiny clustered planetary click targets, clipped panels or blocked scrolling.

**Both:** Quiet editorial aesthetic, dark navy/charcoal background, warm white text, copper accents. Flat surfaces, borders, rectangular or very lightly softened controls. Avoid gradients-heavy, translucent-glass, rounded pill or neon-glow designs.

**Accessibility:** semantic buttons for selections; discernible labels; visible keyboard focus; Escape closes selection panel; Enter/Space activates buttons; focus restoration after panel close; `prefers-reduced-motion` respected; sufficient contrast and alt/ARIA labels where needed.

## Low-bandwidth implementation decision

**Default: HTML5 + CSS3 + vanilla JS.** Use lightweight planet imagery, ideally optimized formats and responsive sizes. There is no need for a continuously running 3D animation merely to show eight planets. Load planet detail/Three.js only when a real 3D destination map is needed and after testing it on modest devices. The Solar System overview must remain functional without WebGL.

## Definition of done

- Every planet and region is legible and keyboard accessible.
- Each selectable destination opens the correct panel and route.
- All links and controls have clear actions; unavailable content is labeled honestly.
- Accurate hierarchy for Earth/Moon, Sun, encounter routes, and planetary site maps.
- Accessible desktop/mobile behavior and reduced-motion support.
- Sufficient performance on modest phones; no mandatory 3D dependency for the overview.
- Tests and production build pass and actual browser-test outcomes documented.
- Project lead reviews the feature PR before merge.

## Manual test scenarios

1. Keyboard-only: navigate Sun/Mercury/Venus/Earth/Moon/Mars/Jupiter/Saturn/Uranus/Neptune/Deep Space. Check focus and activation.
2. Narrow-screen: inspect planet labels, tap targets, and panel navigation without overflow.
3. Select Mars; navigate to mission view; return to Solar System preserving expected context.
4. Select Jupiter; see encounter/orbiter preview, not fabricated landing locations.
5. Select an unfinished destination; view archive status + official NASA link, no empty hero.
6. Enable reduced motion and verify no necessary content depends on animation.
7. Disable WebGL: overview and destination choice still function.

## Future expansion

- Destination-specific animated camera transitions, if performance permits.
- Idle 60-second featured mission trailer, paused by input, focus or reduced-motion (tracked separately at M9).
- Detailed Moon/Mars mission coordinate rendering and marker clustering (M3–M4).
- “Hero of Steel” narrative template, Legacy Gallery, and credited 3D artifact models (M6–M7).

## Scope boundary

This is a contract for implementation on competition weekend. It contains no production interface source code, NASA media assets, or prebuilt competition features.
