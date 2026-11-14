'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatMeasure } from './calculation';
import {
  VOLUME_UNIT_BY_ID,
  type CalcMode,
  type VolumeResult,
  type WaterWeightResult,
} from './types';

interface GallonResultsProps {
  mode: CalcMode;
  volumeResult: VolumeResult | null;
  waterResult: WaterWeightResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function GallonResults({
  mode,
  volumeResult,
  waterResult,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: GallonResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        {mode === 'volume'
          ? 'Enter a valid non-negative volume in any field.'
          : 'Enter a non-negative volume or mass and a density greater than zero.'}
      </p>
    );
  }

  if (mode === 'volume' && !volumeResult) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter a volume.
      </p>
    );
  }

  if (mode === 'waterWeight' && !waterResult) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter volume or mass with a valid density.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {mode === 'volume' && volumeResult ? (
        <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Volume conversion
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
            {formatMeasure(volumeResult.values[0])}{' '}
            {VOLUME_UNIT_BY_ID[volumeResult.units[0]].symbol}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            = {formatMeasure(volumeResult.values[1])}{' '}
            {VOLUME_UNIT_BY_ID[volumeResult.units[1]].symbol} ·{' '}
            {formatMeasure(volumeResult.liters)} L canonical
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatMeasure(volumeResult.values[4])}{' '}
            {VOLUME_UNIT_BY_ID[volumeResult.units[4]].symbol} ·{' '}
            {formatMeasure(volumeResult.values[5])}{' '}
            {VOLUME_UNIT_BY_ID[volumeResult.units[5]].symbol} ·{' '}
            {formatMeasure(volumeResult.values[6])}{' '}
            {VOLUME_UNIT_BY_ID[volumeResult.units[6]].symbol} ·{' '}
            {formatMeasure(volumeResult.values[7])}{' '}
            {VOLUME_UNIT_BY_ID[volumeResult.units[7]].symbol}
          </p>
        </div>
      ) : null}

      {mode === 'waterWeight' && waterResult ? (
        <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Water weight
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
            {formatMeasure(waterResult.volume)}{' '}
            {VOLUME_UNIT_BY_ID[waterResult.volumeUnit].symbol} ≈{' '}
            {formatMeasure(waterResult.massKg)} kg
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            ≈ {formatMeasure(waterResult.massLb)} lb · density{' '}
            {formatMeasure(waterResult.densityKgPerL)} kg/L
            {waterResult.densityApproximate ? ' (approx.)' : ''}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Mass = volume × density (canonical liters and kg)
          </p>
        </div>
      ) : null}

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
