# COSMIC HEROES OF STEEL MUSEUM
## Product Requirements Document + Project Handoff Prompt
**Version 1.0 — 4 November 2026**

> Use this as the primary migration brief for the new ChatGPT Pro account/member. It captures project intent and reported history, not a live repository audit. Verify GitHub, PRs, files and Vercel before relying on any reported implementation.

## Copy-and-paste migration prompt

You are joining an active NASA Space Apps Challenge project called **Cosmic Heroes of Steel Museum**. Treat this PRD as the source of truth for product intent and project history. Continue implementation; do not restart planning.

First inspect https://github.com/INEZA-24/Cosmic-Heroes-Museum. Verify the default branch, commits, PRs, active branches, Vercel configuration and actual files (`index.html`, `src/app.js`, `src/styles.css`, `package.json`, documentation/data). Establish what works, what is incomplete and what is broken. Run or inspect the build. Compare the actual preview with the source. Preserve working features. Do not claim a PR/build/test/deployment succeeded unless verified. Work in small reviewable PRs and do not merge without user approval. The immediate priority is a complete, reliable visitor journey through the museum. Keep the unresolved texture issue isolated. The user is time-constrained and prefers practical implementation over long planning.

## 1. Product summary and mission

Cosmic Heroes of Steel Museum is a browser-based interactive digital museum telling the stories of six NASA robotic explorers and pieces of exploration hardware. It helps school-age space enthusiasts understand what these machines were, why they were sent, how they worked, what they discovered and what legacy they left.

**Mission statement:** Bring the silent machines of space exploration to life through an accessible, visually immersive and scientifically grounded digital museum—turning mission history into human-centred stories that inspire the next generation of explorers.

The challenge is that mission history is often buried in dense technical pages. The museum should turn that information into clear, visual, memorable storytelling.

## 2. Challenge objectives and audience

- Explain the purpose and design of historic/current NASA exploration hardware.
- Show where each machine went and what mission it supported.
- Translate complex mission facts into age-appropriate storytelling.
- Connect engineering decisions to scientific discoveries.
- Accurately represent mission status.
- Primary audience: ages approximately 10–18; secondary: teachers, families and casual visitors.
- Use clear language, readable contrast, accessible controls and non-audio access to all narration.

## 3. Selected six machines

Confirm names and facts against the team's original documentation before final submission.

| Machine | Destination | Type | Story focus |
|---|---|---|---|
| Surveyor 3 | Moon | Robotic lunar lander | Soft-landed, photographed the surface and tested lunar soil; later visited by Apollo 12 astronauts. |
| Apollo 15 Lunar Roving Vehicle | Moon | Crewed lunar surface vehicle | Enabled astronauts to travel farther and conduct more extensive field science. |
| Sojourner | Mars | Mars rover / technology demonstrator | First successful wheeled rover to operate on Mars, delivered by Mars Pathfinder in 1997. |
| Opportunity | Mars | Mars Exploration Rover | Explored for more than fourteen years and found evidence of past water-related environments. |
| InSight | Mars | Stationary geophysical lander | Studied Mars' interior through seismic observations and heat-flow investigations. |
| Pioneer 10 | Deep space / Jupiter | Outer-planet probe | First spacecraft to make a close encounter with Jupiter; continued outward from the Sun. |

## 4. Desired visitor journey

1. **Museum entrance:** theatrical velvet/curtain opening. Optional short welcome audio (“Welcome to the Cosmic Heroes of Steel Museum”). The visitor can enter/skip; no loud autoplay; include mute and transcript/captions.
2. **Solar System:** immersive, full-width Three.js scene with Sun, planets, orbit paths, stars and mission beacons. It should occupy the main hero/exploration area, not a small card.
3. **Destination selection:** select Moon, Mars or Deep Space and see an introduction plus relevant exhibits.
4. **Machine exhibition:** each machine has a dedicated exhibit with hero image, name, destination, dates/status, story, discoveries, facts, timeline and source references.
5. **Return/discover:** clear back navigation and previous/next exhibit controls.

## 5. Functional requirements

- Entrance can be entered or skipped; it never traps visitors.
- Responsive Three.js Solar System with rotate/drag, zoom and planet selection.
- Clear mission beacons tied to the six exhibits.
- Moon, Mars and Deep Space destination views.
- Six dedicated, data-driven exhibit views.
- Mission story, discoveries, facts, timeline, status and reliable source links for each machine.
- Working return-to-destination and previous/next controls.
- Optional welcome narration first; exhibit narration later, with controls and transcript.
- Mobile/tablet/desktop support and graceful fallback for low-power devices or unavailable WebGL.
- Missing textures/audio/images must never crash the entire app.
- Scientific dates, measurements and mission outcomes must be accurate; identify illustrative scale.

## 6. Visual direction

Cinematic editorial science museum—not a generic dashboard. Deep navy/near-black space backgrounds, warm ivory headlines, restrained amber-orange accents and muted blue-grey supporting text. Expressive serif display typography with clean sans-serif body copy. Full title must read **COSMIC HEROES OF STEEL MUSEUM**. Emblem: simple orbital rings with a small survivor/explorer robot at the centre. Use stars, subtle glows, orbital lines and negative space; avoid clutter, excessive neon and generic card-heavy layouts.

## 7. Technical direction

- Web application hosted on Vercel.
- Three.js is the chosen 3D approach.
- Main files referenced in prior work: `index.html`, `src/app.js`, `src/styles.css` (verify actual structure).
- Repository: https://github.com/INEZA-24/Cosmic-Heroes-Museum
- Production domain previously shared: https://cosmicsteelheroes.vercel.app/
- Verify `package.json` and Vercel build settings rather than guessing.
- Keep exhibit content data-driven.
- Prefer reliable local/bundled assets where licensing and size allow. Verify external image/texture URLs, CORS, attribution and availability.
- Use NASA mission resources as primary references and retain citations/source links.

## 8. Reported implementation history (verify before relying)

- Initial homepage and Solar System navigation were developed and deployed.
- Solar System evolved into a larger full-width Three.js scene with Sun, planets, orbit paths and stars.
- The team requested realistic planetary surfaces, especially visible Earth continents and natural planet textures.
- Texture fix attempts failed: preview reported all nine surface maps failed, leaving mostly plain coloured spheres. This was deliberately parked so the rest of the museum could progress.
- A misleading message appeared: “Your browser could not start the 3D universe. Please try a WebGL-enabled browser.” A code inspection suggested an undefined `textureBase` reference in Moon texture loading could throw during setup; a correction was reportedly pushed but not verified as a complete fix.
- PR #18 was first created for texture diagnostics/fixes; the prior conversation later reported adding individual exhibition views and updating the PR description. Verify actual PR state, changed files, branch and Vercel preview. Do not assume it is merged or healthy.
- Reported exhibition changes: machine selection links, dedicated exhibit view, mission summaries, facts, timelines, previous/next navigation and responsive styling. Requires preview testing.

## 9. Risks and unresolved issues

1. **Textures:** inspect browser Network and Console. Determine if requests are 404, blocked by CORS, redirected, invalid image responses or loader-path errors. Do not keep guessing URLs.
2. **WebGL/error handling:** distinguish actual WebGL context creation failure from JavaScript exceptions during scene initialization. Report accurate errors.
3. **External assets:** hosts can block cross-origin requests or change URLs. Bundle properly licensed assets when practical.
4. **Scientific accuracy:** verify starter exhibit metrics/dates/status against NASA and team documentation.
5. **Navigation:** test collection → exhibit, destination → exhibit, back, previous and next.
6. **Performance:** cap pixel ratio, texture sizes and geometry; add loading states and graceful fallbacks.

## 10. Recommended priorities

- **P0:** verify repository/deployment truth and establish safe baseline.
- **P0:** complete entrance → Solar System → destination → exhibit → back journey.
- **P0:** verify all six exhibits and their facts/status/source links.
- **P1:** add genuine NASA exhibit photographs/diagrams with attribution.
- **P1:** connect all six exhibits to mission beacons.
- **P1:** add optional welcome narration with transcript.
- **P2:** exhibit narration, richer stories and sound design.
- **P2:** return to planet realism after gathering actual diagnostics.
- **P2:** accessibility, responsive and performance polish.

## 11. Definition of done

- Visitor can enter/skip intro.
- Solar System fills intended exploration area and is usable.
- Moon, Mars and Deep Space destinations are selectable.
- All six machines are discoverable.
- Each has a distinct complete exhibit with story, facts, timeline, status and sources.
- All navigation controls work.
- Missing media does not crash the app.
- WebGL fallback appears only for genuine WebGL context failure; JavaScript errors are separately reported.
- Core content works without audio or external media.
- Vercel preview tested on desktop Chrome and a mobile-sized viewport.
- Facts and media attributions checked.
- Stable, accessible demonstration-ready prototype.

## 12. Working agreement

- Be execution-focused; the user has limited time.
- Verify exact current files/branch before editing; use latest file version/SHA.
- Do not invent successful tests, commits, PRs or deployment states.
- Preserve working features and the navy/ivory/amber identity.
- Keep PRs focused; explain files changed, user-visible effect, limitations and exact test steps.
- Ask user approval before merging.
- Use the six selected machines unless the team confirms a documented change.
- Do not let texture failures block the educational museum journey.

## 13. Links

- GitHub: https://github.com/INEZA-24/Cosmic-Heroes-Museum
- Production site previously shared: https://cosmicsteelheroes.vercel.app/
- PR #18 (reported working PR; verify): https://github.com/INEZA-24/Cosmic-Heroes-Museum/pull/18
- NASA: https://www.nasa.gov/
- NASA Solar System Exploration: https://science.nasa.gov/solar-system/

## Final instruction

Do not redesign from scratch. Verify the real code and deployment, then make the museum journey complete and dependable. The goal is a compelling educational prototype that tells the stories of these six machines—not merely a technically impressive Solar System that visitors cannot use.
