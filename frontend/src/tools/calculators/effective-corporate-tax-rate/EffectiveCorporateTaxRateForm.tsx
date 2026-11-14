'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EffectiveCorporateTaxRateFieldErrors,
  EffectiveCorporateTaxRateInput,
  EffectiveCorporateTaxRateResult,
} from './types';

interface EffectiveCorporateTaxRateFormProps {
  input: EffectiveCorporateTaxRateInput;
  errors: EffectiveCorporateTaxRateFieldErrors;
  result: EffectiveCorporateTaxRateResult | null;
  onChange: (input: EffectiveCorporateTaxRateInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} />
    </div>
  );
}

export function EffectiveCorporateTaxRateForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: EffectiveCorporateTaxRateFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<EffectiveCorporateTaxRateInput>) =>
    onChange({ ...input, ...patch });
  const setCurrency = (currency: EffectiveCorporateTaxRateInput['currency']) =>
    set({ currency });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="ectr-earnings"
          label="Earnings before tax"
          tip="Pre-tax earnings (EBT) for the period. Must be greater than zero."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="ectr-earnings"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.earningsBeforeTax}
              aria-invalid={Boolean(errors.earningsBeforeTax)}
              onChange={(event) => set({ earningsBeforeTax: event.target.value })}
            />
          </div>
          <div className="w-[120px] shrink-0 sm:w-[130px]">
            <CurrencySelect
              id="ectr-earnings-currency"
              value={input.currency}
              onChange={setCurrency}
            />
          </div>
        </div>
        {errors.earningsBeforeTax ? (
          <p className="mt-1 text-xs text-rose-600">{errors.earningsBeforeTax}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="ectr-tax"
          label="Income tax paid"
          tip="Corporate income tax paid for the same period. Zero is allowed; negatives are not."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="ectr-tax"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.incomeTaxPaid}
              aria-invalid={Boolean(errors.incomeTaxPaid)}
              onChange={(event) => set({ incomeTaxPaid: event.target.value })}
            />
          </div>
          <div className="w-[120px] shrink-0 sm:w-[130px]">
            <CurrencySelect id="ectr-tax-currency" value={input.currency} onChange={setCurrency} />
          </div>
        </div>
        {errors.incomeTaxPaid ? (
          <p className="mt-1 text-xs text-rose-600">{errors.incomeTaxPaid}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="ectr-rate"
          label="Effective corporate tax rate"
          tip="Income tax paid divided by earnings before tax, as a percent. Not capped at 100%."
        />
        <div className="relative">
          <input
            id="ectr-rate"
            className={`${inputClass} bg-muted/30 pr-8 font-semibold text-accent`}
            readOnly
            value={result?.formattedRate ?? ''}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-primary">
            %
          </span>
        </div>
      </div>

      {errors.form || errors.currency ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form ?? errors.currency}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
