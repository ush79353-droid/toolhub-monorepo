'use client';

import type { TrafficDensityResult } from './types';
import { fmt } from './calculation';

interface TrafficDensityDiagramProps {
  result: TrafficDensityResult;
}

/** Simple schematic — not a traffic microsimulation. */
export function TrafficDensityDiagram({ result }: TrafficDensityDiagramProps) {
  const k = result.trafficDensityVehiclesPerKm;
  const spacing = result.spacingMeters;
  const count =
    k != null && k > 0
      ? Math.min(8, Math.max(2, Math.round(Math.min(k / 2, 8))))
      : 2;

  const width = 360;
  const height = 88;
  const roadY = 44;
  const usable = 280;
  const startX = 40;

  const positions: number[] = [];
  for (let i = 0; i < count; i++) {
    positions.push(startX + (i / Math.max(1, count - 1)) * usable);
  }

  return (
    <div
      className="space-y-1"
      role="img"
      aria-label={`Schematic road with about ${count} vehicles. Flow ${result.flowDisplay ?? 'n/a'}, density ${result.densityDisplay ?? 'n/a'}.`}
    >
      <h4 className="text-sm font-semibold text-accent">Road schematic</h4>
      <p className="text-[11px] text-muted-foreground">
        Illustrative spacing only — not a live traffic simulation.
        {spacing != null ? ` Avg spacing ≈ ${fmt(spacing, 1)} m.` : ''}
      </p>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <rect
          x={20}
          y={28}
          width={320}
          height={32}
          rx={4}
          fill="#e8f0f2"
          stroke="#163c43"
          strokeWidth={1}
        />
        <line
          x1={20}
          y1={roadY}
          x2={340}
          y2={roadY}
          stroke="#5b8a94"
          strokeWidth={1}
          strokeDasharray="6 4"
        />
        {/* Observation point */}
        <line
          x1={startX}
          y1={18}
          x2={startX}
          y2={70}
          stroke="#e11d48"
          strokeWidth={1.5}
        />
        <text x={startX} y={14} textAnchor="middle" style={{ fontSize: 9 }} fill="#e11d48">
          obs.
        </text>
        {positions.map((x, i) => (
          <g key={i}>
            <rect
              x={x - 10}
              y={roadY - 7}
              width={20}
              height={12}
              rx={2}
              fill="#163c43"
            />
          </g>
        ))}
        <path
          d="M310 44 L330 44 M322 38 L330 44 L322 50"
          stroke="#163c43"
          strokeWidth={1.5}
          fill="none"
        />
      </svg>
    </div>
  );
}
