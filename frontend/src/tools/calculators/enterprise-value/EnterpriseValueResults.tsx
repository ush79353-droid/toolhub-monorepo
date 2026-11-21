'use client';

import Link from 'next/link';
import type { EnterpriseValueResult } from './types';

interface EnterpriseValueResultsProps {
  result: EnterpriseValueResult | null;
}

export function EnterpriseValueResults({ result }: EnterpriseValueResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Enterprise value</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Total claims and net debt breakdown.
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total claims</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalClaims}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Net debt (Debt − Cash)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedNetDebt}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-2">
          <dt className="font-medium text-accent">Enterprise value</dt>
          <dd className="text-lg font-semibold tabular-nums text-accent">
            {result.formattedEv}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        EV = MC + MI + PS + Debt − Cash
      </p>

      {result.warningMessage ? (
        <p
          className={`text-xs leading-relaxed ${
            result.enterpriseValue < 0 ? 'text-rose-800' : 'text-amber-800'
          }`}
          role="status"
        >
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/ebitda-multiple-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBITDA Multiple
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
          href="/tools/ebit-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EBIT
        </Link>
        {' · '}
        <Link
          href="/tools/economic-value-added-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          EVA
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
          href="/tools/roi-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROI
        </Link>
        .
      </p>
    </div>
  );
}
