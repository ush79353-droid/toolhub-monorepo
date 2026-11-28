'use client';

import { calculateHexagonHeight, calculateHexagonWidth } from './calculation';
import type { HexPreviewCell } from './types';

interface HexQuiltPreviewProps {
  cells: HexPreviewCell[];
  sideCm: number;
  columns: number;
  rows: number;
  actualWidthCm: number;
  actualLengthCm: number;
  simplified: boolean;
  note: string | null;
}

function flatTopPoints(cx: number, cy: number, side: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i);
    pts.push(`${cx + side * Math.cos(a)},${cy + side * Math.sin(a)}`);
  }
  return pts.join(' ');
}

export function HexQuiltPreview({
  cells,
  sideCm,
  columns,
  rows,
  actualWidthCm,
  actualLengthCm,
  simplified,
  note,
}: HexQuiltPreviewProps) {
  const pad = sideCm * 0.35;
  const W = calculateHexagonWidth(sideCm);
  const H = calculateHexagonHeight(sideCm);
  const width = actualWidthCm + pad * 2;
  const height = actualLengthCm + pad * 2;
  const vb = `${-pad} ${-pad} ${width} ${height}`;

  return (
    <figure className="rounded-xl border border-border bg-white p-3">
      <svg
        viewBox={vb}
        className="mx-auto h-auto w-full max-h-72"
        role="img"
        aria-labelledby="hex-quilt-preview-title hex-quilt-preview-desc"
      >
        <title id="hex-quilt-preview-title">Hexagon quilt layout preview</title>
        <desc id="hex-quilt-preview-desc">
          Flat-top hexagon grid with {columns} columns and {rows} rows.
          {simplified ? ' Simplified sample preview.' : ''}
        </desc>
        <rect
          x={0}
          y={0}
          width={actualWidthCm}
          height={actualLengthCm}
          fill="#f8fafc"
          stroke="#163c43"
          strokeWidth={sideCm * 0.04}
        />
        {cells.map((c) => (
          <polygon
            key={`${c.col}-${c.row}`}
            points={flatTopPoints(c.cx, c.cy, sideCm * 0.92)}
            fill={c.col % 2 === 0 ? '#dcfce7' : '#bbf7d0'}
            stroke="#16a34a"
            strokeWidth={sideCm * 0.05}
          />
        ))}
        {/* Width arrow */}
        <line
          x1={0}
          y1={-pad * 0.45}
          x2={actualWidthCm}
          y2={-pad * 0.45}
          stroke="#e11d48"
          strokeWidth={sideCm * 0.04}
          markerEnd="url(#arrow)"
        />
        <text
          x={actualWidthCm / 2}
          y={-pad * 0.15}
          textAnchor="middle"
          fontSize={Math.max(H * 0.25, 1.2)}
          fill="#e11d48"
        >
          width
        </text>
        {/* Length arrow */}
        <line
          x1={-pad * 0.45}
          y1={0}
          x2={-pad * 0.45}
          y2={actualLengthCm}
          stroke="#e11d48"
          strokeWidth={sideCm * 0.04}
        />
        <text
          x={-pad * 0.7}
          y={actualLengthCm / 2}
          textAnchor="middle"
          fontSize={Math.max(W * 0.12, 1.2)}
          fill="#e11d48"
          transform={`rotate(-90 ${-pad * 0.7} ${actualLengthCm / 2})`}
        >
          length
        </text>
      </svg>
      <figcaption className="mt-2 space-y-1 text-center text-xs text-muted-foreground">
        <p>
          Flat-top staggered columns · {columns}×{rows}
          {simplified ? ' (sample)' : ''}
        </p>
        {note ? <p>{note}</p> : null}
        <p className="flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-200 border border-emerald-600" />{' '}
            Full hexagon
          </span>
          <span>Half hexagons finish straight edges (counts in results).</span>
        </p>
      </figcaption>
    </figure>
  );
}
