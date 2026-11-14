'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import type { LiquidNetWorthResult } from './types';

interface LiquidNetWorthResultsProps {
  result: LiquidNetWorthResult | null;
  invalid: boolean;
  incomplete: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function LiquidNetWorthResults({
  result,
  invalid,
  incomplete,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: LiquidNetWorthResultsProps) {
  if (invalid) {
    return (
      <p className="text-sm text-muted-foreground">
        Fix the highlighted fields to calculate liquid net worth.
      </p>
    );
  }

  if (incomplete || !result) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter total liquid assets and total liabilities. Results update as you type.{' '}
        {CURRENCY_DENOMINATION_NOTE}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.liquidNetWorth < 0
          ? 'Negative liquid net worth means liabilities exceed liquid assets.'
          : result.liquidNetWorth === 0
            ? 'Liquid assets exactly cover liabilities.'
            : 'Positive liquid net worth means liquid assets exceed liabilities.'}{' '}
        {CURRENCY_DENOMINATION_NOTE}
      </p>
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
