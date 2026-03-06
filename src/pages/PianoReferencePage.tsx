import { Link } from 'react-router-dom';
import { chordToPianoChordOrgUrl } from '../utils/pianochordOrg';
import './PianoReferencePage.css';

/** Common chords to show on the reference page (root + type label) */
const CHORD_GROUPS: { title: string; chords: string[] }[] = [
  { title: 'Major', chords: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C#', 'Db', 'Eb', 'F#', 'Ab', 'Bb'] },
  { title: 'Minor', chords: ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm', 'C#m', 'Ebm', 'F#m', 'Abm', 'Bbm'] },
  { title: 'Dominant 7', chords: ['C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7', 'Bb7', 'Eb7'] },
  { title: 'Major 7', chords: ['Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7'] },
  { title: 'Minor 7', chords: ['Cm7', 'Dm7', 'Em7', 'Fm7', 'Gm7', 'Am7', 'Bm7'] },
  { title: 'Other common', chords: ['Csus', 'Cdim', 'Caug', 'C6', 'Cm6', 'Cadd9', 'Cm7b5'] },
];

function ChordLink({ chord }: { chord: string }) {
  const url = chordToPianoChordOrgUrl(chord);
  if (!url) return <span className="piano-ref__chord piano-ref__chord--na">{chord}</span>;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="piano-ref__chord"
      title={`View ${chord} on PianoChord.org`}
    >
      {chord}
    </a>
  );
}

export function PianoReferencePage() {
  return (
    <div className="piano-ref">
      <header className="piano-ref__header">
        <h1 className="piano-ref__title">Piano chord reference</h1>
        <p className="piano-ref__intro">
          Diagrams and fingerings from{' '}
          <a href="https://www.pianochord.org/" target="_blank" rel="noopener noreferrer">
            PianoChord.org
          </a>
          . Click a chord to open it in a new tab.
        </p>
        <Link to="/" className="piano-ref__back">
          ← Back to home
        </Link>
      </header>

      <section className="piano-ref__grid">
        {CHORD_GROUPS.map((group) => (
          <div key={group.title} className="piano-ref__group">
            <h2 className="piano-ref__group-title">{group.title}</h2>
            <div className="piano-ref__chords">
              {group.chords.map((chord) => (
                <ChordLink key={chord} chord={chord} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <p className="piano-ref__footer">
        In songs, click a chord above the lyrics and choose <strong>Piano</strong> to see a diagram; use “View on PianoChord.org” for the same reference diagrams.
      </p>
    </div>
  );
}
