# M3 — Destination Exploration Views Specification

**Project:** Cosmic Heroes of Steel Museum  
**Milestone:** M3 — Destination Views  
**Status:** Design and research handoff; no competition application code  
**Build target:** Officially permitted NASA Space Apps build window, November 14–15, 2026

## 1. Goal

M3 turns the Solar System overview into useful destination experiences. The first detailed destinations are the **Moon** and **Mars**. Visitors should understand where documented machines explored, what kind of location each marker represents, and how to return to the Solar System.

Other destinations remain honest archive or encounter views until their content is researched. M3 does not attempt to create detailed terrain maps for every planet.

## 2. Visitor journey

1. Visitor selects the Moon or Mars in the M2 Solar System explorer.
2. The destination view opens with a clear title, short context paragraph, and visible destination identity.
3. A map or map-like surface view presents verified mission sites and documented machines.
4. Visitor selects a marker to open a compact information panel.
5. The panel identifies the machine, mission, location type, and what is known about the location.
6. Visitor can open the mission preview when available, or read an honest archive summary when it is not.
7. **Back to Solar System** returns to M2 and preserves the visitor's previous destination context where practical.

A visitor must never arrive at a blank map, dead-end panel, or unexplained marker.

## 3. Destination views in scope

### Moon

The Moon view is the first detailed lunar surface destination.

- Show a recognizable lunar surface/map context and a clear **MOON** heading.
- Include the documented Surveyor 3 landing site in Oceanus Procellarum.
- Include Apollo 15 as a mission landing-site context for the Lunar Roving Vehicle exhibit.
- Do not present the Apollo 15 Lunar Module coordinate as the rover's parking location.
- Keep the distinction between mission landing site and the rover's individual route/final position explicit.
- If a rover-specific final location is not verified, show the mission landing region or a non-coordinate mission card instead of inventing a pin.

### Mars

The Mars view is the first detailed Mars surface destination.

- Show a recognizable Mars surface/map context and a clear **MARS** heading.
- Include Mars Pathfinder / Sojourner, Opportunity, and InSight.
- Distinguish the Pathfinder lander-site approximation from Sojourner's precise final position.
- Distinguish Opportunity's Eagle Crater landing site from its final resting region in Perseverance Valley, Endeavour Crater.
- Treat InSight's Elysium Planitia coordinate as a regional landing-site value, not a precision point.
- Where exact final coordinates are unresolved, use a labeled region or mission card rather than a falsely precise marker.

### Deep Space

Deep Space is an archive/encounter experience in M3, not a planetary surface map.

- Include Pioneer 10 as a deep-space probe.
- Show its Jupiter encounter as a flyby/encounter in mission context, never as a surface landing pin.
- A conceptual outward trajectory may be used only when clearly labeled **conceptual** and not represented as a measured live path.
- No live tracking or current spacecraft position is implied.

## 4. The six documented machines

| Machine | Destination | Correct M3 representation | Important restriction |
|---|---|---|---|
| Surveyor 3 | Moon | Robotic lander landing-site marker | It is a lander, not a rover |
| Apollo 15 Lunar Roving Vehicle | Moon | Apollo 15 mission landing-site context; rover story card | Do not label the Lunar Module coordinate as the rover's parking spot |
| Sojourner / Mars Pathfinder | Mars | Pathfinder lander-site region; rover story card | Do not present lander coordinates as Sojourner's precise final position |
| Opportunity | Mars | Landing-to-final-traverse context; final region marker only when verified | Eagle Crater landing and Perseverance Valley final location are different |
| InSight | Mars | Elysium Planitia regional landing-site marker | Published coordinate is approximate/regional |
| Pioneer 10 | Deep Space | Jupiter encounter card and conceptual outbound route | Jupiter flyby, not a landing or surface location |

The six machines remain the agreed collection. M3 must not silently replace or add a featured machine.

## 5. Map and marker model

Every location representation must declare its meaning. Use explicit marker types rather than one generic pin:

- **Landing site:** spacecraft or lander arrival location.
- **Rover final location:** final resting point, only when supported by a suitable source.
- **Traverse / route:** a documented path or a clearly labeled simplified route.
- **Region:** approximate geographic area, not a precise point.
- **Encounter:** flyby or orbital encounter, shown in mission context and not on a surface map.
- **Archive item:** mission record without a geographic marker.

Each marker record should be traceable to the mission source pack and contain, at minimum:

- Stable mission or machine ID.
- Celestial body.
- Marker type.
- Display label and short explanation.
- Latitude/longitude only when meaningful and sufficiently sourced.
- Coordinate convention/reference frame where known.
- Precision/uncertainty note.
- Primary source URL and any additional verification source.
- Featured machine ID, if applicable.

Do not infer a coordinate convention from the numeric values alone. Do not combine planetocentric and planetographic coordinates silently. Keep the original source value and any converted display value traceable.

## 6. Map presentation and interaction

### Shared layout

- Keep the museum identity and destination title visible.
- Provide a clear **Back to Solar System** control.
- Make the map the main visual area, with a compact information panel that does not permanently cover important map content.
- Provide a visible list of locations/missions as an alternative to map selection.
- Show a small legend explaining marker types.
- Display a concise note when locations are approximate or shown at regional scale.

### Selecting a marker

On selection:

1. Highlight the selected marker and its matching list item.
2. Open a panel with the machine/mission name and location type.
3. State what the marker represents (landing, final location, region, route, or encounter).
4. Show the uncertainty note when the location is approximate.
5. Provide a short verified description and a source reference.
6. Offer **View Mission** only when a mission preview or exhibit route exists; otherwise provide an archive summary and source link.

No marker should promise a detailed exhibit that has not been built.

### Map controls

- Keep zoom and pan controls simple and usable on touch.
- Provide a reset-to-destination view control.
- Do not require hover to discover marker details.
- Avoid excessive marker animation, decorative effects, or auto-flying camera movement.
- If a surface basemap or texture cannot load, retain the mission list and factual location cards.

## 7. Desktop and mobile behavior

**Desktop**
- Map occupies the main content area.
- Information panel sits beside the map or in a restrained overlay.
- A location list/legend remains easy to reach without obscuring the map.

**Mobile**
- Stack the map, selected-location panel, and location list vertically.
- Use comfortable tap targets and avoid tiny clustered markers.
- Keep the back control visible and prevent horizontal page overflow.
- Allow visitors to select locations from the list when map pins are difficult to tap.

Both layouts must preserve the same content and navigation. The experience must remain usable on modest phones and with reduced motion.

## 8. Scientific and content integrity

- A surface marker is permitted only for a location on that body's surface.
- A flyby or orbiter must never be shown as abandoned equipment on a surface.
- Distinguish landing, traverse, final resting location, orbital encounter, and deep-space trajectory in both text and icon/legend.
- Do not imply that an approximate region is an exact artifact coordinate.
- Do not claim live spacecraft tracking.
- Do not invent rover routes, parking spots, landing points, dates, or mission outcomes.
- If sources disagree, retain the discrepancy in the research notes and use the least misleading representation until resolved.
- The map is an educational navigation aid, not a precision scientific GIS product.

## 9. Source and asset policy

Use `docs/MISSION_SOURCE_PACK.md` as the starting research record. Before a marker is approved for implementation:

1. Open the cited primary source and confirm it supports the displayed claim.
2. Record the coordinate convention and uncertainty, if coordinates are used.
3. Verify that the marker type matches the source (landing, final location, region, encounter).
4. Record the source URL and access date in the project research record.
5. For map imagery, terrain textures, photos, and 3D models, record the original asset URL, creator/organization credit, media type, and reuse notes.
6. Do not assume a NASA-hosted asset is automatically cleared for every use; check the asset-specific credit and usage information.

Use a lightweight map or locally optimized map assets where possible. Do not make large imagery downloads mandatory for navigation.

## 10. Navigation and state contract

- Moon and Mars are reachable from the M2 destination panel.
- Deep Space opens an archive/encounter view, not a surface map.
- Every destination view provides a return path to the Solar System.
- Returning should preserve the previous M2 selection and camera context when feasible.
- Selecting a mission from a map opens the correct mission preview or archive record.
- Closing a panel returns focus to the marker/list control that opened it.
- Browser back behavior should not strand the visitor on an empty or uninitialized scene.

## 11. Accessibility

- Use semantic buttons for map markers where feasible and always provide an equivalent semantic location list.
- Give each marker a descriptive accessible name including its type where necessary.
- Support keyboard selection, visible focus, Enter/Space activation, and Escape to close a panel.
- Keep selected state visible beyond color alone.
- Provide text equivalents for all map-only information.
- Respect `prefers-reduced-motion`.
- Ensure contrast, readable labels, and touch target sizing.
- The destination view must remain useful if map rendering or imagery fails.

## 12. M3 acceptance checklist

- [ ] Moon and Mars open as distinct destination views from M2.
- [ ] Deep Space opens an archive/encounter view, not a surface map.
- [ ] The six agreed machines appear in the correct destination/context.
- [ ] Surveyor 3 is identified as a lander.
- [ ] Apollo 15 Lunar Module coordinates are not mislabeled as the rover's parking point.
- [ ] Pathfinder lander coordinates are not mislabeled as Sojourner's precise final position.
- [ ] Opportunity landing and final-location context are distinguished.
- [ ] InSight's coordinate is labeled as a regional value.
- [ ] Pioneer 10 is represented as a Jupiter flyby/deep-space probe, never a surface marker.
- [ ] Every coordinate has a source, convention, and uncertainty qualification before implementation.
- [ ] Marker types are explained by a visible legend and text.
- [ ] Every marker can be opened from the map and an equivalent list.
- [ ] Mission panels provide a working next step or an honest archive summary.
- [ ] Back navigation returns to M2 without losing expected context.
- [ ] Desktop, mobile, keyboard, reduced-motion, and map-failure behavior are tested.
- [ ] Asset credits and source links are recorded.

## 13. Manual test scenarios

1. Open Moon from M2, select Surveyor 3, and confirm it is described as a lander.
2. Open Apollo 15 and confirm the landing-site coordinate is not described as the rover's parking location.
3. Open Mars, select Sojourner, and confirm the lander-site approximation is qualified.
4. Open Opportunity and verify landing and final-location labels are not conflated.
5. Open InSight and confirm the marker is described as a regional landing-site value.
6. Open Deep Space and confirm Pioneer 10 is shown as a Jupiter encounter/flyby, not a surface pin.
7. Navigate all locations using only the semantic list and keyboard.
8. Use a narrow mobile viewport and verify marker selection remains possible through the list.
9. Simulate a failed map/texture load and confirm the factual list and navigation remain usable.
10. Return to the Solar System and verify context is preserved.

## 14. Scope and timing

This document is a design, data, and QA handoff only. It contains no map implementation, production code, or downloaded competition assets.

Implement the M3 destination views during the officially permitted November 14–15, 2026 build window, after checking the current official event rules and challenge guidance.

---

**Experience statement:** The Moon and Mars should feel like curated museum galleries. Every marker must tell visitors what is actually known about a machine's place in exploration—without making uncertain locations look exact.
