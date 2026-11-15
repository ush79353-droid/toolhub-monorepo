'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { DiscountRateForm } from './DiscountRateForm';
import {
  CASH_FLOW_FREQUENCY_OPTIONS,
  COMPOUND_OPTIONS,
  createDefaultInput,
  type DiscountRateFieldErrors,
  type DiscountRateInput,
  type DiscountRateResult,
} from './types';
import { validateDiscountRateInput } from './validation';

export function DiscountRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<DiscountRateInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<DiscountRateFieldErrors>({});
  const [result, setResult] = React.useState<DiscountRateResult | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const handleChange = (next: DiscountRateInput) => {
    setInput(next);
    const validation = validateDiscountRateInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setErrors({});
    setResult(null);
  };

  const symbol = getCurrencySymbol(input.currency);
  const compoundLabel =
    COMPOUND_OPTIONS.find((o) => o.value === input.compoundFrequency)?.label ??
    input.compoundFrequency;
  const cfFreqLabel =
    CASH_FLOW_FREQUENCY_OPTIONS.find((o) => o.value === input.cashFlowFrequency)?.label ??
    input.cashFlowFrequency;

  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `PV: ${symbol}${input.presentValue}`,
        `FV: ${symbol}${input.futureValue}`,
        `Term: ${input.term} ${input.termUnit}`,
        `Compounding: ${compoundLabel}`,
        `CF: ${symbol}${input.cashFlow} ${cfFreqLabel} (${input.cashFlowTiming})`,
        `Annual discount rate: ${result.formattedRate}%`,
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
            Solve the annual discount rate from PV, FV, and optional cash flows.{' '}
            {CURRENCY_DENOMINATION_NOTE}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <DiscountRateForm
          input={input}
          errors={errors}
          result={result}
          onChange={handleChange}
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
      </div>
    </section>
  );
}
