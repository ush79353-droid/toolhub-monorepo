'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { formatFlowNumber, fromMeters, fromSquareMeters } from './calculation';
import type { PsiToGpmResult } from './types';

interface PsiToGpmResultsProps {
  result: PsiToGpmResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function PsiToGpmResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: PsiToGpmResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter valid inlet and exit pressures, pipe size, density, and Cd to estimate flow.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter pressure and pipe diameter (or area).
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Ideal flow estimate
        </p>
        <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-accent sm:text-3xl">
          {formatFlowNumber(result.flowUsGpm)} US gpm
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Diameter {formatFlowNumber(fromMeters(result.diameterM, 'cm'))} cm · Area{' '}
          {formatFlowNumber(fromSquareMeters(result.areaM2, 'cm2'))} cm² · Cd{' '}
          {formatFlowNumber(result.dischargeCoefficient)} · ρ{' '}
          {formatFlowNumber(result.densityKgM3)} kg/m³
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{result.modelNote}</p>
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
