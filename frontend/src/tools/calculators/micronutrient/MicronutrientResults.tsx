'use client';

import type { MicronutrientResult, RecommendationKind } from './types';

const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const labelClass = 'mb-1 text-[13px] font-medium text-accent';
const valueClass =
  'flex h-11 items-center rounded-lg border border-border bg-muted/20 px-3 text-sm tabular-nums text-accent';

function kindLabel(kind: RecommendationKind | null): string {
  if (kind === 'rda') return 'RDA';
  if (kind === 'ai') return 'AI';
  if (kind === 'cdrr') return 'CDRR';
  return 'Recommendation';
}

interface Props {
  result: MicronutrientResult | null;
}

export function MicronutrientResults({ result }: Props) {
  if (!result) return null;

  const hasRec = result.recommendationAmount != null;

  return (
    <section className={sectionClass} aria-live="polite" aria-label="Micronutrient result">
      <h3 className="text-sm font-semibold text-accent">
        {result.elementLabel || 'Element'} recommendation
      </h3>

      {hasRec ? (
        <>
          <div>
            <p className={labelClass}>
              {kindLabel(result.recommendationKind)}
              {result.populationLabel ? (
                <span className="ml-1 font-normal text-muted-foreground">
                  · {result.populationLabel}
                </span>
              ) : null}
            </p>
            <div className={valueClass}>
              <span className="font-semibold">
                {result.recommendationDisplay}
                {result.unit ? ` ${result.unit}` : ''}
              </span>
              <span className="ml-1 text-muted-foreground">/ day</span>
            </div>
          </div>

          <div>
            <p className={labelClass}>Tolerable Upper Intake Level (UL)</p>
            <div className={valueClass}>
              {result.ulAmount != null ? (
                <>
                  <span className="font-semibold">
                    {result.ulDisplay}
                    {result.unit ? ` ${result.unit}` : ''}
                  </span>
                  <span className="ml-1 text-muted-foreground">/ day</span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  {result.ulDisplay || 'Not established'}
                </span>
              )}
            </div>
            {result.ulNote ? (
              <p className="mt-1.5 text-xs text-muted-foreground">{result.ulNote}</p>
            ) : null}
          </div>

          <p className="text-xs text-muted-foreground">{result.statusDetail}</p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{result.statusDetail}</p>
      )}

      <p className="text-xs text-muted-foreground">{result.disclaimer}</p>
    </section>
  );
}
