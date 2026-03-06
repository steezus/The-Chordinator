import type { ChordSegment, LyricsLine, ParsedSong } from './types';

const CHORD_REGEX = /\[([^\]]+)\]/g;

/**
 * Parse a ChordPro-style line: "Swing [D]low, sweet [G]chari[D]ot"
 * into segments of { chord, text }.
 */
function parseLine(line: string): ChordSegment[] {
  const segments: ChordSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  CHORD_REGEX.lastIndex = 0;
  while ((match = CHORD_REGEX.exec(line)) !== null) {
    const before = line.slice(lastIndex, match.index);
    if (before) segments.push({ chord: null, text: before });
    segments.push({ chord: match[1].trim(), text: '' });
    lastIndex = match.index + match[0].length;
  }
  const after = line.slice(lastIndex);
  if (after) segments.push({ chord: null, text: after });

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
