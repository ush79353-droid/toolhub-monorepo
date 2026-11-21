'use client';

import Link from 'next/link';
import type { DupontResult } from './types';

interface DupontAnalysisResultsProps {
  result: DupontResult | null;
}

export function DupontAnalysisResults({ result }: DupontAnalysisResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        DuPont analysis results
      </h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Three-factor decomposition of return on equity.
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Net profit margin</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedNpm}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total asset turnover</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTat}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Financial leverage</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedFl}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-2">
          <dt className="font-medium text-accent">Return on equity (ROE)</dt>
          <dd className="text-lg font-semibold tabular-nums text-accent">
            {result.formattedRoe}
          </dd>
        </div>
      </dl>

      <p className="rounded-lg border border-border bg-white px-3 py-2 font-mono text-xs text-accent">
        {result.formattedNpm} × {result.formattedTat} × {result.formattedFl} ={' '}
        {result.formattedRoe}
      </p>

      <p className="font-mono text-xs text-muted-foreground">
        ROE = (NI/Sales) × (Sales/Assets) × (Assets/Equity)
      </p>

      {result.warningMessage ? (
        <p
          className={`text-xs leading-relaxed ${
            result.negativeEquity ? 'text-rose-800' : 'text-amber-800'
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
          href="/tools/total-asset-turnover-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Total Asset Turnover
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
          href="/tools/fixed-asset-turnover-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Fixed Asset Turnover
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
          href="/tools/current-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Current Ratio
        </Link>
        .
      </p>
    </div>
  );
}
