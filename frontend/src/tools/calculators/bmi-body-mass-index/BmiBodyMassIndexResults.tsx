'use client';

import Link from 'next/link';
import type { BmiBodyMassIndexResult } from './types';

interface BmiBodyMassIndexResultsProps {
  result: BmiBodyMassIndexResult | null;
}

export function BmiBodyMassIndexResults({
  result,
}: BmiBodyMassIndexResultsProps) {
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
        BMI Prime {result.formattedBmiPrime} · {result.category.label}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Category (WHO adult)</dt>
          <dd className="text-right font-medium text-accent">
            {result.category.label}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">BMI range</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.category.rangeLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Healthy weight</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedHealthyWeightRange}
          </dd>
        </div>
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
          href="/tools/bmi-percentile-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          BMI Percentile
        </Link>
        {' · '}
        <Link
          href="/tools/body-fat-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Body Fat
        </Link>
        {' · '}
        <Link
          href="/tools/calorie-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Calorie Calculator
        </Link>
      </p>
    </div>
  );
}
