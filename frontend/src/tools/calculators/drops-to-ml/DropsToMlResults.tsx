'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatMeasure } from './calculation';
import type { DropsToMlResult } from './types';

interface DropsToMlResultsProps {
  result: DropsToMlResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function DropsToMlResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: DropsToMlResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a non-negative drop count or volume and a drops-per-mL factor greater
        than zero. Drop size is not a fixed SI unit.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter drops or milliliters with a valid factor.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Estimated conversion
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatMeasure(result.drops)} drops ≈ {formatMeasure(result.ml)} mL
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Factor: {formatMeasure(result.dropsPerMl)} drops/mL
          {result.factorAssumed ? ' (assumed)' : ' (custom)'} · ≈{' '}
          {formatMeasure(result.mlPerDrop)} mL per drop
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {result.source === 'drops'
            ? 'mL = drops ÷ drops-per-mL'
            : 'Drops = mL × drops-per-mL (mathematical estimate; may be fractional)'}
        </p>
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
