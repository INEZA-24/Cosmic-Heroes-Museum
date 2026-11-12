export interface MachineStoryChapter {
  title: string;
  content: string;
}

export interface MachineTimelineEvent {
  date: string;
  title: string;
  desc: string;
}

export interface Machine {
  id: string;
  name: string;
  place: string;
  area: 'moon' | 'mars' | 'deep-space' | 'saturn';
  kind: string;
  year: string;
  summary: string;
  location: string;
  detail: string;
  launchDate?: string;
  landingDate?: string;
  status?: string;
  engineering?: string[];
  story?: MachineStoryChapter[];
  discoveries?: string[];
  timeline?: MachineTimelineEvent[];
  sourceUrl?: string;
  sourceLabel?: string;
}

export interface PlanetData {
  name: string;
  key: string;
  radius: number;
  distance: number;
  texture: string;
  color: number;
  rotation: number;
  clouds?: string;
  rings?: boolean;
  axialTilt?: number;
  roughness?: number;
  metalness?: number;
}

export type ViewType = 'entrance' | 'solar' | 'collection' | 'destination' | 'exhibit' | 'guided';

export type DestinationArea = 'moon' | 'mars' | 'deep-space' | 'saturn';
