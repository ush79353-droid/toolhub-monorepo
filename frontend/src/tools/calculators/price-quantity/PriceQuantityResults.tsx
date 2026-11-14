'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import type { PriceQuantityResult } from './types';

interface PriceQuantityResultsProps {
  result: PriceQuantityResult | null;
  invalid: boolean;
  incomplete: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function PriceQuantityResults({
  result,
  invalid,
  incomplete,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: PriceQuantityResultsProps) {
  if (invalid) {
    return (
      <p className="text-sm text-muted-foreground">
        Fix the highlighted fields to compare price per unit and savings.
      </p>
    );
  }

  if (incomplete || !result) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter quantity and price for both products. Results update as you type.{' '}
        {CURRENCY_DENOMINATION_NOTE}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.youSave < 0
          ? 'Negative savings means the larger product costs more per unit than the smaller one.'
          : result.youSave === 0
            ? 'Both products cost the same per unit at these quantities.'
            : 'Positive savings means buying the larger product is cheaper per unit.'}{' '}
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
