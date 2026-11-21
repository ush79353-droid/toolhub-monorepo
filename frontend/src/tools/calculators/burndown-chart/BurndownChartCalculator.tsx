'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { BurndownChartForm } from './BurndownChartForm';
import { BurndownChartResults } from './BurndownChartResults';
import { calculateBurndown, formatPoints } from './calculation';
import type { BurndownChartFieldErrors, BurndownChartResult } from './types';
import {
  createDefaultDraft,
  validateBurndownDraft,
  type BurndownDraft,
} from './validation';

export function BurndownChartCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [draft, setDraft] = React.useState<BurndownDraft>(() => createDefaultDraft());
  const [errors, setErrors] = React.useState<BurndownChartFieldErrors>({});
  const [result, setResult] = React.useState<BurndownChartResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: BurndownDraft) => {
    const validation = validateBurndownDraft(next);
    setErrors(validation.errors);
    if (validation.isValid && validation.parsed) {
      setResult(calculateBurndown(validation.parsed, validation.progressThroughDay));
    } else {
      setResult(null);
    }
  };

  const handleReset = () => {
    const fresh = createDefaultDraft();
    setDraft(fresh);
    setErrors({});
    setResult(null);
  };

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Sprint duration: ${draft.sprintDuration} working days`,
        `Total story points: ${draft.totalStoryPoints}`,
        `Progress through day: ${result.actualThroughDay}`,
        `Total burned: ${formatPoints(result.totalBurned)}`,
        `Remaining: ${formatPoints(result.remainingPoints)}`,
      ].join('\n')
    : '';

  return (
    <section
      aria-label={`${metadata.title} calculator panel`}
      className={`overflow-hidden rounded-2xl border border-border bg-white ${
        isEmbed ? 'shadow-sm' : 'shadow-[0_12px_40px_-16px_rgba(22,60,67,0.28)]'
      } ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border bg-muted/45 px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-[15px] font-semibold text-accent">Calculator</h2>
          <p className="text-xs font-normal text-muted-foreground">
            Ideal vs actual remaining story points
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <BurndownChartForm
          draft={draft}
          errors={errors}
          onChange={(next) => {
            setDraft(next);
            run(next);
          }}
          onReset={handleReset}
        />
        <BurndownChartResults result={result} />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!summary}
            onClick={async () => {
              if (!summary) return;
              if (await copyTextToClipboard(summary)) {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              }
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!summary}
              onClick={async () => {
                if (!summary) return;
                try {
                  await navigator.share({ title: metadata.title, text: summary });
                  setShared(true);
                  window.setTimeout(() => setShared(false), 2000);
                } catch {
                  // User dismissed the share sheet.
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
