'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatPressure } from './calculation';
import { PRESSURE_UNIT_BY_ID, type PressureConverterResult } from './types';

interface PressureConverterResultsProps {
  result: PressureConverterResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function PressureConverterResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: PressureConverterResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid pressure in any field to convert.
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

  const primary = result.values.map((value, index) => {
    const symbol = PRESSURE_UNIT_BY_ID[result.units[index]!].symbol;
    return `${formatPressure(value)} ${symbol}`;
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion
        </p>
        <p className="mt-1 text-xl font-bold tabular-nums tracking-tight text-accent sm:text-2xl">
          {primary.join(' · ')}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Canonical: {formatPressure(result.pascals)} Pa
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Pressure = force / area. Unit conversion only — not gauge↔absolute.
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
