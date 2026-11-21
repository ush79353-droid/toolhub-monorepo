'use client';

import Link from 'next/link';
import type { RelativeStrengthIndexResult } from './types';

interface RelativeStrengthIndexResultsProps {
  result: RelativeStrengthIndexResult | null;
}

/** Minimal SVG RSI series — no chart library dependency. */
function RsiSparkline({
  series,
}: {
  series: RelativeStrengthIndexResult['series'];
}) {
  if (series.length < 2) return null;
  const w = 320;
  const h = 120;
  const pad = 8;
  const x = (i: number) =>
    pad + (i / (series.length - 1)) * (w - pad * 2);
  const y = (rsi: number) => pad + ((100 - rsi) / 100) * (h - pad * 2);
  const path = series
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.rsi).toFixed(1)}`)
    .join(' ');
  const ref = (level: number) =>
    `M${pad},${y(level).toFixed(1)} L${w - pad},${y(level).toFixed(1)}`;

  return (
    <figure className="space-y-2">
      <figcaption className="text-xs font-medium text-accent">
        RSI history
      </figcaption>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="h-auto w-full max-w-md rounded-lg border border-border bg-white"
        role="img"
        aria-label={`RSI series from ${series[0]!.rsi.toFixed(1)} to ${series[series.length - 1]!.rsi.toFixed(1)}`}
      >
        <path d={ref(70)} stroke="#fda4af" strokeWidth="1" fill="none" />
        <path d={ref(50)} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 3" fill="none" />
        <path d={ref(30)} stroke="#86efac" strokeWidth="1" fill="none" />
        <path d={path} stroke="#0f766e" strokeWidth="2" fill="none" />
      </svg>
      <p className="text-[11px] text-muted-foreground">
        Guides at 30 (oversold), 50 (neutral), and 70 (overbought).
      </p>
    </figure>
  );
}

export function RelativeStrengthIndexResults({
  result,
}: RelativeStrengthIndexResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Prices / changes</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.priceCount} / {result.changeCount}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average gain</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAvgGain ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average loss</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAvgLoss ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Relative strength</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRs ?? '—'}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">RSI</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedRsi ??
              (result.status === 'insufficient-data'
                ? 'Insufficient data'
                : '—')}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        RSI = 100 − 100/(1+RS) · RS = AvgGain/AvgLoss
      </p>

      {result.interpretation ? (
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
      ) : null}

      {result.insufficientMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.insufficientMessage}
        </p>
      ) : null}

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.warningMessage}
        </p>
      ) : null}

      {result.series.length >= 2 ? (
        <RsiSparkline series={result.series} />
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/pivot-point-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Pivot Point
        </Link>
        {' · '}
        <Link
          href="/tools/fibonacci-retracement-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fibonacci Retracement
        </Link>
        {' · '}
        <Link
          href="/tools/portfolio-beta-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Portfolio Beta
        </Link>
        {' · '}
        <Link
          href="/tools/price-to-earnings-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          P/E
        </Link>
        {' · '}
        <Link
          href="/tools/peg-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          PEG
        </Link>
        {' · '}
        <Link
          href="/tools/stock-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Stock
        </Link>
        .
      </p>
    </div>
  );
}
