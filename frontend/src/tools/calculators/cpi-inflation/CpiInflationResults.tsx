'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CpiInflationResult } from './types';
import {
  US_CPI_MAX_YEAR,
  US_CPI_MIN_YEAR,
  US_CPI_RETRIEVED_AT,
  US_CPI_SERIES_ID,
  US_CPI_SOURCE_NAME,
  US_CPI_SOURCE_URL,
} from '../buying-power/us-cpi-u-annual';

interface CpiInflationResultsProps {
  result: CpiInflationResult | null;
}

export function CpiInflationResults({ result }: CpiInflationResultsProps) {
  const [showDetails, setShowDetails] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Inflation-Adjusted Value
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedEquivalentValue}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Cumulative inflation</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedCumulativeInflation}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average annual inflation</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAverageAnnualInflation}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Purchasing power change</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedPurchasingPowerChange}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showDetails ? 'Hide CPI details' : 'Show CPI details'}
      </button>
      {showDetails ? (
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Base CPI</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedBaseCPI}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Target CPI</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedTargetCPI}
            </dd>
          </div>
        </dl>
      ) : null}

      <p className="font-mono text-xs text-muted-foreground">
        A<sub>target</sub> = A × (CPI<sub>target</sub> / CPI<sub>base</sub>) ·
        compound annualized rate
      </p>
      <p className="text-xs leading-relaxed text-foreground/90">
        {result.explanation}
      </p>
      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Purchasing-power % is not the simple negative of cumulative inflation.
        Average annual rate is a compound CAGR (not arithmetic average).
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.sourceSummary.includes('Custom') ? (
          result.sourceSummary
        ) : (
          <>
            Data: {US_CPI_SOURCE_NAME} · {US_CPI_SERIES_ID} · years{' '}
            {US_CPI_MIN_YEAR}–{US_CPI_MAX_YEAR} · retrieved {US_CPI_RETRIEVED_AT}.{' '}
            <a
              href={US_CPI_SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              BLS CPI
            </a>
            .
          </>
        )}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/buying-power-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Buying Power
        </Link>
        {' · '}
        <Link
          href="/tools/present-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Present Value
        </Link>
        {' · '}
        <Link
          href="/tools/future-value-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Future Value
        </Link>
        {' · '}
        <Link
          href="/tools/compound-interest-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Compound Interest
        </Link>
        .
      </p>
    </div>
  );
}
