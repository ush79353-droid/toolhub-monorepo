'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { MatrixDisplay } from './MatrixDisplay';
import type { RrefResult } from './types';

interface RrefResultsProps {
  result: RrefResult | null;
  copied: boolean;
  onCopy: () => void;
}

export function RrefResults({ result, copied, onCopy }: RrefResultsProps) {
  const [stepsOpen, setStepsOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});

  if (!result) {
    return (
      <div className="flex min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-5 text-center">
        <p className="text-sm font-medium text-accent">Results appear here</p>
        <p className="mt-1 max-w-sm text-xs font-normal leading-relaxed text-muted-foreground">
          Enter a matrix and click Calculate RREF to see the reduced form, rank, and steps.
        </p>
      </div>
    );
  }

  const allExpanded = result.steps.every((step) => expanded[step.index]);

  const expandAll = () => {
    const next: Record<number, boolean> = {};
    result.steps.forEach((step) => {
      next[step.index] = true;
    });
    setExpanded(next);
    setStepsOpen(true);
  };

  const collapseAll = () => {
    setExpanded({});
  };

  return (
    <div className="space-y-3.5">
      <div className="rounded-xl border border-primary/20 bg-brand-softTeal/70 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-[13px] font-medium text-accent">Reduced Row Echelon Form</p>
            <p className="mt-0.5 text-xs font-normal text-muted-foreground">
              Exact rational arithmetic · Gauss–Jordan elimination
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-8 bg-white px-2.5 text-xs font-medium"
            onClick={onCopy}
          >
            {copied ? 'Copied' : 'Copy Results'}
          </Button>
        </div>
        <div className="mt-3">
          <MatrixDisplay
            matrix={result.rref}
            pivotColumns={result.pivotColumns}
            aria-label="RREF matrix"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: 'Rank', value: String(result.rank) },
          { label: 'Nullity', value: String(result.nullity) },
          {
            label: 'Pivot columns',
            value: result.pivotColumns.length
              ? result.pivotColumns.join(', ')
              : 'None',
          },
          {
            label: 'Free columns',
            value: result.freeColumns.length ? result.freeColumns.join(', ') : 'None',
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="flex min-h-[68px] flex-col justify-between rounded-xl border border-border bg-white p-3"
          >
            <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-[15px] font-semibold text-accent tabular-nums sm:text-base">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {result.augmented && result.augmentedAnalysis.kind !== 'not_augmented' ? (
        <div className="rounded-xl border border-border bg-white p-3.5">
          <p className="text-[13px] font-medium text-accent">Linear system</p>
          <p className="mt-1 text-xs font-normal leading-relaxed text-muted-foreground">
            {result.augmentedAnalysis.message}
          </p>
          {result.augmentedAnalysis.uniqueSolution ? (
            <p className="mt-2 text-sm font-medium text-accent tabular-nums">
              Solution:{' '}
              {result.augmentedAnalysis.uniqueSolution
                .map((v, i) => `x${i + 1} = ${v}`)
                .join(', ')}
            </p>
          ) : null}
          {result.augmentedAnalysis.freeVariables.length > 0 ? (
            <p className="mt-1 text-xs font-normal text-muted-foreground">
              Free variables:{' '}
              {result.augmentedAnalysis.freeVariables.map((v) => `x${v}`).join(', ')}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3.5 py-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setStepsOpen((open) => !open)}
            aria-expanded={stepsOpen}
          >
            Step-by-step solution ({result.steps.length})
            {stepsOpen ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
          {stepsOpen ? (
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs font-medium text-primary hover:underline"
                onClick={allExpanded ? collapseAll : expandAll}
              >
                {allExpanded ? 'Collapse All' : 'Expand All'}
              </button>
            </div>
          ) : null}
        </div>

        {stepsOpen ? (
          <ol className="divide-y divide-border">
            {result.steps.map((step) => {
              const open = Boolean(expanded[step.index]);
              return (
                <li key={step.index} className="px-3.5 py-2.5">
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-2 text-left"
                    onClick={() =>
                      setExpanded((prev) => ({ ...prev, [step.index]: !prev[step.index] }))
                    }
                    aria-expanded={open}
                  >
                    <span className="text-xs font-medium text-accent">
                      <span className="tabular-nums text-muted-foreground">{step.index}.</span>{' '}
                      {step.description}
                    </span>
                    {open ? (
                      <ChevronUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    )}
                  </button>
                  {open ? (
                    <div className="mt-2">
                      <MatrixDisplay matrix={step.matrix} aria-label={`Matrix after step ${step.index}`} />
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-border bg-background/70 px-3.5 py-2.5 text-xs font-normal leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        <p>
          Pivot columns are highlighted in teal. Calculations use exact fractions — intermediate
          values are not rounded for display convenience.
        </p>
      </div>
    </div>
  );
}
