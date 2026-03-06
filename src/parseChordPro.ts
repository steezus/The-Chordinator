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

/** One chord token: root (A-G #/b) + optional suffix (m, 7, maj7, etc.) */
const CHORD_TOKEN = /^[A-Ga-g][#b]?(m|maj|min|dim|aug|sus|maj7|m7|7|6|add9|b5)?$/i;

/** True if line has no brackets and is only chord tokens and spaces (two-line format). */
function isChordOnlyLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.includes('[') || trimmed.includes(']')) return false;
  const tokens = trimmed.split(/\s+/).filter((t) => t.length > 0);
  if (tokens.length === 0) return false;
  return tokens.every((t) => CHORD_TOKEN.test(t));
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

  for (let i = 0; i < inputLines.length; i++) {
    const line = inputLines[i];
    const trimmed = line.trim();
    if (!trimmed) {
      result.push({ segments: [] });
      continue;
    }
    // Two-line format: chord line (no brackets) then lyric line — preserve exact alignment
    if (isChordOnlyLine(line)) {
      const nextLine = inputLines[i + 1];
      const nextTrimmed = nextLine?.trim() ?? '';
      const nextIsLyric =
        nextTrimmed.length > 0 &&
        !nextTrimmed.includes('[') &&
        parseSectionHeader(nextTrimmed) == null &&
        !/^Title\s*:|^Artist\s*:|^\{\s*title\s*:/i.test(nextTrimmed) &&
        !isChordOnlyLine(nextLine ?? '');
      if (nextIsLyric && nextLine != null) {
        result.push({ chordLine: line, lyricLine: nextLine });
        i++;
        continue;
      }
      result.push({ chordLine: line, lyricLine: '' });
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
    const artistMatch = trimmed.match(/^\{\s*(?:artist|st)\s*:\s*(.+)\s*\}$/i);
    if (artistMatch) {
      artist = artistMatch[1].trim();
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
    if (/^\{\s*(comment|text|highlight|font|size|subtitle)\s*[:=]/i.test(trimmed)) continue;
    if (/^\{\s*[a-z_]+\s*\}$/i.test(trimmed)) continue;

    const segments = parseLine(line);

    // ChordPro two-line: "[C] [G] [Am]" on one line, "Hello world today" on next → merge so chord sits above word
    const prev = result[result.length - 1];
    const prevSegments = prev?.segments;
    const prevLineIsChordOnly =
      prevSegments &&
      prevSegments.length > 0 &&
      prevSegments.every((s) => s.chord != null && s.text.trim() === '');
    const isLyricOnlyLine =
      segments.length === 1 && segments[0].chord === null && segments[0].text.trim() !== '';
    if (prevLineIsChordOnly && isLyricOnlyLine && prevSegments) {
      let lyricText = segments[0].text.trim();
      // If the line before the chord-only line is a single leading fragment (e.g. "The"), prepend it so words stay in phrase order
      const lineBeforeChord = result.length >= 2 ? result[result.length - 2] : null;
      const singleLeading =
        lineBeforeChord?.segments?.length === 1 &&
        lineBeforeChord.segments[0].chord === null &&
        lineBeforeChord.segments[0].text.trim() !== '';
      if (singleLeading && lineBeforeChord?.segments?.[0]) {
        const leading = lineBeforeChord.segments[0].text.trim();
        lyricText = leading + (lyricText ? ' ' + lyricText : '');
        result.pop(); // chord-only line
        result.pop(); // leading line
      } else {
        result.pop(); // chord-only line (we'll push merged in its place)
      }
      const chords = prevSegments.map((s) => s.chord!);
      const words = lyricText.split(/\s+/).filter((w) => w.length > 0);
      const merged: ChordSegment[] = words.map((w, i) => ({
        chord: chords[i % chords.length] ?? null,
        text: i < words.length - 1 ? w + ' ' : w,
      }));
      result.push({ segments: merged });
      continue;
    }

    result.push({ segments });
  }

  if (artist && title !== 'Untitled') title = `${title} — ${artist}`;
  return { title, lines: result };
}
