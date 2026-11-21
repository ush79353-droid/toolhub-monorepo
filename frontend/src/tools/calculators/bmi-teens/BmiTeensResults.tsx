'use client';

import Link from 'next/link';
import type { BmiTeensResult } from './types';

interface BmiTeensResultsProps {
  result: BmiTeensResult | null;
}

export function BmiTeensResults({ result }: BmiTeensResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        BMI {result.formattedBmi}
      </p>
      <p className="text-sm text-muted-foreground">
        BMI Prime {result.formattedBmiPrime}
        {result.category ? ` · ${result.category.label}` : null}
      </p>

      <dl className="space-y-2 text-sm">
        {result.formattedPercentile != null ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">CDC percentile</dt>
            <dd className="tabular-nums font-medium text-accent">
              {result.formattedPercentile}
            </dd>
          </div>
        ) : null}
        {result.category ? (
          <>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Weight status</dt>
              <dd className="text-right font-medium text-accent">
                {result.category.label}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Percentile band</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.category.rangeLabel}
              </dd>
            </div>
          </>
        ) : null}
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.classificationSource}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/bmi-calculator-body-mass-index"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          BMI Calculator
        </Link>
        {' · '}
        <Link
          href="/tools/bmi-percentile-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          BMI Percentile
        </Link>
        {' · '}
        <Link
          href="/tools/bmi-calculator-for-kids"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          BMI for Kids
        </Link>
      </p>
    </div>
  );
}
