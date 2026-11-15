'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  type CompoundFrequency,
  type SinkingFundFieldErrors,
  type SinkingFundInput,
  type SinkingFundResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function ReadOnlyShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/10">
      {children}
    </div>
  );
}

interface SinkingFundFormProps {
  input: SinkingFundInput;
  errors: SinkingFundFieldErrors;
  result: SinkingFundResult | null;
  onChange: (input: SinkingFundInput) => void;
  onReset: () => void;
}

export function SinkingFundForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: SinkingFundFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<SinkingFundInput>) => onChange({ ...input, ...patch });

  const onText =
    (key: keyof SinkingFundInput) => (event: ChangeEvent<HTMLInputElement>) => {
      set({ [key]: event.target.value } as Partial<SinkingFundInput>);
    };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label htmlFor="sf-fv" className={labelClass}>
          Money to accumulate
          <InfoTooltip
            label="Money to accumulate"
            text="Target future value of the sinking fund. Non-negative. Currency labels amounts only."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.moneyToAccumulate}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="sf-fv"
              className={inputClass}
              inputMode="decimal"
              value={input.moneyToAccumulate}
              aria-invalid={Boolean(errors.moneyToAccumulate)}
              onChange={onText('moneyToAccumulate')}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="sf-fv-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label="Money to accumulate currency"
            />
          </div>
        </div>
        {errors.moneyToAccumulate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.moneyToAccumulate}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="sf-rate" className={labelClass}>
          Annual interest rate
          <InfoTooltip
            label="Annual interest rate"
            text="Nominal annual interest rate as a percent. Zero is allowed. Must be non-negative."
          />
        </label>
        <FieldShell error={errors.annualInterestRatePercent}>
          <input
            id="sf-rate"
            className={`${inputClass} pr-12`}
            inputMode="decimal"
            value={input.annualInterestRatePercent}
            aria-invalid={Boolean(errors.annualInterestRatePercent)}
            onChange={onText('annualInterestRatePercent')}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            %/yr
          </span>
        </FieldShell>
        {errors.annualInterestRatePercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.annualInterestRatePercent}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="sf-compounding" className={labelClass}>
          Rate compounding frequency
          <InfoTooltip
            label="Rate compounding frequency"
            text="How often interest compounds and how often equal end-of-period contributions are made."
          />
        </label>
        <select
          id="sf-compounding"
          className={selectClass}
          value={input.compounding}
          onChange={(event) =>
            set({ compounding: event.target.value as CompoundFrequency })
          }
        >
          {COMPOUNDING_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <span className={labelClass}>
          Period
          <InfoTooltip
            label="Period"
            text="Investment length in years and months (0–11). Months count as months÷12 of a year, so total compounding periods may be fractional."
          />
        </span>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <FieldShell error={errors.periodYears}>
              <input
                id="sf-years"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={input.periodYears}
                aria-label="Period years"
                aria-invalid={Boolean(errors.periodYears)}
                onChange={onText('periodYears')}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                yrs
              </span>
            </FieldShell>
          </div>
          <div className="min-w-0 flex-1">
            <FieldShell error={errors.periodMonths}>
              <input
                id="sf-months"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={input.periodMonths}
                aria-label="Period months"
                aria-invalid={Boolean(errors.periodMonths)}
                onChange={onText('periodMonths')}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                mos
              </span>
            </FieldShell>
          </div>
        </div>
        {errors.periodYears ? (
          <p className="mt-1 text-xs text-rose-600">{errors.periodYears}</p>
        ) : null}
        {errors.periodMonths ? (
          <p className="mt-1 text-xs text-rose-600">{errors.periodMonths}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="sf-ussf" className={labelClass}>
          USSF factor
          <InfoTooltip
            label="USSF factor"
            text="Uniform series sinking fund factor: i / ((1 + i)^n − 1), or 1 / n when i = 0."
          />
        </label>
        <ReadOnlyShell>
          <input
            id="sf-ussf"
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={result?.ussfDisplay ?? ''}
            aria-live="polite"
          />
        </ReadOnlyShell>
      </div>

      <div>
        <label htmlFor="sf-contribution" className={labelClass}>
          Required contribution
          <InfoTooltip
            label="Required contribution"
            text="FV × USSF. Equal end-of-period contribution at the selected compounding frequency."
          />
        </label>
        <div className="flex gap-2">
          <ReadOnlyShell>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
              {symbol}
            </span>
            <input
              id="sf-contribution"
              className={`${inputClass} cursor-default font-semibold text-accent`}
              readOnly
              value={result?.contributionDisplay ?? ''}
              aria-live="polite"
            />
          </ReadOnlyShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="sf-contribution-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
              aria-label="Required contribution currency"
            />
          </div>
        </div>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
