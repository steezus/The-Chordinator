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

function parseSectionHeader(trimmed: string): string | null {
  const hashMatch = trimmed.match(/^#\s*(.+)$/);
  if (hashMatch) return hashMatch[1].trim();
  // "Verse 1:", "Chorus 2:", "Intro:", "Bridge:", etc.
  const plainMatch = trimmed.match(/^(intro|verse\s*\d*|chorus\s*\d*|outro|solo|bridge|interlude|pre.?chorus|tag)\s*:?\s*$/i);
  if (plainMatch) {
    const s = plainMatch[1].trim();
    const normalized = s.replace(/\s+/g, ' ');
    return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
  }
  return null;
}

/**
 * Parse full ChordPro-style text. Supports:
 * - {title: Song Name}
 * - # Verse 1 / #Chorus (section headers)
 * - Plain "Verse 1:", "Chorus:" (section headers)
 * - Lines with [Chord] above syllables
 */
export function parseChordPro(raw: string): ParsedSong {
  const inputLines = raw.split(/\r?\n/);
  let title = 'Untitled';
  let artist = '';
  const result: LyricsLine[] = [];

  for (const line of inputLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push({ segments: [] });
      continue;
    }
    // OnSong-style: Title: ... / Artist: ... (skip, don't add to lyrics)
    const titleLine = trimmed.match(/^Title\s*:\s*(.+)$/i);
    if (titleLine) {
      title = titleLine[1].trim();
      continue;
    }
    const artistLine = trimmed.match(/^Artist\s*:\s*(.+)$/i);
    if (artistLine) {
      artist = artistLine[1].trim();
      continue;
    }
    // Skip other OnSong metadata (Key, Notes, Tempo, CCLI, Book, etc.)
    if (/^(Key|Original Key|Notes|Tempo|Scripture|Book|Capo|CCLI)\s*:/i.test(trimmed)) continue;
    const section = parseSectionHeader(trimmed);
    if (section !== null) {
      result.push({ section });
      continue;
    }
    const titleMatch = trimmed.match(/^\{\s*title\s*:\s*(.+)\s*\}$/i);
    if (titleMatch) {
      title = titleMatch[1].trim();
      continue;
    }
    // ChordPro directives: treat as section headers or skip so lyrics/chords stay correct
    const startChorus = trimmed.match(/^\{\s*start_of_chorus\s*\}/i);
    const startVerse = trimmed.match(/^\{\s*start_of_verse\s*\}/i);
    if (startChorus) {
      result.push({ section: 'Chorus' });
      continue;
    }
    if (startVerse) {
      result.push({ section: 'Verse' });
      continue;
    }
    if (/^\{\s*end_of_(chorus|verse|bridge|tab)\s*\}/i.test(trimmed)) continue;
    const commentSection = trimmed.match(/^\{\s*c\s*:\s*(.+)\s*\}$/i); // {c: Verse 1} = section
    if (commentSection) {
      result.push({ section: commentSection[1].trim() });
      continue;
    }
    if (/^\{\s*(comment|text|highlight|font|size|subtitle|artist)\s*[:=]/i.test(trimmed)) continue;
    if (/^\{\s*[a-z_]+\s*\}$/i.test(trimmed)) continue;
    result.push({ segments: parseLine(line) });
  }

  if (artist && title !== 'Untitled') title = `${title} — ${artist}`;
  return { title, lines: result };
}
