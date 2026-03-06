import type { Instrument } from '../types';
import { getFingering } from '../utils/chordLookup';
import { chordToPianoChordOrgUrl } from '../utils/pianochordOrg';
import { guitarChords, ukuleleChords } from '../chordData';
import { FrettedChordDiagram } from './FrettedChordDiagram';
import { PianoChordDiagram } from './PianoChordDiagram';

interface ChordPaneProps {
  chordName: string;
  instrument: Instrument;
  onClose?: () => void;
}

export function ChordPane({ chordName, instrument, onClose }: ChordPaneProps) {
  const content =
    instrument === 'piano' ? (
      <PianoChordDiagram chordName={chordName} />
    ) : (
      <FrettedChordDiagram
        chordName={chordName}
        data={instrument === 'guitar' ? getFingering(guitarChords, chordName) : getFingering(ukuleleChords, chordName)}
        instrument={instrument}
      />
    );

  const pianoChordUrl = chordToPianoChordOrgUrl(chordName) ?? 'https://www.pianochord.org/';

  return (
    <aside className="chord-pane" aria-label={`Chord: ${chordName}`}>
      {onClose && (
        <button
          type="button"
          className="chord-pane__close"
          onClick={onClose}
          aria-label="Close chord"
          title="Close"
        >
          ×
        </button>
      )}
      <div className="chord-pane__content">{content}</div>
      {instrument === 'piano' && (
        <a
          href={pianoChordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="chord-pane__link"
        >
          Fingerings on PianoChord.org →
        </a>
      )}
    </aside>
  );
}
