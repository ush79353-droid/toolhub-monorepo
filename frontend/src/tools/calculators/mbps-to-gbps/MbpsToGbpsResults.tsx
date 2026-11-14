'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { DataRateUnit } from './types';
import { DATA_RATE_UNIT_BY_ID } from './types';

interface MbpsToGbpsResultsProps {
  values: Record<DataRateUnit, string> | null;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function MbpsToGbpsResults({
  values,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: MbpsToGbpsResultsProps) {
  if (!values) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a non-negative value in Mbps, Gbps, or GB/s to convert data transfer rates.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion summary
        </p>
        <ul className="mt-3 space-y-1.5 font-mono text-sm tabular-nums text-accent">
          <li className="break-all">
            {values.Mbps} {DATA_RATE_UNIT_BY_ID.Mbps.symbol} = {values.Gbps}{' '}
            {DATA_RATE_UNIT_BY_ID.Gbps.symbol}
          </li>
          <li className="break-all">
            {values.Mbps} {DATA_RATE_UNIT_BY_ID.Mbps.symbol} = {values.GBps}{' '}
            {DATA_RATE_UNIT_BY_ID.GBps.symbol}
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          1 Gbps = 1000 Mbps · 1 GB/s = 8 Gbps · bits (b) ≠ bytes (B)
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
