/**
 * Fetch official lyrics from Musixmatch (same kind of source Google uses for lyrics).
 * Requires VITE_MUSIXMATCH_API_KEY in .env. Free tier may return partial lyrics only.
 * @see docs/MUSIXMATCH-LYRICS.md
 */

const API_BASE = 'https://api.musixmatch.com/ws/1.1';

export function getMusixmatchApiKey(): string | undefined {
  return typeof import.meta.env?.VITE_MUSIXMATCH_API_KEY === 'string' &&
    import.meta.env.VITE_MUSIXMATCH_API_KEY.trim() !== ''
    ? import.meta.env.VITE_MUSIXMATCH_API_KEY.trim()
    : undefined;
}

export interface MusixmatchLyricsResult {
  lyrics: string;
  copyright: string | null;
}

interface MatcherTrackResponse {
  message?: {
    body?: {
      track?: {
        commontrack_id?: number;
        has_lyrics?: number;
      };
    };
    header?: { status_code?: number };
  };
}

interface TrackLyricsResponse {
  message?: {
    body?: {
      lyrics?: {
        lyrics_body?: string;
        lyrics_copyright?: string;
      };
    };
    header?: { status_code?: number };
  };
}

/**
 * Fetch lyrics for a track by title and artist. Returns null if no key, not found, or error.
 */
export async function fetchMusixmatchLyrics(
  trackName: string,
  artistName: string
): Promise<MusixmatchLyricsResult | null> {
  const apiKey = getMusixmatchApiKey();
  if (!apiKey) return null;

  const qTrack = encodeURIComponent(trackName.trim());
  const qArtist = encodeURIComponent(artistName.trim());
  if (!qTrack || !qArtist) return null;

  try {
    const matcherUrl = `${API_BASE}/matcher.track.get?apikey=${apiKey}&q_track=${qTrack}&q_artist=${qArtist}`;
    const matcherRes = await fetch(matcherUrl);
    if (!matcherRes.ok) return null;
    const matcher = (await matcherRes.json()) as MatcherTrackResponse;
    const status = matcher.message?.header?.status_code;
    if (status !== 200) return null;
    const track = matcher.message?.body?.track;
    const commontrackId = track?.commontrack_id;
    if (commontrackId == null || track?.has_lyrics !== 1) return null;

    const lyricsUrl = `${API_BASE}/track.lyrics.get?apikey=${apiKey}&commontrack_id=${commontrackId}`;
    const lyricsRes = await fetch(lyricsUrl);
    if (!lyricsRes.ok) return null;
    const lyricsData = (await lyricsRes.json()) as TrackLyricsResponse;
    if (lyricsData.message?.header?.status_code !== 200) return null;
    const lyricsBody = lyricsData.message?.body?.lyrics?.lyrics_body;
    const copyright = lyricsData.message?.body?.lyrics?.lyrics_copyright ?? null;
    if (typeof lyricsBody !== 'string' || lyricsBody.trim() === '') return null;

    return {
      lyrics: lyricsBody.trim(),
      copyright,
    };
  } catch {
    return null;
  }
}
