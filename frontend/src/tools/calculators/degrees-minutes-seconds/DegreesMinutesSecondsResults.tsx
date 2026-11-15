'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { DegreesMinutesSecondsResult } from './types';

interface DegreesMinutesSecondsResultsProps {
  result: DegreesMinutesSecondsResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function DegreesMinutesSecondsResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: DegreesMinutesSecondsResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid DMS angle or decimal-degree value to convert.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter an angle in DMS or decimal degrees.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Converted angle
        </p>
        <div className="mt-3 space-y-2 text-sm text-accent">
          <div>
            <p className="text-xs font-medium text-muted-foreground">DMS</p>
            <p className="mt-0.5 font-mono text-base font-semibold tabular-nums">
              {result.dmsLine}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Decimal degrees</p>
            <p className="mt-0.5 font-mono text-base font-semibold tabular-nums">
              {result.ddLine}
            </p>
          </div>
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
