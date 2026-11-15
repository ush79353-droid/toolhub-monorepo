'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { AnnualizedReturnResult } from './types';

interface AnnualizedReturnResultsProps {
  result: AnnualizedReturnResult | null;
  hasErrors: boolean;
  incomplete: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

/** Share/copy actions only — annualized % stays inline (ADR-023). */
export function AnnualizedReturnResults({
  result,
  hasErrors,
  incomplete,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: AnnualizedReturnResultsProps) {
  if (hasErrors) {
    return (
      <p className="text-sm text-muted-foreground">
        Fix the highlighted fields to calculate annualized return.
      </p>
    );
  }

  if (incomplete || !result) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter the fields for your selected method to see annualized return.
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
