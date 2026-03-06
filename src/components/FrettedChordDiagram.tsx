import { useEffect, useRef } from 'react';
import { SVGuitarChord } from 'svguitar';
import type { GuitarChordData } from '../types';
import type { Instrument } from '../types';

const UKULELE_TUNING = ['A', 'E', 'C', 'G'];

interface FrettedChordDiagramProps {
  chordName: string;
  data: GuitarChordData | null;
  instrument: Instrument;
}

export function FrettedChordDiagram({ chordName, data, instrument }: FrettedChordDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<InstanceType<typeof SVGuitarChord> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.innerHTML = '';
    if (!data) return;

    const isUkulele = instrument === 'ukulele';
    const chart = new SVGuitarChord(el);

    chartRef.current = chart;

    chart
      .configure({
        strings: isUkulele ? 4 : 6,
        frets: 4,
        tuning: isUkulele ? UKULELE_TUNING : ['E', 'A', 'D', 'G', 'B', 'E'],
        position: data.position ?? 1,
        title: chordName,
        titleFontSize: 20,
        fretLabelFontSize: 14,
        tuningsFontSize: 12,
        noPosition: false,
        color: '#e8e6e3',
        backgroundColor: 'transparent',
        fingerColor: '#c9a227',
        fingerTextColor: '#0f0f12',
      })
      .chord({
        fingers: data.fingers as [number, number | 'x', (string | object)?][],
        barres: data.barres ?? [],
        position: data.position,
        title: chordName,
      })
      .draw();

    return () => {
      chartRef.current = null;
    };
  }, [chordName, data, instrument]);

  if (!data) {
    return (
      <div className="chord-diagram chord-diagram--unsupported">
        <span className="chord-diagram__label">{chordName}</span>
        <p>No diagram for this chord yet.</p>
      </div>
    );
  }

  return <div ref={containerRef} className="chord-diagram chord-diagram--fretted" />;
}
