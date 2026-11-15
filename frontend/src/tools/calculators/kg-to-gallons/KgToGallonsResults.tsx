'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatMeasure } from './calculation';
import {
  GALLON_STANDARD_OPTIONS,
  MASS_UNIT_OPTIONS,
  VOLUME_UNIT_OPTIONS,
  type KgToGallonsResult,
} from './types';

interface KgToGallonsResultsProps {
  result: KgToGallonsResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

function unitLabel(
  options: readonly { value: string; label: string }[],
  value: string
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function KgToGallonsResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: KgToGallonsResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a density greater than zero and a non-negative mass or volume. Kilograms and
        gallons are not interchangeable without density.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter mass or volume with a valid density.
      </p>
    );
  }

  const volLabel = unitLabel(VOLUME_UNIT_OPTIONS, result.volumeUnit);
  const massLabel = unitLabel(MASS_UNIT_OPTIONS, result.massUnit);
  const standardLabel = unitLabel(GALLON_STANDARD_OPTIONS, result.gallonStandard);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Density-based conversion
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatMeasure(result.mass)} {massLabel} ≈ {formatMeasure(result.volume)}{' '}
          {volLabel}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Density {formatMeasure(result.densityKgPerL)} kg/L
          {result.densityApproximate ? ' (approx.)' : ''} · {result.substanceName}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Gallon standard: {standardLabel}.{' '}
          {result.source === 'mass'
            ? 'Volume = mass ÷ density (canonical kg and L).'
            : 'Mass = volume × density (canonical L and kg).'}
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
