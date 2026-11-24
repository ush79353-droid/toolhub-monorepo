'use client';

import type { StillbirthRiskResult } from './types';

interface Props {
  result: StillbirthRiskResult | null;
}

export function StillbirthRiskResults({ result }: Props) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Result</h3>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Yerke 2017 calibrated stillbirth probability from 32 weeks onward
        (educational). This is a logistic model probability — not an odds-ratio
        multiplied by a baseline population rate.
      </p>

      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Estimated stillbirth probability (≥32 weeks)
        </p>
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {result.formattedProbability}
        </p>
        <p className="mt-1 text-sm font-medium tabular-nums text-accent">
          {result.formattedOneInN}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground">Model logit</p>
        <p className="text-base font-semibold tabular-nums text-accent">
          {result.formattedLogit}
        </p>
      </div>

      {result.formattedBmi != null ? (
        <p className="text-sm text-muted-foreground">
          Pre-pregnancy BMI:{' '}
          <span className="font-medium tabular-nums text-accent">
            {result.formattedBmi} kg/m²
          </span>
          {result.bmiCategoryLabel ? (
            <span className="text-muted-foreground">
              {' '}
              ({result.bmiCategoryLabel} in Yerke model)
            </span>
          ) : null}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Intercept-only reference (age 19–34, non-Black, multiparous, BMI &lt;
        25, no smoking, hypertension, or diabetes):{' '}
        <span className="font-medium tabular-nums text-accent">
          {result.formattedInterceptReference}
        </span>
        . Legacy calculators that multiply isolated odds ratios by an editable
        0.2197% baseline are not used here.
      </p>

      {result.nonModelFieldsNote ? (
        <p className="rounded-lg border border-amber-200/80 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed text-amber-950">
          {result.nonModelFieldsNote}
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