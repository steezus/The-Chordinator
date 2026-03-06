/**
 * Enharmonic equivalents for chord image lookup: C# = Db, D# = Eb, F# = Gb, G# = Ab, A# = Bb (and vice versa).
 * Returns the given chord name plus one alternative so either filename works (e.g. C#maj7.png or Dbmaj7.png).
 */

const SHARP_TO_FLAT: Record<string, string> = {
  'C#': 'Db',
  'D#': 'Eb',
  'E#': 'F',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb',
  'B#': 'C',
};

const FLAT_TO_SHARP: Record<string, string> = {
  Db: 'C#',
  Eb: 'D#',
  Fb: 'E',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
  Cb: 'B',
};

/** Root is a letter plus optional # or b */
function parseChordRoot(chordName: string): { root: string; suffix: string } {
  const m = chordName.match(/^([A-Ga-g][#b]?)(.*)$/);
  if (!m) return { root: '', suffix: chordName };
  return { root: m[1].charAt(0).toUpperCase() + (m[1].slice(1) ?? ''), suffix: m[2] ?? '' };
}

/** Convert flat chord to underscore filename form: Dbmaj7 → d_flat_maj7, Eb → e_flat */
function toUnderscoreFlat(chordName: string): string | null {
  const { root, suffix } = parseChordRoot(chordName);
  if (!root || root.length !== 2 || root[1] !== 'b') return null;
  const letter = root[0].toLowerCase();
  const suffixPart = suffix ? `_${suffix.replace(/^_+/, '')}` : '';
  return `${letter}_flat${suffixPart}`;
}

/**
 * Returns chord names to try for image lookup: original, enharmonic, and underscore-flat form.
 * e.g. "C#maj7" → ["C#maj7", "Dbmaj7", "d_flat_maj7"], "Cmaj7" → ["Cmaj7", "cmaj7"].
 */
export function getChordImageCandidates(chordName: string): string[] {
  const trimmed = chordName.trim();
  if (!trimmed) return [];
  const { root, suffix } = parseChordRoot(trimmed);
  const candidates: string[] = [trimmed];
  const flat = SHARP_TO_FLAT[root];
  const sharp = FLAT_TO_SHARP[root];
  const alt = flat ?? sharp;
  if (alt) {
    const altChord = alt + suffix;
    candidates.push(altChord);
    const uFlat = toUnderscoreFlat(altChord);
    if (uFlat) candidates.push(uFlat);
  }
  const uFlatOriginal = toUnderscoreFlat(trimmed);
  if (uFlatOriginal && !candidates.includes(uFlatOriginal)) candidates.push(uFlatOriginal);
  if (trimmed !== trimmed.toLowerCase()) candidates.push(trimmed.toLowerCase());
  return [...new Set(candidates)];
}
