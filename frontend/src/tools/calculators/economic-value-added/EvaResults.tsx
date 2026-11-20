'use client';

import Link from 'next/link';
import type { EvaResult } from './types';

interface EvaResultsProps {
  result: EvaResult | null;
}

export function EvaResults({ result }: EvaResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">EVA results</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Capital charge and economic value added.
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">WACC</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedWacc}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Capital charge</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCapitalCharge}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-2">
          <dt className="font-medium text-accent">Economic value added</dt>
          <dd className="text-lg font-semibold tabular-nums text-accent">
            {result.formattedEva}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        EVA = NOPAT − (Invested capital × WACC)
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-amber-800" role="status">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/roi-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROI
        </Link>
        {' · '}
        <Link
          href="/tools/ebit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBIT
        </Link>
        {' · '}
        <Link
          href="/tools/ebitda-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA
        </Link>
        {' · '}
        <Link
          href="/tools/ebitda-multiple-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA Multiple
        </Link>
        {' · '}
        <Link
          href="/tools/net-operating-assets-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Operating Assets
        </Link>
        {' · '}
        <Link
          href="/tools/net-operating-working-capital-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          NOWC
        </Link>
        {' · '}
        <Link
          href="/tools/dupont-analysis-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DuPont Analysis
        </Link>
        {' · '}
        <Link
          href="/tools/working-capital-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Working Capital
        </Link>
        .
      </p>
    </div>
  );
}
