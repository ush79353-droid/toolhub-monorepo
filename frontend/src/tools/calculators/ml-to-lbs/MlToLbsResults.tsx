'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatMeasure } from './calculation';
import {
  DENSITY_UNIT_OPTIONS,
  MASS_UNIT_OPTIONS,
  VOLUME_UNIT_OPTIONS,
  type MlToLbsResult,
} from './types';

interface MlToLbsResultsProps {
  result: MlToLbsResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function MlToLbsResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: MlToLbsResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter a nonnegative volume or mass and a positive density. Milliliters and pounds are not
        interchangeable without density.
      </p>
    );
  }

  if (!result) {
    return (
      <div className="space-y-4">
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Results appear after you enter volume or mass with a valid density. Fields start empty;
          water defaults to ≈ 1000 kg/m³.
        </p>
        <FeedbackRow feedback={feedback} setFeedback={setFeedback} />
      </div>
    );
  }

  const densityLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  const volumeLabel =
    VOLUME_UNIT_OPTIONS.find((o) => o.value === result.volumeUnit)?.label ?? result.volumeUnit;
  const massLabel =
    MASS_UNIT_OPTIONS.find((o) => o.value === result.massUnit)?.label ?? result.massUnit;

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Volume ↔ mass
        </p>
        <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-accent sm:text-xl">
          {formatMeasure(result.volumeValue)} {volumeLabel} = {formatMeasure(result.massValue)}{' '}
          {massLabel}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.substanceName}
          {result.densityApproximate ? ' (approx. density)' : ''} ·{' '}
          {formatMeasure(result.densityValue)} {densityLabel}
        </p>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-relaxed text-muted-foreground">
          {result.explanation}
        </pre>
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
