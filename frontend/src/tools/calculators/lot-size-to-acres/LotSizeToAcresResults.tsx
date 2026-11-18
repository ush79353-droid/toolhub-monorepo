'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { areaUnitLabel, formatMeasure } from './calculation';
import type { LotSizeToAcresResult } from './types';

interface LotSizeToAcresResultsProps {
  result: LotSizeToAcresResult | null;
  invalid: boolean;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export function LotSizeToAcresResults({
  result,
  invalid,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: LotSizeToAcresResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (invalid) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter non-negative width and length, or area plus one side, to calculate lot size.
      </p>
    );
  }

  if (!result) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Results appear here after you enter lot dimensions or area.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Lot area
        </p>
        <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-accent">
          {formatMeasure(result.area)}{' '}
          <span className="text-lg font-semibold text-primary">
            {areaUnitLabel(result.areaUnit)}
          </span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatMeasure(result.width)} {result.widthUnit} × {formatMeasure(result.length)}{' '}
          {result.lengthUnit} · {formatMeasure(result.acres)} ac
        </p>
        <p className="mt-2 font-mono text-xs text-muted-foreground">{result.explanation}</p>
      </div>

      {result.totalPrice !== null ? (
        <div className="rounded-xl border border-border px-4 py-3.5 sm:px-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total price
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-accent">
            {formatCurrencyValue(result.totalPrice, result.currency)}
          </p>
          {result.pricePerUnit !== null ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCurrencyValue(result.pricePerUnit, result.currency)} per{' '}
              {areaUnitLabel(result.priceAreaUnit)}
            </p>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        <Button type="button" variant="outline" className="h-10" onClick={onShare} disabled={!canShare}>
          {shared ? <Check className="mr-1.5 h-4 w-4" /> : <Share2 className="mr-1.5 h-4 w-4" />}
          {shared ? 'Shared' : 'Share result'}
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
