'use client';

import Link from 'next/link';
import type { EbitdaMultipleResult } from './types';

interface EbitdaMultipleResultsProps {
  result: EbitdaMultipleResult | null;
}

export function EbitdaMultipleResults({ result }: EbitdaMultipleResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Valuation results</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Enterprise value and EV/EBITDA multiple.
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Enterprise value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedEv}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-2">
          <dt className="font-medium text-accent">EBITDA multiple</dt>
          <dd className="text-lg font-semibold tabular-nums text-accent">
            {result.formattedMultiple ?? 'Undefined'}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        EV = MC + Debt + MI + PE − Cash · Multiple = EV ÷ EBITDA
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
          href="/tools/ebitda-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA
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
          href="/tools/net-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Income
        </Link>
        {' · '}
        <Link
          href="/tools/earnings-per-share-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EPS
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
          href="/tools/financial-leverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Financial Leverage
        </Link>
        {' · '}
        <Link
          href="/tools/ffo-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          FFO
        </Link>
        .
      </p>
    </div>
  );
}
