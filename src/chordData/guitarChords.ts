import type { ChordFingeringMap } from '../types';

/**
 * Common guitar chords in svguitar format.
 * String 1 = high E, 6 = low E. Fingers only for fretted notes; open strings have no entry.
 */
export const guitarChords: ChordFingeringMap = {
  C: { fingers: [[2, 1, '1'], [4, 2, '2'], [5, 3, '3']], position: 1 },
  D: { fingers: [[1, 2, '2'], [2, 3, '3'], [3, 2, '1']], position: 1 },
  E: { fingers: [[2, 1, '1'], [3, 2, '2'], [4, 2, '3']], position: 1 },
  G: { fingers: [[1, 3, '3'], [5, 2, '1'], [6, 3, '2']], position: 1 },
  A: { fingers: [[2, 2, '1'], [3, 2, '2'], [4, 2, '3']], position: 1 },
  Am: { fingers: [[2, 1, '1'], [3, 2, '2'], [4, 2, '3']], position: 1 },
  Em: { fingers: [[4, 2, '1'], [5, 2, '2']], position: 1 },
  Dm: { fingers: [[1, 1, '1'], [2, 3, '3'], [3, 2, '2']], position: 1 },
  F: {
    fingers: [[1, 1, '1'], [2, 1, '1'], [3, 2, '2'], [4, 3, '3'], [5, 3, '4']],
    barres: [{ fromString: 1, toString: 2, fret: 1, text: '1' }],
    position: 1,
  },
  'F#m': { fingers: [[2, 2, '1'], [3, 2, '2'], [4, 2, '3'], [6, 2, '4']], barres: [{ fromString: 2, toString: 6, fret: 2, text: '1' }], position: 2 },
  Bm: { fingers: [[1, 2, '1'], [2, 3, '2'], [3, 4, '3'], [4, 4, '4']], barres: [{ fromString: 1, toString: 5, fret: 2, text: '1' }], position: 2 },
  B: { fingers: [[1, 2, '1'], [2, 4, '4'], [3, 4, '3'], [4, 4, '2'], [5, 2, '1']], barres: [{ fromString: 1, toString: 5, fret: 2, text: '1' }], position: 2 },
  'C#m': { fingers: [[2, 2, '1'], [3, 2, '2'], [4, 2, '3'], [5, 4, '4']], barres: [{ fromString: 2, toString: 4, fret: 2, text: '1' }], position: 2 },
  'G#': { fingers: [[1, 3, '4'], [2, 4, '3'], [3, 4, '2'], [4, 4, '1'], [5, 3, '1']], barres: [{ fromString: 2, toString: 5, fret: 4, text: '1' }], position: 4 },
  'A7': { fingers: [[1, 2, '2'], [2, 2, '1'], [4, 2, '3']], position: 1 },
  D7: { fingers: [[1, 2, '2'], [2, 1, '1'], [3, 2, '3']], position: 1 },
  E7: { fingers: [[2, 1, '1'], [3, 2, '2'], [4, 0], [5, 0]], position: 1 },
  C7: { fingers: [[2, 1, '1'], [4, 2, '2'], [5, 3, '3'], [6, 3, '4']], position: 1 },
  G7: { fingers: [[1, 1, '1'], [5, 2, '2'], [6, 3, '3']], position: 1 },
};
