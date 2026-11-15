'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  INITIAL_YEARS,
  MAX_YEARS,
  type MirrFieldErrors,
  type MirrInput,
  type MirrResult,
} from './types';
import { normalizeYearCount } from './validation';

interface MirrFormProps {
  input: MirrInput;
  errors: MirrFieldErrors;
  result: MirrResult | null;
  onChange: (input: MirrInput) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor?: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function MirrForm({ input, errors, result, onChange, onReset }: MirrFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const [moreOpen, setMoreOpen] = React.useState(input.cashFlows.length > INITIAL_YEARS);

  const setCashFlow = (index: number, value: string) => {
    const cashFlows = input.cashFlows.map((cf, i) => (i === index ? value : cf));
    onChange({ ...input, cashFlows });
  };

  const primaryYears = input.cashFlows.slice(0, INITIAL_YEARS);
  const extraYears = input.cashFlows.slice(INITIAL_YEARS);

  const addYear = () => {
    if (input.cashFlows.length >= MAX_YEARS) return;
    setMoreOpen(true);
    onChange(normalizeYearCount(input, input.cashFlows.length + 1));
  };

  const removeLastExtraYear = () => {
    if (input.cashFlows.length <= INITIAL_YEARS) return;
    onChange(normalizeYearCount(input, input.cashFlows.length - 1));
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="mirr-finance"
          label="Financing rate"
          tip="Annual rate used to discount negative cash flows (including the initial investment) to year 0."
        />
        <div className="relative">
          <input
            id="mirr-finance"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.financingRatePercent}
            aria-invalid={Boolean(errors.financingRatePercent)}
            onChange={(e) => onChange({ ...input, financingRatePercent: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
        {errors.financingRatePercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.financingRatePercent}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="mirr-reinvest"
          label="Reinvestment rate"
          tip="Annual rate used to compound positive cash flows forward to the final year."
        />
        <div className="relative">
          <input
            id="mirr-reinvest"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.reinvestmentRatePercent}
            aria-invalid={Boolean(errors.reinvestmentRatePercent)}
            onChange={(e) => onChange({ ...input, reinvestmentRatePercent: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
        {errors.reinvestmentRatePercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.reinvestmentRatePercent}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="mirr-initial"
          label="Initial investment"
          tip="Upfront outflow at year 0. Must be greater than zero. Currency labels denomination only."
        />
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              {symbol}
            </span>
            <input
              id="mirr-initial"
              className={`${inputClass} pl-8`}
              inputMode="decimal"
              value={input.initialInvestment}
              aria-invalid={Boolean(errors.initialInvestment)}
              onChange={(e) => onChange({ ...input, initialInvestment: e.target.value })}
            />
          </div>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="mirr-currency"
              value={input.currency}
              onChange={(currency) => onChange({ ...input, currency })}
            />
          </div>
        </div>
        {errors.initialInvestment ? (
          <p className="mt-1 text-xs text-rose-600">{errors.initialInvestment}</p>
        ) : null}
      </div>

      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Annual cash flows</legend>
        <p className="text-xs text-muted-foreground">
          Positive values are inflows; negative values are outflows. Zero years inside the horizon
          are kept.
        </p>

        <div className="space-y-3">
          {primaryYears.map((cf, index) => {
            const year = index + 1;
            const err = errors[`year${year}`];
            return (
              <div key={year}>
                <FieldLabel
                  htmlFor={`mirr-year-${year}`}
                  label={`Year ${year}`}
                  tip={`Cash flow at the end of year ${year}.`}
                />
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      {symbol}
                    </span>
                    <input
                      id={`mirr-year-${year}`}
                      className={`${inputClass} pl-8`}
                      inputMode="decimal"
                      value={cf}
                      aria-invalid={Boolean(err)}
                      onChange={(e) => setCashFlow(index, e.target.value)}
                    />
                  </div>
                  <div className="w-[110px] shrink-0 sm:w-[120px]">
                    <CurrencySelect
                      id={`mirr-year-${year}-currency`}
                      value={input.currency}
                      onChange={(currency) => onChange({ ...input, currency })}
                    />
                  </div>
                </div>
                {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-border bg-muted/10">
          <button
            type="button"
            className="flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] font-medium text-accent"
            aria-expanded={moreOpen}
            onClick={() => {
              setMoreOpen((open) => {
                const next = !open;
                if (next && input.cashFlows.length <= INITIAL_YEARS) {
                  onChange(normalizeYearCount(input, INITIAL_YEARS + 1));
                }
                return next;
              });
            }}
          >
            <span>Enter more annual cash flows</span>
            <span aria-hidden="true">{moreOpen ? '▴' : '▾'}</span>
          </button>

          {moreOpen ? (
            <div className="space-y-3 border-t border-border px-3 py-3">
              {extraYears.map((cf, extraIndex) => {
                const index = INITIAL_YEARS + extraIndex;
                const year = index + 1;
                const err = errors[`year${year}`];
                return (
                  <div key={year}>
                    <FieldLabel
                      htmlFor={`mirr-year-${year}`}
                      label={`Year ${year}`}
                      tip={`Cash flow at the end of year ${year}.`}
                    />
                    <div className="flex gap-2">
                      <div className="relative min-w-0 flex-1">
                        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                          {symbol}
                        </span>
                        <input
                          id={`mirr-year-${year}`}
                          className={`${inputClass} pl-8`}
                          inputMode="decimal"
                          value={cf}
                          aria-invalid={Boolean(err)}
                          onChange={(e) => setCashFlow(index, e.target.value)}
                        />
                      </div>
                      <div className="w-[110px] shrink-0 sm:w-[120px]">
                        <CurrencySelect
                          id={`mirr-year-${year}-currency`}
                          value={input.currency}
                          onChange={(currency) => onChange({ ...input, currency })}
                        />
                      </div>
                    </div>
                    {err ? <p className="mt-1 text-xs text-rose-600">{err}</p> : null}
                  </div>
                );
              })}

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
        </div>
      </fieldset>

      <section
        className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        aria-labelledby="mirr-result-heading"
      >
        <h3 id="mirr-result-heading" className="text-[13px] font-semibold text-accent">
          Result
        </h3>
        <FieldLabel
          htmlFor="mirr-result"
          label="MIRR"
          tip="Modified internal rate of return as an annual percentage."
        />
        <div className="relative">
          <input
            id="mirr-result"
            type="text"
            readOnly
            className={`${inputClass} bg-muted/20 pr-8 font-semibold text-accent`}
            value={result ? result.formattedMirr : ''}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %
          </span>
        </div>
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
