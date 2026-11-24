'use client';

import type { TwinsResult } from './types';

interface Props {
  result: TwinsResult | null;
}

export function ChancesOfHavingTwinsResults({ result }: Props) {
  if (!result) return null;

  return (
    <div
      className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-accent">Population twin birth rate</h3>

      <p className="text-xs text-muted-foreground">{result.stratumDescription}</p>

      <div>
        <p className="text-xs font-medium text-muted-foreground">
          Twin births per 1,000 total births
        </p>
        <p className="text-2xl font-semibold tabular-nums text-accent">
          {result.formattedRatePerThousand}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Share of births that are twins
          </p>
          <p className="text-lg font-semibold tabular-nums text-accent">
            {result.formattedPercent}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Approximate frequency
          </p>
          <p className="text-lg font-semibold tabular-nums text-accent">
            {result.formattedOneInN}
          </p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        US overall (2024 reference): {result.formattedOverallUsRate} — shown for
        context only; your selected stratum is reported above.
      </p>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.endpointNote} {result.artNote}
      </p>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Source: {result.sourceLabel}
      </p>

      <p className="text-xs font-semibold text-accent">{result.disclaimer}</p>
    </div>
  );
}