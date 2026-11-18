'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { NUMBER_SYSTEM_LABELS, type DataUnit, type NumberSystem } from './types';

interface MbToGbResultsProps {
  values: Record<DataUnit, string> | null;
  numberSystem: NumberSystem;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function MbToGbResults({
  values,
  numberSystem,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: MbToGbResultsProps) {
  if (!values) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a non-negative value in megabytes or gigabytes to begin.
      </p>
    );
  }

  const factor = numberSystem === 'decimal' ? '1000' : '1024';

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion summary
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{NUMBER_SYSTEM_LABELS[numberSystem]}</p>
        <ul className="mt-3 space-y-1.5 font-mono text-sm tabular-nums text-accent">
          <li className="break-all">
            {values.MB} MB = {values.GB} GB
          </li>
        </ul>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          GB = MB / {factor} · MB = GB × {factor}
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
