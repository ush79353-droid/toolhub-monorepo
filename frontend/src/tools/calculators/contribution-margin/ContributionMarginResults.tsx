'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import type { ContributionMarginResult } from './types';

interface ContributionMarginResultsProps {
  result: ContributionMarginResult | null;
  invalid: boolean;
  incomplete: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function ContributionMarginResults({
  result,
  invalid,
  incomplete,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: ContributionMarginResultsProps) {
  if (invalid) {
    return (
      <p className="text-sm text-muted-foreground">
        Fix the highlighted fields to calculate contribution margin, ratio, and profit.
      </p>
    );
  }

  if (incomplete || !result) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter selling price, variable cost, units, and fixed costs. Results update as you type.{' '}
        {CURRENCY_DENOMINATION_NOTE}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.contributionMarginRatioPercent === null
          ? 'Contribution margin ratio is omitted when selling price is zero so the page never shows Infinity or NaN.'
          : 'Profit can be negative when fixed costs exceed contribution margin.'}{' '}
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
