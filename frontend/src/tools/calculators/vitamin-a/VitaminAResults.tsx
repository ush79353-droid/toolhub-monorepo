'use client';

import { formatMeasure } from './calculation';
import { DISCLAIMER, type VitaminAResult } from './types';

interface Props {
  result: VitaminAResult | null;
  invalid: boolean;
}

export function VitaminAResults({ result, invalid }: Props) {
  return (
    <div className="space-y-3">
      {invalid ? (
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Fix the highlighted fields. Source IU and RAE must be non-negative numbers.
        </p>
      ) : null}

      <div
        className="overflow-hidden rounded-xl border border-border bg-white"
        aria-live="polite"
      >
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-accent">
            Total Retinol Activity Equivalents (RAEs)
          </h3>
        </div>
        <div className="space-y-3 px-4 py-3">
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-muted/20 px-3 py-2.5">
              <p className="font-mono text-lg font-semibold tabular-nums text-accent">
                {result ? formatMeasure(result.totalRaeMcg) : '0'}
              </p>
            </div>
            <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground">
              mcg
            </span>
          </div>

          {result ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {result.statusHeadline}
              {result.vsRdaPercent != null
                ? ` (${formatMeasure(result.vsRdaPercent)}% of the listed ${result.rdaKind.toUpperCase()}).`
                : null}
            </p>
          ) : null}

          <div
            className="rounded-lg border border-amber-200/90 bg-amber-50/90 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90"
            role="note"
          >
            {DISCLAIMER}
          </div>
        </div>
      </div>
    </div>
  );
}
