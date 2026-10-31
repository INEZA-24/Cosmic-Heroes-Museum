# M2 — Three.js Solar System Explorer Architecture

**Project:** Cosmic Heroes of Steel Museum  
**Milestone:** M2 — Solar System Overview  
**Rendering approach:** Three.js interactive 3D scene with a complete 2D fallback  
**Status:** Technical design handoff; implementation is reserved for the official build window.

## 1. Experience goal

After entering the museum, visitors arrive at an interactive Solar System gallery. They can recognize the Sun and all eight planets, select Earth to access the Moon, and open a separate Beyond / Deep Space destination.

The scene should feel like a calm, carefully curated science museum exhibit. It is a navigation experience, not a scientifically scaled simulator or a live planetary tracker.

**Core principle:** Three.js provides the visual experience; semantic HTML provides the reliable, accessible navigation.

## 2. Visual direction

- Continue the M1 visual identity: midnight navy, charcoal, warm white, muted silver, and restrained copper accents.
- Keep the museum title centered in the header: **COSMIC HEROES OF STEEL MUSEUM**.
- Place the original orange orbital emblem at the left of the desktop header.
- Present the Sun as the central visual anchor, with eight clearly distinguishable planets.
- Use thin, understated orbit guides only as visual navigation aids.
- Keep labels readable and avoid cluttering the scene with decorative stars, glowing effects, or excessive UI panels.
- The Moon must be visibly associated with Earth and available as its own destination.
- Show **BEYOND / DEEP SPACE** as a separate destination beyond Neptune.

The 3D overview is intentionally **not to scale**. Planet sizes, distances, orbit spacing, and displayed positions are illustrative and must never be presented as real measurements or current astronomical positions.

## 3. Scene composition

### Main scene

Include:
- Sun.
- Mercury.
- Venus.
- Earth.
- Mars.
- Jupiter.
- Saturn.
- Uranus.
- Neptune.
- A clearly marked Moon access point associated with Earth.
- A separate Beyond / Deep Space access point.

Use a balanced composition that makes every planet identifiable. Do not force real-world distance ratios; those would make the inner planets too crowded and outer planets too small for useful navigation.

### Planet representation

- Use recognizable color and surface cues without implying that the textures are precise scientific maps.
- Saturn may have a restrained ring system.
- Earth should be visually recognizable, but do not require high-resolution texture downloads for the scene to work.
- Use simple geometry and optimized textures.
- Ensure labels remain legible against both the planet and background.

### Moon access

The Moon is not a ninth planet. It is Earth's natural satellite. Show it as a distinct, selectable object or clearly linked access marker near Earth. Its relationship to Earth must be visually and textually clear.

### Deep Space access

Beyond Neptune, provide a distinct destination marker or portal labeled **BEYOND / DEEP SPACE**. It represents the museum's deep-space mission archive, not a physical planet.

## 4. Interaction model

Every visible selectable object must have a real action.

### Selecting a destination

On selection:
1. Visually highlight the selected destination.
2. Display a destination information panel.
3. Show its name and type (star, planet, moon, or region).
4. Show a concise, verified description.
5. Indicate whether it has a surface map, encounter list, or archive view.
6. Offer a clear **Explore Destination** action when the destination view exists.

The initial view should not show a preselected destination unless the design explicitly explains the selection.

### Camera behavior

- Selecting a destination may smoothly bring it into focus.
- Keep the camera movement short, predictable, and interruptible.
- Provide a visible **Reset View** control.
- Provide simple zoom and pan controls only if they remain usable on touch devices.
- Do not trap visitors in the 3D scene or require precise mouse gestures.
- Avoid uncontrolled spinning or automatic camera movement.

### Navigation

- **Explore Destination** opens the correct destination experience.
- **Back to Solar System** returns to the overview and preserves reasonable navigation context.
- A visible destination list provides an alternative to selecting objects in the scene.
- A visitor must always be able to reach every destination without relying on hover.

## 5. Three.js technical architecture

Use a small, isolated Solar System module rather than coupling Three.js to the entire museum application.

Suggested conceptual responsibilities:

- **SolarSystemScene:** creates and owns the renderer, scene, camera, lighting, and planet objects.
- **DestinationData:** provides the authoritative destination names, kinds, summaries, and next-view behavior.
- **DestinationInteraction:** maps pointer/touch selection to destination IDs and updates selected state.
- **DestinationPanel:** ordinary HTML that renders the selected destination information and actions.
- **AccessibleDestinationList:** ordinary semantic HTML buttons listing all destinations.
- **FallbackOverview:** lightweight 2D overview that uses the same destination data and navigation behavior.

These are architectural responsibilities, not a requirement to create separate files or classes if a simpler implementation is more reliable during the event.

### Rendering and lifecycle

- Load Three.js only when the Solar System gallery is entered.
- Do not load Three.js on the M1 welcome screen.
- Use one renderer and one animation loop for the active scene.
- Stop or pause rendering when the scene is not visible or the browser tab is hidden.
- Avoid continuous animation when there is no meaningful movement.
- Dispose of geometries, materials, textures, event listeners, and the renderer when leaving the scene if the scene is not retained.
- Handle window resizing and device pixel ratio carefully.
- Cap pixel ratio on high-density mobile displays to avoid unnecessary GPU load.
- Keep scene state separate from mission content and exhibit copy.

### Selection handling

Use Three.js raycasting for pointer selection, but do not make raycasting the only way to navigate. The semantic HTML destination list and visible controls must provide equivalent access.

A click or tap should select an object; hover may provide a subtle preview on pointer devices but must not be required. Touch users must not need hover to discover what an object does.

## 6. Responsive and low-end device behavior

### Desktop

- Main scene occupies the central gallery area.
- Destination information panel appears beside or over the scene without obscuring the selected planet.
- Header and controls remain stable.
- Mouse selection and keyboard destination list both work.

### Tablet and mobile

- Keep all destinations available without tiny tap targets.
- Use a compact panel below or above the scene when side-by-side layout is too narrow.
- Provide a visible destination list or chooser.
- Support touch selection and straightforward reset/zoom controls.
- Avoid horizontal page overflow.
- Reduce texture resolution, pixel ratio, and decorative effects where needed.

### WebGL fallback

If WebGL is unavailable, initialization fails, or performance is unacceptable:
- Show the 2D overview.
- Keep every destination selectable.
- Preserve the same information panel and navigation.
- Explain the fallback only if useful; do not display a technical error that confuses visitors.
- Never show a blank scene or block access to the museum.

The fallback is a complete navigation experience, not a static screenshot.

## 7. Accessibility

- Use semantic HTML buttons for every destination in the accessible list.
- Provide descriptive names and destination types.
- Support keyboard selection and visible focus indicators.
- Keep selected state visible in both the 3D scene and HTML controls.
- Ensure Escape closes an open panel where appropriate.
- Restore focus logically when panels close.
- Respect `prefers-reduced-motion`; disable nonessential movement and use immediate or minimal camera transitions.
- Do not communicate selection by color alone.
- Ensure sufficient contrast and touch targets.
- Make the full museum journey possible without WebGL, pointer hover, or audio.

## 8. Destination behavior contract

| Destination | Kind | M2 behavior |
|---|---|---|
| Sun | Star | Information panel; no surface map |
| Mercury | Planet | Archive / mission encounter preview |
| Venus | Planet | Archive / mission encounter preview |
| Earth | Planet | Earth context and Moon access |
| Moon | Moon | Lunar landing-site map in later milestone |
| Mars | Planet | Mars landing/final-location map in later milestone |
| Jupiter | Planet | Probe encounter and orbiter records; never surface pins for flybys |
| Saturn | Planet | Encounter and orbiter records; never fabricated surface locations |
| Uranus | Planet | Archive / flyby preview |
| Neptune | Planet | Archive / flyby preview |
| Beyond / Deep Space | Region | Deep-space mission archive |

The Sun is not a planet; the Moon is Earth's satellite. The destination data contract in `docs/M2_SOLAR_SYSTEM_CONTRACT.md` remains authoritative for IDs and content fields.

## 9. Scientific integrity

- Label the overview: **Illustrative overview — sizes, distances and positions are not to scale.**
- Do not claim live tracking or current planetary positions.
- Do not imply the planets are arranged at their real distances.
- Keep the Moon connected to Earth.
- Distinguish surface landing sites, rover final locations, orbit, flyby, and deep-space trajectory.
- Pioneer 10's Jupiter flyby is an encounter, not a landing or stationary Jupiter surface marker.
- Consult `docs/MISSION_SOURCE_PACK.md` before adding mission-specific claims, coordinates, or markers.

## 10. Performance and asset policy

- Prefer procedural geometry and a small number of optimized textures.
- Load textures lazily and avoid downloading large maps for the overview.
- Use compressed, appropriately sized assets where supported.
- Avoid large particle systems, complex post-processing, and expensive real-time shadows.
- Provide a visually coherent material/color fallback if a texture fails.
- Record source URLs, credits, and license/usage notes for every external texture, model, or image.
- Do not assume NASA imagery or 3D assets are automatically cleared for every use; verify asset-specific credit and usage requirements.

## 11. M2 acceptance checklist

- [ ] Sun and all eight planets are visible and labeled.
- [ ] Moon is clearly represented as Earth's satellite and can be selected.
- [ ] Beyond / Deep Space is available as a separate destination.
- [ ] Overview visibly states that sizes, distances, and positions are not to scale.
- [ ] Every selectable object opens the correct information panel.
- [ ] Every destination is also reachable through semantic HTML controls.
- [ ] Explore and Back navigation work without losing expected context.
- [ ] Camera controls are predictable and have a reset action.
- [ ] WebGL failure leads to a complete 2D fallback.
- [ ] Mobile and modest-device performance is acceptable.
- [ ] Reduced-motion and keyboard behavior are tested.
- [ ] No false surface locations or live-position claims appear.
- [ ] Build, browser tests, and manual test outcomes are recorded before the milestone is marked complete.

## 12. Manual test scenarios

1. Navigate every destination using keyboard-only controls.
2. Select each planet using pointer and touch.
3. Select Earth and confirm the Moon is presented as its satellite.
4. Select Jupiter and confirm the panel describes encounters/orbiters, not surface landings.
5. Select Beyond / Deep Space and open the archive destination.
6. Reset the camera after zooming and selecting several planets.
7. Disable WebGL and verify the 2D overview still supports every destination.
8. Enable reduced motion and verify camera transitions are minimized or removed.
9. Test on a narrow mobile viewport and a modest device; record viewport, browser, and observed performance.
10. Navigate to a destination and return to the Solar System without a blank screen or lost context.

## 13. Scope and build timing

This document defines the technical design and acceptance criteria only. It does not include Three.js application code, production scene assets, or prebuilt competition features.

Implement and validate the M2 scene during the officially permitted November 14–15, 2026 build window, following the event rules. Re-check the official event guidance before coding.

---

**Experience statement:** The Solar System is the museum's grand central gallery. Visitors should be able to look around, understand where they are going, and choose their next destination without needing to be expert astronomers or own a powerful computer.
