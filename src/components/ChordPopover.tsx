import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Instrument } from '../types';
import { getFingering } from '../utils/chordLookup';
import { guitarChords, ukuleleChords } from '../chordData';
import { FrettedChordDiagram } from './FrettedChordDiagram';
import { PianoChordDiagram } from './PianoChordDiagram';
import './ChordPopover.css';

interface ChordPopoverProps {
  chordName: string;
  instrument: Instrument;
  anchorRect: DOMRect;
  onClose: () => void;
}

export function ChordPopover({ chordName, instrument, anchorRect, onClose }: ChordPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) onClose();
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const x = anchorRect.left + anchorRect.width / 2;
  const y = anchorRect.top;
  const showAbove = y > 280;
  const style: React.CSSProperties = {
    position: 'fixed',
    left: x,
    top: showAbove ? y : anchorRect.bottom,
    transform: showAbove ? 'translate(-50%, calc(-100% - 8px))' : 'translate(-50%, 8px)',
    zIndex: 1000,
  };

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

  return createPortal(
    <div ref={popoverRef} className={`chord-popover ${!showAbove ? 'chord-popover--below' : ''}`} style={style} role="dialog" aria-label={`Chord: ${chordName}`}>
      <div className="chord-popover__arrow" />
      <div className="chord-popover__content">{content}</div>
    </div>,
    document.body
  );
}
