import { useEffect, useRef } from 'react';
import { Instrument } from 'piano-chart';
import { chordParserFactory } from 'chord-symbol';
import { chordToPianoChordOrgUrl } from '../utils/pianochordOrg';
import { getPianoNotesForChord } from '../data/pianoChordNotes';

const parseChord = chordParserFactory();

/** Piano notes for diagram: use PianoChord.org-style map first, then chord-symbol. */
function chordNameToPianoNotes(chordName: string): string[] {
  const fromMap = getPianoNotesForChord(chordName);
  if (fromMap.length > 0) return fromMap;
  const trimmed = chordName.trim();
  if (!trimmed) return [];
  try {
    const parsed = parseChord(trimmed);
    if (!parsed || typeof parsed !== 'object') return [];
    const normalized = (parsed as { normalized?: { notes?: string[] } }).normalized;
    const notes = normalized?.notes;
    if (!Array.isArray(notes) || notes.length === 0) return [];
    return notes.map((noteName) => `${String(noteName).trim()}4`);
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

  const pianoChordUrl = chordToPianoChordOrgUrl(chordName) ?? 'https://www.pianochord.org/';

  return (
    <div className="chord-diagram chord-diagram--piano">
      <span className="chord-diagram__label chord-diagram__label--piano">{chordName}</span>
      <div ref={containerRef} className="piano-chart-container" />
      <a
        href={pianoChordUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="chord-diagram__pianochord-link"
      >
        View on PianoChord.org →
      </a>
    </div>
  );
}
