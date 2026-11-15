'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Share2 } from 'lucide-react';
import type { TenureResult } from './types';

interface TenureResultsProps {
  result: TenureResult;
  hasErrors: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

/** Share/copy actions only — metrics stay inline (ADR-023). */
export function TenureResults({
  result,
  hasErrors,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: TenureResultsProps) {
  const hasResult = Boolean(result.average || result.specific);

  if (hasErrors) {
    return (
      <p className="text-sm text-muted-foreground">
        Fix the highlighted fields to calculate tenure.
      </p>
    );
  }

  if (!hasResult) {
    return (
      <p className="text-sm text-muted-foreground">
        Enter employees and combined service for average tenure, and/or both dates for a
        specific service duration.
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
