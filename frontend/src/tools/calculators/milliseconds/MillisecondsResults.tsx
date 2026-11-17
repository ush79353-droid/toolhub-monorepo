'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TIME_UNIT_DEFS, type TimeUnit } from './types';

interface MillisecondsResultsProps {
  rows: readonly { unit: TimeUnit; value: string }[] | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function MillisecondsResults({
  rows,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: MillisecondsResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a valid finite duration in any field to convert.
      </p>
    );
  }

  if (!rows) {
    return (
      <div className="space-y-4">
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Results appear here after you enter a duration. Fields start empty.
        </p>
        <FeedbackRow feedback={feedback} setFeedback={setFeedback} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion result
        </p>
        <ul className="mt-2 space-y-1 font-mono text-sm tabular-nums text-accent sm:text-[15px]">
          {rows.map((row) => (
            <li key={row.unit}>
              {row.value} {TIME_UNIT_DEFS[row.unit].symbol}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          1 s = 1000 ms · years use 365.25-day average (shared time engine)
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={onShare}
          disabled={!canShare}
        >
          {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
          {shared ? 'Shared' : 'Share result'}
        </Button>
      </div>

      <FeedbackRow feedback={feedback} setFeedback={setFeedback} />
    </div>
  );
}

function FeedbackRow({
  feedback,
  setFeedback,
}: {
  feedback: 'yes' | 'no' | null;
  setFeedback: (value: 'yes' | 'no') => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
      <span>Did we solve your problem today?</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setFeedback('yes')}
          className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
            feedback === 'yes'
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-muted-foreground hover:text-foreground'
          }`}
        >
          <ThumbsUp className="h-3 w-3" />
          <span>Yes</span>
        </button>
        <button
          type="button"
          onClick={() => setFeedback('no')}
          className={`flex items-center gap-1 rounded-md border px-2 py-1 transition-colors ${
            feedback === 'no'
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-muted-foreground hover:text-foreground'
          }`}
        >
          <ThumbsDown className="h-3 w-3" />
          <span>No</span>
        </button>
      </div>
    </div>
  );
}
