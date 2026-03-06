# Using Musixmatch for Official Lyrics

Google and other apps often show lyrics from **Musixmatch** — a licensed lyrics database. You can use the same source in The Chordinator to fetch official lyrics for a song.

## How it works

- **Musixmatch API** returns **lyrics text only** (no chord positions). So we use it for the *words*; chords still come from ChordPro or your own chart.
- In the app, when you open a song you can tap **“Get official lyrics”** (if you’ve set an API key). The app will look up the track by title and artist, fetch lyrics from Musixmatch, and show them. You can compare or copy them; chord charts stay as in your ChordPro/OnSong content.

## Get an API key

1. Go to **[developer.musixmatch.com](https://developer.musixmatch.com)** and sign up.
2. Create an app and copy your **API key**.
3. In the project root, create a `.env` file (or add to it):
   ```bash
   VITE_MUSIXMATCH_API_KEY=your_api_key_here
   ```
4. Restart the dev server (`npm run dev`). The key is only used in the browser when you tap “Get official lyrics”; it is not shipped in a way that exposes it in the repo if you keep `.env` in `.gitignore`.

## Limits

- **Free tier**: Limited requests per day; lyrics may be **partial** (snippet only). Full lyrics usually require a paid plan.
- **Terms**: Use of the API is subject to [Musixmatch’s terms](https://developer.musixmatch.com/terms). Don’t share your API key or use it in a way that violates their rules.

## Summary

| What you get        | Source        |
|---------------------|---------------|
| Official lyrics text| Musixmatch API|
| Chord positions     | ChordPro / OnSong (or manual) |

So we use Musixmatch “like Google does” for the **correct lyrics**; chord-over-lyrics still come from your ChordPro files or future editor.
