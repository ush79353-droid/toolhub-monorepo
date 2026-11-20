'use client';

import Link from 'next/link';
import { formatBeta } from './calculation';
import type { PortfolioBetaResult } from './types';

interface PortfolioBetaResultsProps {
  result: PortfolioBetaResult | null;
}

export function PortfolioBetaResults({ result }: PortfolioBetaResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Portfolio beta results
      </h3>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total portfolio weight</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalWeight}
          </dd>
        </div>
      </dl>

      {result.contributions.length > 0 ? (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Weighted beta contributions
          </h4>
          <dl className="space-y-1.5 text-sm">
            {result.contributions.map((c) => (
              <div key={c.id} className="flex justify-between gap-2">
                <dt className="text-muted-foreground">{c.label}</dt>
                <dd className="tabular-nums font-medium text-accent">
                  {formatBeta(c.weightedBeta)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      <div className="rounded-lg border border-border bg-white px-3 py-3">
        <p className="text-xs font-medium text-muted-foreground">
          Portfolio beta
        </p>
        <p className="mt-1 text-2xl font-semibold tabular-nums text-accent">
          {result.formattedPortfolioBeta ?? '—'}
        </p>
      </div>

      {result.interpretation ? (
        <p className="text-xs leading-relaxed text-foreground/90">
          {result.interpretation}
        </p>
      ) : null}

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="font-mono text-xs text-muted-foreground">
        βp = Σ (wi/100 × βi)
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/capm-calculator-capital-asset-pricing-model"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          CAPM
        </Link>
        {' · '}
        <Link
          href="/tools/sharpe-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Sharpe Ratio
        </Link>
        {' · '}
        <Link
          href="/tools/expected-return-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Expected Return
        </Link>
        {' · '}
        <Link
          href="/tools/peg-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          PEG Ratio
        </Link>
        {' · '}
        <Link
          href="/tools/market-capitalization-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Market Cap
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
