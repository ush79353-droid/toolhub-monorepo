'use client';

import type { VbacResult } from './types';

interface Props {
  result: VbacResult | null;
}

export function VbacResults({ result }: Props) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Result</h3>

      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Predicted VBAC success probability
        </p>
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {result.formattedProbability}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Grobman model log-odds (w)
        </p>
        <p className="text-base font-semibold tabular-nums text-accent">
          {result.formattedLogOdds}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          The 2021 race-neutral model reports a logistic probability, not a
          separate integer point score. The linear predictor w is shown for
          transparency alongside the published coefficients.
        </p>
      </div>

      {result.formattedBmi != null ? (
        <p className="text-sm text-muted-foreground">
          Derived pre-pregnancy BMI (not a model predictor):{' '}
          <span className="font-medium tabular-nums text-accent">
            {result.formattedBmi} kg/m²
          </span>
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.eligibilitySummary}
      </p>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Model: {result.modelLabel}. {result.modelVersion}.
      </p>
      <p className="text-xs font-semibold text-accent">{result.disclaimer}</p>
    </div>
  );
}