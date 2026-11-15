'use client';

import * as React from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
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
  AnnualizedReturnDraft,
  AnnualizedReturnFieldErrors,
  AnnualizedReturnMode,
} from './types';

const MONEY_FIELDS = ['beginningValue', 'endingValue'] as const;

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const shellClass =
  'rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring';

interface AnnualizedReturnFormProps {
  draft: AnnualizedReturnDraft;
  resultDisplay: string;
  errors: AnnualizedReturnFieldErrors;
  onDraftChange: (draft: AnnualizedReturnDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

function FieldShell({
  label,
  htmlFor,
  error,
  tip,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  tip?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        <span>{label}</span>
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function AnnualizedReturnForm({
  draft,
  resultDisplay,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: AnnualizedReturnFormProps) {
  const rates = useCurrencyRates();
  const ratesStatus = useCurrencyRatesStatus();
  const [conversionError, setConversionError] = React.useState<string | null>(null);
  const set = (patch: Partial<AnnualizedReturnDraft>) => {
    setConversionError(null);
    onDraftChange({ ...draft, ...patch });
  };
  const symbol = getCurrencySymbol(draft.currency);

  const setMode = (mode: AnnualizedReturnMode) => set({ mode });

  /** Shared currency UI — convert both monetary inputs together; rates/duration untouched. */
  const handleCurrencyChange = (currency: SupportedCurrency) => {
    if (currency === draft.currency) return;
    if (!rates.available) {
      setConversionError(CURRENCY_CONVERSION_UNAVAILABLE_NOTE);
      return;
    }
    const converted = convertDraftMoneyFields(
      draft,
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
    onDraftChange({
      ...draft,
      ...converted.values,
      currency,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset>
        <legend className={labelClass}>Calculate annualized return from</legend>
        <div className="space-y-2">
          {(
            [
              ['total-return', 'Total return (%)'],
              ['values', 'Beginning and ending values'],
            ] as const
          ).map(([mode, label]) => (
            <label key={mode} className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="annualized-return-mode"
                className="h-4 w-4 border-border"
                checked={draft.mode === mode}
                onChange={() => setMode(mode)}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {draft.mode === 'total-return' ? (
        <FieldShell
          label="Total return (R)"
          htmlFor="ar-total-return"
          error={errors.totalReturnPercent}
          tip="Overall holding-period return as a percent. Must be at least −100%."
        >
          <div className={`relative ${shellClass}`}>
            <input
              id="ar-total-return"
              inputMode="decimal"
              className={`${inputClass} pr-10`}
              value={draft.totalReturnPercent}
              aria-invalid={Boolean(errors.totalReturnPercent)}
              onChange={(event) => set({ totalReturnPercent: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
        </FieldShell>
      ) : (
        <>
          <FieldShell
            label="Beginning value"
            htmlFor="ar-beginning"
            error={errors.beginningValue}
            tip="Starting portfolio or investment value. Must be greater than zero. Currency change converts both monetary inputs together."
          >
            <div className="flex gap-2">
              <div className={`relative min-w-0 flex-1 ${shellClass}`}>
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="ar-beginning"
                  inputMode="decimal"
                  className={`${inputClass} pl-8`}
                  value={draft.beginningValue}
                  aria-invalid={Boolean(errors.beginningValue)}
                  onChange={(event) => set({ beginningValue: event.target.value })}
                />
              </div>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ar-beginning-currency"
                  value={draft.currency}
                  onChange={handleCurrencyChange}
                  aria-label="Beginning value currency"
                />
              </div>
            </div>
          </FieldShell>

          <FieldShell
            label="Ending value"
            htmlFor="ar-ending"
            error={errors.endingValue}
            tip="Value at the end of the holding period. Zero means a complete loss. Currency change converts both monetary inputs together."
          >
            <div className="flex gap-2">
              <div className={`relative min-w-0 flex-1 ${shellClass}`}>
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="ar-ending"
                  inputMode="decimal"
                  className={`${inputClass} pl-8`}
                  value={draft.endingValue}
                  aria-invalid={Boolean(errors.endingValue)}
                  onChange={(event) => set({ endingValue: event.target.value })}
                />
              </div>
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id="ar-ending-currency"
                  value={draft.currency}
                  onChange={handleCurrencyChange}
                  aria-label="Ending value currency"
                />
              </div>
            </div>
          </FieldShell>
          {conversionError ? (
            <p className="text-xs text-rose-600" role="alert">
              {conversionError}
            </p>
          ) : null}
          {ratesStatus.warning && !conversionError ? (
            <p className="text-xs text-amber-700">{ratesStatus.warning}</p>
          ) : null}
        </>
      )}

      <FieldShell
        label="Holding period (n)"
        htmlFor="ar-holding"
        error={errors.holdingPeriodYears}
        tip="Length of the holding period in years. Must be greater than zero."
      >
        <div className={`relative ${shellClass}`}>
          <input
            id="ar-holding"
            inputMode="decimal"
            className={`${inputClass} pr-14`}
            value={draft.holdingPeriodYears}
            aria-invalid={Boolean(errors.holdingPeriodYears)}
            onChange={(event) => set({ holdingPeriodYears: event.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            years
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Annualized return"
        htmlFor="ar-result"
        tip="Compound average return per year over the holding period."
      >
        <div className="relative rounded-lg border border-border bg-muted/30">
          <input
            id="ar-result"
            readOnly
            tabIndex={0}
            className={`${inputClass} cursor-default pr-10 font-semibold text-accent`}
            value={resultDisplay}
            placeholder="—"
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
      </FieldShell>

      {errors.form ? (
        <p className="text-xs text-red-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={() => {
            setConversionError(null);
            onReset();
          }}
        >
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11"
          onClick={() => {
            setConversionError(null);
            onReset();
          }}
        >
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
