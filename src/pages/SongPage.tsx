import { useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSongById, getParsedSong } from '../data/songs';
import { useSongCatalog } from '../context/SongCatalogContext';
import type { Instrument } from '../types';
import { LyricsView } from '../components/LyricsView';
import { ChordPopover } from '../components/ChordPopover';
import { InstrumentSelector } from '../components/InstrumentSelector';
import '../App.css';

const HOVER_SHOW_DELAY_MS = 300;
const HOVER_HIDE_DELAY_MS = 200;

export function SongPage() {
  const { id } = useParams<{ id: string }>();
  const { catalog, contentMap } = useSongCatalog();
  const [instrument, setInstrument] = useState<Instrument>('guitar');
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<DOMRect | null>(null);
  const [hoverChord, setHoverChord] = useState<string | null>(null);
  const [hoverAnchor, setHoverAnchor] = useState<DOMRect | null>(null);
  const hoverShowTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const meta = id ? getSongById(id, catalog) : undefined;
  const song = id ? getParsedSong(id, { catalog, contentMap }) : undefined;

  const handleChordSelect = (chord: string | null, anchorRect?: DOMRect) => {
    setSelectedChord(chord);
    setPopoverAnchor(anchorRect ?? null);
  };

  const handleChordHover = useCallback((chord: string, anchorRect: DOMRect) => {
    if (hoverHideTimeoutRef.current) {
      clearTimeout(hoverHideTimeoutRef.current);
      hoverHideTimeoutRef.current = null;
    }
    hoverShowTimeoutRef.current = setTimeout(() => {
      hoverShowTimeoutRef.current = null;
      setHoverChord(chord);
      setHoverAnchor(anchorRect);
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
      setHoverAnchor(null);
    }, HOVER_HIDE_DELAY_MS);
  }, []);

  const handleHoverPopoverEnter = useCallback(() => {
    if (hoverHideTimeoutRef.current) {
      clearTimeout(hoverHideTimeoutRef.current);
      hoverHideTimeoutRef.current = null;
    }
  }, []);

  const handleHoverPopoverLeave = useCallback(() => {
    setHoverChord(null);
    setHoverAnchor(null);
  }, []);

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
        <LyricsView
          song={song}
          selectedChord={selectedChord}
          onChordSelect={handleChordSelect}
          onChordHover={handleChordHover}
          onChordHoverEnd={handleChordHoverEnd}
        />
      </div>
      {selectedChord && popoverAnchor && (
        <ChordPopover
          chordName={selectedChord}
          instrument={instrument}
          anchorRect={popoverAnchor}
          onClose={() => { setSelectedChord(null); setPopoverAnchor(null); }}
        />
      )}
      {hoverChord && hoverAnchor && !selectedChord && (
        <ChordPopover
          chordName={hoverChord}
          instrument={instrument}
          anchorRect={hoverAnchor}
          onClose={() => {}}
          hoverMode
          onMouseEnter={handleHoverPopoverEnter}
          onMouseLeave={handleHoverPopoverLeave}
        />
      )}
    </div>
  );
}
