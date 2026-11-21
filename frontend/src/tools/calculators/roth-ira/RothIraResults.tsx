'use client';

import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { RothIraResult } from './types';

interface RothIraResultsProps {
  result: RothIraResult | null;
}

function ResultRow({
  label,
  value,
  tip,
}: {
  label: string;
  value: string;
  tip?: string;
}) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent">
        {label}
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </p>
      <div className="flex h-11 items-center rounded-lg border border-primary/30 bg-primary/5 px-3">
        <span className="text-base font-semibold tabular-nums text-accent">
          {value}
        </span>
      </div>
    </div>
  );
}

export function RothIraResults({ result }: RothIraResultsProps) {
  if (!result) return null;

  return (
    <div
      id="roth-ira-results"
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      <ResultRow label="Max contribution" value={result.formattedMaxContribution} />
      <ResultRow
        label="Eligible contribution"
        value={result.formattedEligible}
        tip="Annual Roth contribution allowed after MAGI phase-out (IRS rounding to next $10)."
      />
      <ResultRow
        label="Eligible contribution after-tax"
        value={result.formattedEligibleAfterTax}
        tip="Eligible × (1 − income tax rate). Illustrative tax-cost view, not withholding."
      />
      <ResultRow
        label="Roth IRA balance at retirement"
        value={result.formattedBalance}
      />

      <p className="text-sm leading-relaxed text-foreground/90">
        {result.summaryMessage}
      </p>

      <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
        {result.assumptionNotes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
