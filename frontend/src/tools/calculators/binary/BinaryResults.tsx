'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { BinaryWidth } from './types';

interface BinaryResultsProps {
  bits: BinaryWidth;
  binaryFromDecimal: string | null;
  decimalFromBinary: string | null;
  decimalInputDisplay: string | null;
  binaryInputDisplay: string | null;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function BinaryResults({
  bits,
  binaryFromDecimal,
  decimalFromBinary,
  decimalInputDisplay,
  binaryInputDisplay,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: BinaryResultsProps) {
  const hasAny = Boolean(binaryFromDecimal || decimalFromBinary);

  if (!hasAny) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a decimal integer or a complete {bits}-bit binary string to see results.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion summary · signed {bits}-bit
        </p>
        <div className="mt-3 space-y-2 font-mono text-sm tabular-nums text-accent">
          {binaryFromDecimal && decimalInputDisplay ? (
            <p className="break-all">
              <span className="font-sans text-xs text-muted-foreground">Decimal → binary: </span>
              {decimalInputDisplay} = {binaryFromDecimal}
              <sub className="font-sans text-[10px]">₂</sub>
            </p>
          ) : null}
          {decimalFromBinary && binaryInputDisplay ? (
            <p className="break-all">
              <span className="font-sans text-xs text-muted-foreground">Binary → decimal: </span>
              {binaryInputDisplay}
              <sub className="font-sans text-[10px]">₂</sub> = {decimalFromBinary}
            </p>
          ) : null}
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
