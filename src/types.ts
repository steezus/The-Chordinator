export type Instrument = 'piano' | 'guitar' | 'ukulele';

export interface ChordSegment {
  chord: string | null;
  text: string;
}

export interface LyricsLine {
  /** Section header (e.g. "Verse 1", "Chorus"). When set, this line is a header only. */
  section?: string;
  /** Chord + lyric segments. Omitted when section is set. */
  segments?: ChordSegment[];
}

export interface ParsedSong {
  title: string;
  lines: LyricsLine[];
}

/** svguitar-compatible finger: [stringIndex, fret, optionalLabel] or [stringIndex, 'x'] */
export type FretFinger = [number, number, (string | { text: string })?] | [number, 'x'];

export interface GuitarChordData {
  fingers: FretFinger[];
  barres?: { fromString: number; toString: number; fret: number; text?: string }[];
  position?: number;
}

export type ChordFingeringMap = Record<string, GuitarChordData>;
