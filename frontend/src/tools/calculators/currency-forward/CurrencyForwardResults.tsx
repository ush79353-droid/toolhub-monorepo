'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CurrencyForwardResult } from './types';

interface CurrencyForwardResultsProps {
  result: CurrencyForwardResult | null;
}

export function CurrencyForwardResults({
  result,
}: CurrencyForwardResultsProps) {
  const [showDetails, setShowDetails] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Currency Forward Price
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedForwardRate}
      </p>
      <p className="text-xs text-muted-foreground">
        Spot {result.formattedSpotRate} · {result.compounding} · Actual/
        {result.dayCountBasis}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Forward points (F − S)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedForwardPoints}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Forward premium / discount</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedForwardPremium}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Simple annualized premium
          </dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAnnualizedPremium}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Year fraction T</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedYearFraction}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showDetails ? 'Hide calculation breakdown' : 'Show calculation breakdown'}
      </button>
      {showDetails ? (
        <p className="rounded-lg border border-border bg-white px-3 py-2 font-mono text-xs leading-relaxed text-accent">
          {result.formulaBreakdown}
        </p>
      ) : null}

      {(result.formattedQuoteAtForward ||
        result.formattedSettlementPayoff) && (
        <dl className="space-y-2 border-t border-border pt-3 text-sm">
          {result.formattedQuoteAtForward ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Quote amount at F</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedQuoteAtForward}
              </dd>
            </div>
          ) : null}
          {result.formattedQuoteAtSpot ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Quote amount at spot</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedQuoteAtSpot}
              </dd>
            </div>
          ) : null}
          {result.formattedQuoteDifference ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Difference (F − S)×N</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedQuoteDifference}
              </dd>
            </div>
          ) : null}
          {result.formattedSettlementPayoff ? (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Settlement payoff (quote)</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedSettlementPayoff}
              </dd>
            </div>
          ) : null}
        </dl>
      )}

      <p className="font-mono text-xs text-muted-foreground">
        F = S × (Aq / Ab) · CIP
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
          href="/tools/carry-trade-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Carry Trade
        </Link>
        {' · '}
        <Link
          href="/tools/interest-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Interest Rate
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
          href="/tools/cpi-inflation-calculator-consumer-price-index"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          CPI Inflation
        </Link>
        {' · '}
        <Link
          href="/tools/buying-power-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Buying Power
        </Link>
        .
      </p>
    </div>
  );
}
