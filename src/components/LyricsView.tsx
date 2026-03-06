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
 * Book-like layout: each segment is one unit (chord above, words below). Segments flow inline and wrap together so the chord stays directly above its phrase.
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
    <div className="lyrics__line">
      {segments.map((seg, i) => (
        <span key={i} className="lyrics__segment">
          {seg.chord !== null ? (
            <span className="lyrics__chord-line">
              <button
                type="button"
                className={`lyrics__chord ${selectedChord === seg.chord ? 'lyrics__chord--selected' : ''}`}
                onClick={(e) => handleChordClick(seg.chord!, e)}
              >
                {seg.chord}
              </button>
            </span>
          ) : null}
          <span className="lyrics__words">{seg.text}</span>
        </span>
      ))}
    </div>
  );
}
