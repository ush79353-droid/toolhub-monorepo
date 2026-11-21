'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { UnleveredBetaResult } from './types';

interface UnleveredBetaResultsProps {
  result: UnleveredBetaResult | null;
}

export function UnleveredBetaResults({ result }: UnleveredBetaResultsProps) {
  const [showCalc, setShowCalc] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Corporate tax rate</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTaxRate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Debt-to-equity</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDebtToEquity}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Levered beta</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedLeveredBeta}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Unlevered beta</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedUnleveredBeta}
          </dd>
        </div>
      </dl>

      <p className="font-mono text-xs text-muted-foreground">
        βU = βL / [1 + (1 − T) × (D/E)]
      </p>

      <button
        type="button"
        onClick={() => setShowCalc((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showCalc ? 'Hide calculation' : 'Show calculation'}
      </button>
      {showCalc ? (
        <p className="rounded-lg border border-border bg-white px-3 py-2 font-mono text-xs text-accent">
          {result.formulaBreakdown}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.explanation}
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>

      {result.warningMessage ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.warningMessage}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/portfolio-beta-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Portfolio Beta
        </Link>
        {' · '}
        <Link
          href="/tools/capm-calculator-capital-asset-pricing-model"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          CAPM
        </Link>
        {' · '}
        <Link
          href="/tools/debt-to-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Debt-to-Equity
        </Link>
        {' · '}
        <Link
          href="/tools/cost-of-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cost of Equity
        </Link>
        {' · '}
        <Link
          href="/tools/financial-leverage-ratio-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Financial Leverage
        </Link>
        .
      </p>
    </div>
  );
}
