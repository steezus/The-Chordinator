import { useEffect, useRef } from 'react';
import { Instrument } from 'piano-chart';
import { chordParserFactory } from 'chord-symbol';

const parseChord = chordParserFactory();

/** Map chord-symbol note names (e.g. "Eb", "C#") to piano-chart format (e.g. "Eb4"). Uses normalized.notes from chord-symbol. */
function chordNameToPianoNotes(chordName: string): string[] {
  const trimmed = chordName.trim();
  if (!trimmed) return [];
  try {
    const parsed = parseChord(trimmed);
    if (!parsed || typeof parsed !== 'object') return [];
    const normalized = (parsed as { normalized?: { notes?: string[] } }).normalized;
    const notes = normalized?.notes;
    if (!Array.isArray(notes) || notes.length === 0) return [];
    const octave = 4;
    return notes.map((noteName) => `${String(noteName).trim()}${octave}`);
  } catch {
    return [];
  }
}

interface PianoChordDiagramProps {
  chordName: string;
}

export function PianoChordDiagram({ chordName }: PianoChordDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instrumentRef = useRef<InstanceType<typeof Instrument> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = '';
    const notes = chordNameToPianoNotes(chordName);
    if (notes.length === 0) return;

    const piano = new Instrument(el, {
      startOctave: 3,
      endOctave: 5,
      showNoteNames: 'onpress',
    });
    instrumentRef.current = piano;
    piano.create();
    notes.forEach((n) => piano.keyDown(n));

    return () => {
      try {
        piano.destroy?.();
      } catch (_) {}
      instrumentRef.current = null;
    };
  }, [chordName]);

  const notes = chordNameToPianoNotes(chordName);
  if (notes.length === 0) {
    return (
      <div className="chord-diagram chord-diagram--unsupported">
        <span className="chord-diagram__label">{chordName}</span>
        <p>Could not parse chord for piano.</p>
      </div>
    );
  }

  return (
    <div className="chord-diagram chord-diagram--piano">
      <span className="chord-diagram__label chord-diagram__label--piano">{chordName}</span>
      <div ref={containerRef} className="piano-chart-container" />
    </div>
  );
}
