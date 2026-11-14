'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { FifoInventoryResult } from './types';

interface FifoInventoryResultsProps {
  result: FifoInventoryResult | null;
  invalid: boolean;
  incomplete: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

/** Compact share actions — revenue/COGS/margin stay in the results section (ADR-023). */
export function FifoInventoryResults({
  result,
  invalid,
  incomplete,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: FifoInventoryResultsProps) {
  if (invalid) {
    return (
      <p className="text-sm text-muted-foreground">
        Fix the highlighted fields to calculate FIFO revenue and margin.
      </p>
    );
  }

  if (incomplete || !result) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter purchase batches, units sold, and selling price to see FIFO results.
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
