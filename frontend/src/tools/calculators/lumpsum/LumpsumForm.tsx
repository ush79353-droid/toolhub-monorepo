'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COMPOUNDING_OPTIONS,
  MODE_OPTIONS,
  type CompoundingFrequency,
  type LumpsumCalculationMode,
  type LumpsumFieldErrors,
  type LumpsumInput,
  type TermUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface LumpsumFormProps {
  input: LumpsumInput;
  errors: LumpsumFieldErrors;
  onChange: (next: LumpsumInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function LumpsumForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: LumpsumFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<LumpsumInput>) => onChange({ ...input, ...patch });
  const mode = input.mode;

  const showPv =
    mode === 'final-balance' ||
    mode === 'expected-return' ||
    mode === 'investment-term';
  const showFv =
    mode === 'initial-lumpsum' ||
    mode === 'expected-return' ||
    mode === 'investment-term';
  const showRate =
    mode === 'initial-lumpsum' ||
    mode === 'final-balance' ||
    mode === 'investment-term';
  const showTerm =
    mode === 'initial-lumpsum' ||
    mode === 'final-balance' ||
    mode === 'expected-return';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        One-time investment compound growth. Expected return and inflation are
        assumptions, not guarantees. Weekly = 52/yr, daily = 365/yr. Currency is
        denomination only (not FX).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="lumpsum-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example (goal ₹100,000 · 10% · 10y · monthly → ≈ ₹36,941)
      </button>

      <div>
        <label htmlFor="lumpsum-mode" className={labelClass}>
          I&apos;d like to know the...
        </label>
        <select
          id="lumpsum-mode"
          className={selectClass}
          value={input.mode}
          onChange={(e) =>
            set({ mode: e.target.value as LumpsumCalculationMode })
          }
        >
          {MODE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {showFv ? (
        <div>
          <label htmlFor="lumpsum-goal" className={labelClass}>
            Your Goal
            <InfoTooltip
              label="Goal"
              text="Target future value (final balance) you want to reach."
            />
          </label>
          <FieldShell error={errors.targetAmount}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="lumpsum-goal"
              className={inputClass}
              inputMode="decimal"
              value={input.targetAmount}
              onChange={(e) => set({ targetAmount: e.target.value })}
              placeholder="100000"
            />
          </FieldShell>
          {errors.targetAmount ? (
            <p className="mt-1 text-xs text-rose-600">{errors.targetAmount}</p>
          ) : null}
        </div>
      ) : null}

      {showPv ? (
        <div>
          <label htmlFor="lumpsum-pv" className={labelClass}>
            Initial Lumpsum
          </label>
          <FieldShell error={errors.initialInvestment}>
            <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
            <input
              id="lumpsum-pv"
              className={inputClass}
              inputMode="decimal"
              value={input.initialInvestment}
              onChange={(e) => set({ initialInvestment: e.target.value })}
              placeholder="100000"
            />
          </FieldShell>
          {errors.initialInvestment ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.initialInvestment}
            </p>
          ) : null}
        </div>
      ) : null}

      {showRate ? (
        <div>
          <label htmlFor="lumpsum-rate" className={labelClass}>
            Expected Rate of Return
            <InfoTooltip
              label="Return"
              text="Nominal annual return compounded at the selected frequency. Assumption only."
            />
          </label>
          <FieldShell error={errors.annualReturn}>
            <input
              id="lumpsum-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.annualReturn}
              onChange={(e) => set({ annualReturn: e.target.value })}
              placeholder="10"
            />
            <span className="pr-3 text-xs text-muted-foreground">%/yr</span>
          </FieldShell>
          {errors.annualReturn ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualReturn}</p>
          ) : null}
        </div>
      ) : null}

      {showTerm ? (
        <div>
          <label htmlFor="lumpsum-term" className={labelClass}>
            Term
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.termValue}>
              <input
                id="lumpsum-term"
                className={inputClass}
                inputMode="decimal"
                value={input.termValue}
                onChange={(e) => set({ termValue: e.target.value })}
                placeholder="10"
              />
            </FieldShell>
            <select
              className={`${selectClass} w-32 shrink-0`}
              value={input.termUnit}
              onChange={(e) => set({ termUnit: e.target.value as TermUnit })}
              aria-label="Term unit"
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
          {errors.termValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.termValue}</p>
          ) : null}
        </div>
      ) : null}

      <div>
        <label htmlFor="lumpsum-start" className={labelClass}>
          Start Date
        </label>
        <FieldShell error={errors.startDate}>
          <input
            id="lumpsum-start"
            type="date"
            className={inputClass}
            value={input.startDate}
            onChange={(e) => set({ startDate: e.target.value })}
          />
        </FieldShell>
        {errors.startDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.startDate}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="lumpsum-inflation" className={labelClass}>
          Inflation Rate
        </label>
        <FieldShell error={errors.inflationRate}>
          <input
            id="lumpsum-inflation"
            className={inputClass}
            inputMode="decimal"
            value={input.inflationRate}
            onChange={(e) => set({ inflationRate: e.target.value })}
            placeholder="0"
          />
          <span className="pr-3 text-xs text-muted-foreground">%/yr</span>
        </FieldShell>
        {errors.inflationRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.inflationRate}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="lumpsum-freq" className={labelClass}>
          Compounding Frequency
        </label>
        <select
          id="lumpsum-freq"
          className={selectClass}
          value={input.compoundingFrequency}
          onChange={(e) =>
            set({
              compoundingFrequency: e.target.value as CompoundingFrequency,
            })
          }
        >
          {COMPOUNDING_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
