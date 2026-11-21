'use client';

import type { MaintainPregnancyWeightResult } from './types';

export function MaintainPregnancyWeightResults({
  result,
}: {
  result: MaintainPregnancyWeightResult | null;
}) {
  if (!result) return null;
  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4" aria-live="polite">
      <h3 className="text-sm font-semibold text-accent">Educational gain range</h3>
      <p className="text-sm text-muted-foreground">
        Week {result.week}
        {result.twins ? ' · twins' : ' · singleton'} · BMI {result.formattedBmi} (
        {result.bmiCategoryLabel})
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">{result.guidanceNote}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{result.sourceNote}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{result.disclaimer}</p>
    </div>
  );
}
