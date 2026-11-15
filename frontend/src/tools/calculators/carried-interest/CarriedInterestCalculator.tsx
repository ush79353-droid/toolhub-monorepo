'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { CarriedInterestForm } from './CarriedInterestForm';
import {
  createDefaultInput,
  type CarriedInterestFieldErrors,
  type CarriedInterestInput,
  type CarriedInterestResult,
} from './types';
import { validateCarriedInterestInput } from './validation';

export function CarriedInterestCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const [input, setInput] = React.useState<CarriedInterestInput>(() => createDefaultInput());
  const [errors, setErrors] = React.useState<CarriedInterestFieldErrors>({});
  const [result, setResult] = React.useState<CarriedInterestResult | null>(null);
  const [fundReturnDisplay, setFundReturnDisplay] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const [canShare, setCanShare] = React.useState(false);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const apply = (next: CarriedInterestInput) => {
    setInput(next);
    const validation = validateCarriedInterestInput(next);
    setErrors(validation.errors);
    setResult(validation.isValid ? validation.result : null);
    setFundReturnDisplay(
      validation.result?.formattedFundReturnPercent ??
        validation.partialFundReturn?.formatted ??
        ''
    );
  };

  const handleReset = () => {
    setInput(createDefaultInput());
    setErrors({});
    setResult(null);
    setFundReturnDisplay('');
    setCopied(false);
    setShared(false);
  };

  const symbol = getCurrencySymbol(input.currency);
  const summary = result
    ? [
        `${metadata.title} — Omega Calculators`,
        `Initial fund value: ${symbol}${input.initialFundValue}`,
        `Final fund value: ${symbol}${input.finalFundValue}`,
        `Fund return: ${result.formattedFundReturnPercent}%`,
        `Hold period: ${input.holdPeriodYears} yrs`,
        `Hurdle rate: ${input.hurdleRatePercent}%`,
        `Carried interest: ${input.carriedInterestPercent}%`,
        `GP catch-up: ${input.gpCatchUp === 'yes' ? 'Yes' : 'No'}`,
        `Total profit: ${symbol}${result.formattedTotalProfit}`,
        `GP carried interest amount: ${symbol}${result.formattedGpCarriedInterestAmount}`,
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
            Carry on profit above the compounded hurdle
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <CarriedInterestForm
          input={input}
          errors={errors}
          result={result}
          fundReturnDisplay={fundReturnDisplay}
          onChange={apply}
          onReset={handleReset}
        />
        <p className="text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
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
