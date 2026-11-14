'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatTorque } from './calculation';
import { NEWTON_METERS_PER_FOOT_POUND, type NmToFtLbsResult } from './types';

interface NmToFtLbsResultsProps {
  result: NmToFtLbsResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function NmToFtLbsResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: NmToFtLbsResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid torque in newton-meters or foot-pounds to convert.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter a torque.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatTorque(result.nm)} N·m ≈ {formatTorque(result.ftlbf)} ft·lbf
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.source === 'nm'
            ? `ft·lbf = N·m / ${NEWTON_METERS_PER_FOOT_POUND}`
            : `N·m = ft·lbf × ${NEWTON_METERS_PER_FOOT_POUND}`}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Torque (foot-pound-force). Not energy (joules) and not force (newtons alone).
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
