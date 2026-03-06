import { useState } from 'react';
import { Link } from 'react-router-dom';
import { parseChordPro } from '../parseChordPro';
import { LyricsView } from '../components/LyricsView';
import './ImportPage.css';

const LYRICS_ON_DEMAND_BASE = 'https://www.lyricsondemand.com';

export function ImportPage() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [pasted, setPasted] = useState('');
  const [copied, setCopied] = useState(false);

  const hasChords = /\[[^\]]+\]/.test(pasted);
  const chordProTitle = title || artist ? `{title: ${[title, artist].filter(Boolean).join(' — ')}}\n\n` : '';
  const chordProBody = pasted.trim();
  const chordProFull = chordProTitle + (chordProBody ? chordProBody : '');
  const parsed = chordProFull.trim() ? parseChordPro(chordProFull) : null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(chordProFull);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="import-page">
      <header className="import-page__header">
        <Link to="/" className="import-page__back">
          ← The Chordinator
        </Link>
        <h1 className="import-page__title">Import from Lyrics On Demand</h1>
      </header>

      <main className="import-page__main">
        <section className="import-page__instructions">
          <p>
            <strong>Lyrics On Demand</strong> doesn’t offer a public API, so lyrics can’t be fetched automatically.
          </p>
          <ol>
            <li>
              Open the song on{' '}
              <a href={LYRICS_ON_DEMAND_BASE} target="_blank" rel="noopener noreferrer">
                lyricsondemand.com
              </a>
              . URLs look like: <code>{LYRICS_ON_DEMAND_BASE}/artist_name/song_name</code>
            </li>
            <li>Copy the lyrics from the page (Ctrl+C / Cmd+C).</li>
            <li>Paste below. If you add chords in ChordPro form (<code>[G]</code> before a word), they’ll show in the preview.</li>
            <li>Use “Copy ChordPro” and add the result to <code>src/data/songContent.ts</code> or <code>public/songs.json</code>.</li>
          </ol>
        </section>

        <section className="import-page__form">
          <label className="import-page__label">
            Song title (optional)
            <input
              type="text"
              className="import-page__input"
              placeholder="e.g. Blinding Lights"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="import-page__label">
            Artist (optional)
            <input
              type="text"
              className="import-page__input"
              placeholder="e.g. The Weeknd"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
            />
          </label>
          <label className="import-page__label">
            Pasted lyrics (plain or ChordPro)
            <textarea
              className="import-page__textarea"
              placeholder="Paste lyrics here. Add chords like [G] or [Am] before the word they’re played on."
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              rows={12}
              spellCheck={false}
            />
          </label>
          {pasted.trim() && (
            <p className="import-page__hint">
              {hasChords ? 'ChordPro detected — chords will show in preview.' : 'Plain text — add [Chord] before words for a chord chart.'}
            </p>
          )}
        </section>

        {parsed && parsed.lines.some((l) => (l.segments?.length ?? 0) > 0 || l.section) && (
          <section className="import-page__preview">
            <h2 className="import-page__preview-title">Preview</h2>
            <div className="import-page__preview-content">
              <LyricsView
                song={parsed}
                selectedChord={null}
                onChordSelect={() => {}}
              />
            </div>
          </section>
        )}

        {chordProFull.trim() && (
          <section className="import-page__actions">
            <button
              type="button"
              className="import-page__copy-btn"
              onClick={handleCopy}
            >
              {copied ? 'Copied!' : 'Copy ChordPro'}
            </button>
            <p className="import-page__copy-hint">
              Paste into <code>songContent.ts</code> or into a song’s <code>content</code> in <code>songs.json</code>.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
