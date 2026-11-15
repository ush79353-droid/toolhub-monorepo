'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatDistance, formatLightTravelTime } from './calculation';
import { AU_UNIT_BY_ID, type AstronomicalUnitResult } from './types';

interface AstronomicalUnitResultsProps {
  result: AstronomicalUnitResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function AstronomicalUnitResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: AstronomicalUnitResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a non-negative distance in any field to convert.
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

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion
        </p>
        <ul className="mt-2 space-y-1.5 text-sm tabular-nums text-accent">
          {result.values.map((value, index) => {
            const unit = AU_UNIT_BY_ID[result.units[index]!];
            return (
              <li key={index} className={index === 0 ? 'text-xl font-bold sm:text-2xl' : ''}>
                {formatDistance(value)} {unit.symbol}
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Canonical: {formatDistance(result.meters)} m · 1 au = 149,597,870,700 m (exact)
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Vacuum light-travel time: {formatLightTravelTime(result.lightTravelSeconds)} (
          {formatDistance(result.lightTravelSeconds)} s)
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy results'}
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
