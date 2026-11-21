'use client';

import type { NsfrResult } from './types';

interface NsfrChartProps {
  result: NsfrResult;
}

const W = 340;
const H = 160;
const PAD = { l: 48, r: 12, t: 16, b: 36 };

export function NsfrChart({ result }: NsfrChartProps) {
  const maxVal = Math.max(result.asf, result.rsf, 1);
  const barW = 56;
  const baseY = H - PAD.b;
  const chartH = H - PAD.t - PAD.b;
  const asfH = (result.asf / maxVal) * chartH;
  const rsfH = (result.rsf / maxVal) * chartH;
  const x1 = PAD.l + 40;
  const x2 = PAD.l + 140;

  const gaugeMax = 200;
  const gaugeValue = Math.min(Math.max(result.nsfrPercent, 0), gaugeMax);
  const start = -110;
  const sweep = 220;
  const angle = start + (gaugeValue / gaugeMax) * sweep;
  const benchAngle = start + (100 / gaugeMax) * sweep;
  const gx = 270;
  const gy = 78;
  const gr = 42;
  const polar = (a: number, r = gr) => {
    const rad = (a * Math.PI) / 180;
    return { x: gx + r * Math.cos(rad), y: gy + r * Math.sin(rad) };
  };
  const needle = polar(angle, gr - 6);

  return (
    <figure className="space-y-2">
      <figcaption className="text-xs font-medium text-accent">
        Available vs required stable funding
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={`ASF ${result.formattedAsf}, RSF ${result.formattedRsf}, NSFR ${result.formattedNsfr}. 100 percent benchmark marked on gauge.`}
      >
        <line
          x1={PAD.l}
          y1={baseY}
          x2={200}
          y2={baseY}
          className="stroke-border"
          strokeWidth={1.5}
        />
        <rect
          x={x1}
          y={baseY - asfH}
          width={barW}
          height={Math.max(asfH, 1)}
          fill="#0f766e"
          rx={4}
        />
        <rect
          x={x2}
          y={baseY - rsfH}
          width={barW}
          height={Math.max(rsfH, 1)}
          fill="#ea580c"
          rx={4}
        />
        <text
          x={x1 + barW / 2}
          y={H - 12}
          textAnchor="middle"
          fontSize={9}
          className="fill-muted-foreground"
        >
          ASF
        </text>
        <text
          x={x2 + barW / 2}
          y={H - 12}
          textAnchor="middle"
          fontSize={9}
          className="fill-muted-foreground"
        >
          RSF
        </text>

        <path
          d={`M ${polar(start).x} ${polar(start).y} A ${gr} ${gr} 0 0 1 ${polar(start + sweep).x} ${polar(start + sweep).y}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <line
          x1={gx}
          y1={gy}
          x2={polar(benchAngle, gr).x}
          y2={polar(benchAngle, gr).y}
          stroke="#64748b"
          strokeWidth={1.5}
          strokeDasharray="3 2"
        />
        <line
          x1={gx}
          y1={gy}
          x2={needle.x}
          y2={needle.y}
          stroke="#0f766e"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <circle cx={gx} cy={gy} r={3.5} fill="#0f766e" />
        <text
          x={gx}
          y={gy + 28}
          textAnchor="middle"
          fontSize={9}
          className="fill-muted-foreground"
        >
          100% mark
        </text>
      </svg>
    </figure>
  );
}
