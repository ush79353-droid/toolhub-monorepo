'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RevenueGrowthFieldErrors,
  RevenueGrowthInput,
  RevenueGrowthResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/15">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left sm:px-4"
        aria-expanded={open}
      >
        <span className="text-[13px] font-semibold text-accent">{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open ? <div className="space-y-3.5 border-t border-border p-3.5 sm:p-4">{children}</div> : null}
    </div>
  );
}

interface RevenueGrowthFormProps {
  input: RevenueGrowthInput;
  errors: RevenueGrowthFieldErrors;
  result: RevenueGrowthResult | null;
  onChange: (input: RevenueGrowthInput) => void;
  onMoneyCurrencyChange: (
    field:
      | 'totalInitial'
      | 'totalFinal'
      | 'rateInitial'
      | 'rateFinal',
    next: SupportedCurrency
  ) => void;
  onLoadExample: (id: 1 | 2) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function RevenueGrowthForm({
  input,
  errors,
  result,
  onChange,
  onMoneyCurrencyChange,
  onLoadExample,
  conversionError = null,
  ratesWarning = null,
}: RevenueGrowthFormProps) {
  const [totalOpen, setTotalOpen] = React.useState(true);
  const [rateOpen, setRateOpen] = React.useState(true);
  const set = (patch: Partial<RevenueGrowthInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <Section
        title="Revenue growth"
        open={totalOpen}
        onToggle={() => setTotalOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="rg-total-initial">
            <span>Initial value revenue</span>
            <InfoTooltip
              label="Initial value revenue"
              text="Starting revenue. Must be nonzero for total growth %."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalInitial}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {getCurrencySymbol(input.totalInitialCurrency)}
              </span>
              <input
                id="rg-total-initial"
                className={inputClass}
                inputMode="decimal"
                value={input.totalInitial}
                aria-invalid={Boolean(errors.totalInitial)}
                onChange={(e) => set({ totalInitial: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rg-total-initial-currency"
                value={input.totalInitialCurrency}
                onChange={(next) => onMoneyCurrencyChange('totalInitial', next)}
                aria-label="Total initial currency"
              />
            </div>
          </div>
          {errors.totalInitial ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalInitial}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rg-total-final">
            <span>Final value revenue</span>
            <InfoTooltip
              label="Final value revenue"
              text="Ending revenue. Zero and negatives are allowed for total growth."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.totalFinal}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {getCurrencySymbol(input.totalFinalCurrency)}
              </span>
              <input
                id="rg-total-final"
                className={inputClass}
                inputMode="decimal"
                value={input.totalFinal}
                aria-invalid={Boolean(errors.totalFinal)}
                onChange={(e) => set({ totalFinal: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rg-total-final-currency"
                value={input.totalFinalCurrency}
                onChange={(next) => onMoneyCurrencyChange('totalFinal', next)}
                aria-label="Total final currency"
              />
            </div>
          </div>
          {errors.totalFinal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalFinal}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rg-total-growth">
            <span>Total growth in revenue</span>
          </label>
          <FieldShell muted>
            <input
              id="rg-total-growth"
              className={inputClass}
              readOnly
              tabIndex={-1}
              value={result?.formattedTotalGrowth ?? ''}
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
        </div>
      </Section>

      <Section
        title="Revenue growth rate"
        open={rateOpen}
        onToggle={() => setRateOpen((v) => !v)}
      >
        <div>
          <label className={labelClass} htmlFor="rg-rate-initial">
            <span>Initial value revenue</span>
            <InfoTooltip
              label="Initial value revenue"
              text="Starting revenue for compound growth. Must be positive."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.rateInitial}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {getCurrencySymbol(input.rateInitialCurrency)}
              </span>
              <input
                id="rg-rate-initial"
                className={inputClass}
                inputMode="decimal"
                value={input.rateInitial}
                aria-invalid={Boolean(errors.rateInitial)}
                onChange={(e) => set({ rateInitial: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rg-rate-initial-currency"
                value={input.rateInitialCurrency}
                onChange={(next) => onMoneyCurrencyChange('rateInitial', next)}
                aria-label="Rate initial currency"
              />
            </div>
          </div>
          {errors.rateInitial ? (
            <p className="mt-1 text-xs text-rose-600">{errors.rateInitial}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rg-rate-final">
            <span>Final value revenue</span>
            <InfoTooltip
              label="Final value revenue"
              text="Ending revenue for compound growth. Must be positive."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.rateFinal}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {getCurrencySymbol(input.rateFinalCurrency)}
              </span>
              <input
                id="rg-rate-final"
                className={inputClass}
                inputMode="decimal"
                value={input.rateFinal}
                aria-invalid={Boolean(errors.rateFinal)}
                onChange={(e) => set({ rateFinal: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="rg-rate-final-currency"
                value={input.rateFinalCurrency}
                onChange={(next) => onMoneyCurrencyChange('rateFinal', next)}
                aria-label="Rate final currency"
              />
            </div>
          </div>
          {errors.rateFinal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.rateFinal}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rg-periods">
            <span>Number of periods</span>
            <InfoTooltip
              label="Number of periods"
              text="Count of compounding periods between initial and final revenue (e.g. years)."
            />
          </label>
          <FieldShell error={errors.periods}>
            <input
              id="rg-periods"
              className={inputClass}
              inputMode="decimal"
              value={input.periods}
              aria-invalid={Boolean(errors.periods)}
              onChange={(e) => set({ periods: e.target.value })}
            />
          </FieldShell>
          {errors.periods ? (
            <p className="mt-1 text-xs text-rose-600">{errors.periods}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="rg-growth-rate">
            <span>Revenue growth rate</span>
            <InfoTooltip
              label="Revenue growth rate"
              text="Compound growth rate per period: [(Final/Initial)^(1/n) − 1] × 100."
            />
          </label>
          <FieldShell muted>
            <input
              id="rg-growth-rate"
              className={inputClass}
              readOnly
              tabIndex={-1}
              value={result?.formattedGrowthRate ?? ''}
              aria-live="polite"
            />
            <span className="shrink-0 pr-3 text-sm text-muted-foreground">%</span>
          </FieldShell>
        </div>
      </Section>

      <div className="rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <p className="mb-2 text-[13px] font-semibold text-accent">Check our examples</p>
        <ul className="space-y-2 text-sm text-accent">
          <li>
            <button
              type="button"
              className="font-semibold text-primary underline underline-offset-2"
              onClick={() => onLoadExample(1)}
            >
              Example 1
            </button>
            <span className="text-muted-foreground">
              {' '}
              — final revenue after 20% of total growth.
            </span>
          </li>
          <li>
            <button
              type="button"
              className="font-semibold text-primary underline underline-offset-2"
              onClick={() => onLoadExample(2)}
            >
              Example 2
            </button>
            <span className="text-muted-foreground">
              {' '}
              — final revenue after 5 years.
            </span>
          </li>
        </ul>
      </div>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesWarning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
