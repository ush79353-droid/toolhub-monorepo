'use client';

import type { DosageResult } from './types';

export function DosageResults({ result }: { result: DosageResult | null }) {
  if (!result) return null;
  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Results</h3>
      <p className="text-2xl font-semibold tabular-nums text-accent">
        {result.formattedDosePerAdmin}
      </p>
      <p className="text-sm text-muted-foreground">
        Per administration · {result.frequencyLabel}
      </p>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Daily total</dt>
          <dd className="font-medium tabular-nums text-accent">
            {result.formattedDosePerDay}
          </dd>
        </div>
        {result.formattedLiquidMl ? (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">Liquid per dose</dt>
            <dd className="font-medium tabular-nums text-accent">
              {result.formattedLiquidMl}
            </dd>
          </div>
        ) : null}
      </dl>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.explanation}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.disclaimer}
      </p>
    </div>
  );
}
