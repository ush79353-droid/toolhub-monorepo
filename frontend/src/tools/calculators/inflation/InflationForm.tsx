'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  listUsCpiYearsDescending,
  US_CPI_MAX_YEAR,
  US_CPI_MIN_YEAR,
  US_CPI_SERIES_ID,
  US_CPI_SOURCE_NAME,
} from '../buying-power/us-cpi-u-annual';
import type {
  CustomTimeUnit,
  InflationDataMode,
  InflationFieldErrors,
  InflationFrequency,
  InflationInput,
  InflationResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full min-w-0 appearance-none bg-transparent px-3 text-sm text-accent outline-none';

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

const DATA_MODES: { id: InflationDataMode; label: string }[] = [
  { id: 'historical', label: 'US historical data' },
  { id: 'custom', label: 'Custom data' },
];

const FREQUENCIES: { id: InflationFrequency; label: string }[] = [
  { id: 'yearly', label: 'Yearly' },
  { id: 'quarterly', label: 'Quarterly' },
];

const TIME_UNITS: { id: CustomTimeUnit; label: string }[] = [
  { id: 'years', label: 'Years' },
  { id: 'months', label: 'Months' },
  { id: 'quarters', label: 'Quarters' },
];

interface InflationFormProps {
  input: InflationInput;
  errors: InflationFieldErrors;
  result: InflationResult | null;
  onChange: (input: InflationInput) => void;
  onLoadHistoricalExample: () => void;
  onLoadCustomExample: () => void;
}

export function InflationForm({
  input,
  errors,
  result,
  onChange,
  onLoadHistoricalExample,
  onLoadCustomExample,
}: InflationFormProps) {
  const years = listUsCpiYearsDescending();
  const set = (patch: Partial<InflationInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Historical mode uses {US_CPI_SOURCE_NAME} {US_CPI_SERIES_ID} annual
        averages ({US_CPI_MIN_YEAR}–{US_CPI_MAX_YEAR}). Custom mode compounds a
        user-supplied annual rate — an estimate, not a forecast. Fixed USD.
      </p>

      <div>
        <p className={labelClass}>Calculation based on</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Data mode">
          {DATA_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={input.dataMode === m.id}
              onClick={() => set({ dataMode: m.id })}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                input.dataMode === m.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <button
          type="button"
          onClick={onLoadHistoricalExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load historical example ($1,000 · 2000→2020)
        </button>
        <button
          type="button"
          onClick={onLoadCustomExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load custom example (3% · 5 years)
        </button>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {errors.frequency ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.frequency}
        </p>
      ) : null}

      {input.dataMode === 'historical' ? (
        <>
          <div>
            <p className={labelClass}>Frequency</p>
            <div
              className="flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Frequency"
            >
              {FREQUENCIES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="radio"
                  aria-checked={input.frequency === f.id}
                  onClick={() => set({ frequency: f.id })}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                    input.frequency === f.id
                      ? 'border-primary bg-primary text-white'
                      : 'border-border bg-white text-accent hover:bg-muted/30'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="inf-amount" className={labelClass}>
              With value
              <InfoTooltip
                label="With value"
                text="Original monetary amount whose purchasing power you want to compare across periods."
              />
            </label>
            <FieldShell error={errors.originalAmount}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="inf-amount"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.originalAmount}
                onChange={(e) => set({ originalAmount: e.target.value })}
                placeholder="100"
              />
            </FieldShell>
            {errors.originalAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.originalAmount}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="inf-ref-year" className={labelClass}>
              In (reference year)
            </label>
            <FieldShell error={errors.referenceYear}>
              <select
                id="inf-ref-year"
                className={selectClass}
                value={input.referenceYear}
                onChange={(e) => set({ referenceYear: e.target.value })}
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={`r-${y}`} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </FieldShell>
            {errors.referenceYear ? (
              <p className="mt-1 text-xs text-rose-600">{errors.referenceYear}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="inf-adjusted" className={labelClass}>
              I would have
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="inf-adjusted"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={
                  result?.dataMode === 'historical'
                    ? result.formattedAdjusted.replace(/^\$/, '')
                    : ''
                }
                placeholder="—"
              />
            </FieldShell>
          </div>

          <div>
            <label htmlFor="inf-tgt-year" className={labelClass}>
              In (target year)
            </label>
            <FieldShell error={errors.targetYear}>
              <select
                id="inf-tgt-year"
                className={selectClass}
                value={input.targetYear}
                onChange={(e) => set({ targetYear: e.target.value })}
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={`t-${y}`} value={String(y)}>
                    {y}
                    {y === US_CPI_MAX_YEAR ? ' (latest annual)' : ''}
                  </option>
                ))}
              </select>
            </FieldShell>
            {errors.targetYear ? (
              <p className="mt-1 text-xs text-rose-600">{errors.targetYear}</p>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div>
            <label htmlFor="inf-custom-amount" className={labelClass}>
              Original amount
            </label>
            <FieldShell error={errors.originalAmount}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="inf-custom-amount"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.originalAmount}
                onChange={(e) => set({ originalAmount: e.target.value })}
                placeholder="1000"
              />
            </FieldShell>
            {errors.originalAmount ? (
              <p className="mt-1 text-xs text-rose-600">{errors.originalAmount}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="inf-rate" className={labelClass}>
              Annual inflation rate
              <InfoTooltip
                label="Annual inflation rate"
                text="Constant annual inflation rate used for compound estimation. Must be greater than −100%."
              />
            </label>
            <FieldShell error={errors.annualInflationRate}>
              <input
                id="inf-rate"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.annualInflationRate}
                onChange={(e) => set({ annualInflationRate: e.target.value })}
                placeholder="3"
              />
              <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
                % / yr
              </span>
            </FieldShell>
            {errors.annualInflationRate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.annualInflationRate}
              </p>
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="inf-time" className={labelClass}>
                Time period
              </label>
              <FieldShell error={errors.timePeriod}>
                <input
                  id="inf-time"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.timePeriod}
                  onChange={(e) => set({ timePeriod: e.target.value })}
                  placeholder="5"
                />
              </FieldShell>
              {errors.timePeriod ? (
                <p className="mt-1 text-xs text-rose-600">{errors.timePeriod}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="inf-unit" className={labelClass}>
                Unit
              </label>
              <FieldShell>
                <select
                  id="inf-unit"
                  className={selectClass}
                  value={input.timeUnit}
                  onChange={(e) =>
                    set({ timeUnit: e.target.value as CustomTimeUnit })
                  }
                >
                  {TIME_UNITS.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </FieldShell>
            </div>
          </div>
          <div>
            <label htmlFor="inf-custom-adj" className={labelClass}>
              Inflation-adjusted amount
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="inf-custom-adj"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold`}
                value={
                  result?.dataMode === 'custom'
                    ? result.formattedAdjusted.replace(/^\$/, '')
                    : ''
                }
                placeholder="—"
              />
            </FieldShell>
          </div>
        </>
      )}
    </form>
  );
}
