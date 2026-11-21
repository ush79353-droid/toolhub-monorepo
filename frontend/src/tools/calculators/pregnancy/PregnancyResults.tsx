'use client';

import type { PregnancyResult } from './types';

interface PregnancyResultsProps {
  result: PregnancyResult | null;
}

export function PregnancyResults({ result }: PregnancyResultsProps) {
  if (!result) {
    return (
      <p className="text-xs text-muted-foreground">
        Enter a date and click Calculate to see the estimated due date and
        schedule.
      </p>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/15 px-3.5 py-3.5 text-sm text-accent sm:px-4">
      <div>
        <p className="text-[13px] font-semibold">Estimated due date</p>
        <p className="text-base font-semibold tabular-nums">
          {result.formattedDueDate}
        </p>
      </div>

      <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <p>
          <span className="font-medium text-accent">Gestational age (as of{' '}
          {result.asOfDateIso}):</span>{' '}
          {result.gestationalLabel}
        </p>
        <p>
          <span className="font-medium text-accent">LMP-equivalent:</span>{' '}
          {result.formattedLmpEquivalent}
        </p>
        <p>
          <span className="font-medium text-accent">Approx. conception:</span>{' '}
          {result.formattedConceptionApprox}
        </p>
      </div>

      <p className="text-xs text-muted-foreground">{result.formulaNote}</p>

      <div>
        <p className="mb-1.5 text-[13px] font-semibold">Schedule milestones</p>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {result.milestones.map((m) => (
            <li
              key={m.id}
              className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/60 pb-1.5 last:border-0"
            >
              <span className="font-medium text-accent">{m.label}</span>
              <span className="tabular-nums">{m.formattedDate}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Source: {result.classificationSource}
      </p>
      <p className="text-xs italic leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>
    </div>
  );
}
