'use client';

import Link from 'next/link';

import type { MonthOverMonthResult } from './types';

interface MonthOverMonthResultsProps {
  result: MonthOverMonthResult | null;
}

function Row({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={`tabular-nums ${warn ? 'text-rose-700' : 'text-accent'}`}
      >
        {value}
      </dd>
    </div>
  );
}

export function MonthOverMonthResults({ result }: MonthOverMonthResultsProps) {
  if (!result) return null;
  const { mom, cmgr, qoq, yoy } = result;
  if (!mom && !cmgr && !qoq && !yoy) return null;

  return (
    <div
      className="rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Growth summary</h3>
      <dl className="mt-3 space-y-1.5 text-sm">
        {mom ? (
          <Row
            label="MoM"
            value={
              mom.formatted
                ? `${mom.formatted}%`
                : mom.status === 'indeterminate'
                  ? 'Indeterminate'
                  : 'Unavailable'
            }
            warn={mom.status !== 'valid' && mom.status !== 'negativeBaseline'}
          />
        ) : null}
        {cmgr ? (
          <Row label="CMGR" value={`${cmgr.formatted}%`} />
        ) : null}
        {qoq ? (
          <Row
            label="QoQ"
            value={
              qoq.formatted
                ? `${qoq.formatted}%`
                : qoq.status === 'indeterminate'
                  ? 'Indeterminate'
                  : 'Unavailable'
            }
            warn={qoq.status !== 'valid' && qoq.status !== 'negativeBaseline'}
          />
        ) : null}
        {yoy ? (
          <Row
            label="YoY"
            value={
              yoy.formatted
                ? `${yoy.formatted}%`
                : yoy.status === 'indeterminate'
                  ? 'Indeterminate'
                  : 'Unavailable'
            }
            warn={yoy.status !== 'valid' && yoy.status !== 'negativeBaseline'}
          />
        ) : null}
      </dl>
      <p className="mt-3 font-mono text-xs text-muted-foreground">
        MoM/QoQ/YoY = Δ ÷ previous × 100 · CMGR = (Vf/Vi)^(1/n) − 1
      </p>
      {mom?.interpretation ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {mom.interpretation}
        </p>
      ) : null}
      {cmgr?.interpretation ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {cmgr.interpretation}
        </p>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/year-over-year-growth-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Year-over-Year Growth
        </Link>
        {' · '}
        <Link
          href="/tools/cagr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          CAGR Calculator
        </Link>
        .
      </p>
    </div>
  );
}
