'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  listUsCpiYearsDescending,
  US_CPI_BASE,
  US_CPI_MAX_YEAR,
  US_CPI_MIN_YEAR,
  US_CPI_SERIES_ID,
  US_CPI_SOURCE_NAME,
} from '../buying-power/us-cpi-u-annual';
import type {
  CpiInflationFieldErrors,
  CpiInflationInput,
  CpiInflationResult,
  CpiMode,
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

interface CpiInflationFormProps {
  input: CpiInflationInput;
  errors: CpiInflationFieldErrors;
  result: CpiInflationResult | null;
  onChange: (input: CpiInflationInput) => void;
}

export function CpiInflationForm({
  input,
  errors,
  result,
  onChange,
}: CpiInflationFormProps) {
  const years = listUsCpiYearsDescending();
  const set = (patch: Partial<CpiInflationInput>) =>
    onChange({ ...input, ...patch });
  const setMode = (mode: CpiMode) => set({ mode });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Equivalent value = Amount × (CPI<sub>target</sub> / CPI<sub>base</sub>).
        Dataset: {US_CPI_SOURCE_NAME} {US_CPI_SERIES_ID} annual average (
        {US_CPI_BASE}), {US_CPI_MIN_YEAR}–{US_CPI_MAX_YEAR}. Fixed USD. Manual
        rates only in custom mode.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode('historical')}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
            input.mode === 'historical'
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-accent hover:bg-muted/30'
          }`}
        >
          Historical CPI years
        </button>
        <button
          type="button"
          onClick={() => setMode('custom')}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
            input.mode === 'custom'
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-accent hover:bg-muted/30'
          }`}
        >
          Custom CPI values
        </button>
      </div>

      <div>
        <label htmlFor="cpi-amount" className={labelClass}>
          Amount
          <InfoTooltip
            label="Amount"
            text="Enter the monetary amount whose CPI-adjusted equivalent value you want to compare between two years."
          />
        </label>
        <FieldShell error={errors.amount}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="cpi-amount"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.amount}
            onChange={(e) => set({ amount: e.target.value })}
            placeholder="100"
            aria-invalid={Boolean(errors.amount)}
          />
        </FieldShell>
        {errors.amount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.amount}</p>
        ) : null}
      </div>

      {input.mode === 'historical' ? (
        <>
          <div>
            <label htmlFor="cpi-base-year" className={labelClass}>
              Base year
              <InfoTooltip
                label="Base year"
                text="Year in which the original monetary amount is valued."
              />
            </label>
            <FieldShell error={errors.baseYear}>
              <select
                id="cpi-base-year"
                className={selectClass}
                value={input.baseYear}
                onChange={(e) => set({ baseYear: e.target.value })}
                aria-invalid={Boolean(errors.baseYear)}
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={`b-${y}`} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </FieldShell>
            {errors.baseYear ? (
              <p className="mt-1 text-xs text-rose-600">{errors.baseYear}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="cpi-target-year" className={labelClass}>
              Target year
              <InfoTooltip
                label="Target year"
                text="Year into which the original monetary amount is converted."
              />
            </label>
            <FieldShell error={errors.targetYear}>
              <select
                id="cpi-target-year"
                className={selectClass}
                value={input.targetYear}
                onChange={(e) => set({ targetYear: e.target.value })}
                aria-invalid={Boolean(errors.targetYear)}
              >
                <option value="">Select year</option>
                {years.map((y) => (
                  <option key={`t-${y}`} value={String(y)}>
                    {y}
                    {y === US_CPI_MAX_YEAR ? ' (latest final annual)' : ''}
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
        <div className="space-y-3 rounded-xl border border-border bg-muted/10 p-3">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Enter CPI index values from the <strong>same</strong> compatible
            series. Do not mix unrelated countries or differently based indexes.
          </p>
          <div>
            <label htmlFor="cpi-base-cpi" className={labelClass}>
              Base CPI
            </label>
            <FieldShell error={errors.baseCPI}>
              <input
                id="cpi-base-cpi"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.baseCPI}
                onChange={(e) => set({ baseCPI: e.target.value })}
                placeholder="220"
                aria-invalid={Boolean(errors.baseCPI)}
              />
            </FieldShell>
            {errors.baseCPI ? (
              <p className="mt-1 text-xs text-rose-600">{errors.baseCPI}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="cpi-target-cpi" className={labelClass}>
              Target CPI
            </label>
            <FieldShell error={errors.targetCPI}>
              <input
                id="cpi-target-cpi"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.targetCPI}
                onChange={(e) => set({ targetCPI: e.target.value })}
                placeholder="260"
                aria-invalid={Boolean(errors.targetCPI)}
              />
            </FieldShell>
            {errors.targetCPI ? (
              <p className="mt-1 text-xs text-rose-600">{errors.targetCPI}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="cpi-years" className={labelClass}>
              Number of years (for annualized rate)
            </label>
            <FieldShell error={errors.yearsSpan}>
              <input
                id="cpi-years"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.yearsSpan}
                onChange={(e) => set({ yearsSpan: e.target.value })}
                placeholder="10"
                aria-invalid={Boolean(errors.yearsSpan)}
              />
            </FieldShell>
            {errors.yearsSpan ? (
              <p className="mt-1 text-xs text-rose-600">{errors.yearsSpan}</p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Required for average annual inflation; leave blank to skip
                annualization.
              </p>
            )}
          </div>
        </div>
      )}

      <div>
        <label htmlFor="cpi-equiv" className={labelClass}>
          Equivalent value
        </label>
        <FieldShell muted>
          <input
            id="cpi-equiv"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            value={result?.formattedEquivalentValue ?? ''}
            placeholder="—"
            aria-readonly="true"
          />
        </FieldShell>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="cpi-cum" className={labelClass}>
            Cumulative inflation rate
          </label>
          <FieldShell muted>
            <input
              id="cpi-cum"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={result?.formattedCumulativeInflation ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
        <div>
          <label htmlFor="cpi-avg" className={labelClass}>
            Average annual CPI inflation rate
          </label>
          <FieldShell muted>
            <input
              id="cpi-avg"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={result?.formattedAverageAnnualInflation ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
