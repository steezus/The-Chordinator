import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSongById, getParsedSong } from '../data/songs';
import { useSongCatalog } from '../context/SongCatalogContext';
import type { Instrument } from '../types';
import { LyricsView } from '../components/LyricsView';
import { ChordPopover } from '../components/ChordPopover';
import { InstrumentSelector } from '../components/InstrumentSelector';
import '../App.css';

export function SongPage() {
  const { id } = useParams<{ id: string }>();
  const { catalog, contentMap } = useSongCatalog();
  const [instrument, setInstrument] = useState<Instrument>('guitar');
  const [selectedChord, setSelectedChord] = useState<string | null>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<DOMRect | null>(null);

  const meta = id ? getSongById(id, catalog) : undefined;
  const song = id ? getParsedSong(id, { catalog, contentMap }) : undefined;

  const handleChordSelect = (chord: string | null, anchorRect?: DOMRect) => {
    setSelectedChord(chord);
    setPopoverAnchor(anchorRect ?? null);
  };

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
    </div>
  );
}
