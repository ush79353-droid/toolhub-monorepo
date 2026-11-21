'use client';

import type { UrineHomePregnancyTestResult } from './types';

interface UrineHomePregnancyTestResultsProps {
  result: UrineHomePregnancyTestResult | null;
}

export function UrineHomePregnancyTestResults({
  result,
}: UrineHomePregnancyTestResultsProps) {
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
    </div>
  );
}
