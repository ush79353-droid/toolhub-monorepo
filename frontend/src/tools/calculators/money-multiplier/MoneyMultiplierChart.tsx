'use client';

import type { MoneyMultiplierResult } from './types';

interface MoneyMultiplierChartProps {
  result: MoneyMultiplierResult;
}

const W = 340;
const H = 200;
const PAD = { l: 40, r: 12, t: 14, b: 40 };

export function MoneyMultiplierChart({ result }: MoneyMultiplierChartProps) {
  const maxBar = Math.max(result.moneySupply, result.monetaryBase, 1);
  const chartH = H - PAD.t - PAD.b;
  const baseY = H - PAD.b;
  const barW = 48;
  const xSupply = PAD.l + 30;
  const xBase = PAD.l + 120;
  const supplyH = (result.moneySupply / maxBar) * chartH;
  const baseH = (result.monetaryBase / maxBar) * chartH;

  // Base doughnut: currency vs reserves
  const baseTotal = result.monetaryBase || 1;
  const currShare = result.currencyInCirculation / baseTotal;
  const R = 36;
  const CX = 270;
  const CY = 78;
  const toXY = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
  };
  const arc = (start: number, end: number) => {
    const s = toXY(start);
    const e = toXY(end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const a1 = Math.max(currShare * 360, 0.01);

  return (
    <figure className="space-y-2">
      <figcaption className="text-xs font-medium text-accent">
        Money supply vs monetary base · base composition
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={`Money supply ${result.formattedSupply}, monetary base ${result.formattedBase}. Base includes currency ${result.formattedCurrency} and reserves ${result.formattedReserves}.`}
      >
        <line
          x1={PAD.l}
          y1={baseY}
          x2={PAD.l + 180}
          y2={baseY}
          className="stroke-border"
          strokeWidth={1.5}
        />
        <rect
          x={xSupply}
          y={baseY - supplyH}
          width={barW}
          height={supplyH}
          fill="#0f766e"
          rx={4}
        />
        <rect
          x={xBase}
          y={baseY - baseH}
          width={barW}
          height={baseH}
          fill="#ea580c"
          rx={4}
        />
        <text
          x={xSupply + barW / 2}
          y={H - 14}
          textAnchor="middle"
          fontSize={9}
          className="fill-muted-foreground"
        >
          Money supply
        </text>
        <text
          x={xBase + barW / 2}
          y={H - 14}
          textAnchor="middle"
          fontSize={9}
          className="fill-muted-foreground"
        >
          Monetary base
        </text>

        {result.monetaryBase > 0 ? (
          <>
            <path
              d={arc(0, a1)}
              fill="none"
              stroke="#2563eb"
              strokeWidth={14}
            />
            <path
              d={arc(a1, 360)}
              fill="none"
              stroke="#0d9488"
              strokeWidth={14}
            />
          </>
        ) : null}
        <text
          x={CX}
          y={CY + 4}
          textAnchor="middle"
          fontSize={10}
          fontWeight={600}
          className="fill-accent"
        >
          {result.formattedMultiplier}
        </text>
        <text
          x={CX}
          y={CY + 52}
          textAnchor="middle"
          fontSize={8}
          className="fill-muted-foreground"
        >
          Base: currency / reserves
        </text>
      </svg>
    </figure>
  );
}
