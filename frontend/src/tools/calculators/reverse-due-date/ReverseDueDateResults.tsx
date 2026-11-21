'use client';

import type { ReverseDueDateResult } from './types';

interface Props {
  result: ReverseDueDateResult | null;
}

export function ReverseDueDateResults({ result }: Props) {
  if (!result) return null;
  return (
    <div
      className="space-y-2 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Estimated dates</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Due date</dt>
          <dd className="text-right font-medium text-accent">
            {result.formattedDueDate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Conception (est.)</dt>
          <dd className="text-right font-medium text-accent">
            {result.formattedConceptionDate}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">
            Intercourse window from
          </dt>
          <dd className="text-right font-medium text-accent">
            {result.formattedIntercourseStart}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Pregnancy length</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.pregnancyLengthDays} days
          </dd>
        </div>
      </dl>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>
    </div>
  );
}
