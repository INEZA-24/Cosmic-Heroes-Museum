# Feature Completion & Quality Gate

## Definition of done
A milestone is considered validated only when its required acceptance criteria are met and the implementer reports the *actual* checks run. Never label a feature tested based solely on reviewing its source. Do not automatically merge a PR.

## Automated checks
Every application PR must include a lockfile and `test` and `build` npm scripts. The GitHub Action runs `npm ci`, `npm test`, and `npm run build`. During planning-only stage, the Action explicitly reports that it has not run application tests.

## Browser testing
- Check supported desktop and mobile widths.
- Test direct navigation, back navigation, mouse, touch, keyboard, focus, image loading, and no broken links.
- Test with reduced motion settings.
- Check a low-powered device or a 2D fallback for 3D functionality.
- Record any browser checks not actually performed.

## Scientific and legal review
- Check mission chronology, dates, locations, final resting sites, coordinate reference conventions and artifact state against original documentation.
- Label art as an illustration; do not mistake an artist rendering for a photograph.
- Add source URLs, credits and media usage notes. Don't display official NASA branding in a way that suggests endorsement.

## Milestone workflow
1. Open feature issue with scope and acceptance criteria.
2. Create isolated feature branch after build window begins.
3. Implement, run relevant tests, repair failures and retest.
4. Open draft PR with test logs and manual evidence.
5. Lead reviews. Merge only on explicit approval.

**Current phase:** pre-event engineering setup only. No competition solution code has been started.
