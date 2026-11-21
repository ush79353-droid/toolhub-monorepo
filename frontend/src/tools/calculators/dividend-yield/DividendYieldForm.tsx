'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DIVIDEND_FREQUENCY_OPTIONS,
  type DividendFrequencySelection,
  type DividendYieldFieldErrors,
  type DividendYieldInput,
  type DividendYieldResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface DividendYieldFormProps {
  input: DividendYieldInput;
  errors: DividendYieldFieldErrors;
  result: DividendYieldResult | null;
  onChange: (input: DividendYieldInput) => void;
  onDividendsPerPeriodCurrencyChange: (next: SupportedCurrency) => void;
  onAnnualDividendsCurrencyChange: (next: SupportedCurrency) => void;
  onSharePriceCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function DividendYieldForm({
  input,
  errors,
  result,
  onChange,
  onDividendsPerPeriodCurrencyChange,
  onAnnualDividendsCurrencyChange,
  onSharePriceCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: DividendYieldFormProps) {
  const periodSymbol = getCurrencySymbol(input.dividendsPerPeriodCurrency);
  const annualSymbol = getCurrencySymbol(
    result?.annualDividendsCurrency ?? input.annualDividendsCurrency
  );
  const shareSymbol = getCurrencySymbol(input.sharePriceCurrency);

  const set = (patch: Partial<DividendYieldInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.annualDividendsOpen}
        onToggle={(event) =>
          set({ annualDividendsOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.annualDividendsOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Annual dividends</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="dy-dividends-per-period">
              <span>Dividends per period</span>
              <InfoTooltip
                label="Dividends per period"
                text="Dividend paid each payment period for one share. Must use the same share unit as share price. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.dividendsPerPeriod}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {periodSymbol}
                </span>
                <input
                  id="dy-dividends-per-period"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.dividendsPerPeriod}
                  aria-invalid={Boolean(errors.dividendsPerPeriod)}
                  onChange={(e) => set({ dividendsPerPeriod: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="dy-dividends-per-period-currency"
                  value={input.dividendsPerPeriodCurrency}
                  onChange={onDividendsPerPeriodCurrencyChange}
                  aria-label="Dividends per period currency"
                />
              </div>
            </div>
            {errors.dividendsPerPeriod ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.dividendsPerPeriod}
              </p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="dy-frequency">
              <span>Dividend frequency</span>
              <InfoTooltip
                label="Dividend frequency"
                text="How often dividends are paid: Annually (1), Semiannually (2), Quarterly (4), or Monthly (12). Selection is required. Not FX-converted."
              />
            </label>
            <select
              id="dy-frequency"
              className={`${selectClass} ${
                input.frequency === '' ? 'text-primary' : ''
              }`}
              value={input.frequency}
              aria-invalid={Boolean(errors.frequency)}
              onChange={(e) =>
                set({
                  frequency: e.target.value as DividendFrequencySelection,
                })
              }
            >
              <option value="">Select</option>
              {DIVIDEND_FREQUENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.frequency ? (
              <p className="mt-1 text-xs text-rose-600">{errors.frequency}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="dy-annual-dividends">
              <span>Annual dividends</span>
              <InfoTooltip
                label="Annual dividends"
                text="Dividends per period × payments per year, shown in this display currency. Not entered manually."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell muted>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {annualSymbol}
                </span>
                <input
                  id="dy-annual-dividends"
                  className={`${inputClass} font-semibold`}
                  readOnly
                  tabIndex={-1}
                  value={result?.formattedAnnualDividends ?? ''}
                  aria-live="polite"
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="dy-annual-dividends-currency"
                  value={input.annualDividendsCurrency}
                  onChange={onAnnualDividendsCurrencyChange}
                  aria-label="Annual dividends currency"
                />
              </div>
            </div>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.dividendYieldOpen}
        onToggle={(event) =>
          set({ dividendYieldOpen: event.currentTarget.open })
        }
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.dividendYieldOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Dividend yield</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="dy-share-price">
              <span>Share price</span>
              <InfoTooltip
                label="Share price"
                text="Current price of one share (same unit as dividends). Must be greater than zero for yield. Changing currency converts this amount with stored FX rates."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.sharePrice}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {shareSymbol}
                </span>
                <input
                  id="dy-share-price"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.sharePrice}
                  aria-invalid={Boolean(errors.sharePrice)}
                  onChange={(e) => set({ sharePrice: e.target.value })}
                />
              </FieldShell>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="dy-share-price-currency"
                  value={input.sharePriceCurrency}
                  onChange={onSharePriceCurrencyChange}
                  aria-label="Share price currency"
                />
              </div>
            </div>
            {errors.sharePrice ? (
              <p className="mt-1 text-xs text-rose-600">{errors.sharePrice}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="dy-dividend-yield">
              <span>Dividend yield</span>
              <InfoTooltip
                label="Dividend yield"
                text="Annual dividends ÷ share price × 100. Never FX-converted."
              />
            </label>
            <FieldShell muted>
              <input
                id="dy-dividend-yield"
                className={`${inputClass} pr-8 font-semibold`}
                readOnly
                tabIndex={-1}
                value={result?.formattedDividendYieldPercent ?? ''}
                aria-live="polite"
              />
              <span
                className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                %
              </span>
            </FieldShell>
          </div>
        </div>
      </details>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-center text-sm text-accent">
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
