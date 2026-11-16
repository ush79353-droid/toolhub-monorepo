'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertCurrency } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
  isCurrencyRateUsable,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import {
  moneyAmountToInputString,
  parseMoneyInput,
} from '@/tools/shared/money-value';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { HomeLoanEmiChart } from './HomeLoanEmiChart';
import type {
  HomeLoanEmiFieldErrors,
  HomeLoanEmiInput,
  HomeLoanEmiResult,
  TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/30' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface HomeLoanEmiFormProps {
  input: HomeLoanEmiInput;
  errors: HomeLoanEmiFieldErrors;
  result: HomeLoanEmiResult | null;
  onChange: (input: HomeLoanEmiInput) => void;
  onReset: () => void;
}

export function HomeLoanEmiForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: HomeLoanEmiFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const [resultsOpen, setResultsOpen] = React.useState(true);

  const principalSymbol = getCurrencySymbol(input.currency);
  const emiSymbol = getCurrencySymbol(input.emiCurrency);
  const payableSymbol = getCurrencySymbol(input.totalPayableCurrency);
  const interestSymbol = getCurrencySymbol(input.totalInterestCurrency);

  const set = (patch: Partial<HomeLoanEmiInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  const canConvertPair = (from: SupportedCurrency, to: SupportedCurrency) => {
    if (from === to) return true;
    return (
      rates.available &&
      isCurrencyRateUsable(rates.rates, from) &&
      isCurrencyRateUsable(rates.rates, to)
    );
  };

  const handlePrincipalCurrencyChange = (next: SupportedCurrency) => {
    if (next === input.currency) return;

    const amount = parseMoneyInput(input.principal);
    if (!Number.isFinite(amount)) {
      if (
        (input.emiCurrency !== next && !canConvertPair(next, input.emiCurrency)) ||
        (input.totalPayableCurrency !== next &&
          !canConvertPair(next, input.totalPayableCurrency)) ||
        (input.totalInterestCurrency !== next &&
          !canConvertPair(next, input.totalInterestCurrency))
      ) {
        setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
        return;
      }
      setConversionError(null);
      onChange({ ...input, currency: next });
      return;
    }

    if (!canConvertPair(input.currency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    if (
      (input.emiCurrency !== next && !canConvertPair(next, input.emiCurrency)) ||
      (input.totalPayableCurrency !== next &&
        !canConvertPair(next, input.totalPayableCurrency)) ||
      (input.totalInterestCurrency !== next &&
        !canConvertPair(next, input.totalInterestCurrency))
    ) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    const converted = convertCurrency({
      amount,
      from: input.currency,
      to: next,
      rates: rates.rates,
    });
    if (!converted.ok) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }

    setConversionError(null);
    onChange({
      ...input,
      currency: next,
      principal: moneyAmountToInputString(converted.amount),
    });
  };

  const handleDisplayCurrencyChange = (
    key: 'emiCurrency' | 'totalPayableCurrency' | 'totalInterestCurrency',
    next: SupportedCurrency
  ) => {
    if (next === input[key]) return;
    if (!canConvertPair(input.currency, next)) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    setConversionError(null);
    onChange({ ...input, [key]: next });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm text-muted-foreground">
        Quickly find out the value of the monthly payment of your loan with our EMI calculator.
        Input the loan amount, the interest rate, and the term, and we&apos;ll do the rest.
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Loan details</legend>

        <div>
          <label className={labelClass} htmlFor="hlemi-principal">
            <span>Principal loan amount</span>
            <InfoTooltip
              label="Principal loan amount"
              text="Home loan principal. Changing currency converts this amount using stored exchange rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.principal}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {principalSymbol}
              </span>
              <input
                id="hlemi-principal"
                className={inputClass}
                inputMode="decimal"
                value={input.principal}
                aria-invalid={Boolean(errors.principal)}
                onChange={(e) => set({ principal: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="hlemi-principal-currency"
                value={input.currency}
                onChange={handlePrincipalCurrencyChange}
                aria-label="Principal currency"
              />
            </div>
          </div>
          {errors.principal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.principal}</p>
          ) : null}
          {conversionError ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {conversionError}
            </p>
          ) : null}
          {ratesStatus.warning && !conversionError ? (
            <p className="mt-1 text-xs text-amber-700">{ratesStatus.warning}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hlemi-term">
            <span>Loan term</span>
            <InfoTooltip
              label="Loan term"
              text="Length of the loan in years or months. Internally converted to monthly payments (n)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.loanTerm}>
              <input
                id="hlemi-term"
                className={inputClass}
                inputMode="decimal"
                value={input.loanTerm}
                aria-invalid={Boolean(errors.loanTerm)}
                onChange={(e) => set({ loanTerm: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="hlemi-term-unit"
                className={selectClass}
                value={input.termUnit}
                aria-label="Loan term unit"
                onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
              >
                <option value="yrs">yrs</option>
                <option value="mos">mos</option>
              </select>
            </div>
          </div>
          {errors.loanTerm ? (
            <p className="mt-1 text-xs text-rose-600">{errors.loanTerm}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="hlemi-rate">
            <span>Interest rate</span>
            <InfoTooltip
              label="Interest rate"
              text="Nominal annual interest rate. Monthly rate r = annual ÷ 12 ÷ 100. Not currency-converted."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="hlemi-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.interestRatePercent}
              aria-invalid={Boolean(errors.interestRatePercent)}
              onChange={(e) => set({ interestRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.interestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="w-full px-1">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left text-[13px] font-semibold text-accent"
            aria-expanded={resultsOpen}
            onClick={() => setResultsOpen((open) => !open)}
          >
            <span>Results</span>
            {resultsOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </legend>

        {resultsOpen ? (
          <>
            <div>
              <label className={labelClass} htmlFor="hlemi-emi">
                <span>EMI (equated monthly installment)</span>
                <InfoTooltip
                  label="EMI"
                  text="Fixed monthly payment. Changing currency only re-expresses the EMI for display."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell muted>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {emiSymbol}
                  </span>
                  <input
                    id="hlemi-emi"
                    className={`${inputClass} font-semibold`}
                    readOnly
                    value={result ? result.formattedEmi : ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="hlemi-emi-currency"
                    value={input.emiCurrency}
                    onChange={(c) => handleDisplayCurrencyChange('emiCurrency', c)}
                    aria-label="EMI currency"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="hlemi-total-payable">
                <span>Total amount payable</span>
                <InfoTooltip
                  label="Total amount payable"
                  text="EMI × number of months. Display currency only re-expresses the total."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell muted>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {payableSymbol}
                  </span>
                  <input
                    id="hlemi-total-payable"
                    className={`${inputClass} font-semibold`}
                    readOnly
                    value={result ? result.formattedTotalPayable : ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="hlemi-total-payable-currency"
                    value={input.totalPayableCurrency}
                    onChange={(c) =>
                      handleDisplayCurrencyChange('totalPayableCurrency', c)
                    }
                    aria-label="Total payable currency"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="hlemi-total-interest">
                <span>Total interest due</span>
                <InfoTooltip
                  label="Total interest due"
                  text="Total amount payable − principal. Display currency only re-expresses interest."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell muted>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {interestSymbol}
                  </span>
                  <input
                    id="hlemi-total-interest"
                    className={`${inputClass} font-semibold`}
                    readOnly
                    value={result ? result.formattedTotalInterest : ''}
                    aria-live="polite"
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="hlemi-total-interest-currency"
                    value={input.totalInterestCurrency}
                    onChange={(c) =>
                      handleDisplayCurrencyChange('totalInterestCurrency', c)
                    }
                    aria-label="Total interest currency"
                  />
                </div>
              </div>
            </div>

            {result ? (
              <HomeLoanEmiChart result={result} />
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-white/60 p-4 text-center text-sm text-muted-foreground">
                no data to display
                <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-accent">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: '#3B82F6' }}
                    />
                    Principal loan amount
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: '#EF4444' }}
                    />
                    Total interest due
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">total payment</p>
              </div>
            )}
          </>
        ) : null}

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button
          type="button"
          variant="outline"
          className="h-11 font-medium"
          onClick={() => {
            setConversionError(null);
            onReset();
          }}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
