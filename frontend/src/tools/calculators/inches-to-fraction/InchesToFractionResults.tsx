'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatDecimal } from './calculation';
import type { InchesToFractionResult } from './types';

interface InchesToFractionResultsProps {
  result: InchesToFractionResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function InchesToFractionResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: InchesToFractionResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid decimal, fraction, or mixed number to convert.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter a distance.
      </p>
    );
  }

  const unitWord = Math.abs(result.roundedInches) === 1 ? 'inch' : 'inches';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Result</p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {result.fractionLabel} {unitWord}
        </p>
        <p className="mt-2 text-sm tabular-nums text-muted-foreground">
          Decimal: {formatDecimal(result.inches)} in
          {result.isApproximate
            ? ` · Rounded to ${formatDecimal(result.roundedInches)} in (nearest 1/${result.precision})`
            : ` · Exact at 1/${result.precision}`}
        </p>
        {result.isApproximate ? (
          <p className="mt-2 text-xs text-amber-800">
            Approximate — the fractional display is rounded to the selected precision.
          </p>
        ) : null}
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
