'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatMeasure } from './calculation';
import type { CubicMeterResult } from './types';

interface CubicMeterResultsProps {
  result: CubicMeterResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function CubicMeterResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: CubicMeterResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter valid non-negative dimensions or a volume to calculate cubic meters.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter dimensions or a volume.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Volume
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatMeasure(result.cubicMeters)} m³
        </p>
        {result.source === 'dimensions' &&
        result.length !== null &&
        result.width !== null &&
        result.height !== null ? (
          <p className="mt-2 text-sm text-muted-foreground">
            {formatMeasure(result.height)} {result.heightUnit} × {formatMeasure(result.length)}{' '}
            {result.lengthUnit} × {formatMeasure(result.width)} {result.widthUnit}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Converted from {formatMeasure(result.volumeInSelectedUnit)} (
            {result.volumeUnit === 'usGal'
              ? 'US gal'
              : result.volumeUnit === 'impGal'
                ? 'imp gal'
                : result.volumeUnit.replace('3', '³')})
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          ≈ {formatMeasure(result.cubicFeet)} ft³
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
