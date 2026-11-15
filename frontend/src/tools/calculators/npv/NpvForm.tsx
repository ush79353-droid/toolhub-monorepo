'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  INITIAL_YEARS,
  MAX_YEARS,
  type NpvFieldErrors,
  type NpvInput,
  type NpvResult,
} from './types';
import { normalizeYearCount } from './validation';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  muted,
  children,
}: {
  error?: string;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring ${
        muted ? 'border-border bg-muted/10' : 'border-border bg-white'
      } ${error ? 'border-rose-400' : ''}`}
    >
      {children}
    </div>
  );
}

interface NpvFormProps {
  input: NpvInput;
  errors: NpvFieldErrors;
  result: NpvResult | null;
  onChange: (input: NpvInput) => void;
  onReset: () => void;
}

export function NpvForm({ input, errors, result, onChange, onReset }: NpvFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<NpvInput>) => onChange({ ...input, ...patch });

  const setCashFlow = (index: number, value: string) => {
    const cashFlows = input.cashFlows.map((cf, i) => (i === index ? value : cf));
    onChange({ ...input, cashFlows });
  };

  const primaryYears = input.cashFlows.slice(0, INITIAL_YEARS);
  const extraYears = input.cashFlows.slice(INITIAL_YEARS);

  const addYear = () => {
    if (input.cashFlows.length >= MAX_YEARS) return;
    onChange(
      normalizeYearCount(
        { ...input, showMoreCashFlows: true },
        input.cashFlows.length + 1
      )
    );
  };

  const removeLastExtraYear = () => {
    if (input.cashFlows.length <= INITIAL_YEARS) return;
    onChange(normalizeYearCount(input, input.cashFlows.length - 1));
  };

  const yearField = (cf: string, index: number) => {
    const year = index + 1;
    const err = errors[`year${year}`];
    return (
      <div key={year}>
        <label htmlFor={`npv-year-${year}`} className={labelClass}>
          Year {year}
        </label>
        <div className="flex gap-2">
          <FieldShell error={err}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id={`npv-year-${year}`}
              className={inputClass}
              inputMode="decimal"
              value={cf}
              aria-invalid={Boolean(err)}
              onChange={(e) => setCashFlow(index, e.target.value)}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id={`npv-year-${year}-currency`}
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label={`Year ${year} currency`}
            />
          </div>
        </div>
        {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
      </div>
    );
  };

  const moneyOutput = (
    id: string,
    label: string,
    tip: string,
    display: string
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell muted>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={display}
            aria-live="polite"
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={(currency) => set({ currency })}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-labelledby="npv-inputs-heading">
        <h3 id="npv-inputs-heading" className={sectionTitleClass}>
          Main inputs
        </h3>

        <div>
          <label htmlFor="npv-discount-rate" className={labelClass}>
            Discount rate
          </label>
          <FieldShell error={errors.discountRatePercent}>
            <input
              id="npv-discount-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.discountRatePercent}
              aria-invalid={Boolean(errors.discountRatePercent)}
              onChange={(e) => set({ discountRatePercent: e.target.value })}
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground" aria-hidden="true">
              %
            </span>
          </FieldShell>
          {errors.discountRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.discountRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="npv-initial-costs" className={labelClass}>
            Initial costs
            <InfoTooltip
              label="Initial costs"
              text="Upfront outflow at year 0. Non-negative. Currency labels denomination only."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.initialCosts}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="npv-initial-costs"
                className={inputClass}
                inputMode="decimal"
                value={input.initialCosts}
                aria-invalid={Boolean(errors.initialCosts)}
                onChange={(e) => set({ initialCosts: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="npv-initial-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Initial costs currency"
              />
            </div>
          </div>
          {errors.initialCosts ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialCosts}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="npv-cash-flows-heading">
        <h3 id="npv-cash-flows-heading" className={sectionTitleClass}>
          Annual cash flows
        </h3>
        <p className="text-xs text-muted-foreground">
          Positive values are inflows; negative values are outflows. Zero is allowed.
        </p>

        <div className="space-y-3">{primaryYears.map((cf, index) => yearField(cf, index))}</div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-accent">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            checked={input.showMoreCashFlows}
            onChange={(e) => {
              const checked = e.target.checked;
              if (checked && input.cashFlows.length <= INITIAL_YEARS) {
                onChange(
                  normalizeYearCount(
                    { ...input, showMoreCashFlows: true },
                    INITIAL_YEARS + 1
                  )
                );
              } else {
                set({ showMoreCashFlows: checked });
              }
            }}
          />
          Show more annual cash flows
        </label>

        {input.showMoreCashFlows ? (
          <div className="space-y-3 border-t border-border pt-3">
            {extraYears.map((cf, extraIndex) =>
              yearField(cf, INITIAL_YEARS + extraIndex)
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-3 text-xs font-medium"
                disabled={input.cashFlows.length >= MAX_YEARS}
                onClick={addYear}
              >
                Add year
              </Button>
              {extraYears.length > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 px-3 text-xs font-medium"
                  onClick={removeLastExtraYear}
                >
                  Remove last year
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>

      <section
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
        aria-labelledby="npv-results-heading"
      >
        <h3 id="npv-results-heading" className={sectionTitleClass}>
          NPV
        </h3>
        {moneyOutput(
          'npv-result',
          'Net present value',
          '−Initial costs + present value of annual cash flows. Positive means the project exceeds the required return.',
          result?.npvDisplay ?? ''
        )}
        {moneyOutput(
          'npv-expected-cf',
          'Expected cash flows',
          'Present value of future cash flows only (excludes initial costs), discounted at the entered rate.',
          result?.expectedCashFlowsDisplay ?? ''
        )}
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
