'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { WaccResult } from './types';

interface WaccResultsProps {
  result: WaccResult | null;
}

export function WaccResults({ result }: WaccResultsProps) {
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [showFormula, setShowFormula] = useState(false);
  if (!result) return null;

  const equityPct = Math.round(result.equityWeight * 1000) / 10;
  const debtPct = Math.round(result.debtWeight * 1000) / 10;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Weighted average cost of capital
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedWacc}
      </p>

      <div className="space-y-1.5">
        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="bg-primary"
            style={{ width: `${equityPct}%` }}
            title={`Equity ${result.formattedEquityWeight}`}
          />
          <div
            className="bg-accent/40"
            style={{ width: `${debtPct}%` }}
            title={`Debt ${result.formattedDebtWeight}`}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Capital mix · Equity {result.formattedEquityWeight} · Debt{' '}
          {result.formattedDebtWeight}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowBreakdown((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showBreakdown ? 'Hide breakdown' : 'Show breakdown'}
      </button>

      {showBreakdown ? (
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Total capital</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedTotalCapital}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Equity weight</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedEquityWeight}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Debt weight</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedDebtWeight}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">After-tax cost of debt</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedAfterTaxCostOfDebt}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Equity contribution</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedEquityContribution}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Debt contribution</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedDebtContribution}
            </dd>
          </div>
        </dl>
      ) : null}

      <p className="font-mono text-xs text-muted-foreground">
        WACC = We×Re + Wd×Rd×(1−T)
      </p>

      <button
        type="button"
        onClick={() => setShowFormula((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showFormula ? 'Hide formula' : 'Show formula'}
      </button>
      {showFormula ? (
        <p className="rounded-lg border border-border bg-white px-3 py-2 font-mono text-xs leading-relaxed text-accent">
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
          href="/tools/cost-of-equity-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Cost of Equity
        </Link>
        {' · '}
        <Link
          href="/tools/after-tax-cost-of-debt-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          After-Tax Cost of Debt
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
          href="/tools/unlevered-beta-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Unlevered Beta
        </Link>
        {' · '}
        <Link
          href="/tools/npv-calculator-net-present-value"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          NPV
        </Link>
        .
      </p>
    </div>
  );
}
