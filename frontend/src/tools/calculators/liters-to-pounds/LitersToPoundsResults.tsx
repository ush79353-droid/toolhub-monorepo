'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatMeasure } from './calculation';
import { DENSITY_UNIT_OPTIONS, type LitersToPoundsResult } from './types';

interface LitersToPoundsResultsProps {
  result: LitersToPoundsResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function LitersToPoundsResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: LitersToPoundsResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a positive density and a non-negative volume or mass to convert.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter liters or pounds with a valid density.
      </p>
    );
  }

  const densityUnitLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion result
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {result.substanceName}
          {result.densityApproximate ? ' · approximate density' : ''}
        </p>
        <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-accent sm:text-xl">
          {formatMeasure(result.liters)} L = {formatMeasure(result.pounds)} lb
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Density {formatMeasure(result.densityValue)} {densityUnitLabel} (
          {formatMeasure(result.densityKgPerL)} kg/L) · {formatMeasure(result.kilograms)} kg
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{result.explanation}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        <Button type="button" variant="outline" className="h-10" onClick={onShare} disabled={!canShare}>
          {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
          {shared ? 'Shared' : 'Share result'}
        </Button>
      </div>

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
            <ThumbsUp className="h-3 w-3" />
            <span>Yes</span>
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
            <ThumbsDown className="h-3 w-3" />
            <span>No</span>
          </button>
        </div>
      </div>
    </div>
  );
}
