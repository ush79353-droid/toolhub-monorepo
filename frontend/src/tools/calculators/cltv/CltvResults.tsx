'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CltvResult } from './types';

interface CltvResultsProps {
  result: CltvResult | null;
}

export function CltvResults({ result }: CltvResultsProps) {
  const [showSteps, setShowSteps] = useState(true);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">
        Customer Lifetime Value (CLTV)
      </h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedRevenueCltv}
      </p>
      <p className="text-xs text-muted-foreground">
        Average customer value{' '}
        <span className="font-medium text-accent">
          {result.formattedAcv}/year
        </span>
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average purchase value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedApv}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Purchases / customer / year</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedApf}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Average customer value</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedAcv}/year
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Customer lifespan</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedLifespan}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Revenue CLTV</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedRevenueCltv}
          </dd>
        </div>
        {result.grossProfitCLTV != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Gross margin</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.grossMarginPercent}%
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Gross profit CLTV</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedGrossProfitCltv}
              </dd>
            </div>
          </>
        ) : null}
        {result.customerAcquisitionCost != null ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">CAC</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedCac}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">CLTV:CAC ratio</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedRatio}
              </dd>
            </div>
          </>
        ) : null}
        {result.discountedCLTV != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Discounted CLTV</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedDiscounted}
            </dd>
          </div>
        ) : null}
        {result.usedBusinessData ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Reporting period</dt>
            <dd className="font-medium text-accent">
              {result.reportingPeriodLabel}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
      </button>
      {showSteps ? (
        <div className="space-y-2 rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-accent">
          <pre className="whitespace-pre-wrap font-mono text-[11px]">
            {result.formulaBreakdown}
          </pre>
          <ol className="list-decimal space-y-1 pl-4 text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/customer-acquisition-cost-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          CAC
        </Link>
        {' · '}
        <Link
          href="/tools/customer-retention-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Retention
        </Link>
        {' · '}
        <Link
          href="/tools/churn-rate-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Churn Rate
        </Link>
        {' · '}
        <Link
          href="/tools/break-even-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Break-Even
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
          href="/tools/net-profit-margin-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Net Profit Margin
        </Link>
      </p>
    </div>
  );
}
