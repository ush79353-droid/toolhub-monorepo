'use client';

import type { RetirementResult } from './types';

interface RetirementResultsProps {
  result: RetirementResult | null;
}

export function RetirementResults({ result }: RetirementResultsProps) {
  if (!result) return null;

  return (
    <div
      id="retirement-results"
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Retirement summary</h3>

      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Years to retirement</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.alreadyRetired
              ? 'Already retired'
              : result.yearsToRetirement.toFixed(
                  Number.isInteger(result.yearsToRetirement) ? 0 : 1
                )}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Years in retirement</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.yearsInRetirement.toFixed(1)}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Nest egg at retirement</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTotalSavings}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Budget coverage</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.budgetCoverageLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Money left</dt>
          <dd
            className={`tabular-nums font-medium ${
              result.insufficientFunds ? 'text-rose-700' : 'text-accent'
            }`}
          >
            {result.formattedMoneyLeft}
          </dd>
        </div>
      </dl>

      <p className="text-sm leading-relaxed text-foreground/90">
        {result.summaryMessage}
      </p>

      <p className="text-xs text-muted-foreground">
        Nominal figures only (not inflation-adjusted). Currency is denomination
        only — no FX.
      </p>

      <details className="rounded-lg border border-border bg-white px-3 py-2 text-xs text-muted-foreground">
        <summary className="cursor-pointer font-medium text-accent">
          Assumptions
        </summary>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          {result.assumptionNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
