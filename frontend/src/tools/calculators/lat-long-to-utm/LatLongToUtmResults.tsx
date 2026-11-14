'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatDd, formatUtmMeters } from './calculation';
import type { LatLongToUtmResult } from './types';

interface LatLongToUtmResultsProps {
  result: LatLongToUtmResult | null;
  invalid: boolean;
  coverageMessage?: string;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const readonlyClass =
  'flex h-11 w-full items-center rounded-lg border border-border bg-muted/40 px-3 text-sm tabular-nums text-accent';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function LatLongToUtmResults({
  result,
  invalid,
  coverageMessage,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: LatLongToUtmResultsProps) {
  if (coverageMessage) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="alert">
        {coverageMessage}
      </p>
    );
  }

  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter valid latitude and longitude within geographic ranges to calculate UTM coordinates.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        UTM zone, easting, and northing appear here after both coordinates are entered.
      </p>
    );
  }

  const { utm } = result;
  const zoneLabel = `${utm.zone}${utm.hemisphere}`;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border">
        <div className="border-b border-border px-3.5 py-3">
          <h3 className="text-sm font-medium text-accent">UTM parameters</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            WGS84 · {utm.epsg} · zone+hemisphere {zoneLabel} (not an MGRS latitude band)
          </p>
        </div>
        <div className="space-y-4 px-3.5 py-3.5">
          <div className="space-y-1.5">
            <p className={labelClass}>Zone</p>
            <div className={readonlyClass} aria-live="polite">
              {utm.zone} ({utm.hemisphere === 'N' ? 'Northern' : 'Southern'} hemisphere)
            </div>
          </div>
          <div className="space-y-1.5">
            <p className={labelClass}>Easting</p>
            <div className="flex gap-2">
              <div className={`min-w-0 flex-1 ${readonlyClass}`} aria-live="polite">
                {formatUtmMeters(utm.easting)}
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                m
              </span>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className={labelClass}>Northing</p>
            <div className="flex gap-2">
              <div className={`min-w-0 flex-1 ${readonlyClass}`} aria-live="polite">
                {formatUtmMeters(utm.northing)}
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                m
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Input: {formatDd(result.latitude)}°, {formatDd(result.longitude)}° · Central meridian{' '}
            {utm.centralMeridian}°
          </p>
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
