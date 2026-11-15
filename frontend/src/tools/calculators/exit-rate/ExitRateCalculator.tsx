'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { ExitRateForm } from './ExitRateForm';
import { ExitRateResults } from './ExitRateResults';
import { calculateExitRate } from './calculation';
import type { ExitRateFieldErrors, ExitRateInput, ExitRateResult } from './types';
import { validateExitRateInput } from './validation';

const INITIAL_INPUT: ExitRateInput = {
  pageviews: '',
  exits: '',
};

export function ExitRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<ExitRateInput>(INITIAL_INPUT);
  const [errors, setErrors] = React.useState<ExitRateFieldErrors>({});
  const [result, setResult] = React.useState<ExitRateResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const handleInputChange = (field: keyof ExitRateInput, value: string) => {
    const nextInput = { ...input, [field]: value };
    setInput(nextInput);

    const validation = validateExitRateInput(nextInput);
    setErrors(validation.errors);

    if (validation.isValid && validation.parsedValues) {
      setResult(
        calculateExitRate(validation.parsedValues.pageviews, validation.parsedValues.exits)
      );
    } else {
      setResult(null);
    }
  };

  const handleReset = () => {
    setInput(INITIAL_INPUT);
    setErrors({});
    setResult(null);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Number of pageviews: ${input.pageviews}`,
        `Number of exits: ${input.exits}`,
        `Exit rate: ${result.formattedRate}%`,
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
            Exit rate = (exits ÷ pageviews) × 100
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <ExitRateForm
          input={input}
          errors={errors}
          result={result}
          onInputChange={handleInputChange}
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
        <ExitRateResults />
      </div>
    </section>
  );
}
