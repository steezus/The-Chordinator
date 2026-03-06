/**
 * Chord symbol → piano note names (no octave), matching PianoChord.org "Notes:" lines.
 * Used so our piano diagram highlights the same keys as PianoChord.org.
 * @see https://www.pianochord.org/
 */

/** Notes as shown on PianoChord.org (e.g. "C - E - G"). Octave is applied when rendering. */
export const PIANO_CHORD_NOTES: Record<string, string[]> = {
  // Major
  C: ['C', 'E', 'G'],
  D: ['D', 'F#', 'A'],
  E: ['E', 'G#', 'B'],
  F: ['F', 'A', 'C'],
  G: ['G', 'B', 'D'],
  A: ['A', 'C#', 'E'],
  B: ['B', 'D#', 'F#'],
  'C#': ['C#', 'E#', 'G#'],
  'Db': ['Db', 'F', 'Ab'],
  'D#': ['D#', 'F##', 'A#'],
  'Eb': ['Eb', 'G', 'Bb'],
  'F#': ['F#', 'A#', 'C#'],
  'Gb': ['Gb', 'Bb', 'Db'],
  'G#': ['G#', 'B#', 'D#'],
  'Ab': ['Ab', 'C', 'Eb'],
  'A#': ['A#', 'C##', 'E#'],
  'Bb': ['Bb', 'D', 'F'],
  // Minor
  Cm: ['C', 'Eb', 'G'],
  Dm: ['D', 'F', 'A'],
  Em: ['E', 'G', 'B'],
  Fm: ['F', 'Ab', 'C'],
  Gm: ['G', 'Bb', 'D'],
  Am: ['A', 'C', 'E'],
  Bm: ['B', 'D', 'F#'],
  'C#m': ['C#', 'E', 'G#'],
  'Ebm': ['Eb', 'Gb', 'Bb'],
  'F#m': ['F#', 'A', 'C#'],
  'Abm': ['Ab', 'Cb', 'Eb'],
  'Bbm': ['Bb', 'Db', 'F'],
  // Dominant 7
  C7: ['C', 'E', 'G', 'Bb'],
  D7: ['D', 'F#', 'A', 'C'],
  E7: ['E', 'G#', 'B', 'D'],
  F7: ['F', 'A', 'C', 'Eb'],
  G7: ['G', 'B', 'D', 'F'],
  A7: ['A', 'C#', 'E', 'G'],
  B7: ['B', 'D#', 'F#', 'A'],
  Bb7: ['Bb', 'D', 'F', 'Ab'],
  Eb7: ['Eb', 'G', 'Bb', 'Db'],
  // Major 7
  Cmaj7: ['C', 'E', 'G', 'B'],
  Dmaj7: ['D', 'F#', 'A', 'C#'],
  Emaj7: ['E', 'G#', 'B', 'D#'],
  Fmaj7: ['F', 'A', 'C', 'E'],
  Gmaj7: ['G', 'B', 'D', 'F#'],
  Amaj7: ['A', 'C#', 'E', 'G#'],
  Bmaj7: ['B', 'D#', 'F#', 'A#'],
  // Minor 7
  Cm7: ['C', 'Eb', 'G', 'Bb'],
  Dm7: ['D', 'F', 'A', 'C'],
  Em7: ['E', 'G', 'B', 'D'],
  Fm7: ['F', 'Ab', 'C', 'Eb'],
  Gm7: ['G', 'Bb', 'D', 'F'],
  Am7: ['A', 'C', 'E', 'G'],
  Bm7: ['B', 'D', 'F#', 'A'],
  // Sus, dim, aug
  Csus: ['C', 'F', 'G'],
  Csus4: ['C', 'F', 'G'],
  Gsus4: ['G', 'C', 'D'],
  Cdim: ['C', 'Eb', 'Gb'],
  Cdim7: ['C', 'Eb', 'Gb', 'A'],
  Caug: ['C', 'E', 'G#'],
  // Common extended
  C6: ['C', 'E', 'G', 'A'],
  Am7b5: ['A', 'C', 'Eb', 'G'],
  Cm7b5: ['C', 'Eb', 'Gb', 'Bb'],
};

const OCTAVE = 4;

/**
 * Get piano note keys (e.g. ["C4", "E4", "G4"]) for a chord, using PianoChord.org-style notes when available.
 */
export function getPianoNotesForChord(chordName: string): string[] {
  const trimmed = chordName.trim();
  if (!trimmed) return [];
  const toNotes = (noteNames: string[]) => noteNames.map((n) => `${n}${OCTAVE}`);
  const get = (key: string): string[] => {
    const n = PIANO_CHORD_NOTES[key];
    return n?.length ? toNotes(n) : [];
  };
  const out = get(trimmed) || get(trimmed.toLowerCase());
  if (out.length) return out;
  const slashIdx = trimmed.indexOf('/');
  const base = slashIdx >= 0 ? trimmed.slice(0, slashIdx).trim() : trimmed;
  return get(base) || get(base.toLowerCase()) || [];
}
