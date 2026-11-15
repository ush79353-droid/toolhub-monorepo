'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE } from '@/tools/shared/currency';
import { ContinuousCompoundInterestForm } from './ContinuousCompoundInterestForm';
import { ContinuousCompoundInterestResults } from './ContinuousCompoundInterestResults';
import { describeResult } from './calculation';
import {
  createDefaultInput,
  type ContinuousCompoundInterestFieldErrors,
  type ContinuousCompoundInterestInput,
  type ContinuousCompoundInterestResult,
} from './types';
import { validateContinuousCompoundInterestInput } from './validation';

export function ContinuousCompoundInterestCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<ContinuousCompoundInterestInput>(() =>
    createDefaultInput(),
  );
  const [errors, setErrors] = React.useState<ContinuousCompoundInterestFieldErrors>(() =>
    validateContinuousCompoundInterestInput(createDefaultInput()).errors,
  );
  const [result, setResult] = React.useState<ContinuousCompoundInterestResult | null>(() =>
    validateContinuousCompoundInterestInput(createDefaultInput()).result,
  );
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const run = (next: ContinuousCompoundInterestInput) => {
    const validation = validateContinuousCompoundInterestInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setCopied(false);
    setShared(false);
    run(fresh);
  };

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Initial balance: ${input.initialBalance} ${input.currency}`,
        `Interest rate: ${input.interestRate}%`,
        `Term: ${input.termYears || '0'} yrs, ${input.termMonths || '0'} mos`,
        `Additional deposits: ${input.depositFrequency}`,
        describeResult(result),
        CURRENCY_DENOMINATION_NOTE,
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
            Continuous compounding with optional deposits. {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <ContinuousCompoundInterestForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setInput(next);
            run(next);
          }}
          onReset={handleReset}
        />
        <ContinuousCompoundInterestResults />
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
      </div>
    </section>
  );
}
