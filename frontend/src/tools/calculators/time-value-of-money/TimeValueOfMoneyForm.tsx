'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  type CompoundFrequency,
  type MoneySourceField,
  type TimeValueOfMoneyFieldErrors,
  type TimeValueOfMoneyInput,
  type TimeValueOfMoneyResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
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

interface TimeValueOfMoneyFormProps {
  input: TimeValueOfMoneyInput;
  errors: TimeValueOfMoneyFieldErrors;
  result: TimeValueOfMoneyResult | null;
  onChange: (input: TimeValueOfMoneyInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function TimeValueOfMoneyForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: TimeValueOfMoneyFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<TimeValueOfMoneyInput>) => onChange({ ...input, ...patch });

  const presentDisplay =
    result && input.sourceField === 'futureValue'
      ? result.formattedPresentValue
      : input.presentValue;
  const futureDisplay =
    result && input.sourceField === 'presentValue'
      ? result.formattedFutureValue
      : input.futureValue;

  const moneyField = (
    key: MoneySourceField,
    id: string,
    label: string,
    tip: string,
    display: string,
    isComputed: boolean
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={errors[key]} muted={isComputed}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} ${isComputed ? 'font-semibold' : ''}`}
            inputMode="decimal"
            value={display}
            aria-invalid={Boolean(errors[key])}
            aria-live={isComputed ? 'polite' : undefined}
            onChange={(event) =>
              set({
                [key]: event.target.value,
                sourceField: key,
              } as Partial<TimeValueOfMoneyInput>)
            }
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-label="Time value of money inputs">
        <div>
          <label htmlFor="tvm-rate" className={labelClass}>
            Interest rate
            <InfoTooltip
              label="Interest rate"
              text="Nominal annual interest rate as a percent. Must keep 1 + rate/m greater than zero for the selected compounding."
            />
          </label>
          <FieldShell error={errors.interestRatePercent}>
            <input
              id="tvm-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.interestRatePercent}
              aria-invalid={Boolean(errors.interestRatePercent)}
              onChange={(event) => set({ interestRatePercent: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.interestRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRatePercent}</p>
          ) : null}
        </div>

        <div>
          <div className={`${labelClass} mb-1.5`}>
            <span>Term</span>
            <InfoTooltip
              label="Term"
              text="Investment length in years and months. Both must be zero or greater. Total years = years + months ÷ 12."
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FieldShell error={errors.years}>
              <input
                id="tvm-years"
                className={`${inputClass} pr-10`}
                inputMode="decimal"
                value={input.years}
                placeholder="0"
                aria-label="Years"
                aria-invalid={Boolean(errors.years)}
                onChange={(event) => set({ years: event.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                yrs
              </span>
            </FieldShell>
            <FieldShell error={errors.months}>
              <input
                id="tvm-months"
                className={`${inputClass} pr-10`}
                inputMode="decimal"
                value={input.months}
                placeholder="0"
                aria-label="Months"
                aria-invalid={Boolean(errors.months)}
                onChange={(event) => set({ months: event.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                mos
              </span>
            </FieldShell>
          </div>
          {errors.years ? (
            <p className="mt-1 text-xs text-rose-600">{errors.years}</p>
          ) : errors.months ? (
            <p className="mt-1 text-xs text-rose-600">{errors.months}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="tvm-compound" className={labelClass}>
            Compound frequency
            <InfoTooltip
              label="Compound frequency"
              text="How many times per year interest compounds (m in the TVM formulas)."
            />
          </label>
          <select
            id="tvm-compound"
            className={selectClass}
            value={input.compounding}
            onChange={(event) =>
              set({ compounding: event.target.value as CompoundFrequency })
            }
          >
            {COMPOUNDING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {moneyField(
          'presentValue',
          'tvm-pv',
          'Present value',
          'Starting amount today. Editing this calculates future value. Currency labels amounts only.',
          presentDisplay,
          input.sourceField === 'futureValue' && Boolean(result)
        )}
        {moneyField(
          'futureValue',
          'tvm-fv',
          'Future value',
          'Ending amount after the term. Editing this calculates present value. Currency labels amounts only.',
          futureDisplay,
          input.sourceField === 'presentValue' && Boolean(result)
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
