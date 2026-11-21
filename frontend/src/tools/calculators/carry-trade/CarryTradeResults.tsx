'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CarryTradeResult } from './types';

interface CarryTradeResultsProps {
  result: CarryTradeResult | null;
}

export function CarryTradeResults({ result }: CarryTradeResultsProps) {
  const [showDetails, setShowDetails] = useState(true);
  if (!result) return null;

  const isLoss = result.carryTradeProfit < 0;
  const isFlat = Math.abs(result.carryTradeProfit) < 1e-9;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Estimated Carry Trade Profit
      </h3>
      <p
        className={`text-2xl font-semibold tabular-nums ${
          isLoss ? 'text-rose-700' : 'text-accent'
        }`}
      >
        {result.formattedCarryTradeProfit}
      </p>
      <p className="text-sm text-muted-foreground">
        Estimated Total Return{' '}
        <span
          className={`font-semibold tabular-nums ${
            isLoss ? 'text-rose-700' : 'text-accent'
          }`}
        >
          {result.formattedTotalReturn}
        </span>
      </p>
      {isFlat ? (
        <p className="text-xs text-muted-foreground">Break-even under inputs.</p>
      ) : isLoss ? (
        <p className="text-xs text-rose-700">Displayed as an estimated loss.</p>
      ) : null}

      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showDetails ? 'Hide calculation details' : 'Show calculation details'}
      </button>

      {showDetails ? (
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Initial investment</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedAmountInvested}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Spot rate differential</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedSpotRateDifferential}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Lending-period return</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedLendingPeriodReturn}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Borrowing-period cost</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedBorrowingPeriodCost}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Net interest differential</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedNetInterestDifferential}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Investment proceeds</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedInvestmentProceeds}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Borrowing repayment</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedBorrowingRepayment}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Estimated profit</dt>
            <dd
              className={`tabular-nums font-medium ${
                isLoss ? 'text-rose-700' : 'text-accent'
              }`}
            >
              {result.formattedCarryTradeProfit}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">
              Approximate return (d + Rl − Rb)
            </dt>
            <dd className="tabular-nums font-medium text-muted-foreground">
              {result.formattedApproximateReturn}
            </dd>
          </div>
        </dl>
      ) : null}

      <p className="font-mono text-xs text-muted-foreground">
        Profit = P×[(S₀/S₁)(1+Rl) − (1+Rb)] · {result.dayCountBasis}-day basis ·
        simple interest
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        The additive approximation {result.formattedApproximateReturn} is labeled
        separately and is not generally identical to the cash-flow total return{' '}
        {result.formattedTotalReturn}.
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.explanation}
      </p>
      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.quoteConventionNote}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/interest-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Rate
        </Link>
        {' · '}
        <Link
          href="/tools/simple-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Simple Interest
        </Link>
        {' · '}
        <Link
          href="/tools/compound-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Compound Interest
        </Link>
        {' · '}
        <Link
          href="/tools/roi-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          ROI
        </Link>
        {' · '}
        <Link
          href="/tools/apr-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          APR
        </Link>
        .
      </p>
    </div>
  );
}
