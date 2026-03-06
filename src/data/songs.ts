import { parseChordPro } from '../parseChordPro';
import type { ParsedSong } from '../types';
import type { SongMeta } from './songs.types';
import { SONG_REPOSITORY } from './songRepository';
import { SONG_CONTENT } from './songContent';

export type { SongMeta } from './songs.types';

/** Catalog of 100 songs from repository (id = slug). Used when no external songs.json is loaded. */
export const SONG_CATALOG: SongMeta[] = SONG_REPOSITORY.map((entry) => ({
  id: entry.slug,
  title: entry.title,
  artist: entry.artist,
  slug: entry.slug,
}));

/** Content key for an id (e.g. "so-easy-7" -> "so-easy"). */
function contentKey(id: string): string {
  if (SONG_CONTENT[id]) return id;
  const m = id.match(/^(.+)-\d+$/);
  if (m && SONG_CONTENT[m[1]]) return m[1];
  return 'default';
}

function getCatalog(catalog?: SongMeta[] | null): SongMeta[] {
  return catalog ?? SONG_CATALOG;
}

export function getSongById(id: string, catalog?: SongMeta[] | null): SongMeta | undefined {
  return getCatalog(catalog).find((s) => s.id === id || s.slug === id);
}

export function getSongContent(
  id: string,
  contentMap?: Map<string, string> | null
): string {
  if (contentMap?.has(id)) return contentMap.get(id)!;
  const key = contentKey(id);
  return SONG_CONTENT[key] ?? SONG_CONTENT['default'];
}

export function getParsedSong(
  id: string,
  opts?: { catalog?: SongMeta[] | null; contentMap?: Map<string, string> | null }
): ParsedSong {
  const raw = getSongContent(id, opts?.contentMap);
  const parsed = parseChordPro(raw);
  const meta = getSongById(id, opts?.catalog);
  if (meta && parsed.title === 'Song') parsed.title = `${meta.title} — ${meta.artist}`;
  return parsed;
}

/** Top N songs by catalog order. */
export function getTopSongs(n: number, catalog?: SongMeta[] | null): SongMeta[] {
  return getCatalog(catalog).slice(0, n);
}

/** N random songs from the catalog (shuffled). */
export function getRandomSongs(
  n: number,
  seed?: number,
  catalog?: SongMeta[] | null
): SongMeta[] {
  const list = getCatalog(catalog);
  const copy = [...list];
  const rng = seed !== undefined ? seededShuffle(seed) : () => Math.random();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function seededShuffle(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Search by title or artist (case-insensitive). */
export function searchSongs(
  query: string,
  limit = 20,
  catalog?: SongMeta[] | null
): SongMeta[] {
  const list = getCatalog(catalog);
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return list
    .filter(
      (s) =>
        s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
