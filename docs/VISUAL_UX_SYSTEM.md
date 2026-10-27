# Cosmic Heroes — Visual & Interaction System (Approval Draft)

**Owner:** Cosmic Heroes of Steel Museum team  
**Status:** Design specification, not competition implementation code  
**Companion references:** `docs/M2_SOLAR_SYSTEM_CONTRACT.md`, `docs/IMPLEMENTATION_MILESTONES.md`, `docs/QUALITY_GATE.md`  
**Applicable to:** Museum Entry, Solar System Explorer, Mission Preview, Hero Story, Legacy Gallery

## 1. Design intention

A calm, welcoming, believable science museum for young learners. **The real NASA missions should be the spectacle, not the UI.**

Use natural, editorial design: strong photography, readable type, intentional whitespace, honest source captions, solid color surfaces, fine borders, minimal cinematic motion.

### Explicit constraints

- Title **COSMIC HEROES OF STEEL MUSEUM** centered in the desktop header and visibly centered on mobile.
- Original orange circular orbital emblem from our mockup is a **visual reference** only. Create and maintain a clean original asset separately at implementation time. Do **not** copy the NASA insignia or imply formal NASA endorsement.
- No pill buttons, oversized rounded rectangles, synthetic glossy cards, glassmorphism overload, heavy gradients, excessive stars, pulsing or flashing glows, artificial rover images posed as documentary photos, or “AI dashboard” visual clichés.
- No fabricated mission totals, false “live tracking” claims, or inaccurate planet sizes/distances.
- Hero photography and map labels remain readable without filters that destroy scientific context.

## 2. UI tokens (proposed, review before coding)

| Token | Value | Intended use |
|---|---|---|
| `color.background` | `#10171E` | Main Solar System and entry background |
| `color.surface` | `#19232C` | Destination information panels |
| `color.surfaceMuted` | `#23313C` | Hover/highlight surfaces |
| `color.paper` | `#F4F1E9` | Museum story reading surface |
| `color.ink` | `#14202A` | Body text on light surfaces |
| `color.text` | `#F8F7F3` | Text on dark surfaces |
| `color.muted` | `#B4C0C8` | Supporting labels on dark surfaces |
| `color.accent` | `#D18A52` | Museum identity and carefully limited accents |
| `color.borderDark` | `#40505D` | Fine dividers and panel borders |
| `color.focus` | `#F6BD79` | Highly visible keyboard focus ring |

Treat values as initial constraints. Verify contrast for each real foreground/background pair, not by assumption. Body text should satisfy at least WCAG 2.2 AA contrast thresholds.

**Typography:** A legible system sans stack first (`system-ui, -apple-system, 'Segoe UI', sans-serif`); avoid font downloads in MVP. Header display text uses moderate letterspacing and weight, not condensed techno lettering. Body paragraph line length: approximately 55–75 characters; base size 16–18px, line-height 1.5–1.65. Headline sizes scale fluidly without overflow.

**Spacing:** 4px base grid, content max-width 1200px, readable narrative column 720px max, 16–20px mobile side margins, 24–40px desktop content gutters. Ensure no horizontal page overflow.

**Geometry:** buttons 2px corner radius (or square), cards at most 4px, restrained 1px borders, minimal/no box shadows. Provide at least 44×44px touch target where practical; never trade hit area for visual thinness.

## 3. Shared header and navigation

**Desktop:** original emblem at left, centered museum name in its own layout region, compact right-side navigation (`Explore`, `About` and `Back to Map` as context requires). A long center title must be responsive without colliding with left/right content. Prefer a three-area grid, with balanced width on left and right.

**Mobile:** retain centered legible title, reduce letter spacing and font size before wrapping awkwardly. Use an accessible navigation disclosure with label and clear touch area if links cannot fit. The title must not overlap the emblem or controls.

The museum title is an actual heading on the entry screen; story pages use a semantic page heading for the machine and a compact brand reference in the header.

## 4. Screens and their contracts

### A. Entry / introduction (M1)
- Clear central invitation and short, accurate opening statement about inactive, retired or left-behind exploration hardware.
- Controls: `Enter Museum`, `Skip Intro`. Enter brings the visitor to the Solar System; skip doesn't trap them in an animation.
- Optional introductory narration off by default; no auto-play audio.
- If a visual trailer exists, it is nonessential to successful entry.
- A reduced-motion or low-bandwidth visitor gets the same navigation.

### B. Solar System overview (M2)
- All eight planets and Sun, Moon accessible through Earth, deep-space region.
- Mark `Illustrative overview — sizes, distances and positions not to scale` in visible small print.
- Accessible labeled planet selection and explicit destination alternative on narrow devices.
- On destination selection: panel displays name, short description, featured/archive designation and a clear next action.
- No "hover only" content; no permanently running WebGL rendering required.
- Featured Moon and Mars lead to actual surface site maps; Jupiter/Saturn and other planetary destinations use mission/encounter lists where suitable.
- Return action preserves reasonable navigation context.

### C. Mission marker / popup (M4–M5)
- Map point represents a verified mission site, final position, or appropriately described encounter—not a generic invented coordinate.
- Closeable popup shows: mission name, period/year, where, objective summary, featured Hero name where applicable, NASA original source.
- **Featured:** `Enter the Mission` navigates to a finished hero exhibit.
- **Archive only:** `Legacy Under Discovery` is explanatory text, not a dead-looking disabled CTA; include `Read NASA mission record` as a real external link.
- Multiple missions at one site: show a count and accessible list of missions; do not use marker size as an unsourced count.

### D. Hero of Steel story (M6)
- Authentic Mars/Moon scene or accurately labeled illustration as background.
- Museum-inspired large mission title, clear featured machine identity, short lead paragraph, final mission state.
- Small middle-left foreground machine image, with careful mobile repositioning, not a giant overlapping sticker.
- Seven sections: Meet the Hero → Mission Purpose → Engineering → Journey → Discoveries → Final Signal → Legacy.
- Primary story CTA `Begin the Story` scrolls to first chapter. Avoid forced scroll-jacking or narration.
- Persistent, accessible Return to Map and direct chapter links.
- Each chapter must cite relevant original mission sources.

### E. Legacy Gallery (M7)
- Image grid/gallery ordered from artifact portrait → preparation → in action → explored landscape → scientific evidence → legacy.
- Each asset stores caption, credit, date if known, source URL and kind (`photograph`, `illustration`, `diagram`).
- Optional fullscreen/lightbox with keyboard close, focus management, image navigation and lazy loading.
- Do not put watermarked third-party imagery into the project without documented permission.

### F. Featured trailer / idle preview rail (M9)
- Horizontal preview rail shows selected missions; manual controls always available.
- An optional automatic advance occurs after **60 seconds of genuine inactivity**, not every minute regardless of visitor actions.
- Reset timer on keyboard, pointer, scroll and touch interactions. Pause when focused or hovered and when the document is hidden.
- Under `prefers-reduced-motion`, keep the rail static by default.
- It must not change destinations or move the user's viewport unexpectedly.

## 5. Motion principles

- Entrance or panel transitions are functional, generally 150–250ms and never necessary for comprehension.
- No mandatory intro sequence: visitors can bypass it.
- Avoid spinning planets continuously as a requirement for using the UI; if decorative rotation is used, stop/pause based on device and motion preference.
- Prefer native scrolling and CSS transitions rather than a large animation dependency.

## 6. Performance and failure states

- Prefer native HTML, CSS and JavaScript for information screens.
- Load heavy planet textures and any Three.js code only in destination scenes that need them; show an honest 2D alternative.
- Responsive NASA imagery with optimized widths, `loading=lazy` for noncritical images, and reserved space to avoid page jumping.
- If one mission's media is unavailable: show a neutral placeholder and intact text, source link and gallery metadata rather than broken-image clutter.
- If scripting fails: the entry still has a navigable non-JS link to core destinations and/or museum overview content.
- Reject silent blank screens as an acceptable empty state.

## 7. Review gates (for each future implementation PR)

- [ ] Matches centered identity and neutral editorial style.
- [ ] No NASA emblem or implication of endorsement.
- [ ] Consistent controls, visible focus, keyboard and touch access.
- [ ] Clear `normal / hover / focus / selected / unavailable` behavior.
- [ ] Phone and desktop layouts verified with screenshots and recorded viewport sizes.
- [ ] No text/image overlap, horizontal overflow, or broken source links.
- [ ] Reduced-motion preference respected; no forced auto-navigation.
- [ ] Color contrast checked on actual rendered pairings.
- [ ] Automated tests and production build pass (after app scaffolding exists).
- [ ] User journey is repeatable end-to-end without console errors.

## 8. Production sequence and ownership

- M1: brand header + intro entry.
- M2: full Solar System navigation.
- M3–M5: destination maps, mission markers and popups.
- M6–M7: a first genuinely complete Hero page and its Legacy Gallery.
- M8: six fully sourced Heroes, meaningful archive-only mission summaries.
- M9: opt-in/idle featured trailer.
- M10: compatibility testing, quality review and Vercel deployment.

**Scope note:** This document contains specifications only, not competition interface implementation. Competition-specific code is to be created during the permitted November 14–15 build window. Official 2026 event guidance confirms projects are developed during the hackathon.
