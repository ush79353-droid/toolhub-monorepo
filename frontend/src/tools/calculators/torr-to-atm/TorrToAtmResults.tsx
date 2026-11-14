'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatPressure } from './calculation';
import { TORR_PER_ATMOSPHERE, type TorrToAtmResult } from './types';

interface TorrToAtmResultsProps {
  result: TorrToAtmResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function TorrToAtmResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: TorrToAtmResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid pressure in Torr or atmospheres to convert.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter a pressure.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatPressure(result.torr)} Torr = {formatPressure(result.atm)} atm
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.source === 'Torr'
            ? `atm = Torr / ${TORR_PER_ATMOSPHERE}`
            : `Torr = atm × ${TORR_PER_ATMOSPHERE}`}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Exact: 1 atm = {TORR_PER_ATMOSPHERE} Torr. Torr ≠ conventional mmHg.
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
            {shared ? 'Shared' : 'Share result'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
