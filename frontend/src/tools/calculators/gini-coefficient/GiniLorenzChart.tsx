'use client';

import type { GiniResult } from './types';

interface GiniLorenzChartProps {
  lorenz: GiniResult['lorenz'];
}

const W = 340;
const H = 240;
const PAD = { l: 44, r: 14, t: 16, b: 40 };

export function GiniLorenzChart({ lorenz }: GiniLorenzChartProps) {
  const mapX = (p: number) => PAD.l + p * (W - PAD.l - PAD.r);
  const mapY = (y: number) => H - PAD.b - y * (H - PAD.t - PAD.b);

  const equality = `${mapX(0)},${mapY(0)} ${mapX(1)},${mapY(1)}`;
  const curve = lorenz.points
    .map((pt, i) =>
      `${i === 0 ? 'M' : 'L'} ${mapX(pt.populationShare)} ${mapY(pt.incomeShare)}`
    )
    .join(' ');

  const areaUnder = [
    `M ${mapX(0)} ${mapY(0)}`,
    ...lorenz.points.map(
      (pt) => `L ${mapX(pt.populationShare)} ${mapY(pt.incomeShare)}`
    ),
    `L ${mapX(1)} ${mapY(0)}`,
    'Z',
  ].join(' ');

  const areaBetween = [
    `M ${mapX(0)} ${mapY(0)}`,
    `L ${mapX(1)} ${mapY(1)}`,
    ...[...lorenz.points].reverse().map(
      (pt) => `L ${mapX(pt.populationShare)} ${mapY(pt.incomeShare)}`
    ),
    'Z',
  ].join(' ');

  return (
    <figure className="space-y-2">
      <figcaption className="text-xs font-medium text-accent">
        Lorenz curve —{' '}
        {lorenz.kind === 'from-data'
          ? 'from entered incomes'
          : 'modeled illustration'}
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={
          lorenz.kind === 'from-data'
            ? 'Lorenz curve constructed from entered income observations with line of perfect equality'
            : 'Illustrative Lorenz curve diagram with line of perfect equality and shaded areas A and B. Not a unique reconstruction from Area A and Area B alone.'
        }
      >
        <path d={areaUnder} fill="#fdba74" fillOpacity={0.35} />
        <path d={areaBetween} fill="#5eead4" fillOpacity={0.4} />
        <line
          x1={PAD.l}
          y1={H - PAD.b}
          x2={W - PAD.r}
          y2={H - PAD.b}
          className="stroke-border"
          strokeWidth={1.5}
        />
        <line
          x1={PAD.l}
          y1={PAD.t}
          x2={PAD.l}
          y2={H - PAD.b}
          className="stroke-border"
          strokeWidth={1.5}
        />
        <polyline
          fill="none"
          stroke="#0f766e"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          points={equality}
        />
        <path d={curve} fill="none" stroke="#ea580c" strokeWidth={2} />
        <text
          x={(PAD.l + W - PAD.r) / 2}
          y={H - 10}
          textAnchor="middle"
          fontSize={9}
          className="fill-muted-foreground"
        >
          Cumulative share of population
        </text>
        <text
          x={12}
          y={(PAD.t + H - PAD.b) / 2}
          textAnchor="middle"
          fontSize={9}
          className="fill-muted-foreground"
          transform={`rotate(-90 12 ${(PAD.t + H - PAD.b) / 2})`}
        >
          Cumulative share of income
        </text>
        <text x={W - PAD.r - 4} y={PAD.t + 12} textAnchor="end" fontSize={9} fill="#0f766e">
          Equality line
        </text>
        <text x={W - PAD.r - 4} y={PAD.t + 24} textAnchor="end" fontSize={9} fill="#ea580c">
          Lorenz curve
        </text>
        <text x={PAD.l + 8} y={PAD.t + 14} fontSize={9} fill="#0d9488">
          Area A
        </text>
        <text x={PAD.l + 8} y={H - PAD.b - 10} fontSize={9} fill="#c2410c">
          Area B
        </text>
      </svg>
      <p className="text-xs leading-relaxed text-muted-foreground">{lorenz.note}</p>
    </figure>
  );
}
