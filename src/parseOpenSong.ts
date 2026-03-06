import type { ChordSegment, LyricsLine, ParsedSong } from './types';

const OPENSONG_SECTION_MAP: Record<string, string> = {
  V: 'Verse',
  V1: 'Verse 1',
  V2: 'Verse 2',
  V3: 'Verse 3',
  V4: 'Verse 4',
  C: 'Chorus',
  B: 'Bridge',
  P: 'Pre-Chorus',
  T: 'Tag',
  I: 'Intro',
  O: 'Outro',
};

/**
 * Parse OpenSong lyrics body: section tags [V1], [C], chord lines (.), lyric lines (space).
 * Pairs chord line + lyric line into segments (one chord per word).
 */
function parseLyricsBody(body: string): LyricsLine[] {
  const lines = body.split(/\r?\n/);
  const result: LyricsLine[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    i++;

    if (!trimmed) {
      result.push({ segments: [] });
      continue;
    }

    // Section: [V1], [C], [B], etc.
    const sectionMatch = trimmed.match(/^\[([A-Z0-9]+)\]$/i);
    if (sectionMatch) {
      const tag = sectionMatch[1];
      const label = OPENSONG_SECTION_MAP[tag] ?? tag;
      result.push({ section: label });
      continue;
    }

    // Chord line: starts with .
    if (trimmed.startsWith('.')) {
      const chordLine = trimmed.slice(1).trim();
      const nextLine = i < lines.length ? lines[i] : '';
      const isLyricLine =
        nextLine.startsWith(' ') ||
        (nextLine.startsWith('\t') || (nextLine.trim() && !nextLine.trim().startsWith('.') && !/^\[[\w\d]+\]$/.test(nextLine.trim())));
      if (isLyricLine && nextLine.trim()) {
        i++;
        const chords = chordLine.split(/\s+/).filter(Boolean);
        const words = nextLine.trim().split(/\s+/);
        const segments: ChordSegment[] = words.map((word, idx) => ({
          chord: chords[idx] ?? null,
          text: idx < words.length - 1 ? word + ' ' : word,
        }));
        result.push({ segments });
      } else {
        // Chord line with no following lyric line: show as chord-only line
        const segments: ChordSegment[] = chordLine
          ? chordLine.split(/\s+/).map((ch) => ({ chord: ch, text: '' }))
          : [];
        if (segments.length) result.push({ segments });
      }
      continue;
    }

    // Comment: starts with ;
    if (trimmed.startsWith(';')) continue;

    // Lyric line (standalone): no chord line above
    if (trimmed) {
      result.push({
        segments: [{ chord: null, text: trimmed }],
      });
    }
  }

  return result;
}

/**
 * Parse OpenSong XML: extract title, author, lyrics and return ParsedSong.
 */
export function parseOpenSongXml(xml: string): ParsedSong {
  const titleMatch = xml.match(/<title>([\s\S]*?)<\/title>/i);
  const authorMatch = xml.match(/<author>([\s\S]*?)<\/author>/i);
  const lyricsMatch = xml.match(/<lyrics>([\s\S]*?)<\/lyrics>/i);

  const title = (titleMatch?.[1] ?? 'Untitled').trim();
  const author = (authorMatch?.[1] ?? '').trim();
  const lyricsBody = (lyricsMatch?.[1] ?? '').trim();

  const lines = parseLyricsBody(lyricsBody);
  const displayTitle = author ? `${title} — ${author}` : title;
  return { title: displayTitle, lines };
}

/**
 * Parse raw OpenSong lyrics text (no XML). Use for pasted content.
 * First line can be "title — author" or just title.
 */
export function parseOpenSongLyrics(raw: string, title = 'Untitled', author = ''): ParsedSong {
  const lines = parseLyricsBody(raw);
  const displayTitle = author ? `${title} — ${author}` : title;
  return { title: displayTitle, lines };
}
