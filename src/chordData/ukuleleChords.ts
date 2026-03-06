import type { ChordFingeringMap, FretFinger } from '../types';

/**
 * Common ukulele chords. 4 strings: 1 = A, 2 = E, 3 = C, 4 = G (standard GCEA).
 * svguitar string 1 = highest pitch (A).
 */
export const ukuleleChords: ChordFingeringMap = {
  C: { fingers: [[1, 3, '3']], position: 1 },
  G: { fingers: [[1, 2, '1'], [2, 3, '2'], [3, 2, '3']], position: 1 },
  Am: { fingers: [[1, 2, '2']], position: 1 },
  F: { fingers: [[1, 2, '2'], [2, 1, '1']], position: 1 },
  D: { fingers: [[1, 2, '2'], [2, 2, '1'], [3, 2, '3']], position: 1 },
  Em: { fingers: [[1, 2, '2'], [2, 3, '3'], [3, 4, '4']], position: 1 },
  Dm: { fingers: [[1, 2, '2'], [2, 1, '1']], position: 1 },
  E: { fingers: [[1, 4, '4'], [2, 4, '3'], [3, 4, '2'], [4, 2, '1']], position: 2 },
  A: { fingers: [[1, 2, '1'], [2, 2, '2'], [3, 2, '3']], position: 1 },
  'A7': { fingers: [[1, 1, '1']], position: 1 },
  'C7': { fingers: [[1, 1, '1']], position: 1 },
  'D7': { fingers: [[1, 2, '2'], [2, 2, '1'], [3, 2, '3'], [4, 2, '4']], position: 1 },
  'G7': { fingers: [[1, 2, '1'], [2, 1, '2'], [3, 2, '3']], position: 1 },
  Bm: { fingers: ([[1, 2, '2'], [2, 2, '1'], [3, 2, '3'], [4, 'x']] as FretFinger[]), position: 1 },
  'B': { fingers: [[1, 2, '1'], [2, 4, '4'], [3, 4, '3'], [4, 4, '2']], barres: [{ fromString: 1, toString: 4, fret: 2, text: '1' }], position: 2 },
  'F#m': { fingers: [[1, 2, '2'], [2, 2, '1'], [3, 2, '3'], [4, 2, '4']], barres: [{ fromString: 1, toString: 4, fret: 2, text: '1' }], position: 2 },
};
