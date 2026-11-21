'use client';

import Link from 'next/link';
import type { PivotPointResult } from './types';
import { PIVOT_METHOD_LABELS } from './types';

interface PivotPointResultsProps {
  result: PivotPointResult | null;
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="tabular-nums font-medium text-accent">{value}</dd>
    </div>
  );
}

export function PivotPointResults({ result }: PivotPointResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Summary · {PIVOT_METHOD_LABELS[result.method]}
      </h3>
      <dl className="space-y-2 text-sm">
        <Row label="Resistance 4" value={result.formattedR4} />
        <Row label="Resistance 3" value={result.formattedR3} />
        <Row label="Resistance 2" value={result.formattedR2} />
        <Row label="Resistance 1" value={result.formattedR1} />
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Pivot point</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedPivot ?? '—'}
          </dd>
        </div>
        <Row label="Support 1" value={result.formattedS1} />
        <Row label="Support 2" value={result.formattedS2} />
        <Row label="Support 3" value={result.formattedS3} />
        <Row label="Support 4" value={result.formattedS4} />
      </dl>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/fibonacci-retracement-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fibonacci Retracement
        </Link>
        {' · '}
        <Link
          href="/tools/moving-average-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Moving Average
        </Link>
        {' · '}
        <Link
          href="/tools/stock-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Stock
        </Link>
        {' · '}
        <Link
          href="/tools/percentage-return-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Percentage Return
        </Link>
        {' · '}
        <Link
          href="/tools/market-capitalization-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Market Cap
        </Link>
        .
      </p>
    </div>
  );
}
