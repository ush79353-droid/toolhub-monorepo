'use client';

import type { TakeHomePayUkResult } from './types';

interface TakeHomePayUkResultsProps {
  result: TakeHomePayUkResult | null;
}

export function TakeHomePayUkResults({ result }: TakeHomePayUkResultsProps) {
  if (!result) return null;

  return (
    <div
      id="take-home-pay-uk-results"
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Take-home summary</h3>
      <p className="text-sm leading-relaxed text-foreground/90">
        {result.summaryMessage}
      </p>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total income</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalIncome}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Personal allowance</dt>
          <dd className="tabular-nums font-medium text-accent">
            £
            {result.personalAllowance.toLocaleString('en-GB', {
              minimumFractionDigits: 2,
            })}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Income tax</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedIncomeTax}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Class 1 NI</dt>
          <dd className="tabular-nums font-medium text-accent">
            £
            {result.class1Ni.toLocaleString('en-GB', {
              minimumFractionDigits: 2,
            })}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Class 4 NI</dt>
          <dd className="tabular-nums font-medium text-accent">
            £
            {result.class4Ni.toLocaleString('en-GB', {
              minimumFractionDigits: 2,
            })}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Total NI</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalNi}
          </dd>
        </div>
        <div className="flex justify-between gap-2 border-t border-border pt-2">
          <dt className="font-semibold text-accent">Take-home pay</dt>
          <dd className="tabular-nums text-base font-semibold text-accent">
            {result.formattedTakeHome}
          </dd>
        </div>
      </dl>
      <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
        {result.assumptionNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
