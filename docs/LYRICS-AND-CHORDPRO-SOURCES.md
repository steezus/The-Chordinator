# Lyrics and ChordPro sources

A short overview of options for getting lyrics and chord charts. **Lyrics are usually under copyright**; use only sources you’re allowed to use (terms of service, license, or your own transcriptions).

---

## Where songs come from

The Chordinator shows **full lyrics with chords mapped above** when content is available. The app supports:

- **ChordPro / OnSong** – Inline chords like `[C]word [G]word` (ChordPro) or Title/Artist + section labels (OnSong).
- **OpenSong XML** – Full song XML with `<title>`, `<author>`, `<lyrics>`; chord lines (.) and lyric lines are paired automatically.

Songs get content from:

- **Built-in** – A small set in `src/data/songContent.ts`.
- **Fetch script** – Deploy or run the script to pull songs from a GitHub repo into `public/songs.json`. **Default source:** **mattgraham/worship** (OnSong format, full worship songs). See **Song sources** below.
- **Manual** – Add ChordPro, OnSong, or OpenSong XML to `songContent.ts` or `public/songs.json`.

Songs without content show a short placeholder until content is added.

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

## Song sources (chords + lyrics)

The fetch script builds `public/songs.json` from a GitHub repo. The app then loads and merges those songs at runtime.

**Default (recommended): mattgraham/worship**

- **mattgraham/worship** – Hundreds of worship songs in **OnSong** format (ChordPro-style with Title/Artist headers and full lyrics). Branch: `master`. Extension: `.onsong`. These are full songs, not samples.

**Other sources:**

- **pcderic/chordpro** – Many `.cho` files (ChordPro). Branch: `main`. Some files may be excerpts.
- **OpenSong XML** – The app also parses OpenSong XML (e.g. from OpenSong exports or repos like brry/chords). Use the same fetch script with a repo that has `.xml` OpenSong files if you add support for that extension.

**Fetch script (Node 18+):**

```bash
node scripts/fetch-chordpro-from-github.mjs [owner/repo] [maxSongs] [ext] [branch]
```

Examples:

- `node scripts/fetch-chordpro-from-github.mjs` — **mattgraham/worship**, 80 songs, `.onsong`, branch `master`.
- `node scripts/fetch-chordpro-from-github.mjs mattgraham/worship 120 onsong master`
- `node scripts/fetch-chordpro-from-github.mjs pcderic/chordpro 50 cho main` — ChordPro repo.

The script backs up existing `public/songs.json` to `public/songs.json.bak`. Set `GITHUB_TOKEN` for higher API rate limits. After running, rebuild and redeploy so the app serves the new songs.

---

## This app

- **Built-in songs** – Content in `src/data/songContent.ts` (ChordPro, OnSong, or OpenSong XML).
- **Large catalog** – Put content in `public/songs.json` or generate it with the fetch script from **mattgraham/worship** (OnSong) or another repo.

For **legal use**, prefer: your own transcriptions, public-domain material, or sources that explicitly allow your use case (e.g. non-commercial, educational, or with a clear license).
