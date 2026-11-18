'use client';

import * as React from 'react';
import { Check, Copy, Share2, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CalorieBreakdown } from './calculation';
import { formatGrams, formatKcal } from './calculation';

interface GramsToCaloriesResultsProps {
  result: CalorieBreakdown | null;
  copied: boolean;
  shared: boolean;
  canShare: boolean;
  onCopy: () => void;
  onShare: () => void;
}

function pctLabel(pct: number | null): string {
  if (pct == null) return '—';
  return `${formatKcal(pct)}%`;
}

export function GramsToCaloriesResults({
  result,
  copied,
  shared,
  canShare,
  onCopy,
  onShare,
}: GramsToCaloriesResultsProps) {
  const [feedback, setFeedback] = React.useState<'yes' | 'no' | null>(null);

  if (result == null) {
    return (
      <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        Enter macronutrient grams to estimate kilocalories. Alcohol is optional.
      </p>
    );
  }

  const rows = [
    { label: 'Calories from carbs', kcal: result.carbsKcal, pct: result.carbsPct },
    { label: 'Calories from protein', kcal: result.proteinKcal, pct: result.proteinPct },
    { label: 'Calories from fat', kcal: result.fatKcal, pct: result.fatPct },
    { label: 'Calories from alcohol', kcal: result.alcoholKcal, pct: result.alcoholPct },
  ];

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl border border-border bg-brand-softTeal/40 px-4 py-4 sm:px-5"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Results
        </p>
        <ul className="mt-3 space-y-2 text-sm text-accent">
          {rows.map((row) => (
            <li key={row.label} className="flex flex-wrap items-baseline justify-between gap-2">
              <span>{row.label}</span>
              <span className="font-mono tabular-nums">
                {formatKcal(row.kcal)} kcal
                <span className="ml-2 text-xs text-muted-foreground">({pctLabel(row.pct)})</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-border/60 pt-3 font-semibold text-accent">
          <span>Total calories</span>
          <span className="font-mono tabular-nums">{formatKcal(result.totalKcal)} kcal</span>
        </p>
        {result.alcoholGramsUsed > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Alcohol mass used: {formatGrams(result.alcoholGramsUsed)} g ethanol (estimate).
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-10" onClick={onCopy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied' : 'Copy result'}
        </Button>
        <Button type="button" variant="outline" className="h-10" onClick={onShare}>
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
