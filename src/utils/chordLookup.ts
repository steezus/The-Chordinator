import type { ChordFingeringMap, GuitarChordData } from '../types';

/** Normalize chord symbol for lookup (e.g. "am" -> "Am", "F#m" -> "F#m"). */
export function normalizeChordName(name: string): string {
  const s = name.trim();
  if (!s) return s;
  const first = s[0].toUpperCase();
  const rest = s.slice(1);
  return first + rest;
}

export function getFingering(map: ChordFingeringMap, chordName: string): GuitarChordData | null {
  const normalized = normalizeChordName(chordName);
  return map[normalized] ?? map[chordName] ?? null;
}
