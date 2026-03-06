import type { ChordSegment, LyricsLine, ParsedSong } from './types';

const CHORD_REGEX = /\[([^\]]+)\]/g;

/**
 * Parse a ChordPro-style line: "[Fmaj7]I could be the [G7]twist"
 * Each chord is paired with the text that follows it until the next chord.
 * So: (Fmaj7, "I could be the "), (G7, "twist"). Leading text without a chord is (null, text).
 */
function parseLine(line: string): ChordSegment[] {
  const segments: ChordSegment[] = [];
  const matches: { chord: string; bracketStart: number; textStart: number }[] = [];
  let match: RegExpExecArray | null;
  CHORD_REGEX.lastIndex = 0;
  while ((match = CHORD_REGEX.exec(line)) !== null) {
    matches.push({
      chord: match[1].trim(),
      bracketStart: match.index,
      textStart: match.index + match[0].length,
    });
  }
  for (let i = 0; i < matches.length; i++) {
    const textEnd = i + 1 < matches.length ? matches[i + 1].bracketStart : line.length;
    const text = line.slice(matches[i].textStart, textEnd);
    segments.push({ chord: matches[i].chord, text });
  }
  if (matches.length > 0 && matches[0].bracketStart > 0) {
    const leading = line.slice(0, matches[0].bracketStart).trim();
    if (leading) segments.unshift({ chord: null, text: leading });
  }
  if (segments.length === 0 && line.trim()) segments.push({ chord: null, text: line });
  return segments;
}

/**
 * Parse full ChordPro-style text. Supports:
 * - {title: Song Name}
 * - # comments (ignored)
 * - Lines with [Chord] above syllables
 */
export function parseChordPro(raw: string): ParsedSong {
  const inputLines = raw.split(/\r?\n/);
  let title = 'Untitled';
  const result: LyricsLine[] = [];

  for (const line of inputLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push({ segments: [] });
      continue;
    }
    if (trimmed.startsWith('#')) continue;
    const titleMatch = trimmed.match(/^\{\s*title\s*:\s*(.+)\s*\}$/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
      continue;
    }
    result.push({ segments: parseLine(line) });
  }

  return { title, lines: result };
}
