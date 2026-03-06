import type { Instrument } from '../types';

const INSTRUMENTS: { id: Instrument; label: string }[] = [
  { id: 'piano', label: 'Piano' },
  { id: 'guitar', label: 'Guitar' },
  { id: 'ukulele', label: 'Ukulele' },
];

interface InstrumentSelectorProps {
  value: Instrument;
  onChange: (instrument: Instrument) => void;
}

export function InstrumentSelector({ value, onChange }: InstrumentSelectorProps) {
  return (
    <div className="instrument-selector" role="tablist" aria-label="Chord diagram instrument">
      {INSTRUMENTS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={value === id}
          className={`instrument-selector__btn ${value === id ? 'instrument-selector__btn--active' : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
