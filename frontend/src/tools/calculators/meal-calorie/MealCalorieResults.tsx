'use client';

import type { MealCalorieResult } from './types';

interface Props {
  result: MealCalorieResult | null;
}

export function MealCalorieResults({ result }: Props) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Meal split</h3>
      <dl className="space-y-1 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Daily total</dt>
          <dd className="tabular-nums font-medium text-accent">
            {result.formattedDaily} kcal
          </dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Meals per day</dt>
          <dd className="font-medium text-accent">{result.mealsPerDayLabel}</dd>
        </div>
      </dl>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="pb-2 pr-2 font-medium">Meal</th>
              <th className="pb-2 pr-2 font-medium">Target</th>
              <th className="pb-2 font-medium">Range</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row) => (
              <tr key={row.id} className="border-b border-border/60 last:border-0">
                <td className="py-2 pr-2 text-accent">{row.label}</td>
                <td className="py-2 pr-2 tabular-nums font-medium text-accent">
                  {row.formattedCenter} kcal
                </td>
                <td className="py-2 tabular-nums text-muted-foreground">
                  {row.formattedRange} kcal
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {result.fromMaintenance && result.maintenanceExplanation ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.maintenanceExplanation}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>
    </div>
  );
}