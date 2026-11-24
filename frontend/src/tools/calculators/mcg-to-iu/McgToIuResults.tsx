'use client';

import * as React from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { formatMeasure, fromMcg } from './calculation';
import type { MassUnit, McgToIuResult } from './types';

interface McgToIuResultsProps {
  result: McgToIuResult | null;
  massUnit: MassUnit;
  invalid: boolean;
  isEmbed: boolean;
}

export function McgToIuResults({ result, massUnit, invalid, isEmbed }: McgToIuResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  return (
    <div className="space-y-3">
      {invalid ? (
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Enter a valid non-negative mass or IU value for the selected substance.
        </p>
      ) : null}

      {!invalid && result ? (
        <div
          className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
          aria-live="polite"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Conversion
          </p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-accent sm:text-xl">
            {formatMeasure(fromMcg(result.massMcg, massUnit))} {massUnit} ={' '}
            {formatMeasure(result.iu)} IU
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{result.substanceLabel}</p>
          <p className="mt-1 text-xs text-muted-foreground">{result.factorNote}</p>
        </div>
      ) : null}

      {!invalid && !result ? (
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Enter a mass or IU amount to convert. Results stay blank until a valid value is entered.
        </p>
      ) : null}

      {!isEmbed ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          <span>Did we solve your problem today?</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFeedback('yes')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'yes'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsUp className="h-3 w-3" aria-hidden />
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFeedback('no')}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
                feedback === 'no'
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-muted-foreground hover:text-foreground'
              }`}
            >
              <ThumbsDown className="h-3 w-3" aria-hidden />
              No
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
