'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { CapitalGainsTaxUkResult } from './types';

interface CapitalGainsTaxUkResultsProps {
  result: CapitalGainsTaxUkResult | null;
}

export function CapitalGainsTaxUkResults({
  result,
}: CapitalGainsTaxUkResultsProps) {
  const [showSteps, setShowSteps] = useState(false);
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Estimate summary</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        £{result.formattedCapitalGainsTax}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Tax year</dt>
          <dd className="font-medium text-accent">{result.taxYear}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Chargeable gains</dt>
          <dd className="tabular-nums font-medium text-accent">
            £{result.formattedChargeableGains}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Annual exempt amount</dt>
          <dd className="tabular-nums font-medium text-accent">
            £
            {result.annualExemptAmount.toLocaleString('en-GB', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </dd>
        </div>
        {!result.assetsInTrust ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Taxed at {(result.basicRate * 100).toFixed(0)}%
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                £
                {result.taxedAtBasic.toLocaleString('en-GB', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Taxed at {(result.higherRate * 100).toFixed(0)}%
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                £
                {result.taxedAtHigher.toLocaleString('en-GB', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </dd>
            </div>
          </>
        ) : (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Trustee rate</dt>
            <dd className="tabular-nums font-medium text-accent">
              {(result.higherRate * 100).toFixed(0)}%
            </dd>
          </div>
        )}
      </dl>

      <p className="text-xs leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>

      <button
        type="button"
        onClick={() => setShowSteps((v) => !v)}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {showSteps ? 'Hide calculation steps' : 'Show calculation steps'}
      </button>
      {showSteps ? (
        <ol className="list-decimal space-y-1 rounded-lg border border-border bg-white px-3 py-2 pl-7 text-xs leading-relaxed text-muted-foreground">
          {result.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/capital-gains-yield-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Capital Gains Yield
        </Link>
        {' · '}
        <Link
          href="/tools/tax-bracket-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Tax Bracket
        </Link>
      </p>
    </div>
  );
}
