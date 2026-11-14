'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatMeasure, formatMixed } from './calculation';
import type { AdditionResult, EquivalenceResult } from './types';

interface PoundsAndOuncesResultsProps {
  equivResult: EquivalenceResult | null;
  addResult: AdditionResult | null;
  equivInvalid: boolean;
  addInvalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function PoundsAndOuncesResults({
  equivResult,
  addResult,
  equivInvalid,
  addInvalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: PoundsAndOuncesResultsProps) {
  if (!equivResult && !addResult && !equivInvalid && !addInvalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a mass in the equivalences section or add measurements below to see
        results.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {equivInvalid ? (
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Enter a non-negative mass for equivalences. Mass cannot be negative.
        </p>
      ) : equivResult ? (
        <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Equivalence
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
            {formatMeasure(equivResult.decimalPounds)} lb ={' '}
            {formatMeasure(equivResult.totalOuncesDisplay)} oz
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Mixed: {formatMixed(equivResult.mixed)} ·{' '}
            {formatMeasure(equivResult.grams)} g ·{' '}
            {formatMeasure(equivResult.stones)} st
          </p>
        </div>
      ) : null}

      {addInvalid && !addResult ? (
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Fix invalid addition rows or enter at least one measurement.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={onCopy}
          disabled={!equivResult && !addResult}
        >
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        {canShare ? (
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={onShare}
            disabled={!equivResult && !addResult}
          >
            {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
            {shared ? 'Shared' : 'Share'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
