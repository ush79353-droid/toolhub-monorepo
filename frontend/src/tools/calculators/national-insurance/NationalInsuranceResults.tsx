'use client';

import Link from 'next/link';
import type { NationalInsuranceResult } from './types';

interface NationalInsuranceResultsProps {
  result: NationalInsuranceResult | null;
}

export function NationalInsuranceResults({
  result,
}: NationalInsuranceResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Tax year</dt>
          <dd className="font-medium text-accent">{result.taxYearLabel}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total annual income</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalAnnualIncome}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">National Insurance</dt>
          <dd className="tabular-nums font-semibold text-accent">
            {result.formattedTotalNationalInsurance}
          </dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>

      <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
        {result.disclosures.map((d) => (
          <li key={d.slice(0, 48)}>{d}</li>
        ))}
      </ul>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Related:{' '}
        <Link
          href="/tools/fica-tax-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          FICA Tax
        </Link>
        {' · '}
        <Link
          href="/tools/income-tax-calculator"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Income Tax
        </Link>
        .
      </p>
    </div>
  );
}
