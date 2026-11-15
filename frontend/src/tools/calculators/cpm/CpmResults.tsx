'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';

interface CpmResultsProps {
  ready: boolean;
  incomplete: boolean;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

/** Compact share actions — solved values stay in the three fields (ADR-023). */
export function CpmResults({
  ready,
  incomplete,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: CpmResultsProps) {
  if (invalid) {
    return (
      <p className="text-sm text-muted-foreground">
        Fix the highlighted fields. Enter any two valid values to solve the third.
      </p>
    );
  }

  if (incomplete || !ready) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter any two of campaign cost, CPM, and impressions. Open Second campaign to compare.
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
