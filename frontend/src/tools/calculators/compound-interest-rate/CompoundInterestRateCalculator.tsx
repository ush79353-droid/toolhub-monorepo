'use client';

import * as React from 'react';
import type { ToolComponentProps } from '@/tools/types';
import { Button } from '@/components/ui/button';
import { copyTextToClipboard } from '@/tools/shared/clipboard';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import {
  CompoundInterestRateForm,
  draftToInput,
  inputToDraft,
  type CompoundInterestRateDraft,
} from './CompoundInterestRateForm';
import { CompoundInterestRateResults } from './CompoundInterestRateResults';
import { calculateCompoundInterestRate } from './calculation';
import {
  COMPOUNDING_OPTIONS,
  createDefaultCompoundInterestRateInput,
  type CompoundInterestRateFieldErrors,
  type CompoundInterestRateResult,
} from './types';
import { validateCompoundInterestRate } from './validation';

const MONEY_FIELDS = ['initialBalance', 'finalBalance'] as const;

const CURRENCY_CONVERSION_NOTE =
  'Changing currency converts starting and ending balances together using stored exchange rates. The implied interest rate and term stay the same.';

function summaryText(title: string, result: CompoundInterestRateResult, note: string): string {
  const money = (value: number) => formatCurrencyValue(value, result.currency);
  const frequency =
    COMPOUNDING_OPTIONS.find((o) => o.value === result.compounding)?.label ??
    result.compounding;
  return [
    `${title} | Omega Calculators`,
    `Initial balance: ${money(result.initialBalance)}`,
    `Final balance: ${money(result.finalBalance)}`,
    `Surplus: ${money(result.surplus)}`,
    `Compounding: ${frequency}`,
    `Term: ${result.termYears} yrs, ${result.termMonths} mos`,
    `Compound interest rate: ${result.annualNominalRatePercent}% annually`,
    note,
  ].join('\n');
}

export function CompoundInterestRateCalculator({
  metadata,
  className = '',
  presentation = 'default',
  headerActions,
}: ToolComponentProps) {
  const isEmbed = presentation === 'embed';
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [draft, setDraft] = React.useState<CompoundInterestRateDraft>(() =>
    inputToDraft(createDefaultCompoundInterestRateInput())
  );
  const [errors, setErrors] = React.useState<CompoundInterestRateFieldErrors>({});
  const [result, setResult] = React.useState<CompoundInterestRateResult | null>(() =>
    calculateCompoundInterestRate(createDefaultCompoundInterestRateInput())
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

  const evaluate = (next: CompoundInterestRateDraft) => {
    setConversionError(null);
    const input = draftToInput(next);
    const nextErrors = validateCompoundInterestRate(input);
    setErrors(nextErrors);
    setDraft(next);
    if (Object.keys(nextErrors).length > 0) {
      setResult(null);
      return;
    }
    setResult(calculateCompoundInterestRate(input));
  };

  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === draft.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      {
        initialBalance: draft.initialBalance,
        finalBalance: draft.finalBalance,
      },
      MONEY_FIELDS,
      draft.currency,
      currency,
      rates.rates
    );
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    evaluate({
      ...draft,
      ...converted.values,
      currency,
    });
  };

  const resetAll = () => {
    const fresh = createDefaultCompoundInterestRateInput();
    setDraft(inputToDraft(fresh));
    setErrors({});
    setResult(calculateCompoundInterestRate(fresh));
    setCopied(false);
    setShared(false);
    setConversionError(null);
  };

  const sharePayload = result?.defined
    ? summaryText(metadata.title, result, currencyNote)
    : '';
  const invalid = Object.keys(errors).length > 0;

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
            Solve the annual nominal compound rate from start/end balances. {currencyNote}
          </p>
        </div>
        {headerActions ? <div className="flex flex-wrap justify-end gap-2">{headerActions}</div> : null}
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
        <CompoundInterestRateForm
          draft={draft}
          errors={errors}
          result={result}
          onDraftChange={evaluate}
          onCurrencyChange={handleCurrencyChange}
          onSubmit={(event) => {
            event.preventDefault();
            evaluate(draft);
          }}
          onReset={resetAll}
        />
        <CompoundInterestRateResults result={result} invalid={invalid} />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 text-xs font-medium"
            disabled={!sharePayload}
            onClick={() => {
              if (!sharePayload) return;
              void copyTextToClipboard(sharePayload).then((ok) => {
                if (!ok) return;
                setCopied(true);
                window.setTimeout(() => setCopied(false), 2000);
              });
            }}
          >
            {copied ? 'Copied' : 'Copy results'}
          </Button>
          {canShare ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 px-3 text-xs font-medium"
              disabled={!sharePayload}
              onClick={() => {
                if (!sharePayload || typeof navigator.share !== 'function') return;
                void navigator
                  .share({
                    title: metadata.title,
                    text: sharePayload,
                    url: typeof window !== 'undefined' ? window.location.href : undefined,
                  })
                  .then(() => {
                    setShared(true);
                    window.setTimeout(() => setShared(false), 2000);
                  })
                  .catch(() => {
                    void copyTextToClipboard(
                      `${sharePayload}\n${typeof window !== 'undefined' ? window.location.href : ''}`
                    ).then((ok) => {
                      if (!ok) return;
                      setCopied(true);
                      window.setTimeout(() => setCopied(false), 2000);
                    });
                  });
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
