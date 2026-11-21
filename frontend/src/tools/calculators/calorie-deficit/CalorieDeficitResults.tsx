'use client';

import type { CalorieDeficitResult } from './types';

interface Props {
  result: CalorieDeficitResult | null;
  showPlanPlaceholder: boolean;
}

export function CalorieDeficitResults({
  result,
  showPlanPlaceholder,
}: Props) {
  return (
    <div className="space-y-4">
      <div
        className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
        aria-live="polite"
      >
        <h3 className="text-sm font-semibold text-accent">Results</h3>
        <div>
          <p className="mb-1.5 text-[13px] font-medium text-accent">
            Calorie deficit to reach goal
          </p>
          <div className="flex h-11 items-center justify-between rounded-lg border border-border bg-muted/40 px-3 text-sm tabular-nums text-accent">
            <span>
              {result ? result.formattedDailyDeficit : '—'}
            </span>
            <span className="text-xs text-muted-foreground">kcal/day</span>
          </div>
        </div>
        {result ? (
          <p className="text-xs text-muted-foreground">
            {result.weightDeltaKg.toFixed(2)} kg over {result.days} days using ≈
            {result.kcalPerKg.toLocaleString('en-US')} kcal/kg.
          </p>
        ) : null}
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-4">
        <h3 className="text-sm font-semibold text-accent">
          Calorie intake plan
        </h3>
        {result ? (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">
                Maintenance ({result.palLabel})
              </dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedMaintenance} kcal/day
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Daily deficit</dt>
              <dd className="tabular-nums font-medium text-accent">
                {result.formattedDailyDeficit} kcal/day
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Suggested intake</dt>
              <dd className="tabular-nums font-semibold text-accent">
                {result.formattedPlannedIntake} kcal/day
              </dd>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.disclaimer}
            </p>
          </dl>
        ) : showPlanPlaceholder ? (
          <p className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs leading-relaxed text-sky-900">
            Expect more details here after you have entered all the necessary
            information above.
          </p>
        ) : null}
      </div>
    </div>
  );
}
