'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';

interface ManHoursResultsProps {
  hasResult: boolean;
  incomplete: boolean;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function ManHoursResults({
  hasResult,
  incomplete,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: ManHoursResultsProps) {
  if (invalid) {
    return (
      <p className="text-sm text-rose-600" role="alert">
        Fix the highlighted fields to see man-hours and cost.
      </p>
    );
  }

  if (!hasResult) {
    return (
      <p className="text-sm text-muted-foreground">
        {incomplete
          ? 'Enter people, hours per person, and hourly pay to calculate.'
          : 'Enter valid inputs to calculate man-hours and cost.'}
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
