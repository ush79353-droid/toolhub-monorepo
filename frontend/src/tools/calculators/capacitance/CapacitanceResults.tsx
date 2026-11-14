'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { CapacitanceUnit } from './types';
import { CAPACITANCE_UNIT_BY_ID, CAP_FIELDS } from './types';

interface CapacitanceResultsProps {
  values: Record<CapacitanceUnit, string> | null;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function CapacitanceResults({
  values,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: CapacitanceResultsProps) {
  if (!values) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a non-negative capacitance in any field to convert across F, mF, µF, nF, and pF.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion summary
        </p>
        <ul className="mt-3 space-y-1.5 font-mono text-sm tabular-nums text-accent">
          {CAP_FIELDS.map((field) => (
            <li key={field} className="break-all">
              {values[field]} {CAPACITANCE_UNIT_BY_ID[field].symbol}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          1 F = 1000 mF = 10⁶ µF = 10⁹ nF = 10¹² pF
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
