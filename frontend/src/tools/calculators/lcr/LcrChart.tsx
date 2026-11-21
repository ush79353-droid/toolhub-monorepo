'use client';

import type { LcrResult } from './types';

interface LcrChartProps {
  result: LcrResult;
}

const W = 340;
const H = 160;
const PAD = { l: 48, r: 12, t: 16, b: 36 };

export function LcrChart({ result }: LcrChartProps) {
  const maxVal = Math.max(result.hqla, result.netCashOutflows, 1);
  const barW = 56;
  const baseY = H - PAD.b;
  const chartH = H - PAD.t - PAD.b;
  const hqlaH = (result.hqla / maxVal) * chartH;
  const outH = (result.netCashOutflows / maxVal) * chartH;
  const x1 = PAD.l + 40;
  const x2 = PAD.l + 140;

  // Gauge: map LCR to angle; allow >100% up to 200% for scale, then clamp visual
  const gaugeMax = 200;
  const gaugeValue = Math.min(Math.max(result.lcrPercent, 0), gaugeMax);
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
  const bench = polar(benchAngle, gr);

  return (
    <figure className="space-y-2">
      <figcaption className="text-xs font-medium text-accent">
        Liquidity coverage vs 30-day net outflows
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={`HQLA ${result.formattedHqla}, net outflows ${result.formattedOutflows}, LCR ${result.formattedLcr}. 100 percent benchmark marked on gauge.`}
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
          y={baseY - hqlaH}
          width={barW}
          height={hqlaH}
          fill="#0f766e"
          rx={4}
        />
        <rect
          x={x2}
          y={baseY - outH}
          width={barW}
          height={outH}
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
          HQLA
        </text>
        <text
          x={x2 + barW / 2}
          y={H - 12}
          textAnchor="middle"
          fontSize={9}
          className="fill-muted-foreground"
        >
          Net outflows
        </text>

        {/* Gauge */}
        <path
          d={`M ${polar(start).x} ${polar(start).y} A ${gr} ${gr} 0 0 1 ${polar(start + sweep).x} ${polar(start + sweep).y}`}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path
          d={`M ${polar(start).x} ${polar(start).y} A ${gr} ${gr} 0 0 1 ${needle.x} ${needle.y}`}
          fill="none"
          stroke="#0f766e"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <line
          x1={gx}
          y1={gy}
          x2={bench.x}
          y2={bench.y}
          stroke="#64748b"
          strokeWidth={1.5}
          strokeDasharray="3 2"
        />
        <circle cx={gx} cy={gy} r={3} fill="#0f766e" />
        <text
          x={gx}
          y={gy + 28}
          textAnchor="middle"
          fontSize={10}
          fontWeight={600}
          className="fill-accent"
        >
          {result.formattedLcr}
        </text>
        <text
          x={gx}
          y={gy + 40}
          textAnchor="middle"
          fontSize={8}
          className="fill-muted-foreground"
        >
          100% mark dashed
        </text>
      </svg>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Surplus/shortfall: {result.formattedDifference}. Gauge scale shown to
        200% for values above 100%; LCR itself is not capped.
      </p>
    </figure>
  );
}
