'use client';

import type { InfantTylenolDosageResult } from './types';

interface InfantTylenolDosageResultsProps {
  result: InfantTylenolDosageResult | null;
}

export function InfantTylenolDosageResults({
  result,
}: InfantTylenolDosageResultsProps) {
  if (!result) return null;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/15 px-3.5 py-3.5 text-sm text-accent sm:px-4">
      {result.productLabel ? (
        <p className="text-[13px] font-semibold">{result.productLabel}</p>
      ) : null}
      {result.activeIngredient ? (
        <p className="text-xs text-muted-foreground">
          {result.activeIngredient}
        </p>
      ) : null}

      {result.status === 'labeled_dose' && result.doseLine ? (
        <p className="text-base font-semibold tabular-nums">
          Dose: {result.doseLine}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.interpretation}
      </p>

      <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
        <li>{result.frequencyNote}</li>
        <li>{result.maxDosesNote}</li>
      </ul>

      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
        {result.acetaminophenWarning}
      </p>

      <p className="text-xs italic leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Source: {result.sourceNote}
      </p>
    </div>
  );
}
