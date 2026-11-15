'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import type { OperatingAssetTurnoverResult } from './types';

interface OperatingAssetTurnoverResultsProps {
  result: OperatingAssetTurnoverResult | null;
  invalid: boolean;
  incomplete: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function OperatingAssetTurnoverResults({
  result,
  invalid,
  incomplete,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: OperatingAssetTurnoverResultsProps) {
  if (invalid) {
    return (
      <p className="text-sm text-muted-foreground">
        Fix the highlighted fields to calculate operating assets and turnover.
      </p>
    );
  }

  if (incomplete || !result) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter the operating asset lines (and sales for turnover). Results update as you type.{' '}
        {CURRENCY_DENOMINATION_NOTE}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.sales === null
          ? 'Operating assets are ready. Enter sales to see turnover.'
          : result.operatingAssetTurnover === null
            ? 'Operating asset turnover is omitted when operating assets are zero so the page never shows Infinity or NaN.'
            : 'Turnover is how many times sales cover the operating asset base in the period.'}{' '}
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
