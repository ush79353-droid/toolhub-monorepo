'use client';

import type { CalorieIntakeSimpleResult } from './types';

interface Props {
  result: CalorieIntakeSimpleResult | null;
}

export function CalorieIntakeSimpleResults({ result }: Props) {
  if (!result) return null;
  return (
    <div
      className="space-y-2 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Summary</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">BMR (Mifflin–St Jeor)</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedBmr} kcal/day
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Activity (PAL)</dt>
          <dd className="text-right font-medium text-accent">
            {result.pal} · {result.activityLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Maintenance calories</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedTdee} kcal/day
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
