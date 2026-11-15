'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import { RateOfReturnForm } from './RateOfReturnForm';
import { RateOfReturnResults } from './RateOfReturnResults';
import {
  COMPOUNDING_OPTIONS,
  CASH_FLOW_FREQUENCY_OPTIONS,
  createDefaultInput,
  type RateOfReturnFieldErrors,
  type RateOfReturnInput,
  type RateOfReturnResult,
} from './types';
import { validateRateOfReturnInput } from './validation';

export function RateOfReturnCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<RateOfReturnInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<RateOfReturnFieldErrors>(() => {
    const seed = validateRateOfReturnInput(createDefaultInput());
    return seed.errors;
  });
  const [result, setResult] = React.useState<RateOfReturnResult | null>(() => {
    const seed = validateRateOfReturnInput(createDefaultInput());
    return seed.isValid ? seed.result : null;
  });
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: RateOfReturnInput) => {
    setInput(next);
    const validation = validateRateOfReturnInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    const validation = validateRateOfReturnInput(fresh);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
    setCopied(false);
    setShared(false);
  };

  const compoundingLabel =
    COMPOUNDING_OPTIONS.find((o) => o.value === input.compounding)?.label ?? input.compounding;
  const cashFlowLabel =
    CASH_FLOW_FREQUENCY_OPTIONS.find((o) => o.value === input.cashFlowFrequency)?.label ??
    input.cashFlowFrequency;

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Initial investment: ${formatCurrencyValue(result.initialInvestment, result.currency)}`,
        `Final amount received: ${formatCurrencyValue(result.finalAmount, result.currency)}`,
        `Investment length: ${input.term} ${input.termUnit}`,
        `Compounding method: ${compoundingLabel}`,
        `Deposit or withdrawal: ${formatCurrencyValue(result.periodicCashFlow, result.currency)}`,
        `Cash flow frequency: ${cashFlowLabel}`,
        `Timing: ${result.paymentTiming === 'end' ? 'End of period' : 'Beginning of period'}`,
        `The rate of return is ${result.formattedRate}%.`,
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
            Annual nominal rate of return · {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <RateOfReturnForm
          input={input}
          errors={errors}
          result={result}
          onChange={apply}
          onReset={handleReset}
        />
        <RateOfReturnResults />
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
