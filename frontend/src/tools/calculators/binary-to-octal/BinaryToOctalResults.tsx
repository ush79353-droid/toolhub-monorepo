'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { BinaryOctalResult } from './types';

interface BinaryToOctalResultsProps {
  result: BinaryOctalResult | null;
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

export function BinaryToOctalResults({
  result,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: BinaryToOctalResultsProps) {
  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a value to convert between binary and octal.
      </p>
    );
  }

  const isBinaryMode = result.direction === 'binary-to-octal';

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-accent">
          {isBinaryMode ? 'Octal representation' : 'Binary representation'}
        </p>
        <ResultRow
          label={isBinaryMode ? 'Octal (Base 8)' : 'Binary (Base 2)'}
          value={result.output}
        />
        <p className="font-mono text-xs text-muted-foreground">
          {isBinaryMode ? (
            <>
              {result.inputNormalized}
              <sub>₂</sub> = {result.output}
              <sub>₈</sub>
            </>
          ) : (
            <>
              {result.inputNormalized}
              <sub>₈</sub> = {result.output}
              <sub>₂</sub>
            </>
          )}
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
