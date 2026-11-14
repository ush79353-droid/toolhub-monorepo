'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatMeasure, scaleKindLabel, unitLabel } from './calculation';
import type { ScaleCalculatorResult } from './types';

interface ScaleResultsProps {
  result: ScaleCalculatorResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function ScaleResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: ScaleResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter valid measurements and scale values to calculate.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter the required values for the selected mode.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Scale result
        </p>
        <div className="mt-3 space-y-2 text-sm text-accent">
          <p className="font-mono text-base font-semibold tabular-nums">
            k = {formatMeasure(result.scaleFactor, 'length')}
            <span className="mx-2 text-muted-foreground">·</span>
            {result.scaleRatio}
          </p>
          <p className="text-xs text-muted-foreground">
            {scaleKindLabel(result.scaleKind)} · measurement multiplier k
            <sup>{result.exponent}</sup> ={' '}
            {formatMeasure(result.measurementMultiplier, 'length')}
          </p>
          <p>
            Scaled: {formatMeasure(result.scaledValue, result.dimension)}{' '}
            {unitLabel(result.scaledUnit, result.dimension)}
          </p>
          <p>
            Real: {formatMeasure(result.realValue, result.dimension)}{' '}
            {unitLabel(result.realUnit, result.dimension)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        {canShare ? (
          <Button type="button" variant="outline" className="h-10" onClick={onShare}>
            {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
            {shared ? 'Shared' : 'Share result'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
