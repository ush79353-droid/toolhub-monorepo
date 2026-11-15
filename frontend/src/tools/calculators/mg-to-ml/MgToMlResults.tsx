'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatMeasure } from './calculation';
import type { MgToMlResult } from './types';

interface MgToMlResultsProps {
  result: MgToMlResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function MgToMlResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: MgToMlResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid density or concentration greater than zero, plus a non-negative mass
        or volume. Milligrams and milliliters are not interchangeable without that factor.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter mass or volume with a valid conversion factor.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {result.mode === 'medication'
            ? 'Medication concentration conversion'
            : 'Density-based conversion'}
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatMeasure(result.massMg)} mg = {formatMeasure(result.volumeMl)} mL
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.factorLabel}
          {result.source === 'mass'
            ? ' · mL = mg ÷ (mg/mL)'
            : ' · mg = mL × (mg/mL)'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{result.substanceLabel}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        {canShare ? (
          <Button type="button" variant="outline" className="h-10" onClick={onShare}>
            {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
            {shared ? 'Shared' : 'Share'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
