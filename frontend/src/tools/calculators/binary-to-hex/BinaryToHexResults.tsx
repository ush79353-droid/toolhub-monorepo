'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { BinaryConversionResult, HexToBinaryResult } from './types';

interface BinaryToHexResultsProps {
  forward: BinaryConversionResult | null;
  reverse: HexToBinaryResult | null;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2.5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 break-all font-mono text-lg font-semibold tabular-nums text-accent">
        {value}
      </p>
    </div>
  );
}

export function BinaryToHexResults({
  forward,
  reverse,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: BinaryToHexResultsProps) {
  if (!forward) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a binary integer to see hexadecimal, decimal, and octal results.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-accent">Results</p>
        <ResultRow label="Hexadecimal (Base 16)" value={forward.hexadecimal} />
        <ResultRow label="Decimal (Base 10)" value={forward.decimal} />
        <ResultRow label="Octal (Base 8)" value={forward.octal} />
        <p className="font-mono text-xs text-muted-foreground">
          {forward.binaryNormalized}
          <sub>₂</sub> = {forward.hexadecimal}
          <sub>₁₆</sub>
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

      {reverse ? (
        <p className="sr-only">
          Reverse conversion also available: {reverse.hexadecimalNormalized} hex = {reverse.binary}{' '}
          binary.
        </p>
      ) : null}
    </div>
  );
}
