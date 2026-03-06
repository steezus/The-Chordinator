#!/usr/bin/env node
/**
 * Fetch ChordPro .cho files from a GitHub repo (e.g. pcderic/chordpro) and
 * build public/songs.json. Run with Node 18+ (uses built-in fetch).
 *
 * Usage:
 *   node scripts/fetch-chordpro-from-github.mjs [owner/repo] [maxSongs]
 *
 * Examples:
 *   node scripts/fetch-chordpro-from-github.mjs
 *   node scripts/fetch-chordpro-from-github.mjs pcderic/chordpro 80
 *
 * Set GITHUB_TOKEN for higher rate limits (optional).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_PATH = path.join(ROOT, 'public', 'songs.json');

const DEFAULT_REPO = 'mattgraham/worship';
const DEFAULT_MAX = 80;
const DEFAULT_EXT = 'onsong';
const DEFAULT_BRANCH = 'master';
const DELAY_MS = 250;

function slugFromPath(filePath, ext) {
  const base = path.basename(filePath, path.extname(filePath));
  return base
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase() || 'untitled';
}

function parseTitleAndArtist(content, isOnsong = false) {
  let title = '';
  let artist = '';
  for (const line of content.split(/\r?\n/)) {
    if (isOnsong) {
      const t = line.match(/^Title\s*:\s*(.+)$/i);
      if (t) title = t[1].trim();
      const a = line.match(/^Artist\s*:\s*(.+)$/i);
      if (a) artist = a[1].trim();
      if (title) break;
    } else {
      const t = line.match(/^\{\s*title\s*:\s*(.+)\s*\}$/i);
      if (t) title = t[1].trim();
      const st = line.match(/^\{\s*st\s*:\s*(.+)\s*\}$/i);
      if (st) artist = st[1].trim();
      if (title && artist) break;
    }
  }
  if (!title) title = 'Untitled';
  if (!artist && title.includes(' — ')) {
    const parts = title.split(' — ');
    title = parts[0].trim();
    artist = parts.slice(1).join(' — ').trim();
  }
  if (!artist) artist = 'Unknown';
  return { title, artist };
}

async function fetchJson(url, opts = {}) {
  const headers = { Accept: 'application/vnd.github.v3+json', ...opts.headers };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) throw new Error(`${url} ${res.status} ${await res.text()}`);
  return res.json();
}

async function getTreeSha(owner, repo, branch = 'main') {
  const ref = await fetchJson(
    `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`
  );
  const commit = await fetchJson(ref.object.url);
  return commit.tree.sha;
}

async function listSongFiles(owner, repo, branch, ext) {
  const treeSha = await getTreeSha(owner, repo, branch);
  const tree = await fetchJson(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`
  );
  const suffix = ext.startsWith('.') ? ext : '.' + ext;
  return (tree.tree || [])
    .filter((e) => e.type === 'blob' && e.path && e.path.toLowerCase().endsWith(suffix.toLowerCase()))
    .map((e) => e.path);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const [repoArg = DEFAULT_REPO, maxArg = DEFAULT_MAX, extArg = DEFAULT_EXT, branchArg = DEFAULT_BRANCH] = process.argv.slice(2);
  const [owner, repo] = repoArg.split('/');
  const maxSongs = Math.min(parseInt(maxArg, 10) || DEFAULT_MAX, 300);
  const ext = (extArg || DEFAULT_EXT).toLowerCase().replace(/^\./, '') || 'onsong';
  const branch = branchArg || (repo === 'worship' ? 'master' : 'main');
  if (!owner || !repo) {
    console.error('Usage: node scripts/fetch-chordpro-from-github.mjs [owner/repo] [maxSongs] [ext] [branch]');
    console.error('Example: node scripts/fetch-chordpro-from-github.mjs mattgraham/worship 80 onsong master');
    console.error('Example: node scripts/fetch-chordpro-from-github.mjs pcderic/chordpro 80 cho main');
    process.exit(1);
  }

  console.log(`Listing .${ext} files in ${owner}/${repo} (${branch})...`);
  const paths = await listSongFiles(owner, repo, branch, ext);
  const toFetch = paths.slice(0, maxSongs);
  console.log(`Found ${paths.length} .${ext} files; fetching up to ${toFetch.length}.`);

  const baseUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
  const songs = [];
  const seenSlugs = new Set();
  const isOnsong = ext === 'onsong';

  for (let i = 0; i < toFetch.length; i++) {
    const filePath = toFetch[i];
    const url = baseUrl + encodeURIComponent(filePath);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Skip ${filePath}: ${res.status}`);
        continue;
      }
      const content = await res.text();
      const { title, artist } = parseTitleAndArtist(content, isOnsong);
      let slug = slugFromPath(filePath, ext);
      while (seenSlugs.has(slug)) slug += '-' + (i + 1);
      seenSlugs.add(slug);
      songs.push({
        id: slug,
        title,
        artist,
        slug,
        content,
      });
      process.stdout.write('.');
    } catch (err) {
      console.warn(`\nSkip ${filePath}: ${err.message}`);
    }
    if (i < toFetch.length - 1) await sleep(DELAY_MS);
  }

  console.log(`\nFetched ${songs.length} songs.`);

  const outDir = path.dirname(OUT_PATH);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (fs.existsSync(OUT_PATH)) {
    const bak = OUT_PATH + '.bak';
    fs.copyFileSync(OUT_PATH, bak);
    console.log(`Backed up existing to ${path.relative(ROOT, bak)}`);
  }
  fs.writeFileSync(OUT_PATH, JSON.stringify({ songs }, null, 2), 'utf8');
  console.log(`Wrote ${path.relative(ROOT, OUT_PATH)} (${songs.length} songs).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
