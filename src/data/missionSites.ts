/**
 * Verified historic landing-region markers; longitudes are east-positive.
 *
 * Sources are NASA/NSSDCA mission records. Rover markers indicate the landing
 * region (NOT the final parked position or a rover's full traverse).
 * Mars data source conventions differ between older IAU/USGS references;
 * display coordinates are approximate illustrative markers, not survey fixes.
 */
export interface MissionSite {
  machineId: string;
  world: 'moon' | 'mars';
  arrivalYear: number;
  latitude: number;
  longitude: number;
  region: string;
  kind: 'landing-site' | 'landing-region';
  detail: string;
  source: string;
}

export const missionSites: MissionSite[] = [
  {
    machineId: 'surveyor-3', world: 'moon', arrivalYear: 1967,
    latitude: -3.01, longitude: -23.41,
    region: 'Oceanus Procellarum', kind: 'landing-site',
    detail: 'Surveyor 3 tested the lunar soil and surface operations before Apollo astronauts landed.',
    source: 'https://science.nasa.gov/mission/surveyor-3/',
  },
  {
    machineId: 'apollo-15-lrv', world: 'moon', arrivalYear: 1971,
    latitude: 26.13239, longitude: 3.63330,
    region: 'Hadley–Apennine', kind: 'landing-region',
    detail: 'Apollo 15 brought the first lunar rover to the Moon, extending how far astronauts could investigate its geology.',
    source: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo15info.html',
  },
  {
    machineId: 'viking-1', world: 'mars', arrivalYear: 1976,
    latitude: 22.27, longitude: -47.95,
    region: 'Chryse Planitia', kind: 'landing-site',
    detail: 'Viking 1 operated a laboratory on the Martian surface, studying soil, atmosphere, and possible signs of life.',
    source: 'https://nssdc.gsfc.nasa.gov/planetary/viking.html',
  },
  {
    machineId: 'sojourner', world: 'mars', arrivalYear: 1997,
    latitude: 19.33, longitude: -33.55,
    region: 'Ares Vallis', kind: 'landing-region',
    detail: 'Sojourner proved that a small robotic rover could travel across Mars and investigate nearby rocks.',
    source: 'https://nssdc.gsfc.nasa.gov/planetary/mesur.html',
  },
  {
    machineId: 'opportunity', world: 'mars', arrivalYear: 2004,
    latitude: -1.9483, longitude: -5.52583,
    region: 'Meridiani Planum · Eagle Crater', kind: 'landing-region',
    detail: 'Opportunity began its journey in Eagle Crater and eventually found compelling evidence for ancient water.',
    source: 'https://science.nasa.gov/mission/mer-opportunity/',
  },
  {
    machineId: 'insight', world: 'mars', arrivalYear: 2018,
    latitude: 4.5, longitude: 135.9,
    region: 'Elysium Planitia', kind: 'landing-region',
    detail: 'InSight listened to marsquakes and revealed new details about the planet\'s crust, mantle, and core.',
    source: 'https://science.nasa.gov/mission/insight/',
  },
];

export const sitesForWorld = (world: 'moon' | 'mars') =>
  missionSites.filter((site) => site.world === world)
    .sort((a, b) => a.arrivalYear - b.arrivalYear);

export const formatSiteCoordinates = (lat: number, lon: number) =>
  `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;
