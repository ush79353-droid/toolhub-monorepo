'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import type { SaasLifetimeValueResult } from './types';

interface SaasLifetimeValueResultsProps {
  result: SaasLifetimeValueResult | null;
  invalid: boolean;
  incomplete: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function SaasLifetimeValueResults({
  result,
  invalid,
  incomplete,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: SaasLifetimeValueResultsProps) {
  if (invalid) {
    return (
      <p className="text-sm text-muted-foreground">
        Fix the highlighted fields to estimate customer lifetime value.
      </p>
    );
  }

  if (incomplete || !result) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter ARPA (or revenue and accounts), gross margin, churn, and account expansion.{' '}
        {CURRENCY_DENOMINATION_NOTE}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs leading-relaxed text-muted-foreground">
        {result.customerLifetimeValue === null
          ? 'No finite LTV estimate when churn is zero; lifetime would be unbounded in this simple model.'
          : 'LTV uses the same period for ARPA, expansion, and churn. Expansion is added to ARPA before applying margin and churn.'}{' '}
        {CURRENCY_DENOMINATION_NOTE}
      </p>
      {result.customerLifetimeValue !== null ? (
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
      ) : null}
    </div>
  );
}
