'use client';

import type { VteRiskPregnancyResult } from './types';

interface Props {
  result: VteRiskPregnancyResult | null;
  bmiDisplay: string;
}

export function VteRiskPregnancyResults({ result, bmiDisplay }: Props) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Result</h3>

      <p className="text-base font-semibold tabular-nums text-accent">
        Total RCOG score: {result.totalScore}
      </p>

      <p className="text-sm text-muted-foreground">
        Derived BMI:{' '}
        <span className="font-medium text-accent">
          {bmiDisplay === '—' ? '—' : `${bmiDisplay} kg/m²`}
        </span>
        {result.obesityPoints > 0
          ? ` (obesity contributes ${result.obesityPoints} point${result.obesityPoints === 1 ? '' : 's'})`
          : null}
      </p>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {result.bandSummary}
      </p>

      {result.excludedNotes.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
          {result.excludedNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      ) : null}

      {result.scoredFactors.length > 0 ? (
        <details className="rounded-lg border border-border bg-white p-3 text-xs">
          <summary className="cursor-pointer font-semibold text-accent">
            Scored factors ({result.scoredFactors.length})
          </summary>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {result.scoredFactors.map((f) => (
              <li key={f.id} className="flex justify-between gap-2">
                <span>{f.label}</span>
                <span className="shrink-0 tabular-nums font-medium text-accent">
                  +{f.points}
                </span>
              </li>
            ))}
          </ul>
        </details>
      ) : (
        <p className="text-xs text-muted-foreground">
          No scored risk factors yet. Tick applicable items or enter height and
          weight for obesity points.
        </p>
      )}

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Source: {result.guidelineLabel}. {result.guidelineVersion}.
      </p>
      <p className="text-xs font-semibold text-accent">{result.disclaimer}</p>
    </div>
  );
}
