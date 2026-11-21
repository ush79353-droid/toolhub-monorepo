'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LcrChart } from './LcrChart';
import type { LcrResult } from './types';

interface LcrResultsProps {
  result: LcrResult | null;
}

export function LcrResults({ result }: LcrResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Liquidity Coverage Ratio
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedLcr}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">HQLA</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedHqla}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">30-day net outflows</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedOutflows}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Coverage multiple</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedMultiple}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Liquidity surplus / shortfall</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDifference}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Required HQLA at 100%</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRequired}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Additional HQLA needed</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAdditional}
          </dd>
        </div>
      </dl>

      <div className="rounded-lg border border-border bg-white px-3 py-2">
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </p>
      </div>

      <LcrChart result={result} />

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps
          ? 'Hide how your LCR is calculated'
          : 'How your liquidity coverage ratio is calculated'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <p className="font-mono">{result.formulaBreakdown}</p>
          <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/current-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Current Ratio
        </Link>
        {' · '}
        <Link
          href="/tools/cash-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cash Ratio
        </Link>
        {' · '}
        <Link
          href="/tools/working-capital-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Working Capital
        </Link>
        {' · '}
        <Link
          href="/tools/financial-leverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Financial Leverage
        </Link>
        {' · '}
        <Link
          href="/tools/debt-to-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt-to-Equity
        </Link>
        .
      </p>
    </div>
  );
}
