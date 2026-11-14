'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { BradfordFactorResult } from './types';

interface BradfordFactorResultsProps {
  result: BradfordFactorResult | null;
  invalid: boolean;
  incomplete: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

/** Compact share actions only — B is shown inline in the form (ADR-023). */
export function BradfordFactorResults({
  result,
  invalid,
  incomplete,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: BradfordFactorResultsProps) {
  if (invalid) {
    return (
      <p className="text-sm text-muted-foreground">
        Fix the highlighted fields to calculate the Bradford factor.
      </p>
    );
  }

  if (incomplete || !result) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter times absent and days absent to see the Bradford factor.
      </p>
    );
  }

  return (
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
  );
}
