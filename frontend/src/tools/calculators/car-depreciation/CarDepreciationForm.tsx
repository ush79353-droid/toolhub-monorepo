'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { CAR_DEPRECIATION_ANNUAL_RATE } from './content';
import type {
  CarDepreciationFieldErrors,
  CarDepreciationInput,
  CarDepreciationResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
const unitSelectClass =
  'h-11 w-[110px] shrink-0 rounded-lg border border-border bg-white px-3 text-sm text-accent sm:w-[120px]';

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

interface MoneyOutProps {
  id: string;
  label: string;
  tip: string;
  symbol: string;
  value: string;
  currency: SupportedCurrency;
  onCurrencyChange: (next: SupportedCurrency) => void;
  currencyLabel: string;
}

function MoneyOutField({
  id,
  label,
  tip,
  symbol,
  value,
  currency,
  onCurrencyChange,
  currencyLabel,
}: MoneyOutProps) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell muted>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} text-accent`}
            readOnly
            tabIndex={-1}
            value={value}
            aria-live="polite"
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={currency}
            onChange={onCurrencyChange}
            aria-label={currencyLabel}
          />
        </div>
      </div>
    </div>
  );
}

interface CarDepreciationFormProps {
  input: CarDepreciationInput;
  errors: CarDepreciationFieldErrors;
  result: CarDepreciationResult | null;
  onChange: (input: CarDepreciationInput) => void;
  onInitialValueCurrencyChange: (next: SupportedCurrency) => void;
  onReducedValueCurrencyChange: (next: SupportedCurrency) => void;
  onAfter1MinuteCurrencyChange: (next: SupportedCurrency) => void;
  onAfter1YearCurrencyChange: (next: SupportedCurrency) => void;
  onAfter2YearsCurrencyChange: (next: SupportedCurrency) => void;
  onAfter3YearsCurrencyChange: (next: SupportedCurrency) => void;
  onAfter4YearsCurrencyChange: (next: SupportedCurrency) => void;
  onAfter5YearsCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function CarDepreciationForm({
  input,
  errors,
  result,
  onChange,
  onInitialValueCurrencyChange,
  onReducedValueCurrencyChange,
  onAfter1MinuteCurrencyChange,
  onAfter1YearCurrencyChange,
  onAfter2YearsCurrencyChange,
  onAfter3YearsCurrencyChange,
  onAfter4YearsCurrencyChange,
  onAfter5YearsCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: CarDepreciationFormProps) {
  const initialSymbol = getCurrencySymbol(input.initialValueCurrency);
  const reducedSymbol = getCurrencySymbol(
    result?.reducedValueCurrency ?? input.reducedValueCurrency
  );
  const m1Symbol = getCurrencySymbol(
    result?.after1MinuteCurrency ?? input.after1MinuteCurrency
  );
  const y1Symbol = getCurrencySymbol(
    result?.after1YearCurrency ?? input.after1YearCurrency
  );
  const y2Symbol = getCurrencySymbol(
    result?.after2YearsCurrency ?? input.after2YearsCurrency
  );
  const y3Symbol = getCurrencySymbol(
    result?.after3YearsCurrency ?? input.after3YearsCurrency
  );
  const y4Symbol = getCurrencySymbol(
    result?.after4YearsCurrency ?? input.after4YearsCurrency
  );
  const y5Symbol = getCurrencySymbol(
    result?.after5YearsCurrency ?? input.after5YearsCurrency
  );

  const set = (patch: Partial<CarDepreciationInput>) => {
    onChange({ ...input, ...patch });
  };

  const ratePercent = CAR_DEPRECIATION_ANNUAL_RATE * 100;

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="cd-initial-value">
            <span>Initial car value</span>
            <InfoTooltip
              label="Initial car value"
              text="Purchase or starting value before applying the illustrative declining-balance model. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.initialValue}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {initialSymbol}
              </span>
              <input
                id="cd-initial-value"
                className={inputClass}
                inputMode="decimal"
                value={input.initialValue}
                aria-invalid={Boolean(errors.initialValue)}
                onChange={(e) => set({ initialValue: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cd-initial-value-currency"
                value={input.initialValueCurrency}
                onChange={onInitialValueCurrencyChange}
                aria-label="Initial car value currency"
              />
            </div>
          </div>
          {errors.initialValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cd-car-age">
            <span>Car age</span>
            <InfoTooltip
              label="Car age"
              text="Years since the initial value (zero allowed). Never currency-converted."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.carAgeYears}>
              <input
                id="cd-car-age"
                className={inputClass}
                inputMode="decimal"
                value={input.carAgeYears}
                aria-invalid={Boolean(errors.carAgeYears)}
                onChange={(e) => set({ carAgeYears: e.target.value })}
              />
            </FieldShell>
            <select
              className={unitSelectClass}
              value="yrs"
              aria-label="Car age unit"
              disabled
            >
              <option value="yrs">yrs</option>
            </select>
          </div>
          {errors.carAgeYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.carAgeYears}</p>
          ) : null}
        </div>

        <MoneyOutField
          id="cd-reduced-value"
          label="Reduced car value"
          tip={`Estimated value after the entered age using a constant ${ratePercent}% annual declining-balance rate (illustrative, not a market appraisal).`}
          symbol={reducedSymbol}
          value={result?.formattedReducedValue ?? ''}
          currency={input.reducedValueCurrency}
          onCurrencyChange={onReducedValueCurrencyChange}
          currencyLabel="Reduced car value currency"
        />
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.afterOpen}
        onToggle={(event) => set({ afterOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.afterOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Car value after…</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <MoneyOutField
            id="cd-after-1-minute"
            label="1 minute"
            tip="Projection from the reduced value for one minute as a fractional year under the same annual rate."
            symbol={m1Symbol}
            value={result?.formattedAfter1Minute ?? ''}
            currency={input.after1MinuteCurrency}
            onCurrencyChange={onAfter1MinuteCurrencyChange}
            currencyLabel="1 minute value currency"
          />
          <MoneyOutField
            id="cd-after-1-year"
            label="1 year"
            tip="Projection from the reduced value one year ahead."
            symbol={y1Symbol}
            value={result?.formattedAfter1Year ?? ''}
            currency={input.after1YearCurrency}
            onCurrencyChange={onAfter1YearCurrencyChange}
            currencyLabel="1 year value currency"
          />
          <MoneyOutField
            id="cd-after-2-years"
            label="2 years"
            tip="Projection from the reduced value two years ahead."
            symbol={y2Symbol}
            value={result?.formattedAfter2Years ?? ''}
            currency={input.after2YearsCurrency}
            onCurrencyChange={onAfter2YearsCurrencyChange}
            currencyLabel="2 years value currency"
          />
          <MoneyOutField
            id="cd-after-3-years"
            label="3 years"
            tip="Projection from the reduced value three years ahead."
            symbol={y3Symbol}
            value={result?.formattedAfter3Years ?? ''}
            currency={input.after3YearsCurrency}
            onCurrencyChange={onAfter3YearsCurrencyChange}
            currencyLabel="3 years value currency"
          />
          <MoneyOutField
            id="cd-after-4-years"
            label="4 years"
            tip="Projection from the reduced value four years ahead."
            symbol={y4Symbol}
            value={result?.formattedAfter4Years ?? ''}
            currency={input.after4YearsCurrency}
            onCurrencyChange={onAfter4YearsCurrencyChange}
            currencyLabel="4 years value currency"
          />
          <MoneyOutField
            id="cd-after-5-years"
            label="5 years"
            tip="Projection from the reduced value five years ahead."
            symbol={y5Symbol}
            value={result?.formattedAfter5Years ?? ''}
            currency={input.after5YearsCurrency}
            onCurrencyChange={onAfter5YearsCurrencyChange}
            currencyLabel="5 years value currency"
          />

          <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
            Scared of depreciation? Check out our{' '}
            <a
              href="/tools/car-lease-calculator"
              className="font-semibold text-primary underline underline-offset-2"
            >
              car lease calculator
            </a>
            !
          </div>
        </div>
      </details>

      <div className="rounded-xl border border-border bg-muted/20 px-3.5 py-3.5 text-sm text-accent sm:px-4">
        <p className="font-semibold">Vehicle depreciation varies</p>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
          Resale value depends on age, mileage, condition, brand demand, and local
          market conditions. This tool applies a disclosed illustrative {ratePercent}%
          annual declining-balance model for education — not a dealer quote or market
          guarantee.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesWarning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
