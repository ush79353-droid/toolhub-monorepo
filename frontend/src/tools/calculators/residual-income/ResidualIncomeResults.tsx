'use client';

import Link from 'next/link';
import type { ResidualIncomeResult } from './types';

interface ResidualIncomeResultsProps {
  result: ResidualIncomeResult | null;
}

export function ResidualIncomeResults({ result }: ResidualIncomeResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Equity charge</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedEquityCharge}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Residual income</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedResidualIncome}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        RI = NI − (EC × r%) · Charge = EC × (r% ÷ 100)
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.warningMessage}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/net-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Income
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
          href="/tools/enterprise-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Enterprise Value
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
          href="/tools/fcfe-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          FCFE
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
          href="/tools/retained-earnings-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Retained Earnings
        </Link>
        {' · '}
        <Link
          href="/tools/dupont-analysis-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          DuPont
        </Link>
        .
      </p>
    </div>
  );
}
