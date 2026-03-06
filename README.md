# The Chordinator

A modular chord-and-lyrics app that shows chord diagrams in sync with song lyrics. Choose how each chord is displayed: **piano**, **guitar**, or **ukulele**, so you can play and sing along with the shape that matches your instrument (similar to Ukulele Tabs / Ultimate Guitar, but with multiple instrument views).

## Features

- **ChordPro-style lyrics**: Chords in square brackets above syllables, e.g. `[G]Amazing [C]grace`
- **Instrument selector**: Switch chord diagram view between **Piano**, **Guitar**, and **Ukulele**
- **Click-to-preview**: Click any chord in the lyrics to show its diagram in the selected instrument
- **Piano**: Renders which keys to press (via chord-symbol + piano-chart)
- **Guitar / Ukulele**: Fretboard diagrams with finger positions (svguitar + built-in chord data)

## Run locally (optional)

If you have **Node.js 18+** and **npm** on your machine, from the project folder:

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser. Try a song (e.g. “So Easy”), switch instruments (Piano / Guitar / Ukulele), and tap chords to see diagrams. The app is responsive and works in mobile browsers (iPad, phone). **No npm on your machine?** Run the app in AWS instead—see **[docs/RUN-IN-AWS-NO-LOCAL-NPM.md](docs/RUN-IN-AWS-NO-LOCAL-NPM.md)** (EC2 + Docker; build runs in the cloud).

## Project structure

- `src/parseChordPro.ts` — parses ChordPro-style text (`[Chord]` over lyrics)
- `src/chordData/` — guitar and ukulele fingerings (svguitar format); add more chords here
- `src/components/` — lyrics view, chord panel, instrument selector, piano/guitar/ukulele diagram components
- `src/sampleSong.ts` — sample song (So Easy by Olivia Dean); replace or extend for your own songs

## Adding more songs

- **In code**: Add ChordPro to `src/data/songContent.ts` and the song to `src/data/songRepository.ts`.
- **Lyrics / ChordPro sources**: See **[docs/LYRICS-AND-CHORDPRO-SOURCES.md](docs/LYRICS-AND-CHORDPRO-SOURCES.md)** for open-source lyrics APIs and where to find ChordPro charts.
- **Large repository**: Put a **`public/songs.json`** file in the project. The app loads it on startup and **merges** those songs into the built-in catalog (no duplicate ids). Format:

  ```json
  {
    "songs": [
      {
        "id": "my-song",
        "title": "My Song",
        "artist": "Artist Name",
        "slug": "my-song",
        "content": "{title: My Song}\n\n[C]Lyrics with [G]chords..."
      }
    ]
  }
  ```

  Each entry can omit `content`; then the app uses built-in content for that id if available, or a placeholder. You can host a large JSON elsewhere and copy it into `public/songs.json`, or generate it from your own ChordPro files.

  **Populate from a ChordPro GitHub repo:** Run the fetch script (Node 18+, no npm required) to download `.cho` files and build `public/songs.json`:

  ```bash
  node scripts/fetch-chordpro-from-github.mjs [owner/repo] [maxSongs] [ext] [branch]
  # Example (default: mattgraham/worship, 80 OnSong songs, full lyrics+chords):
  node scripts/fetch-chordpro-from-github.mjs
  ```

  See **[docs/LYRICS-AND-CHORDPRO-SOURCES.md](docs/LYRICS-AND-CHORDPRO-SOURCES.md)** for details.

ChordPro format:

- `{title: Your Song Title}`
- Section headers: `# Verse 1`, `# Chorus`, `# Intro`, or plain `Verse 1:`, `Chorus:` (UkuTabs-style)
- Lines with chords: `[G]word [C]word` (chord is shown above the text that follows it)
- Empty lines for spacing

## Adding more chords

- **Guitar / Ukulele**: Add entries to `src/chordData/guitarChords.ts` and `src/chordData/ukuleleChords.ts` in svguitar format (`fingers`, optional `barres`, `position`).
- **Piano**: Uses **chord-symbol** to derive notes from the chord name, so most standard chord names work without extra data.

## Build

```bash
npm run build
npm run preview   # optional: preview production build
```

## Run with Docker

Build and run the app in a container (no local Node needed for production):

```bash
docker compose up --build
```

Then open **http://localhost:8080**. Or build and run the image yourself:

```bash
docker build -t chordinator .
docker run -p 8080:80 chordinator
```

On **EC2**: install Docker, copy the project (or clone), run `docker compose up -d --build`. Open **http://\<EC2-public-IP\>:8080** (or map port 80 in the security group and use `ports: "80:80"` in docker-compose).

**Do you need npm on EC2/ECS?** No. For production you serve the **built** app (static HTML/JS/CSS). Build once (on your machine or in CI with `npm run build`), then either: (1) **Docker**: the image runs `npm run build` during `docker build` and nginx serves the result—no Node on the server; (2) **Static host (S3, etc.)**: upload the `dist/` folder. So EC2/ECS only need a web server (or the pre-built Docker image); npm on the server is not required and doesn’t make the app more optimal.

## Deploy to AWS

### Option A: EC2 (with or without Docker)

**With Docker (simplest):** Launch EC2, install Docker, copy the project, then run `docker compose up -d --build`. Open port **8080** (or **80** if you change the compose port mapping) in the security group. App at **http://\<EC2-public-IP\>:8080**.

**Without Docker:** Copy the project to the instance and run `bash scripts/setup-ec2.sh` (installs Node + nginx on the host). Open port **80**. Full steps: **[docs/DEPLOY-EC2.md](docs/DEPLOY-EC2.md)**.

### Option B: S3 static website

With [AWS CLI](https://aws.amazon.com/cli/) configured:

```powershell
$env:AWS_BUCKET = "your-bucket-name"
.\scripts\deploy-aws.ps1
```

Then open the S3 website URL. For HTTPS, put CloudFront in front of the bucket.

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **svguitar** — guitar/ukulele chord SVGs
- **piano-chart** — piano keyboard with highlighted keys
- **chord-symbol** — chord name → notes (for piano)
