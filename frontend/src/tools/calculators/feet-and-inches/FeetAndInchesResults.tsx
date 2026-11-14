'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatDecimal } from './calculation';
import type { FeetAndInchesResult } from './types';

interface FeetAndInchesResultsProps {
  result: FeetAndInchesResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function FeetAndInchesResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: FeetAndInchesResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter valid feet-and-inches values (and a nonzero divisor when dividing) to calculate.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter a measurement.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Result
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {result.normalized.mixedLabel}
        </p>
        {result.normalized.isApproximate ? (
          <p className="mt-2 text-xs text-amber-800">
            Displayed fraction is rounded to the selected precision. Metric and decimal totals use
            the exact unrounded result.
          </p>
        ) : null}
        <dl className="mt-3 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <dt className="inline">Decimal feet: </dt>
            <dd className="inline tabular-nums font-medium text-accent">
              {formatDecimal(result.decimalFeet)} ft
            </dd>
          </div>
          <div>
            <dt className="inline">Total inches: </dt>
            <dd className="inline tabular-nums font-medium text-accent">
              {formatDecimal(result.totalInches)} in
            </dd>
          </div>
        </dl>
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
