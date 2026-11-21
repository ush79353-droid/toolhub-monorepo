'use client';

import type { BloodPregnancyHcgResult } from './types';

interface BloodPregnancyHcgResultsProps {
  result: BloodPregnancyHcgResult | null;
}

export function BloodPregnancyHcgResults({
  result,
}: BloodPregnancyHcgResultsProps) {
  if (!result) return null;

  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5">
      <p className="text-[13px] font-medium text-accent">Timing summary</p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      {result.sensitivityNote ? (
        <p className="text-xs text-muted-foreground">{result.sensitivityNote}</p>
      ) : null}
      <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
      <div className="space-y-1 border-t border-border pt-2 text-xs text-muted-foreground">
        <p className="font-medium text-accent">What do hCG results mean?</p>
        <p>
          Blood (serum) and urine tests detect the pregnancy hormone hCG. A
          qualitative result is usually reported as positive or negative;
          quantitative blood tests report a concentration. Levels vary widely by
          gestational age and assay — this page does not interpret numeric lab
          values or judge pregnancy viability.
        </p>
      </div>
    </div>
  );
}
