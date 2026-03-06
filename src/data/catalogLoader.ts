import type { SongMeta } from './songs.types';

export interface SongJsonEntry {
  id: string;
  title: string;
  artist: string;
  slug?: string;
  content?: string;
}

export interface SongsJson {
  songs: SongJsonEntry[];
}

/** Convert JSON entry to SongMeta. */
export function toSongMeta(entry: SongJsonEntry): SongMeta {
  return {
    id: entry.id,
    title: entry.title,
    artist: entry.artist,
    slug: entry.slug ?? entry.id,
  };
}

/** Fetch optional /songs.json; returns null if not found or invalid. */
export async function loadSongsJson(): Promise<{
  songs: SongMeta[];
  contentMap: Map<string, string>;
} | null> {
  try {
    const res = await fetch('/songs.json');
    if (!res.ok) return null;
    const data = (await res.json()) as SongsJson;
    if (!data?.songs || !Array.isArray(data.songs)) return null;
    const songs: SongMeta[] = data.songs.map(toSongMeta);
    const contentMap = new Map<string, string>();
    for (const entry of data.songs) {
      if (entry.content && typeof entry.content === 'string') {
        contentMap.set(entry.id, entry.content);
        if (entry.slug && entry.slug !== entry.id)
          contentMap.set(entry.slug, entry.content);
      }
    }
    return { songs, contentMap };
  } catch {
    return null;
  }
}
