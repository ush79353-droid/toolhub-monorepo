'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatMeasure } from './calculation';
import type { AreaResult, LengthResult } from './types';

interface GajToSqYdResultsProps {
  area: AreaResult | null;
  length: LengthResult | null;
  areaInvalid: boolean;
  lengthInvalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function GajToSqYdResults({
  area,
  length,
  areaInvalid,
  lengthInvalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: GajToSqYdResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (areaInvalid && !area && !length) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a non-negative land area in gaj or square yards to convert.
      </p>
    );
  }

  if (!area && !length && !lengthInvalid) {
    return (
      <div className="space-y-4">
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Results appear here after you enter a land area (or open the length section). Fields start
          empty.
        </p>
        <FeedbackRow feedback={feedback} setFeedback={setFeedback} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {area ? (
        <div
          className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
          aria-live="polite"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Land area result
          </p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-accent sm:text-xl">
            {formatMeasure(area.gaj)} gaj = {formatMeasure(area.squareYards)} yd²
          </p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {formatMeasure(area.squareFeet)} ft² · {area.explanation}
          </p>
        </div>
      ) : null}

      {length ? (
        <div
          className="rounded-xl border border-border bg-muted/30 px-4 py-4 sm:px-5"
          aria-live="polite"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Length result
          </p>
          <p className="mt-1 font-mono text-base font-semibold tabular-nums text-accent sm:text-lg">
            {formatMeasure(length.linearGaj)} gaj = {formatMeasure(length.yards)} yd
          </p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">{length.explanation}</p>
        </div>
      ) : null}

      {(area || length) && (
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
      )}

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
