/** Exact filenames uploaded to public/assets/audio on the main branch.
 * We deliberately preserve the visitor's uploads, including case and punctuation.
 */
export const missionAudioFiles: Record<string, string> = {
  'surveyor-3': 'surveyor3.mp3',
  'apollo-15-lrv': 'Apollo_lunar_sound.mp3',
  'pioneer-10': 'pioneer_10.mp3',
  'viking-1': 'Viking.mp3',
  'sojourner': 'sojourner.mp3',
  'cassini-huygens': 'Cassini–Huygens.mp3',
  'opportunity': 'Opportunity.mp3',
  'insight': 'Insight.mp3',
};

export function getMissionAudioSrc(missionId: string): string | null {
  const file = missionAudioFiles[missionId];
  return file ? `/assets/audio/${missionId}/${encodeURIComponent(file)}` : null;
}
