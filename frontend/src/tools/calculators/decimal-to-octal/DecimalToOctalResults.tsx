'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { DecimalOctalResult } from './types';

interface DecimalToOctalResultsProps {
  result: DecimalOctalResult | null;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function DecimalToOctalResults({
  result,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: DecimalToOctalResultsProps) {
  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a decimal or octal whole number to see the conversion.
      </p>
    );
  }

  const isDecimalMode = result.direction === 'decimal-to-octal';

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {isDecimalMode ? 'Octal Number' : 'Decimal Number'}
        </p>
        <p className="mt-1 break-all font-mono text-2xl font-semibold tabular-nums tracking-tight text-accent">
          {result.output}
        </p>
        <p className="mt-3 break-all font-mono text-sm tabular-nums text-accent">{result.formula}</p>
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
