/**
 * Map chord symbols (as used in ChordPro) to PianoChord.org page URLs.
 * PianoChord.org has consistent diagrams; we link to their pages for reference.
 * @see https://www.pianochord.org/
 */

const PIANOCHORD_BASE = 'https://www.pianochord.org';

/** Normalize chord for URL: C# -> c-sharp, Bb -> b-flat, F -> f */
function rootToSlug(root: string): string {
  const r = root.trim();
  if (r.length === 0) return 'c';
  const letter = r.charAt(0).toLowerCase();
  if (r.length === 1) return letter;
  const acc = r.slice(1).replace(/#/g, '-sharp').replace(/b/g, '-flat');
  return letter + acc;
}

/** Chord type suffix on PianoChord.org: Cmaj7 -> maj7, Cm -> m, C7 -> 7, etc. */
function typeToSuffix(chordType: string): string {
  const t = chordType.toLowerCase().trim();
  if (!t || t === 'major' || t === '') return '-major';
  if (t === 'm' || t === 'min' || t === 'minor') return ''; // cm, am
  if (t === 'maj7' || t === 'ma7' || t === 'Δ7') return 'maj7';
  if (t === 'm7' || t === 'min7') return 'm7';
  if (t === '7') return '7';
  if (t === 'maj9') return 'maj9';
  if (t === 'm9') return 'm9';
  if (t === '9') return '-extended'; // C9
  if (t === '6') return '6';
  if (t === 'm6') return 'm6';
  if (t === '6/9' || t === '6-9') return '6-9';
  if (t === '5') return '5';
  if (t === 'add' || t === 'add9') return '-add';
  if (t === 'dim') return '-dim';
  if (t === 'dim7') return '-dim7';
  if (t === 'm7b5' || t === 'ø' || t === 'half-diminished') return 'm7b5';
  if (t === 'aug' || t === '+') return '-aug';
  if (t === 'aug7') return 'aug7';
  if (t === 'sus' || t === 'sus4') return '-sus';
  if (t === '7-5' || t === '7b5') return '7-5';
  if (t === '7+5' || t === '7#5' || t === 'altered') return '-altered';
  if (t === '11') return '11';
  if (t === 'm11') return 'm11';
  if (t === 'maj11') return 'maj11';
  if (t === '13') return '13';
  if (t === 'm13') return 'm13';
  if (t === 'maj13') return 'maj13';
  if (t === 'minmaj7' || t === 'mmaj7') return 'minmaj7';
  return '';
}

/**
 * Map a chord symbol (e.g. "Fmaj7", "Bb", "C#m") to a PianoChord.org URL.
 * Returns null if we can't build a sensible URL.
 */
export function chordToPianoChordOrgUrl(chordName: string): string | null {
  const raw = chordName.trim();
  if (!raw) return null;

  // Known exact slugs from pianochord.org (lowercase, as in their URLs)
  const exact: Record<string, string> = {
    c: 'c-major',
    cm: 'cm',
    c7: 'c7',
    cm7: 'cm7',
    cmaj7: 'cmaj7',
    c6: 'c6',
    cm6: 'cm6',
    c9: 'c-extended',
    cm9: 'cm9',
    cmaj9: 'cmaj9',
    c5: 'c5',
    'c6/9': 'c6-9',
    cadd9: 'c-add',
    cdim: 'c-dim',
    cdim7: 'c-dim7',
    cm7b5: 'cm7b5',
    caug: 'c-aug',
    caug7: 'c-aug7',
    csus: 'c-sus',
    'c7-5': 'c7-5',
    'c7+5': 'c-altered',
    cminmaj7: 'cminmaj7',
    d: 'd-major',
    dm: 'dm',
    d7: 'd7',
    dm7: 'dm7',
    dmaj7: 'dmaj7',
    e: 'e-major',
    em: 'em',
    e7: 'e7',
    em7: 'em7',
    emaj7: 'emaj7',
    f: 'f-major',
    fm: 'fm',
    f7: 'f7',
    fm7: 'fm7',
    fmaj7: 'fmaj7',
    g: 'g-major',
    gm: 'gm',
    g7: 'g7',
    gm7: 'gm7',
    gmaj7: 'gmaj7',
    a: 'a-major',
    am: 'am',
    a7: 'a7',
    am7: 'am7',
    amaj7: 'amaj7',
    b: 'b-major',
    bm: 'bm',
    b7: 'b7',
    bm7: 'bm7',
    bmaj7: 'bmaj7',
    'c#': 'c-sharp-major',
    'c#m': 'c-sharp-minor',
    'c#7': 'c-sharp-7',
    'db': 'd-flat-major',
    dbm: 'd-flat-minor',
    'd#': 'd-sharp-major',
    'd#m': 'd-sharp-minor',
    'eb': 'e-flat-major',
    ebm: 'e-flat-minor',
    'f#': 'f-sharp-major',
    'f#m': 'f-sharp-minor',
    'gb': 'g-flat-major',
    'ab': 'a-flat-major',
    abm: 'a-flat-minor',
    'a#': 'a-sharp-major',
    'a#m': 'a-sharp-minor',
    'bb': 'b-flat-major',
    bbm: 'b-flat-minor',
    'b#': 'c-major',
  };

  const normalized = raw.replace(/\s+/g, '').replace(/△/g, 'maj').replace(/°/g, 'dim');
  const key = normalized.toLowerCase();
  if (exact[key]) {
    return `${PIANOCHORD_BASE}/${exact[key]}.html`;
  }

  // Slash chords: use root chord page (e.g. C/E -> c-major)
  const slashIdx = normalized.indexOf('/');
  const baseChord = slashIdx >= 0 ? normalized.slice(0, slashIdx) : normalized;
  const baseKey = baseChord.toLowerCase();
  if (exact[baseKey]) {
    return `${PIANOCHORD_BASE}/${exact[baseKey]}.html`;
  }

  // Fallback: build from root + type (best effort)
  const match = baseChord.match(/^([A-Ga-g][#b]?)(.*)$/);
  if (match) {
    const root = match[1];
    const type = match[2] || '';
    const rootSlug = rootToSlug(root);
    const suffix = typeToSuffix(type);
    const slug = suffix === '-major' ? `${rootSlug}-major` : `${rootSlug}${suffix}`;
    if (slug) return `${PIANOCHORD_BASE}/${slug}.html`;
  }

  return `${PIANOCHORD_BASE}/`;
}

/** Open the chord on PianoChord.org in a new tab */
export function openPianoChordOrg(chordName: string): void {
  const url = chordToPianoChordOrgUrl(chordName);
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}
