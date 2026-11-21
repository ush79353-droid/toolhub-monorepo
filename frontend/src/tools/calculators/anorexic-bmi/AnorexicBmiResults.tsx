'use client';

import type { AnorexicBmiResult } from './types';

interface AnorexicBmiResultsProps {
  result: AnorexicBmiResult | null;
}

export function AnorexicBmiResults({ result }: AnorexicBmiResultsProps) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Result</h3>

      <p className="text-base font-semibold tabular-nums text-accent">
        BMI = {result.formattedBmi} kg/m²
      </p>

      {result.adultReferenceApplicable && result.healthyRangeLabel ? (
        <p className="text-sm text-muted-foreground">
          Healthy BMI range (WHO adults):{' '}
          <span className="font-medium text-accent">
            {result.healthyRangeLabel}
          </span>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Adult WHO BMI categories apply at ages 20 and older. For younger ages,
          use age- and sex-specific percentile charts rather than adult cutoffs.
        </p>
      )}

      <p className="text-sm leading-relaxed text-muted-foreground">
        {result.interpretationNote}
      </p>

      <p className="text-xs font-semibold text-accent">
        The result above is not a diagnosis.
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Source: {result.healthyRangeSource}.
      </p>
    </div>
  );
}
