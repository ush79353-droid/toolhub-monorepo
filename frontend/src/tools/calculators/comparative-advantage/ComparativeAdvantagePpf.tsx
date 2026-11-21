'use client';

import type { ComparativeAdvantageResult } from './types';

interface ComparativeAdvantagePpfProps {
  ppf: ComparativeAdvantageResult['ppf'];
}

const W = 340;
const H = 220;
const PAD = { l: 40, r: 14, t: 14, b: 34 };

export function ComparativeAdvantagePpf({ ppf }: ComparativeAdvantagePpfProps) {
  const aMax = Math.max(ppf.xAMax, ppf.yAMax, 1);
  const bMax = Math.max(ppf.xBMax, ppf.yBMax, 1);

  const mapX = (a: number) => PAD.l + (a / aMax) * (W - PAD.l - PAD.r);
  const mapY = (b: number) => H - PAD.b - (b / bMax) * (H - PAD.t - PAD.b);

  const xLine = `${mapX(0)},${mapY(ppf.xBMax)} ${mapX(ppf.xAMax)},${mapY(0)}`;
  const yLine = `${mapX(0)},${mapY(ppf.yBMax)} ${mapX(ppf.yAMax)},${mapY(0)}`;

  return (
    <figure className="space-y-2">
      <figcaption className="text-xs font-medium text-accent">
        Linear PPFs (labor H = {ppf.laborH})
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={`Production possibility frontiers for Country X and Country Y with labor endowment ${ppf.laborH}`}
      >
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
        <text
          x={(PAD.l + W - PAD.r) / 2}
          y={H - 8}
          textAnchor="middle"
          fontSize={10}
          className="fill-muted-foreground"
        >
          Good A
        </text>
        <text
          x={12}
          y={(PAD.t + H - PAD.b) / 2}
          textAnchor="middle"
          fontSize={10}
          className="fill-muted-foreground"
          transform={`rotate(-90 12 ${(PAD.t + H - PAD.b) / 2})`}
        >
          Good B
        </text>
        <polyline
          fill="none"
          stroke="#0d9488"
          strokeWidth={2}
          points={xLine}
        />
        <polyline
          fill="none"
          stroke="#ea580c"
          strokeWidth={2}
          points={yLine}
        />
        <text x={W - PAD.r - 4} y={PAD.t + 12} textAnchor="end" fontSize={9} fill="#0d9488">
          Country X
        </text>
        <text x={W - PAD.r - 4} y={PAD.t + 24} textAnchor="end" fontSize={9} fill="#ea580c">
          Country Y
        </text>
      </svg>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Intercepts = H × productivity. Slope magnitude equals the opportunity
        cost of Good A in units of Good B. Productivity fields are rates per
        labor unit; H converts them to total capacity for the chart.
      </p>
    </figure>
  );
}
