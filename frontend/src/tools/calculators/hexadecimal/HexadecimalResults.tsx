'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type {
  BinaryToHexResult,
  DecimalToHexResult,
  HexToBothResult,
} from './types';

interface HexadecimalResultsProps {
  decimalResult: DecimalToHexResult | null;
  binaryResult: BinaryToHexResult | null;
  hexResult: HexToBothResult | null;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function HexadecimalResults({
  decimalResult,
  binaryResult,
  hexResult,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: HexadecimalResultsProps) {
  const hasAny = Boolean(decimalResult || binaryResult || hexResult);

  if (!hasAny) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a decimal, binary, or hexadecimal integer in any section to see results.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion summary
        </p>
        <div className="mt-3 space-y-2 font-mono text-sm tabular-nums text-accent">
          {decimalResult ? (
            <p className="break-all">
              <span className="font-sans text-xs text-muted-foreground">Decimal → hex: </span>
              {decimalResult.decimal}
              <sub className="font-sans text-[10px]">₁₀</sub> = {decimalResult.hexadecimal}
              <sub className="font-sans text-[10px]">₁₆</sub>
            </p>
          ) : null}
          {binaryResult ? (
            <p className="break-all">
              <span className="font-sans text-xs text-muted-foreground">Binary → hex: </span>
              {binaryResult.binaryNormalized}
              <sub className="font-sans text-[10px]">₂</sub> = {binaryResult.hexadecimal}
              <sub className="font-sans text-[10px]">₁₆</sub>
            </p>
          ) : null}
          {hexResult ? (
            <p className="break-all">
              <span className="font-sans text-xs text-muted-foreground">Hex → dec/bin: </span>
              {hexResult.hexadecimalNormalized}
              <sub className="font-sans text-[10px]">₁₆</sub> = {hexResult.decimal}
              <sub className="font-sans text-[10px]">₁₀</sub> = {hexResult.binary}
              <sub className="font-sans text-[10px]">₂</sub>
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
