import type { ParsedSong } from '../types';
import type { ChordSegment } from '../types';

interface LyricsViewProps {
  song: ParsedSong;
  selectedChord: string | null;
  onChordSelect: (chord: string | null, anchorRect?: DOMRect) => void;
}

export function LyricsView({ song, selectedChord, onChordSelect }: LyricsViewProps) {
  return (
    <article className="lyrics">
      <h1 className="lyrics__title">{song.title}</h1>
      <div className="lyrics__content">
        {song.lines.map((line, lineIdx) => (
          <LyricsLine
            key={lineIdx}
            segments={line.segments}
            selectedChord={selectedChord}
            onChordSelect={onChordSelect}
          />
        ))}
      </div>
    </article>
  );
}

/**
 * UkuTabs-style: one row of chords, one row of lyrics. One column per segment so each chord sits directly above its phrase.
 */
function LyricsLine({
  segments,
  selectedChord,
  onChordSelect,
}: {
  segments: ChordSegment[];
  selectedChord: string | null;
  onChordSelect: (chord: string | null, anchorRect?: DOMRect) => void;
}) {
  if (segments.length === 0) {
    return <div className="lyrics__line lyrics__line--empty" />;
  }

  const handleChordClick = (chord: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    onChordSelect(selectedChord === chord ? null : chord, rect);
  };

  return (
    <div
      className="lyrics__line lyrics__line--grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${segments.length}, auto)`,
        gridTemplateRows: 'auto auto',
        gap: '0 1em',
      }}
    >
      {segments.map((seg, i) => (
        <div key={`chord-${i}`} className="lyrics__cell lyrics__cell--chord">
          {seg.chord !== null ? (
            <button
              type="button"
              className={`lyrics__chord ${selectedChord === seg.chord ? 'lyrics__chord--selected' : ''}`}
              onClick={(e) => handleChordClick(seg.chord!, e)}
            >
              {seg.chord}
            </button>
          ) : (
            '\u00A0'
          )}
        </div>
      ))}
      {segments.map((seg, i) => (
        <div key={`text-${i}`} className="lyrics__cell lyrics__cell--text">
          {seg.text}
        </div>
      ))}
    </div>
  );
}
