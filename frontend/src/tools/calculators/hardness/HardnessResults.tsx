'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatHardness } from './calculation';
import {
  HARDNESS_MATERIAL_LABELS,
  HARDNESS_SCALES,
  type HardnessConversionResult,
} from './types';

interface HardnessResultsProps {
  result: HardnessConversionResult | null;
  pending: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function HardnessResults({
  result,
  pending,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: HardnessResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (pending || !result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Select a scale, enter a hardness value within the verified reference range, and estimated
        equivalents will appear here.
      </p>
    );
  }

  const unavailable = result.warnings.some((w) => w.includes('No verified conversion'));

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Conversion results
        </p>
        <p className="mt-2 text-sm text-accent">
          Input:{' '}
          <span className="font-mono font-semibold tabular-nums">
            {result.sourceValue} {result.sourceScale}
          </span>
        </p>
        <p className="mt-1 text-sm text-accent">
          Material: {HARDNESS_MATERIAL_LABELS[result.material]}
        </p>

        <p className="mt-4 text-xs font-medium text-muted-foreground">Estimated equivalents</p>
        <ul className="mt-2 space-y-1.5">
          {HARDNESS_SCALES.map((scale) => (
            <li
              key={scale}
              className="flex items-baseline justify-between gap-3 border-b border-border/60 py-1.5 last:border-0"
            >
              <span className="text-sm text-muted-foreground">{scale}</span>
              <span className="font-mono text-sm font-semibold tabular-nums text-accent">
                {scale === result.sourceScale
                  ? String(result.sourceValue)
                  : formatHardness(result.converted[scale])}
              </span>
            </li>
          ))}
        </ul>

        {unavailable ? (
          <p className="mt-3 text-xs text-amber-800" role="status">
            No verified conversion is available for this hardness value and material under the
            selected reference.
          </p>
        ) : null}

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{result.reference}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy} disabled={unavailable}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10"
          onClick={onShare}
          disabled={unavailable && !canShare}
        >
          {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
          {shared ? (canShare ? 'Shared' : 'Copied') : 'Share result'}
        </Button>
      </div>

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
    </div>
  );
}
