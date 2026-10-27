# Cosmic Heroes of Steel — Implementation Roadmap

**Status:** Planning only. **Event:** NASA Space Apps Kigali, November 14–15, 2026.

## Definition of the product

A welcoming, lightweight web museum of real historical NASA exploration hardware. A visitor begins with a full Solar System overview, selects a destination, inspects authentic mission markers, opens a short mission popup, and enters a curated **Hero of Steel** story with a credited Legacy Gallery. Non-featured mission markers remain discoverable with a short archive summary and original NASA reference.

### Principles
- Entire Solar System is visible at entry. Not every destination needs detailed terrain or a complete exhibit.
- Six carefully chosen finished hero exhibits; confirm list after reviewing official challenge requirements and available NASA assets.
- Keep science and mission statuses accurate. Distinguish a landing site, rover final location, orbit, flyby, and deep-space trajectory.
- Native HTML/CSS/JS for stories and controls; a small Three.js module only if a 3D view is validated on low-end hardware. A 2D fallback is mandatory.
- Museum title centered; retain original independent orange emblem, no NASA insignia; editorial design, rectangular buttons, restrained animation and no gradients-heavy styling.
- Rotating mission trailer: only after 60 seconds of inactivity, with manual controls, pause on input/focus, and reduced-motion support. No disruptive auto-navigation.
- No placeholder “100+ missions” claim until entries are actually in the archive.
- Attribute photos, 3D models and NASA facts with direct source URLs and license/credit notes.

## Milestone acceptance plan

### M0 — Repository & engineering preparation (before hackathon)
- Agree owner roles, main/feature branch process, review rules, and naming standards.
- Confirm deployment capability with a separate generic practice app.
- Source research, mission coordinates, 3D resource investigation, and UX specifications.
- **Done when:** team can open issues, PRs, review changes, and explain the data/model plan.
- **Does not produce** museum implementation code ahead of permitted build window.

### M1 — Minimal museum entry
- Responsive homepage with centered museum title, original emblem placeholder, opening story, skip/enter actions.
- Standard nav and accessible focus/keyboard paths.
- **Done when:** visitor enters the museum in mobile and desktop browsers without dead links.

### M2 — Full Solar System overview
- All eight planets, Sun, Moon as selectable Earth-related destination, and deep-space route.
- Clear labels and accessible destination chooser; responsive 2D fallback.
- **Done when:** all rendered objects can be identified and selected, and each destination has a defined next screen.

### M3 — Destination views
- Moon/Mars surface views first; archive-only planetary encounter views for flybys/orbiters.
- Return to Solar System navigation, current destination indicated.
- **Done when:** navigation doesn't lose context and maps render acceptably on an ordinary phone.

### M4 — NASA mission registry & markers
- Structured mission records, verified coordinate systems, marker types, clustering for overlapping sites.
- Show more NASA missions than six without inventing sites.
- **Done when:** each tested marker corresponds to a verified place or scientifically appropriate route/encounter.

### M5 — Mission preview cards
- Popups with mission, objective, dates, location type, short verified summary.
- Featured missions show “Enter the Mission”; archive-only show “Legacy Under Discovery” plus NASA-source link.
- **Done when:** all markers open correct, dismissible, keyboard-accessible previews.

### M6 — Reusable Hero of Steel story
- Responsive museum-style scene: authentic background, small foreground artifact visual, mission status, chapter navigation.
- Seven chapters: Identity, Purpose, Engineering, Journey, Discoveries, Fate, Legacy.
- **Done when:** one complete researched hero has an end-to-end story and return path.

### M7 — Legacy Gallery
- Gallery attached to hero page with authentic photos, engineering diagrams, and optional true 3D resources.
- Lightbox, descriptions, dates, source URLs, credits, visual-type labels (photograph/illustration/diagram).
- **Done when:** accessible image viewing works, proper attribution appears, assets are optimized.

### M8 — Six complete heroes + archive coverage
- Populate six full stories only after all scientific assertions are validated.
- Additional mission markers have useful summaries even when stories are incomplete.
- **Done when:** six fully sourced exhibits work and no mission popup leads to an empty screen.

### M9 — Featured mission trailer
- Manual preview controls and idle-based 60-second advance; pause when interacting, reduced-motion aware.
- **Done when:** trailer works without disturbing exploration or keyboard users.

### M10 — QA, deployment, and submission
- Test science, dates, links, mobile, touch, focus, WebGL fallback, performance, image credits.
- Deploy to Vercel, test published routes and assets, complete hackathon submission.
- **Done when:** production URL is accessible and the demo follows the visitor flow end to end.

## Proposed project structure (implemented during build period)

```text
index.html
src/styles/base.css
src/styles/museum.css
src/scripts/entry.js
src/scripts/solar-system.js
src/scripts/destinations.js
src/scripts/mission-popup.js
src/scripts/story.js
src/scripts/gallery.js
src/data/missions.json
src/data/heroes.json
public/assets/...
```

## Data requirements

Each mission: stable ID, destination, type of location, site coordinates only when meaningful, coordinate convention, date, objective, verified summary, NASA source URL, featured hero ID if available.

Each hero: name/type, status, last known location, chapter content with citations, original imagery with license/credit/source/alt text, optional 3D file with source.

## PR workflow

One small PR per milestone, with screenshots or test evidence, acceptance checklist, and risks. Keep PR as draft until owner review. Merge only on explicit approval. No direct feature commits to `main`.

## Team workstreams (assign owners later)

1. Mapping & 3D feasibility
2. Frontend / accessibility
3. UX and original branding
4. Mission science and coordinates
5. NASA media and galleries
6. QA, integration, release

## Build timing

Complete conceptual research, source verification and generic technical learning before the hackathon. Re-check the official 2026 full challenge statement and competition development rules. Build actual contest pages, mission maps and exhibits during the officially permitted window.
