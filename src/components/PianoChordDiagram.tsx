import { useEffect, useRef, useState } from 'react';
import { Instrument } from 'piano-chart';
import { chordParserFactory } from 'chord-symbol';
import { chordToPianoChordOrgUrl } from '../utils/pianochordOrg';
import { getPianoNotesForChord } from '../data/pianoChordNotes';
import { getChordImageCandidates } from '../utils/enharmonicChords';

/** URL for a chord image in public/pianochords (e.g. C#.png → /pianochords/C%23.png) */
function pianochordsImageSrc(chordName: string): string {
  const name = chordName.trim();
  if (!name) return '';
  return `/pianochords/${encodeURIComponent(name)}.png`;
}

const parseChord = chordParserFactory();

/** Map chord-symbol enharmonics to piano key names so the chart highlights the correct keys. */
const ENHARMONIC: Record<string, string> = {
  'E#': 'F',
  'B#': 'C',
  'Cb': 'B',
  'Fb': 'E',
};

function toPianoNote(noteName: string): string {
  const n = String(noteName).trim();
  const base = n.replace(/\d+$/, '');
  const octave = n.match(/\d+$/)?.[0] ?? '4';
  const key = ENHARMONIC[base] ?? base;
  return `${key}${octave}`;
}

/**
 * Piano notes for the diagram: use PianoChord.org-style map first (same "Notes:" as their site),
 * then fall back to chord-symbol so the in-app chart matches PianoChord.org where we have data.
 */
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
    return notes.map((noteName) => toPianoNote(noteName + '4'));
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
  const normalizedChord = chordName.trim();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [candidateIndex, setCandidateIndex] = useState(0);

  const imageCandidates = normalizedChord ? getChordImageCandidates(normalizedChord) : [];
  const imageSrc = imageCandidates[candidateIndex]
    ? pianochordsImageSrc(imageCandidates[candidateIndex])
    : '';

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setCandidateIndex(0);
  }, [normalizedChord]);

  useEffect(() => {
    const useChart = !imageSrc || imageError || !imageLoaded;
    if (!useChart) return;
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = '';
    const notes = chordNameToPianoNotes(normalizedChord);
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
  }, [normalizedChord, imageError, imageSrc, imageLoaded]);

  const notes = chordNameToPianoNotes(normalizedChord);
  const pianoChordUrl = chordToPianoChordOrgUrl(normalizedChord) ?? 'https://www.pianochord.org/';
  const showImage = imageSrc && imageLoaded && !imageError;
  const showChart = imageError || !imageSrc || !imageLoaded;

  if (notes.length === 0 && !imageSrc) {
    return (
      <div className="chord-diagram chord-diagram--unsupported">
        <span className="chord-diagram__label">{normalizedChord || chordName}</span>
        <p>Could not parse chord for piano.</p>
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

  return (
    <div className="chord-diagram chord-diagram--piano">
      <span className="chord-diagram__label chord-diagram__label--piano">{normalizedChord || chordName}</span>
      {imageSrc && (
        <img
          key={imageSrc}
          src={imageSrc}
          alt={`Piano chord ${normalizedChord}`}
          className="chord-diagram__piano-image"
          style={{ display: showImage ? 'block' : 'none' }}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            if (candidateIndex < imageCandidates.length - 1) {
              setCandidateIndex((i) => i + 1);
              setImageLoaded(false);
              setImageError(false);
            } else {
              setImageError(true);
            }
          }}
        />
      )}
      {showChart && (
        <div
          ref={containerRef}
          className="piano-chart-container"
          style={{ display: showImage ? 'none' : undefined }}
          aria-hidden={showImage}
        />
      )}
      <a
        href={pianoChordUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="chord-diagram__pianochord-link"
      >
        {showImage ? 'Fingerings on PianoChord.org →' : 'Same notes as PianoChord.org — open for fingerings →'}
      </a>
    </div>
  );
}
