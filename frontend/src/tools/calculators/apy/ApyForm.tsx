'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { convertDraftMoneyFields } from '@/tools/shared/convert-currency';
import {
  CURRENCY_CONVERSION_UNAVAILABLE_NOTE,
} from '@/tools/shared/currency-rates';
import {
  useCurrencyRates,
  useCurrencyRatesStatus,
} from '@/tools/shared/CurrencyRatesProvider';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ApyFieldErrors,
  ApyInput,
  ApyResult,
  CompoundFrequency,
  TermUnit,
} from './types';

const MONEY_FIELDS = ['initialDeposit'] as const;

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent focus:outline-none focus:ring-2 focus:ring-ring';

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

const COMPOUND_OPTIONS: readonly { value: CompoundFrequency; label: string }[] = [
  { value: 'annually', label: 'Annually' },
  { value: 'semi-annually', label: 'Semi-annually' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-weekly', label: 'Bi-weekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' },
];

interface ApyFormProps {
  input: ApyInput;
  errors: ApyFieldErrors;
  result: ApyResult | null;
  onChange: (input: ApyInput) => void;
  onReset: () => void;
}

export function ApyForm({ input, errors, result, onChange, onReset }: ApyFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ApyInput>) => {
    setConversionError(null);
    onChange({ ...input, ...patch });
  };

  /** Shared currency — convert deposit only; APR, frequency, term, and APY % unchanged. */
  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === input.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      input,
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
    onChange({
      ...input,
      ...converted.values,
      currency,
    });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="apy-deposit">
          <span>Initial deposit</span>
          <InfoTooltip
            label="Initial deposit"
            text="Starting principal. Must be greater than zero."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.initialDeposit}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="apy-deposit"
              className={inputClass}
              inputMode="decimal"
              value={input.initialDeposit}
              aria-invalid={Boolean(errors.initialDeposit)}
              onChange={(event) => set({ initialDeposit: event.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="apy-deposit-currency"
              value={input.currency}
              onChange={handleCurrencyChange}
              aria-label="Initial deposit currency"
            />
          </div>
        </div>
        {errors.initialDeposit ? (
          <p className="mt-1 text-xs text-rose-600">{errors.initialDeposit}</p>
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
        <label className={labelClass} htmlFor="apy-apr">
          <span>Annual percentage rate of charge (APR)</span>
          <InfoTooltip
            label="APR"
            text="Nominal annual rate before compounding. Must be greater than −100%."
          />
        </label>
        <FieldShell error={errors.aprPercent}>
          <input
            id="apy-apr"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.aprPercent}
            aria-invalid={Boolean(errors.aprPercent)}
            onChange={(event) => set({ aprPercent: event.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
        {errors.aprPercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.aprPercent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="apy-compound">
          <span>Compound frequency</span>
          <InfoTooltip
            label="Compound frequency"
            text="How many times per year interest compounds (n in the APY formula)."
          />
        </label>
        <select
          id="apy-compound"
          className={selectClass}
          value={input.compoundFrequency}
          onChange={(event) =>
            set({ compoundFrequency: event.target.value as CompoundFrequency })
          }
        >
          {COMPOUND_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="apy-result">
          <span>Annual percentage yield (APY)</span>
          <InfoTooltip
            label="APY"
            text="Effective annual yield: (1 + APR/n)^n − 1, shown as a percent."
          />
        </label>
        <FieldShell muted>
          <input
            id="apy-result"
            className={`${inputClass} pr-8 font-semibold`}
            readOnly
            value={result ? result.formattedApyPercent : ''}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="apy-term">
          <span>Term</span>
          <InfoTooltip
            label="Term"
            text="Deposit duration. Months are converted to years as months ÷ 12."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.term}>
            <input
              id="apy-term"
              className={inputClass}
              inputMode="decimal"
              value={input.term}
              aria-invalid={Boolean(errors.term)}
              onChange={(event) => set({ term: event.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <select
              id="apy-term-unit"
              className={selectClass}
              value={input.termUnit}
              aria-label="Term unit"
              onChange={(event) => set({ termUnit: event.target.value as TermUnit })}
            >
              <option value="mos">mos</option>
              <option value="yrs">yrs</option>
            </select>
          </div>
        </div>
        {errors.term ? <p className="mt-1 text-xs text-rose-600">{errors.term}</p> : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="apy-final">
          <span>Final deposit</span>
          <InfoTooltip
            label="Final deposit"
            text="P × (1 + APR/n)^(n × t), where t is the term in years."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="apy-final"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedFinalDeposit : ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="apy-final-currency"
              value={input.currency}
              onChange={handleCurrencyChange}
              aria-label="Final deposit currency"
            />
          </div>
        </div>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

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
