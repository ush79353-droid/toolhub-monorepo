'use client';

import type { GabapentinDosageResult } from './types';

interface GabapentinDosageResultsProps {
  result: GabapentinDosageResult | null;
}

export function GabapentinDosageResults({
  result,
}: GabapentinDosageResultsProps) {
  if (!result) return null;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5">
      <p className="text-[13px] font-medium text-accent">Label guidance</p>
      <p className="text-sm text-muted-foreground">{result.productNote}</p>
      <p className="text-sm text-muted-foreground">{result.approvalNote}</p>
      {result.doseLines.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-accent">
          {result.doseLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
      <p className="text-sm leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>
      <p className="text-xs text-muted-foreground">{result.renalNote}</p>
      <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
      <p className="text-[11px] text-muted-foreground/80">{result.sourceNote}</p>
    </div>
  );
}
