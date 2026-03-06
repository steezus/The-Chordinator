# Lyrics and ChordPro sources

A short overview of options for getting lyrics and chord charts. **Lyrics are usually under copyright**; use only sources you’re allowed to use (terms of service, license, or your own transcriptions).

---

## Lyrics On Demand (lyricsondemand.com)

**Lyrics On Demand** has a large lyrics database but **no public API** and often blocks automated requests (403). You can’t fetch lyrics from it programmatically from this app.

**How to use it with The Chordinator:**

1. In the app, go to **Import from Lyrics On Demand** (home page link or `/import`).
2. Open the song on [lyricsondemand.com](https://www.lyricsondemand.com) in your browser. URLs are like `lyricsondemand.com/artist_name/song_name`.
3. Copy the lyrics from the page and paste them into the Import form.
4. Optionally add ChordPro chords (`[G]`, `[C]`, etc.) before the words they’re played on.
5. Use **Copy ChordPro** and add the result to `songContent.ts` or `public/songs.json`.

This keeps the “gathering” in your browser (manual copy/paste) and uses the app only to format and preview.

---

## Lyrics APIs (lyrics only)

- **LyricMind** (open source, GPL-3) – Fetches and caches lyrics from multiple providers; CLI and REST API. [GitHub](https://github.com/urbanadventurer/LyricMind).
- **lyrics.ovh** – Free API used by many open-source apps (e.g. Lyrics-Finder). Check current terms for allowed use.
- **Open Lyrics Database** – Lyrics with permission for **non-commercial educational use only**. [lyrics.github.io](https://lyrics.github.io/).
- **Genius API** – Rich lyrics and annotations; requires API key and compliance with their terms.

Most of these return **plain lyrics only**, not chord positions. You’d still need to add chords yourself (e.g. in ChordPro format).

---

## Chord charts (chords + lyrics)

- **ChordPro format** – Many chord charts on the web (Ultimate Guitar, etc.) can be exported or copied as ChordPro (`[Chord]lyric`). You can paste or import that into `public/songs.json` or `src/data/songContent.ts`.
- **Ultimate Guitar / similar sites** – Often offer “ChordPro” or “Text” export; check each site’s terms before using.
- **Open ChordPro repos** – Search GitHub for “chordpro” or “chord charts”; some repos share ChordPro files (verify license and copyright).

---

## ChordPro repos (songs with chords)

Public GitHub repos often host ChordPro `.cho` files (chords + lyrics). The Chordinator can **build** `public/songs.json` from one of these repos so the app loads those songs at runtime.

- **pcderic/chordpro** – Many `.cho` files at repo root (e.g. “A Night To Remember”, “A Whiter Shade of Pale”). Raw URL pattern: `https://raw.githubusercontent.com/pcderic/chordpro/main/<filename>.cho`.
- **chordpro-setlists/setlists** – Contains a `songs` folder with ChordPro content; structure differs from pcderic/chordpro.

**Fetch script (Node 18+, no npm required):**

From the project root (e.g. on your machine or on EC2 after clone):

```bash
node scripts/fetch-chordpro-from-github.mjs [owner/repo] [maxSongs]
```

Examples:

- `node scripts/fetch-chordpro-from-github.mjs` — uses **pcderic/chordpro**, up to 80 songs.
- `node scripts/fetch-chordpro-from-github.mjs pcderic/chordpro 50` — same repo, limit 50.

The script uses the GitHub API to list `.cho` files, fetches each file’s raw content, parses `{title: ...}` and `{st: ...}` (artist), and writes `public/songs.json`. Existing `public/songs.json` is backed up to `public/songs.json.bak`. Optional: set `GITHUB_TOKEN` for higher API rate limits.

After running the script, rebuild and redeploy the app so it serves the new `public/songs.json`; the app merges these songs into the built-in catalog.

---

## This app

- **Built-in songs** – ChordPro is in `src/data/songContent.ts`; add or edit entries there.
- **Large catalog** – Put ChordPro in `public/songs.json` (see README) so the app loads it at runtime. You can generate that file from your own ChordPro files, or use the **fetch script** above to pull from a ChordPro GitHub repo.

For **legal use**, prefer: your own transcriptions, public-domain material, or sources that explicitly allow your use case (e.g. non-commercial, educational, or with a clear license).
