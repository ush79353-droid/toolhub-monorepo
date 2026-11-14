'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';

interface PaybackPeriodResultsProps {
  hasResult: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function PaybackPeriodResults({
  hasResult,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: PaybackPeriodResultsProps) {
  if (!hasResult) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter an initial investment and cash flows to estimate payback and discounted payback.
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
