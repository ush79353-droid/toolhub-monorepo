'use client';

import type { CaloriesBurnedResult } from './types';

interface CaloriesBurnedResultsProps {
  result: CaloriesBurnedResult | null;
}

export function CaloriesBurnedResults({ result }: CaloriesBurnedResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-white px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">
            Calories burned
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-accent">
            {result.formattedCalories}
            <span className="ml-1 text-sm font-semibold text-muted-foreground">
              kcal
            </span>
          </p>
        </div>
        <div className="rounded-lg border border-border bg-white px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">
            Calories per hour
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-accent">
            {result.formattedCaloriesPerHour}
            <span className="ml-1 text-sm font-semibold text-muted-foreground">
              kcal/hr
            </span>
          </p>
        </div>
      </div>

      <dl className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex justify-between gap-2">
          <dt>Activity</dt>
          <dd className="max-w-[60%] text-right font-medium text-accent">
            {result.activityLabel}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Duration</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDuration}
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>MET</dt>
          <dd className="tabular-nums font-medium text-accent">{result.met}</dd>
        </div>
      </dl>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>
      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        {result.formulaLine}
      </p>
      <p className="text-[11px] leading-relaxed text-amber-900/90" role="note">
        Estimate only. Actual burn varies with fitness, terrain, and effort.
        Not medical advice.
      </p>
    </div>
  );
}