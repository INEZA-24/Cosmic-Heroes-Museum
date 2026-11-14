/**
 * Curated NASA hero-image sources. These assets belong to NASA/JPL or their
 * credited collaborators; image kind is displayed to distinguish historical
 * photographs from artist renderings.
 *
 * Source pages and 4 additional gallery picks per exhibit:
 * M8_NASA_Image_Curation.md in the accompanying research pack.
 *
 * Remote NASA URLs are provisional: for dependable production performance,
 * export optimized local .webp files to public/assets/exhibits/<id>/hero.webp.
 */
export interface MuseumHero {
  src: string;
  sourceUrl: string;
  credit: string;
  description: string;
  kind: 'NASA ARCHIVE PHOTOGRAPH' | 'NASA MISSION ARTWORK' | 'NASA VISUAL COMPOSITE' | 'MISSION ILLUSTRATION' | 'MISSION REFERENCE IMAGE';
}

export const exhibitHeroes: Record<string, MuseumHero> = {
  'surveyor-3': {
    src: '/assets/exhibits/surveyor-3/Surveyor3.webp',
    sourceUrl: '',
    credit: 'Museum-uploaded image; original source not yet verified',
    kind: 'MISSION REFERENCE IMAGE',
    description: 'Surveyor 3 mission image from the museum collection.'
  },
  'viking-1': {
    src: '/assets/exhibits/viking-1/hero.webp',
    sourceUrl: '',
    credit: 'Museum-uploaded image; original source not yet verified',
    kind: 'MISSION REFERENCE IMAGE',
    description: 'Viking 1 spacecraft and its exploration of Mars.'
  },
  'apollo-15-lrv': {
    src: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/09/2/2-apollo_15_on_moon-1.jpg?crop=faces%2Cfocalpoint&fit=clip&h=3025&w=4096',
    sourceUrl: 'https://science.nasa.gov/resource/apollo-15-on-the-moon/',
    credit: 'NASA',
    kind: 'NASA ARCHIVE PHOTOGRAPH',
    description: 'James Irwin at the lunar rover during Apollo 15, photographed by David Scott.'
  },
  sojourner: {
    src: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/mars/downloadable_items/3/9/39752_PIA00611.jpg?crop=faces%2Cfocalpoint&fit=clip&h=960&w=1280',
    sourceUrl: 'https://science.nasa.gov/resource/pathfinders-rover-airbags-martian-terrain/',
    credit: 'NASA/JPL',
    kind: 'NASA ARCHIVE PHOTOGRAPH',
    description: 'Sojourner on its Mars Pathfinder landing platform, surrounded by Martian terrain.'
  },
  opportunity: {
    src: '/assets/exhibits/opportunity/hero.webp',
    sourceUrl: '',
    credit: 'Illustration; artist credit not verified',
    kind: 'MISSION ILLUSTRATION',
    description: 'Illustration of the Opportunity rover exploring the Martian surface.'
  },
  insight: {
    // Version matches the verified InSight landing illustration; bypasses any stale CDN image.
    src: '/assets/exhibits/insight/hero.webp?v=e37434c9',
    sourceUrl: 'https://science.nasa.gov/photojournal/insight-on-the-surface-of-mars/',
    credit: 'NASA/JPL-Caltech',
    kind: 'NASA MISSION ARTWORK',
    description: 'Official artist illustration of InSight operating on the Martian surface.'
  },
  'pioneer-10': {
    src: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/09/p/pioneer10_art-3.jpg?crop=faces%2Cfocalpoint&fit=clip&h=1879&w=2971',
    sourceUrl: 'https://science.nasa.gov/resource/pioneer-10-at-jupiter-artists-concept/',
    credit: 'NASA',
    kind: 'NASA MISSION ARTWORK',
    description: 'Official NASA illustration of the Pioneer 10 spacecraft passing Jupiter.'
  },
  'cassini-huygens': {
    src: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/photojournal/pia/pia03/pia03883/PIA03883.jpg?crop=faces%2Cfocalpoint&fit=clip&h=9600&w=14400',
    sourceUrl: 'https://science.nasa.gov/photojournal/artistss-conception-of-cassini-saturn-orbit-insertion/',
    credit: 'NASA/JPL',
    kind: 'NASA MISSION ARTWORK',
    description: 'NASA artist illustration of Cassini entering orbit around Saturn.'
  }
};
