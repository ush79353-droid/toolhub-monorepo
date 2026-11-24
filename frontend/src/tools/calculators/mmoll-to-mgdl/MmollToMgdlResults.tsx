'use client';

import * as React from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { formatMeasure } from './calculation';
import type { MmollToMgdlResult } from './types';

interface MmollToMgdlResultsProps {
  result: MmollToMgdlResult | null;
  invalid: boolean;
  isEmbed: boolean;
}

export function MmollToMgdlResults({ result, invalid, isEmbed }: MmollToMgdlResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);
  const hasConversion = Boolean(result?.preset || result?.custom);

  return (
    <div className="space-y-3">
      {invalid ? (
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Enter non-negative concentrations. Custom molar mass must be a positive number (g/mol).
        </p>
      ) : null}

      {!invalid && hasConversion && result ? (
        <div
          className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
          aria-live="polite"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Conversion
          </p>
          {result.preset ? (
            <p className="mt-1 font-mono text-base font-semibold tabular-nums text-accent sm:text-lg">
              {formatMeasure(result.preset.mmolL)} mmol/L = {formatMeasure(result.preset.mgDl)}{' '}
              mg/dL
              <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                {result.preset.label} · MW {formatMeasure(result.preset.molarMassGPerMol)} g/mol
              </span>
            </p>
          ) : null}
          {result.custom ? (
            <p
              className={`font-mono text-base font-semibold tabular-nums text-accent sm:text-lg ${
                result.preset ? 'mt-3' : 'mt-1'
              }`}
            >
              {formatMeasure(result.custom.mmolL)} mmol/L = {formatMeasure(result.custom.mgDl)}{' '}
              mg/dL
              <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                Custom MW {formatMeasure(result.custom.molarMassGPerMol)} g/mol
              </span>
            </p>
          ) : null}
        </div>
      ) : null}

      {!invalid && !hasConversion ? (
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Enter a concentration in either unit. The paired field fills using MW ÷ 10. Preset and
          custom panels stay independent.
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
