'use client';

import type { MaintenanceCalorieResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const outputClass =
  'flex h-11 items-center justify-between rounded-lg border border-border bg-muted/25 px-3 text-sm tabular-nums text-accent';

interface Props {
  result: MaintenanceCalorieResult | null;
  showMacroPercent: boolean;
  showMacroKcal: boolean;
  showIdealWeight: boolean;
  showChangeWeight: boolean;
}

export function MaintenanceCalorieResults({
  result,
  showMacroPercent,
  showMacroKcal,
  showIdealWeight,
  showChangeWeight,
}: Props) {
  const unit = result?.energyUnit === 'kJ' ? 'kJ' : 'kcal';

  return (
    <div className="space-y-3">
      <div>
        <p className={labelClass}>Calories to maintain weight</p>
        <div className={outputClass} aria-live="polite">
          <span className="text-base font-semibold">
            {result ? result.formattedMaintenance : '—'}
          </span>
          <span className="text-xs text-muted-foreground">{unit} / day</span>
        </div>
        {result ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{result.explanation}</p>
        ) : (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Enter height, weight, and age to estimate maintenance energy.
          </p>
        )}
      </div>

      {result?.macros && (showMacroPercent || showMacroKcal) ? (
        <div className="space-y-2 rounded-lg border border-border bg-white/70 p-3">
          <p className="text-[13px] font-semibold text-accent">
            Calorie distribution
          </p>
          {(
            [
              ['Protein', result.macros.proteinPct, result.macros.proteinKcal, result.macros.proteinGrams],
              ['Carbs', result.macros.carbPct, result.macros.carbKcal, result.macros.carbGrams],
              ['Fat', result.macros.fatPct, result.macros.fatKcal, result.macros.fatGrams],
            ] as const
          ).map(([name, pct, kcal, grams]) => (
            <div
              key={name}
              className="flex flex-wrap items-baseline justify-between gap-2 text-sm text-accent"
            >
              <span className="font-medium">{name}</span>
              <span className="tabular-nums text-muted-foreground">
                {showMacroPercent ? `${pct.toFixed(0)}%` : null}
                {showMacroPercent && showMacroKcal ? ' · ' : null}
                {showMacroKcal
                  ? `${Math.round(kcal).toLocaleString('en-US')} kcal (${grams.toFixed(0)} g)`
                  : null}
              </span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Shares follow USDA AMDR windows (protein 10–35%, carbs 45–65%, fat
            20–35%).
          </p>
        </div>
      ) : null}

      {result?.idealWeight && showIdealWeight ? (
        <div className="space-y-2 rounded-lg border border-border bg-white/70 p-3">
          <p className="text-[13px] font-semibold text-accent">Ideal weight</p>
          <div className="text-sm text-accent">
            Devine estimate:{' '}
            <span className="font-semibold tabular-nums">
              {result.idealWeight.formattedDevineKg}
              {Number.isFinite(result.idealWeight.devineKg) ? ' kg' : ''}
            </span>
          </div>
          <div className="text-sm text-accent">
            BMI healthy band (18.5–24.9):{' '}
            <span className="font-semibold tabular-nums">
              {result.idealWeight.formattedBmiRange}
            </span>
          </div>
        </div>
      ) : null}

      {result?.changePlan && showChangeWeight ? (
        <div className="space-y-2 rounded-lg border border-border bg-white/70 p-3">
          <p className="text-[13px] font-semibold text-accent">
            Weight change plan
          </p>
          <div className="text-sm text-accent">
            Suggested intake:{' '}
            <span className="font-semibold tabular-nums">
              {result.changePlan.formattedPlannedIntake}
            </span>{' '}
            kcal / day
          </div>
          {result.changePlan.weeksEstimate != null ? (
            <div className="text-sm text-muted-foreground">
              Rough timeline ≈ {result.changePlan.weeksEstimate.toFixed(1)} weeks
              at {result.changePlan.weeklyChangeKg} kg/week (
              {result.changePlan.direction}).
            </div>
          ) : null}
          {result.changePlan.warning ? (
            <p className="text-xs text-amber-700" role="status">
              {result.changePlan.warning}
            </p>
          ) : null}
        </div>
      ) : null}

      {result ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.disclaimer}
        </p>
      ) : null}
    </div>
  );
}
