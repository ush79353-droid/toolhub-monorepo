'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatVolume } from './calculation';
import {
  CUP_STANDARD_OPTIONS,
  FL_OZ_STANDARD_OPTIONS,
  type OzToCupsResult,
} from './types';

interface OzToCupsResultsProps {
  result: OzToCupsResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function OzToCupsResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: OzToCupsResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid non-negative volume in fluid ounces or cups. Cups may be a decimal
        or a cooking fraction such as 1/2.
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

  const flLabel =
    FL_OZ_STANDARD_OPTIONS.find((o) => o.value === result.flOzStandard)?.shortLabel ??
    'fl oz';
  const cupLabel =
    CUP_STANDARD_OPTIONS.find((o) => o.value === result.cupStandard)?.shortLabel ??
    'cup';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatVolume(result.flOz)} {flLabel} = {formatVolume(result.cups)}{' '}
          {result.cups === 1 ? 'cup' : 'cups'}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {cupLabel} · {formatVolume(result.volumeMl)} mL · 1 {flLabel} ={' '}
          {formatVolume(result.mlPerFlOz)} mL · 1 cup = {formatVolume(result.mlPerCup)}{' '}
          mL
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
