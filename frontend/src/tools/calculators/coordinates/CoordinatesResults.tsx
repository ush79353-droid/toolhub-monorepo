'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import {
  formatDd,
  formatDdLine,
  formatDdmLine,
  formatDmsLine,
} from './calculation';
import type { CoordinatesResult } from './types';

interface CoordinatesResultsProps {
  result: CoordinatesResult | null;
  showLetters: boolean;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function CoordinatesResults({
  result,
  showLetters,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: CoordinatesResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter valid latitude and longitude values within geographic ranges to convert formats.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter both latitude and longitude.
      </p>
    );
  }

  const latH = result.latitudeHemisphere;
  const lonH = result.longitudeHemisphere;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Converted coordinates
        </p>
        <div className="mt-3 space-y-3 text-sm text-accent">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Decimal Degrees (DD)</p>
            <p className="mt-0.5 font-mono text-base font-semibold tabular-nums">
              {formatDdLine(result.latitude, showLetters, latH)}
              <span className="mx-2 text-muted-foreground">·</span>
              {formatDdLine(result.longitude, showLetters, lonH)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">DMS</p>
            <p className="mt-0.5 font-mono text-base font-semibold tabular-nums">
              {formatDmsLine(result.latitudeDms, showLetters ? latH : null)}
              <span className="mx-2 text-muted-foreground">·</span>
              {formatDmsLine(result.longitudeDms, showLetters ? lonH : null)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">DDM</p>
            <p className="mt-0.5 font-mono text-base font-semibold tabular-nums">
              {formatDdmLine(result.latitudeDdm, showLetters ? latH : null)}
              <span className="mx-2 text-muted-foreground">·</span>
              {formatDdmLine(result.longitudeDdm, showLetters ? lonH : null)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Signed DD: {formatDd(result.latitude)}, {formatDd(result.longitude)}
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
