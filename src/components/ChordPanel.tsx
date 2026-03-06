import type { Instrument } from '../types';
import { getFingering } from '../utils/chordLookup';
import { guitarChords, ukuleleChords } from '../chordData';
import { FrettedChordDiagram } from './FrettedChordDiagram';
import { PianoChordDiagram } from './PianoChordDiagram';

interface ChordPanelProps {
  chordName: string | null;
  instrument: Instrument;
}

export function ChordPanel({ chordName, instrument }: ChordPanelProps) {
  if (!chordName) {
    return (
      <aside className="chord-panel">
        <p className="chord-panel__hint">Click a chord above the lyrics to see the diagram.</p>
      </aside>
    );
  }

  if (instrument === 'piano') {
    return (
      <aside className="chord-panel">
        <PianoChordDiagram chordName={chordName} />
      </aside>
    );
  }

  const data = instrument === 'guitar' ? getFingering(guitarChords, chordName) : getFingering(ukuleleChords, chordName);
  return (
    <aside className="chord-panel">
      <FrettedChordDiagram chordName={chordName} data={data} instrument={instrument} />
    </aside>
  );
}
