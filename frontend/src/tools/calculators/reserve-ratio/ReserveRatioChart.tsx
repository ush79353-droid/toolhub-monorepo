'use client';

import type { ReserveRatioResult } from './types';

interface ReserveRatioChartProps {
  result: ReserveRatioResult;
}

const W = 360;
const H = 160;
const BAR_Y = 48;
const BAR_H = 36;
const BAR_X = 24;
const BAR_W = 312;

export function ReserveRatioChart({ result }: ReserveRatioChartProps) {
  if (
    result.chartReservesShare == null ||
    result.depositsBase <= 0 ||
    !result.unreservedApplicable
  ) {
    return (
      <p className="mt-2 text-[11px] text-muted-foreground">
        Composition chart available when reserves do not exceed deposits.
      </p>
    );
  }

  const rShare = Math.max(0, Math.min(100, result.chartReservesShare));
  const remShare = 100 - rShare;
  const rW = (rShare / 100) * BAR_W;
  const remW = BAR_W - rW;
  const alt = `Simplified illustration: reserves ${rShare.toFixed(1)} percent of deposits; remaining ${remShare.toFixed(1)} percent not held as reserves. The remainder is not unrestricted lending capacity.`;

  return (
    <figure className="mt-3">
      <figcaption className="mb-1 text-xs font-medium text-accent">
        Deposits and Reserves — Simplified Illustration
      </figcaption>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-xl border border-border bg-white"
        role="img"
        aria-label={alt}
      >
        <rect
          x={BAR_X}
          y={BAR_Y}
          width={rW}
          height={BAR_H}
          className="fill-primary/80"
          rx={3}
        />
        <rect
          x={BAR_X + rW}
          y={BAR_Y}
          width={Math.max(remW, 0)}
          height={BAR_H}
          className="fill-teal-600/40"
          rx={3}
        />
        <text
          x={BAR_X + Math.max(rW / 2, 8)}
          y={BAR_Y + 22}
          textAnchor="middle"
          className="fill-white"
          fontSize={11}
        >
          {rShare >= 8 ? `Reserves ${rShare.toFixed(0)}%` : ''}
        </text>
        <text
          x={BAR_X + rW + Math.max(remW / 2, 8)}
          y={BAR_Y + 22}
          textAnchor="middle"
          className="fill-accent"
          fontSize={11}
        >
          {remShare >= 12 ? `Other ${remShare.toFixed(0)}%` : ''}
        </text>
        <text
          x={BAR_X}
          y={BAR_Y + BAR_H + 28}
          className="fill-muted-foreground"
          fontSize={10}
        >
          Remaining share is not labeled as unrestricted lending capacity.
        </text>
      </svg>
    </figure>
  );
}
