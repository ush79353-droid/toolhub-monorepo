'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { AnnualizedRateOfReturnForm } from './AnnualizedRateOfReturnForm';
import { AnnualizedRateOfReturnResults } from './AnnualizedRateOfReturnResults';
import { PERIOD_OPTIONS, type AnnualizedRateOfReturnFieldErrors, type AnnualizedRateOfReturnInput, type AnnualizedRateOfReturnResult } from './types';
import { validateAnnualizedRateOfReturnInput } from './validation';

const INITIAL_INPUT: AnnualizedRateOfReturnInput = {
  period: 'annual',
  periodRate: '',
};

export function AnnualizedRateOfReturnCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<AnnualizedRateOfReturnInput>(INITIAL_INPUT);
  const [errors, setErrors] = React.useState<AnnualizedRateOfReturnFieldErrors>({});
  const [result, setResult] = React.useState<AnnualizedRateOfReturnResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: AnnualizedRateOfReturnInput) => {
    const validation = validateAnnualizedRateOfReturnInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReset = () => {
    setInput(INITIAL_INPUT);
    setErrors({});
    setResult(null);
  };

  const periodLabel =
    PERIOD_OPTIONS.find((option) => option.value === input.period)?.label ?? input.period;

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Period: ${periodLabel}`,
        `Period rate: ${input.periodRate}%`,
        `Annualized rate of return: ${result.formattedRate}%`,
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
            Annualized return = ((1 + period rate ÷ 100)^N − 1) × 100
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <AnnualizedRateOfReturnForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={handleReset}
        />
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
                  // dismissed
                }
              }}
            >
              {shared ? 'Shared' : 'Share'}
            </Button>
          ) : null}
        </div>
        <AnnualizedRateOfReturnResults />
      </div>
    </section>
  );
}
