'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { BusinessBudgetResult } from './types';

interface BusinessBudgetResultsProps {
  result: BusinessBudgetResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

/** Compact share actions — summary totals stay inline (ADR-023). */
export function BusinessBudgetResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: BusinessBudgetResultsProps) {
  if (invalid) {
    return (
      <p className="text-sm text-muted-foreground">
        Fix the highlighted fields to update the budget summary.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter income and expenses to see totals and budget balance.
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
