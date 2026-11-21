'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import type { ToolComponentProps } from '@/tools/types';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import type { SupportedCurrency } from '@/tools/shared/currency';
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

const MONEY_FIELDS = ['initialBalance', 'depositAmount'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts balances and deposits using stored exchange rates. Interest rate and term stay the same.';

export function ContinuousCompoundInterestCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
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
  const [conversionError, setConversionError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCanShare(typeof navigator.share === 'function');
  }, []);

  const currencyNote = ratesStatus.available
    ? CURRENCY_CONVERSION_NOTE
    : CURRENCY_CONVERSION_UNAVAILABLE_NOTE;

  const run = (next: ContinuousCompoundInterestInput) => {
    const validation = validateContinuousCompoundInterestInput(next);
    setErrors(validation.errors);
    setResult(validation.result);
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      {
        initialBalance: input.initialBalance,
        depositAmount: input.depositAmount,
      },
      MONEY_FIELDS,
      input.currency,
      currency,
      rates.rates
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    const next: ContinuousCompoundInterestInput = {
      ...input,
      ...converted.values,
      currency,
    };
    setInput(next);
    run(next);
  };

  const handleReset = () => {
    const fresh = createDefaultInput();
    setInput(fresh);
    setCopied(false);
    setShared(false);
    setConversionError(null);
    run(fresh);
  };

  const summary = result
    ? [
        `${metadata.title} | Omega Calculators`,
        `Initial balance: ${input.initialBalance} ${input.currency}`,
        `Interest rate: ${input.interestRate}%`,
        `Term: ${input.termYears || '0'} yrs, ${input.termMonths || '0'} mos`,
        `Additional deposits: ${input.depositFrequency}`,
        describeResult(result),
        currencyNote,
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
            Continuous compounding with optional deposits. {currencyNote}
          </p>
        </div>
        {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {conversionError ? (
          <p className="text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesStatus.warning && !conversionError ? (
          <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
        ) : null}
        <ContinuousCompoundInterestForm
          input={input}
          errors={errors}
          result={result}
          onChange={(next) => {
            setConversionError(null);
            setInput(next);
            run(next);
          }}
          onCurrencyChange={handleCurrencyChange}
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
