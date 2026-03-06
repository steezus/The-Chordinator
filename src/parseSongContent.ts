import type { ParsedSong } from './types';
import { parseChordPro } from './parseChordPro';
import { parseOpenSongXml } from './parseOpenSong';

/**
 * Detect content format and parse into ParsedSong.
 * - OpenSong: XML with <song> and <lyrics>
 * - Otherwise: ChordPro-style text
 */
export function parseSongContent(raw: string): ParsedSong {
  const trimmed = raw.trim();
  if (
    trimmed.startsWith('<') &&
    (trimmed.includes('<song>') || trimmed.includes('<lyrics>'))
  ) {
    return parseOpenSongXml(trimmed);
  }
  return parseChordPro(trimmed);
}
