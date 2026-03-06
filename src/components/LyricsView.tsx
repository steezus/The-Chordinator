import type { ParsedSong } from '../types';
import type { ChordSegment } from '../types';

interface LyricsViewProps {
  song: ParsedSong;
  selectedChord: string | null;
  onChordSelect: (chord: string | null, anchorRect?: DOMRect) => void;
  onChordHover?: (chord: string, anchorRect: DOMRect) => void;
  onChordHoverEnd?: () => void;
}

export function LyricsView({ song, selectedChord, onChordSelect, onChordHover, onChordHoverEnd }: LyricsViewProps) {
  return (
    <article className="lyrics" dir="ltr">
      <h1 className="lyrics__title">{song.title}</h1>
      <div className="lyrics__content">
        {song.lines.map((line, lineIdx) =>
          line.section ? (
            <h2 key={`section-${lineIdx}`} className="lyrics__section">
              {line.section}:
            </h2>
          ) : line.chordLine != null ? (
            <TwoLineBlock
              key={`line-${lineIdx}`}
              chordLine={line.chordLine}
              lyricLine={line.lyricLine ?? ''}
            />
          ) : (
            <LyricsLine
              key={`line-${lineIdx}`}
              lineIndex={lineIdx}
              segments={line.segments ?? []}
              selectedChord={selectedChord}
              onChordSelect={onChordSelect}
              onChordHover={onChordHover}
              onChordHoverEnd={onChordHoverEnd}
            />
          )
        )}
      </div>
    </article>
  );
}

/**
 * Two-line format: chord line above lyric line. Spacing is preserved so chords align with lyrics.
 * This is the foundation format — paste chord line then lyric line and it displays exactly as provided.
 */
function TwoLineBlock({ chordLine, lyricLine }: { chordLine: string; lyricLine: string }) {
  return (
    <div className="lyrics__two-line" data-two-line>
      <pre className="lyrics__chord-line" aria-hidden={!lyricLine}>
        {chordLine}
      </pre>
      {lyricLine ? (
        <pre className="lyrics__lyric-line">{lyricLine}</pre>
      ) : null}
    </div>
  );
}

/**
 * Paragraph format: each segment is one unit (chord above, words below) in reading order.
 * Segments flow inline and wrap together so the chord stays above the word it's played on.
 */
function LyricsLine({
  lineIndex,
  segments,
  selectedChord,
  onChordSelect,
  onChordHover,
  onChordHoverEnd,
}: {
  lineIndex: number;
  segments: ChordSegment[];
  selectedChord: string | null;
  onChordSelect: (chord: string | null, anchorRect?: DOMRect) => void;
  onChordHover?: (chord: string, anchorRect: DOMRect) => void;
  onChordHoverEnd?: () => void;
}) {
  if (segments.length === 0) {
    return <div className="lyrics__line lyrics__line--empty" aria-hidden />;
  }

  const handleChordClick = (chord: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    onChordSelect(selectedChord === chord ? null : chord, rect);
  };

  const handleChordMouseEnter = (chord: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    onChordHover?.(chord, rect);
  };

  return (
    <div
      className="lyrics__line lyrics__line--paragraph"
      dir="ltr"
      style={{ display: 'block' }}
      data-line-index={lineIndex}
    >
      {segments.map((seg, i) => (
        <span key={`${lineIndex}-${i}`} className="lyrics__segment">
          <span className={`lyrics__chord-wrap ${seg.chord === null ? 'lyrics__chord-wrap--empty' : ''}`}>
            {seg.chord !== null ? (
              <button
                type="button"
                className={`lyrics__chord ${selectedChord === seg.chord ? 'lyrics__chord--selected' : ''}`}
                title="Click or hover for chord diagram"
                onClick={(e) => handleChordClick(seg.chord!, e)}
                onMouseEnter={(e) => handleChordMouseEnter(seg.chord!, e)}
                onMouseLeave={onChordHoverEnd}
              >
                {seg.chord}
              </button>
            ) : (
              <span className="lyrics__chord-placeholder" aria-hidden />
            )}
          </span>
          <span className="lyrics__words">{seg.text}</span>
        </span>
      ))}
    </div>
  );
}
