# M4 — NASA Mission Registry & Marker Data Architecture

**Project:** Cosmic Heroes of Steel Museum  
**Milestone:** M4 — Mission Registry & Markers  
**Status:** Data architecture and research handoff only  
**Build target:** Officially permitted NASA Space Apps build window, November 14–15, 2026

## 1. Purpose

M4 defines one reliable registry for missions, machines, locations, and sources. M2 and M3 should use the same records so a mission cannot have conflicting names or locations in the destination list and map.

The registry supports the six agreed featured machines and can expand to additional verified NASA missions. It does not claim a fixed archive count.

## 2. Core decisions

1. Separate a mission from the machine or vehicle associated with it.
2. Separate machine identity from geographic location records.
3. Coordinates are optional. An archive record or encounter can exist without surface coordinates.
4. Every location has an explicit semantic type: landing site, final location, traverse, region, orbit, encounter, trajectory, or archive-only.
5. Preserve original source coordinates and convention. Store any normalized display coordinate separately with its conversion method.
6. A coordinate is not ready for implementation until its source, body, coordinate convention/reference frame, and uncertainty are reviewed.
7. Featured-exhibit status is content metadata, not a special map behavior.
8. Use versioned static JSON for the MVP; validate it before integration. No database or live NASA API is required.

## 3. Suggested data files

The eventual implementation may use:
- missions.json — mission identity, agency, dates, objective, summary, sources.
- machines.json — spacecraft/rover/lander identity, type, mission relationship, status.
- locations.json — site, region, route, orbit and encounter records.
- sources.json — source metadata and claim coverage.
- heroes.json — featured exhibit linkage and story status.

These are proposed boundaries, not files to create before the permitted build window. The MVP may combine them if validation remains straightforward.

## 4. Conceptual record model

### Mission

| Field | Meaning |
|---|---|
| id | Stable lowercase identifier |
| name | Official mission/program name |
| agency | Responsible organization |
| destinationBodyIds | Bodies or regions relevant to the mission |
| launchDate | ISO date when verified |
| arrivalOrLandingDate | Optional date with event meaning specified |
| endDate | Optional date; do not confuse end of operations with final contact |
| objective | Short verified purpose |
| summary | Concise factual description |
| machineIds | Related machine IDs |
| sourceIds | Sources supporting mission-level claims |
| featuredHeroId | Optional link to a featured exhibit |

### Machine

| Field | Meaning |
|---|---|
| id | Stable machine identifier |
| name | Display name |
| machineType | Lander, rover, crewed rover, probe, orbiter, etc. |
| missionId | Parent mission/program |
| description | Short verified description |
| operationalStatus | Status with date/context |
| locationIds | Related location/event records |
| sourceIds | Sources supporting machine claims |
| featured | Explicit featured-exhibit relation |

### Location / marker

| Field | Meaning |
|---|---|
| id | Stable location record ID |
| machineId | Associated machine, if any |
| missionId | Mission context |
| bodyId | Moon, Mars, Jupiter encounter, deep space, etc. |
| locationType | Controlled type from the vocabulary below |
| label | Visitor-facing name |
| description | What the record actually represents |
| coordinates | Optional coordinate object |
| geometry | Optional sourced path/area data |
| precision | Exact, approximate, regional, conceptual, or unknown |
| sourceIds | Sources supporting this location |
| displayPolicy | Point, region, path, encounter card, or archive only |

### Coordinate object

A coordinate record must identify:
- Latitude and longitude, only when source-backed.
- Celestial body.
- Coordinate system, such as planetocentric or planetographic.
- East- or west-positive longitude convention, when relevant.
- Reference frame/datum when supplied by the source.
- Original source values preserved exactly as published.
- Optional normalized values for the renderer.
- Conversion method/source for any transformed values.
- Plain-language uncertainty/precision note.

Never silently convert west longitude to east longitude or planetographic to planetocentric latitude. Do not assume Earth-style conventions apply to another body.

### Source record

Each source should include a stable ID, publisher, title, canonical URL, source type, access date, claims/fields supported, asset credit, and asset-specific reuse notes.

## 5. Controlled location vocabulary

Use only these semantic categories:
- landing_site — arrival/landing location.
- rover_final_location — final resting location, only when sourced.
- traverse — documented vehicle route.
- region — approximate area or named geographic region.
- orbit — orbital mission context, never a surface pin.
- flyby_encounter — encounter relative to a body, not a surface location.
- trajectory — sourced trajectory or explicitly conceptual path.
- archive_only — record without a defensible map location.

Each type needs a distinct visual treatment and explanatory label. Do not rely on color alone.

## 6. Initial six-machine registry plan

These are the agreed featured machines. Coordinate approval remains subject to source review.

| Stable ID | Machine | Mission context | Destination | Initial location treatment |
|---|---|---|---|---|
| surveyor-3 | Surveyor 3 | Surveyor 3 | Moon | Approximate landing-site region, Oceanus Procellarum |
| apollo-15-lrv | Apollo 15 Lunar Roving Vehicle | Apollo 15 | Moon | Mission landing-site context plus rover story; no unsupported rover parking pin |
| sojourner | Sojourner rover | Mars Pathfinder | Mars | Pathfinder lander-site region; rover final point only if independently verified |
| opportunity | Opportunity rover | Mars Exploration Rover-B | Mars | Separate landing and final-region records |
| insight | InSight lander | InSight | Mars | Approximate Elysium Planitia landing-site region |
| pioneer-10 | Pioneer 10 probe | Pioneer 10 | Deep Space / Jupiter encounter | Jupiter flyby encounter; conceptual outbound trajectory only if labeled |

Do not encode the Apollo 15 Lunar Module coordinate as the LRV parking location. Do not encode Pathfinder lander coordinates as Sojourner's exact final position. Do not represent Pioneer 10 as landed on Jupiter.

## 7. Coordinate review queue

The current MISSION_SOURCE_PACK identifies these qualified values and open tasks:

| Record | Current research state | Required review |
|---|---|---|
| Surveyor 3 | NASA historical listing gives 3.01° S, 336.66° E; approximate site | Confirm longitude convention and body coordinate reference |
| Apollo 15 LRV | Apollo 15 Lunar Module coordinate is documented, not rover parking location | Retain as mission landing-site context; research rover-specific location separately |
| Sojourner / Pathfinder | Historical values differ from a newer technical memorandum and coordinate conventions | Select one documented convention; preserve source values; distinguish lander from rover |
| Opportunity | Landing and final region differ; exact final point not approved | Use named region until final coordinate and frame are verified |
| InSight | Approximately 4.5° N, 135.9° E; regional value | Label uncertainty; verify coordinate reference details |
| Pioneer 10 | Jupiter flyby; no surface location | Use encounter card; trajectory must be sourced or explicitly conceptual |

When credible sources disagree, do not average values. Investigate reference frames, conventions, and event definitions, and choose the least misleading display treatment.

## 8. Marker rendering rules

- Render a surface point only for a surface location with approved coordinates.
- Render an approximate region as a region or qualified approximate marker, not as a surveyed exact point.
- Render a traverse as a path only when sourced; label simplified paths.
- Render orbit and flyby records in mission/encounter context, never as surface pins.
- Render archive-only records in the accessible mission list.
- Cluster overlapping markers without hiding records; selecting a cluster exposes a list.
- Every marker has a matching semantic list item and detail panel.
- Map and list selection share the same selected record.

## 9. Validation gates

Before records enter the application:
1. Validate unique stable IDs and all record references.
2. Validate required fields by record type.
3. Reject coordinates without a body and coordinate convention.
4. Reject surface marker types for orbit/flyby/trajectory records.
5. Reject rover_final_location when the source only supports a landing site.
6. Reject featured exhibits linked to missing machines or missions.
7. Require sources for factual dates, status, coordinates, and asset credits.
8. Validate latitude/longitude ranges using the selected convention.
9. Require uncertainty notes for approximate and regional coordinates.
10. Ensure each featured machine has a destination/encounter card even without an approved map pin.

A lightweight build-time validation script can enforce these rules during the competition build. Validation should fail visibly rather than silently dropping bad markers.

## 10. Performance and maintainability

- Keep mission text and marker data separate from 3D scene code.
- Load only records needed for the selected destination where practical.
- Avoid runtime external API calls for basic navigation.
- Keep JSON compact; do not duplicate long story content in marker records.
- Keep IDs stable so stories, galleries, maps, and previews reference the same records.
- Map rendering failure must not prevent access to the mission registry.
- Include a schema version so future changes can be deliberate.

## 11. Acceptance checklist

- [ ] Shared model exists for missions, machines, locations, and sources.
- [ ] Mission, machine, and location are separate concepts.
- [ ] Location types are controlled and semantically distinct.
- [ ] Coordinates are optional and carry body/convention/reference/uncertainty metadata.
- [ ] Original source values are preserved when conversions are made.
- [ ] Six agreed machines have stable planned IDs and correct destinations.
- [ ] Apollo 15 rover location is not fabricated from the Lunar Module coordinate.
- [ ] Sojourner final position is not fabricated from Pathfinder lander coordinates.
- [ ] Opportunity landing and final location are separate records.
- [ ] InSight is regional/approximate unless stronger evidence is verified.
- [ ] Pioneer 10 is a flyby/encounter record, not a Jupiter surface pin.
- [ ] Factual location/date/status claims have source traceability.
- [ ] Validation and manual review gates are defined.
- [ ] Map markers have equivalent accessible list entries.
- [ ] No unsupported mission count or live-tracking claim is displayed.

## 12. Manual review scenarios

1. Attempt to create a Pioneer 10 surface marker; reject it.
2. Attempt to label the Apollo 15 Lunar Module coordinate as the LRV parking location; reject it.
3. Attempt to assign Pathfinder lander coordinates as Sojourner's final point; reject it.
4. Add Opportunity landing and final-region records; confirm they remain distinct.
5. Add InSight's approximate coordinate; require an uncertainty note.
6. Add an archive-only mission without coordinates; confirm it remains in the destination list.
7. Add nearby markers; confirm clustering exposes every record.
8. Remove a source ID from a coordinate record; validation must fail.
9. Select a record from map and list; both must select the same record.
10. Disable map rendering; mission list and details remain accessible.

## 13. Scope and timing

This document defines data architecture, review workflow, and acceptance criteria only. It does not add production JSON, validation scripts, map code, or competition assets.

Create actual registry files and validation tests during the officially permitted November 14–15, 2026 build window, after checking current event rules and challenge guidance.

---

**Data principle:** A location record must describe what the evidence supports—not what would make the map look more complete.
