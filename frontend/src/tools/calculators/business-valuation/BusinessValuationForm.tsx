'use client';

import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CASH_FLOW_SCALES,
  VALUATION_METHODS,
  type BusinessValuationFieldErrors,
  type BusinessValuationInput,
  type BusinessValuationResult,
  type CashFlowScale,
  type ValuationMethod,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-muted-foreground';

const METHOD_OPTIONS: { value: ValuationMethod; label: string }[] = [
  { value: 'dcf', label: 'Discounted Cash Flow (DCF)' },
  { value: 'asset-based', label: 'Asset-based valuation' },
  { value: 'market-cap', label: 'Market capitalization' },
  { value: 'multiples', label: 'Market-based valuation (multiples method)' },
];

const SCALE_LABEL: Record<CashFlowScale, string> = {
  ones: 'ones',
  thousand: 'thousand',
  million: 'million',
};

function numberOrBlank(value: number): string {
  return Number.isFinite(value) ? String(value) : '';
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

interface BusinessValuationFormProps {
  input: BusinessValuationInput;
  errors: BusinessValuationFieldErrors;
  result: BusinessValuationResult | null;
  onChange: (input: BusinessValuationInput) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function BusinessValuationForm({
  input,
  errors,
  result,
  onChange,
  onSubmit,
  onReset,
}: BusinessValuationFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<BusinessValuationInput>) => onChange({ ...input, ...patch });

  const onNumber = (key: keyof BusinessValuationInput) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<BusinessValuationInput>);
    };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <fieldset>
        <legend className={`${labelClass} mb-2`}>
          <span>Valuation method</span>
          <InfoTooltip
            label="Valuation method"
            text="Choose one approach. Only the inputs for that method are shown. Results are not mixed across methods."
          />
        </legend>
        <div role="radiogroup" aria-label="Valuation method" className="space-y-2">
          {METHOD_OPTIONS.map((option) => {
            const active = input.method === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${
                  active
                    ? 'border-primary/40 bg-brand-softTeal/50 text-accent'
                    : 'border-border bg-white text-muted-foreground hover:text-foreground'
                }`}
              >
                <input
                  type="radio"
                  name="valuation-method"
                  className="accent-[hsl(var(--primary))]"
                  checked={active}
                  value={option.value}
                  onChange={() => {
                    if (!VALUATION_METHODS.includes(option.value)) return;
                    set({ method: option.value });
                  }}
                />
                <span className="font-medium text-accent">{option.label}</span>
              </label>
            );
          })}
        </div>
        {errors.method ? <p className="mt-1 text-xs text-rose-600">{errors.method}</p> : null}
      </fieldset>

      <details open className="rounded-xl border border-border bg-muted/15">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          Enter your data
        </summary>
        <div className="space-y-3.5 px-4 pb-4">
          {input.method === 'dcf' ? (
            <>
              <div>
                <label className={labelClass} htmlFor="bv-cash-flow">
                  <span>Cash flow</span>
                  <InfoTooltip
                    label="Cash flow"
                    text="Constant annual cash flow for the projection period. The scale (ones / thousand / million) multiplies the entered amount before discounting."
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <FieldShell error={errors.cashFlow}>
                    <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                      {symbol}
                    </span>
                    <input
                      id="bv-cash-flow"
                      className={inputClass}
                      inputMode="decimal"
                      value={numberOrBlank(input.cashFlow)}
                      aria-invalid={Boolean(errors.cashFlow)}
                      onChange={onNumber('cashFlow')}
                    />
                  </FieldShell>
                  <div className="w-[110px] shrink-0 sm:w-[120px]">
                    <CurrencySelect
                      id="bv-cash-currency"
                      value={input.currency}
                      onChange={(currency) => set({ currency })}
                    />
                  </div>
                  <select
                    className={selectClass}
                    aria-label="Cash flow scale"
                    value={input.cashFlowScale}
                    onChange={(event) =>
                      set({ cashFlowScale: event.target.value as CashFlowScale })
                    }
                  >
                    {CASH_FLOW_SCALES.map((scale) => (
                      <option key={scale} value={scale}>
                        {SCALE_LABEL[scale]}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.cashFlow ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.cashFlow}</p>
                ) : null}
              </div>

              <div>
                <label className={labelClass} htmlFor="bv-years">
                  <span>Projection period</span>
                  <InfoTooltip
                    label="Projection period"
                    text="Number of years of constant annual cash flow. No terminal value is added after this period."
                  />
                </label>
                <div className="relative">
                  <FieldShell error={errors.projectionYears}>
                    <input
                      id="bv-years"
                      className={`${inputClass} pr-14`}
                      inputMode="decimal"
                      value={numberOrBlank(input.projectionYears)}
                      aria-invalid={Boolean(errors.projectionYears)}
                      onChange={onNumber('projectionYears')}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                      years
                    </span>
                  </FieldShell>
                </div>
                {errors.projectionYears ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.projectionYears}</p>
                ) : null}
              </div>

              <div>
                <label className={labelClass} htmlFor="bv-discount">
                  <span>Discount rate</span>
                  <InfoTooltip
                    label="Discount rate"
                    text="Annual discount rate as a percent. At 0%, value equals cash flow × years."
                  />
                </label>
                <div className="relative">
                  <FieldShell error={errors.discountRatePercent}>
                    <input
                      id="bv-discount"
                      className={`${inputClass} pr-10`}
                      inputMode="decimal"
                      value={numberOrBlank(input.discountRatePercent)}
                      aria-invalid={Boolean(errors.discountRatePercent)}
                      onChange={onNumber('discountRatePercent')}
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </FieldShell>
                </div>
                {errors.discountRatePercent ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.discountRatePercent}</p>
                ) : null}
              </div>
            </>
          ) : null}

          {input.method === 'asset-based' ? (
            <>
              <MoneyField
                id="bv-assets"
                label="Total assets"
                tip="Book or fair value of assets in the same currency as liabilities."
                value={input.totalAssets}
                error={errors.totalAssets}
                symbol={symbol}
                currency={input.currency}
                onValue={onNumber('totalAssets')}
                onCurrency={(currency) => set({ currency })}
              />
              <MoneyField
                id="bv-liabilities"
                label="Total liabilities"
                tip="All liabilities subtracted from total assets for net asset value."
                value={input.totalLiabilities}
                error={errors.totalLiabilities}
                symbol={symbol}
                currency={input.currency}
                onValue={onNumber('totalLiabilities')}
                onCurrency={(currency) => set({ currency })}
              />
            </>
          ) : null}

          {input.method === 'market-cap' ? (
            <>
              <MoneyField
                id="bv-share-price"
                label="Share price"
                tip="Current market price per share."
                value={input.sharePrice}
                error={errors.sharePrice}
                symbol={symbol}
                currency={input.currency}
                onValue={onNumber('sharePrice')}
                onCurrency={(currency) => set({ currency })}
              />
              <div>
                <label className={labelClass} htmlFor="bv-shares">
                  Shares outstanding
                </label>
                <FieldShell error={errors.sharesOutstanding}>
                  <input
                    id="bv-shares"
                    className={inputClass}
                    inputMode="decimal"
                    value={numberOrBlank(input.sharesOutstanding)}
                    aria-invalid={Boolean(errors.sharesOutstanding)}
                    onChange={onNumber('sharesOutstanding')}
                  />
                </FieldShell>
                {errors.sharesOutstanding ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.sharesOutstanding}</p>
                ) : null}
              </div>
            </>
          ) : null}

          {input.method === 'multiples' ? (
            <>
              <MoneyField
                id="bv-metric"
                label="Financial metric"
                tip="Base metric such as EBITDA, revenue, or earnings in the selected currency."
                value={input.financialMetric}
                error={errors.financialMetric}
                symbol={symbol}
                currency={input.currency}
                onValue={onNumber('financialMetric')}
                onCurrency={(currency) => set({ currency })}
              />
              <div>
                <label className={labelClass} htmlFor="bv-multiple">
                  Valuation multiple
                </label>
                <FieldShell error={errors.valuationMultiple}>
                  <input
                    id="bv-multiple"
                    className={inputClass}
                    inputMode="decimal"
                    value={numberOrBlank(input.valuationMultiple)}
                    aria-invalid={Boolean(errors.valuationMultiple)}
                    onChange={onNumber('valuationMultiple')}
                  />
                </FieldShell>
                {errors.valuationMultiple ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.valuationMultiple}</p>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
      </details>

      <div>
        <label className={labelClass} htmlFor="bv-value">
          Estimated value
        </label>
        <div className="flex gap-2">
          <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="bv-value"
              className={`${inputClass} cursor-default font-semibold text-accent`}
              readOnly
              value={result?.valueDisplay ?? ''}
              placeholder="—"
              aria-live="polite"
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="bv-value-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label="Estimated value currency"
            />
          </div>
        </div>
      </div>

      {errors.form ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}

function MoneyField({
  id,
  label,
  tip,
  value,
  error,
  symbol,
  currency,
  onValue,
  onCurrency,
}: {
  id: string;
  label: string;
  tip: string;
  value: number;
  error?: string;
  symbol: string;
  currency: BusinessValuationInput['currency'];
  onValue: (event: ChangeEvent<HTMLInputElement>) => void;
  onCurrency: (currency: BusinessValuationInput['currency']) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        <span>{label}</span>
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={error}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={numberOrBlank(value)}
            aria-invalid={Boolean(error)}
            onChange={onValue}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect id={`${id}-currency`} value={currency} onChange={onCurrency} />
        </div>
      </div>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
