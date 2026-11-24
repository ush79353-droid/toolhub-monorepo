'use client';

import type { GastricSleeveWeightLossResult } from './types';

const labelClass = 'mb-1.5 text-[13px] font-medium text-accent';
const outputClass =
  'flex h-11 items-center justify-between rounded-lg border border-border bg-muted/25 px-3 text-sm tabular-nums text-accent';

interface Props {
  result: GastricSleeveWeightLossResult | null;
}

export function GastricSleeveWeightLossResults({ result }: Props) {
  if (!result?.ready) {
    return (
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {result?.statusDetail ??
          'Enter height and weight to see the published sleeve gastrectomy population estimate.'}
      </p>
    );
  }

  return (
    <section
      className="space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4"
      aria-live="polite"
    >
      <div>
        <p className="text-sm font-semibold text-accent">{result.statusHeadline}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {result.statusDetail}
        </p>
      </div>

      <div>
        <p className={labelClass}>Estimated weight at {result.followUpHorizonLabel}</p>
        <div className={outputClass}>
          <span>{formatKg(result.predictedWeightKg)}</span>
          <span className="text-xs text-muted-foreground">kg</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className={labelClass}>Estimated loss ({result.metricLabel})</p>
          <div className={outputClass}>
            <span>{formatKg(result.estimatedLossKg)}</span>
            <span className="text-xs text-muted-foreground">kg</span>
          </div>
        </div>
        <div>
          <p className={labelClass}>Population %EWL applied</p>
          <div className={outputClass}>
            <span>
              {result.percentEwlApplied != null
                ? result.percentEwlApplied.toFixed(1)
                : '—'}
            </span>
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className={labelClass}>Excess weight (vs BMI 25)</p>
          <div className={outputClass}>
            <span>{formatKg(result.excessWeightKg)}</span>
            <span className="text-xs text-muted-foreground">kg</span>
          </div>
        </div>
        <div>
          <p className={labelClass}>Implied %TWL (teaching)</p>
          <div className={outputClass}>
            <span>
              {result.percentTwlImplied != null
                ? result.percentTwlImplied.toFixed(1)
                : '—'}
            </span>
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">{result.sourceNote}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{result.disclaimer}</p>
    </section>
  );
}

function formatKg(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '—';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
