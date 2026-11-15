'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatVolume } from './calculation';
import { VOLUME_UNIT_BY_ID, type VolumeConversionResult } from './types';

interface VolumeConversionResultsProps {
  result: VolumeConversionResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function VolumeConversionResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: VolumeConversionResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid non-negative volume in any field.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter a volume.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Volume conversion
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatVolume(result.values[1])} {VOLUME_UNIT_BY_ID[result.units[1]].symbol}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          = {formatVolume(result.values[0])} {VOLUME_UNIT_BY_ID[result.units[0]].symbol} ·{' '}
          {formatVolume(result.values[2])} {VOLUME_UNIT_BY_ID[result.units[2]].symbol}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {formatVolume(result.values[3])} {VOLUME_UNIT_BY_ID[result.units[3]].symbol} ·{' '}
          {formatVolume(result.values[4])} {VOLUME_UNIT_BY_ID[result.units[4]].symbol} ·{' '}
          {formatVolume(result.values[5])} {VOLUME_UNIT_BY_ID[result.units[5]].symbol} ·{' '}
          {formatVolume(result.values[6])} {VOLUME_UNIT_BY_ID[result.units[6]].symbol}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Canonical: {formatVolume(result.liters)} L
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
