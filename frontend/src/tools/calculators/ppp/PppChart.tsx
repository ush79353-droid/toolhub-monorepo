'use client';

import type { PppResult } from './types';

interface Props {
  result: PppResult;
}

const W = 360;
const H = 180;
const PAD = { l: 48, r: 16, t: 20, b: 36 };

export function PppChart({ result }: Props) {
  const ppp = result.chartPpp;
  const market = result.chartMarket;
  if (!Number.isFinite(ppp) || ppp < 0) return null;

  const max = Math.max(ppp, market ?? 0, 1);
  const barW = 56;
  const gap = 80;
  const baseY = H - PAD.b;
  const scale = (H - PAD.t - PAD.b) / max;
  const x0 = PAD.l + 40;
  const x1 = x0 + gap;

  return (
    <figure className="space-y-1">
      <figcaption className="text-xs font-medium text-accent">
        Market vs PPP-adjusted salary ({result.targetCurrency},{' '}
        {result.period})
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={`Bar comparison of market-converted and PPP-adjusted salaries in ${result.targetCurrency}.`}
      >
        <line
          x1={PAD.l}
          y1={baseY}
          x2={W - PAD.r}
          y2={baseY}
          className="stroke-border"
          strokeWidth={1}
        />
        {market != null ? (
          <>
            <rect
              x={x0}
              y={baseY - market * scale}
              width={barW}
              height={market * scale}
              className="fill-muted-foreground/70"
              rx={4}
            />
            <text
              x={x0 + barW / 2}
              y={H - 12}
              textAnchor="middle"
              fontSize={10}
              className="fill-muted-foreground"
            >
              Market
            </text>
          </>
        ) : null}
        <rect
          x={market != null ? x1 : x0}
          y={baseY - ppp * scale}
          width={barW}
          height={ppp * scale}
          className="fill-primary"
          rx={4}
        />
        <text
          x={(market != null ? x1 : x0) + barW / 2}
          y={H - 12}
          textAnchor="middle"
          fontSize={10}
          className="fill-muted-foreground"
        >
          PPP
        </text>
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Both bars use {result.targetCurrency} for the selected period. Not a
        tradable FX quote.
      </p>
    </figure>
  );
}
