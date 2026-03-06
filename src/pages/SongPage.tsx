import { useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSongById, getParsedSong } from '../data/songs';
import { useSongCatalog } from '../context/SongCatalogContext';
import type { Instrument } from '../types';
import { LyricsView } from '../components/LyricsView';
import { ChordPane } from '../components/ChordPane';
import { InstrumentSelector } from '../components/InstrumentSelector';
import { getMusixmatchApiKey, fetchMusixmatchLyrics } from '../utils/musixmatch';
import '../App.css';

const HOVER_SHOW_DELAY_MS = 300;
const HOVER_HIDE_DELAY_MS = 200;

export function SongPage() {
  const { id } = useParams<{ id: string }>();
  const { catalog, contentMap } = useSongCatalog();
  const [instrument, setInstrument] = useState<Instrument>('guitar');
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [hoverChord, setHoverChord] = useState<string | null>(null);
  const [musixmatchLyrics, setMusixmatchLyrics] = useState<{ lyrics: string; copyright: string | null } | null>(null);
  const [musixmatchLoading, setMusixmatchLoading] = useState(false);
  const [musixmatchError, setMusixmatchError] = useState(false);
  const hoverShowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const meta = id ? getSongById(id, catalog) : undefined;
  const hasMusixmatchKey = !!getMusixmatchApiKey();

  const handleGetOfficialLyrics = useCallback(async () => {
    if (!meta) return;
    setMusixmatchError(false);
    setMusixmatchLoading(true);
    setMusixmatchLyrics(null);
    const result = await fetchMusixmatchLyrics(meta.title, meta.artist);
    setMusixmatchLoading(false);
    if (result) setMusixmatchLyrics(result);
    else setMusixmatchError(true);
  }, [meta]);
  const song = id ? getParsedSong(id, { catalog, contentMap }) : undefined;

  const handleChordSelect = (chord: string | null) => {
    setSelectedChord(chord);
  };

  const handleChordHover = useCallback((chord: string) => {
    if (hoverHideTimeoutRef.current) {
      clearTimeout(hoverHideTimeoutRef.current);
      hoverHideTimeoutRef.current = null;
    }
    hoverShowTimeoutRef.current = setTimeout(() => {
      hoverShowTimeoutRef.current = null;
      setHoverChord(chord);
    }, HOVER_SHOW_DELAY_MS);
  }, []);

  const handleChordHoverEnd = useCallback(() => {
    if (hoverShowTimeoutRef.current) {
      clearTimeout(hoverShowTimeoutRef.current);
      hoverShowTimeoutRef.current = null;
    }
    hoverHideTimeoutRef.current = setTimeout(() => {
      hoverHideTimeoutRef.current = null;
      setHoverChord(null);
    }, HOVER_HIDE_DELAY_MS);
  }, []);

  const displayChord = selectedChord ?? hoverChord;

  if (!id || !meta || !song) {
    return (
      <div className="app">
        <header className="app__header">
          <Link to="/" className="app__brand" style={{ color: 'inherit', textDecoration: 'none' }}>
            The Chordinator
          </Link>
        </header>
        <div className="app__main app__main--single" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Song not found.</p>
          <Link to="/">Back to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app__header">
        <Link to="/" className="app__brand" style={{ color: 'inherit', textDecoration: 'none' }}>
          The Chordinator
        </Link>
        <p className="app__tagline">
          <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Back to search
          </Link>
        </p>
        <InstrumentSelector value={instrument} onChange={setInstrument} />
      </header>
      <div className="app__main app__main--single">
        {hasMusixmatchKey && (
          <div className="musixmatch-bar">
            <button
              type="button"
              className="musixmatch-bar__btn"
              onClick={handleGetOfficialLyrics}
              disabled={musixmatchLoading}
            >
              {musixmatchLoading ? 'Loading…' : 'Get official lyrics (Musixmatch)'}
            </button>
          </div>
        )}
        <div className="song-content">
          <div className="song-content__lyrics">
            <LyricsView
              song={song}
              selectedChord={selectedChord}
              onChordSelect={handleChordSelect}
              onChordHover={handleChordHover}
              onChordHoverEnd={handleChordHoverEnd}
            />
            {musixmatchError && (
              <p className="musixmatch-message musixmatch-message--error">
                Could not load lyrics for this track. It may not be in Musixmatch or the free tier returned no result.
              </p>
            )}
            {musixmatchLyrics && (
              <section className="musixmatch-lyrics" aria-label="Official lyrics from Musixmatch">
                <h2 className="musixmatch-lyrics__title">Official lyrics (Musixmatch)</h2>
                <pre className="musixmatch-lyrics__body">{musixmatchLyrics.lyrics}</pre>
                {musixmatchLyrics.copyright && (
                  <p className="musixmatch-lyrics__copyright">{musixmatchLyrics.copyright}</p>
                )}
              </section>
            )}
          </div>
          {displayChord ? (
            <ChordPane
              chordName={displayChord}
              instrument={instrument}
              onClose={selectedChord ? () => setSelectedChord(null) : undefined}
            />
          ) : (
            <aside className="chord-pane chord-pane--empty" aria-hidden>
              <span>Click or hover a chord in the lyrics</span>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
