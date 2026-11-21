'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BuyingPowerResult } from './types';
import {
  US_CPI_MAX_YEAR,
  US_CPI_MIN_YEAR,
  US_CPI_RETRIEVED_AT,
  US_CPI_SERIES_ID,
  US_CPI_SOURCE_NAME,
  US_CPI_SOURCE_URL,
} from './us-cpi-u-annual';

interface BuyingPowerResultsProps {
  result: BuyingPowerResult | null;
}

export function BuyingPowerResults({ result }: BuyingPowerResultsProps) {
  const [showDetails, setShowDetails] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Dollar Value</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedAdjustedAmount}
      </p>

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
            <dt className="text-muted-foreground">Original Amount</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedOriginalAmount}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Reference Year</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.referenceYear}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Target Year</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.targetYear}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Reference CPI</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedReferenceCPI}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Target CPI</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedTargetCPI}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">CPI Ratio</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedCpiRatio}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Adjusted Value</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedAdjustedAmount}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Cumulative Inflation</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedInflationChange}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Purchasing Power Change</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedPurchasingPowerChange}
            </dd>
          </div>
        </dl>
      ) : null}

      <p className="font-mono text-xs text-muted-foreground">
        Adjusted = Amount × (CPI<sub>target</sub> / CPI<sub>reference</sub>)
      </p>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.explanation}
      </p>
      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Data: {US_CPI_SOURCE_NAME} · series {US_CPI_SERIES_ID} (CPI-U annual
        average, 1982-84=100) · years {US_CPI_MIN_YEAR}–{US_CPI_MAX_YEAR} ·
        retrieved {US_CPI_RETRIEVED_AT}.{' '}
        <a
          href={US_CPI_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          BLS CPI
        </a>
        . Values are final published annual averages in this dataset — not
        partial year-to-date indexes.
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/salary-inflation-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Salary Inflation
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
          href="/tools/annual-income-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Annual Income
        </Link>
        {' · '}
        <Link
          href="/tools/savings-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Savings
        </Link>
        .
      </p>
    </div>
  );
}
