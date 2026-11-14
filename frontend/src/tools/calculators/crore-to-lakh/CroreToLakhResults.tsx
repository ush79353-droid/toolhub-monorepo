'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { CroreLakhResult } from './types';

interface CroreToLakhResultsProps {
  result: CroreLakhResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function CroreToLakhResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: CroreToLakhResultsProps) {
  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid crore or lakh value to convert.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter a value in either field.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion summary
        </p>
        <p className="mt-3 font-mono text-base font-semibold tabular-nums text-accent">
          {result.croreDisplay} crore = {result.lakhDisplay} lakh
        </p>
        <div className="mt-3 space-y-1 text-xs text-muted-foreground">
          <p>
            International:{' '}
            <span className="font-mono tabular-nums text-accent">
              {result.absoluteInternational}
            </span>
          </p>
          <p>
            Indian:{' '}
            <span className="font-mono tabular-nums text-accent">{result.absoluteIndian}</span>
          </p>
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
