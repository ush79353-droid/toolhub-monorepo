'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DegreeOfOperatingLeverageFieldErrors,
  DegreeOfOperatingLeverageInput,
  DegreeOfOperatingLeverageResult,
  DolCalculationMode,
  DolMethod,
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

function CollapsibleSection({
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
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

interface DegreeOfOperatingLeverageFormProps {
  input: DegreeOfOperatingLeverageInput;
  errors: DegreeOfOperatingLeverageFieldErrors;
  result: DegreeOfOperatingLeverageResult | null;
  onChange: (input: DegreeOfOperatingLeverageInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function DegreeOfOperatingLeverageForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: DegreeOfOperatingLeverageFormProps) {
  const [periodOpen, setPeriodOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const isPeriod = input.method === 'periodChange';

  const salesReadOnly = isPeriod && input.mode === 'salesChange';
  const ebitReadOnly = isPeriod && input.mode === 'ebitChange';
  const dolReadOnly = isPeriod && input.mode === 'dol';

  const set = (patch: Partial<DegreeOfOperatingLeverageInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset>
        <legend className={labelClass}>Calculation method</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="dol-method"
              className="h-4 w-4 accent-primary"
              checked={input.method === 'periodChange'}
              onChange={() =>
                set({ method: 'periodChange' satisfies DolMethod })
              }
            />
            Period-to-period
          </label>
          <label className="flex items-center gap-2 text-sm text-accent">
            <input
              type="radio"
              name="dol-method"
              className="h-4 w-4 accent-primary"
              checked={input.method === 'contributionMargin'}
              onChange={() =>
                set({ method: 'contributionMargin' satisfies DolMethod })
              }
            />
            Contribution margin
          </label>
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {isPeriod
            ? 'Observed DOL from percentage changes in sales and EBIT between two periods (reference default).'
            : 'Point-in-time DOL = contribution margin ÷ EBIT under a linear CVP cost model; not automatically interchangeable with period-to-period DOL.'}
        </p>
      </fieldset>

      {isPeriod ? (
        <>
          <fieldset>
            <legend className={labelClass}>Calculate</legend>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
              {(
                [
                  ['dol', 'DOL'],
                  ['ebitChange', 'EBIT change'],
                  ['salesChange', 'Sales change'],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center gap-2 text-sm text-accent"
                >
                  <input
                    type="radio"
                    name="dol-mode"
                    className="h-4 w-4 accent-primary"
                    checked={input.mode === value}
                    onChange={() =>
                      set({ mode: value satisfies DolCalculationMode })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <CollapsibleSection
            title="Period-to-period profit data"
            open={periodOpen}
            onToggle={() => setPeriodOpen((o) => !o)}
          >
            <div>
              <label htmlFor="dol-sales-pct" className={labelClass}>
                <span>Change in sales (%)</span>
                <InfoTooltip
                  label="Change in sales (%)"
                  text="%ΔSales = (Sales₂ − Sales₁) / Sales₁ × 100 for comparable periods. Rejected below −100% for nonnegative sales."
                />
              </label>
              <FieldShell
                error={errors.salesChangePercentage}
                muted={salesReadOnly}
              >
                <input
                  id="dol-sales-pct"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  readOnly={salesReadOnly}
                  tabIndex={salesReadOnly ? -1 : undefined}
                  value={
                    salesReadOnly
                      ? (result?.formattedSalesChangePercentage ?? '')
                      : input.salesChangePercentage
                  }
                  aria-invalid={
                    errors.salesChangePercentage ? true : undefined
                  }
                  aria-live={salesReadOnly ? 'polite' : undefined}
                  onChange={(e) =>
                    set({ salesChangePercentage: e.target.value })
                  }
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              {errors.salesChangePercentage ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.salesChangePercentage}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dol-ebit-pct" className={labelClass}>
                <span>Change in EBIT (%)</span>
                <InfoTooltip
                  label="Change in EBIT (%)"
                  text="%ΔEBIT = (EBIT₂ − EBIT₁) / EBIT₁ × 100. Starting EBIT of zero makes the percentage undefined; a negative base needs careful interpretation."
                />
              </label>
              <FieldShell
                error={errors.ebitChangePercentage}
                muted={ebitReadOnly}
              >
                <input
                  id="dol-ebit-pct"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  readOnly={ebitReadOnly}
                  tabIndex={ebitReadOnly ? -1 : undefined}
                  value={
                    ebitReadOnly
                      ? (result?.formattedEbitChangePercentage ?? '')
                      : input.ebitChangePercentage
                  }
                  aria-invalid={errors.ebitChangePercentage ? true : undefined}
                  aria-live={ebitReadOnly ? 'polite' : undefined}
                  onChange={(e) =>
                    set({ ebitChangePercentage: e.target.value })
                  }
                />
                <span className="pr-3 text-xs text-muted-foreground">%</span>
              </FieldShell>
              {errors.ebitChangePercentage ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.ebitChangePercentage}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dol-dol" className={labelClass}>
                <span>Degree of operating leverage</span>
                <InfoTooltip
                  label="Degree of operating leverage"
                  text="DOL = %ΔEBIT / %ΔSales. Dimensionless; no currency or % sign on the coefficient."
                />
              </label>
              <FieldShell
                error={errors.degreeOfOperatingLeverage}
                muted={dolReadOnly}
              >
                <input
                  id="dol-dol"
                  type="text"
                  inputMode="decimal"
                  className={`${inputClass} font-semibold`}
                  readOnly={dolReadOnly}
                  tabIndex={dolReadOnly ? -1 : undefined}
                  value={
                    dolReadOnly
                      ? (result?.formattedDegreeOfOperatingLeverage ?? '')
                      : input.degreeOfOperatingLeverage
                  }
                  aria-invalid={
                    errors.degreeOfOperatingLeverage ? true : undefined
                  }
                  aria-live={dolReadOnly ? 'polite' : undefined}
                  onChange={(e) =>
                    set({ degreeOfOperatingLeverage: e.target.value })
                  }
                />
              </FieldShell>
              {errors.degreeOfOperatingLeverage ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.degreeOfOperatingLeverage}
                </p>
              ) : null}
            </div>
          </CollapsibleSection>
        </>
      ) : (
        <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 px-3.5 py-3.5 sm:px-4 sm:py-4">
          <legend className="px-1 text-[13px] font-semibold text-accent">
            Calculate DOL from contribution margin
          </legend>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              Amounts use one display currency (denomination only). Assumes
              constant prices, variable cost per unit, fixed costs, and sales mix
              over the relevant range.
            </p>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="dol-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Display currency"
              />
            </div>
          </div>
          <div>
            <label htmlFor="dol-sales" className={labelClass}>
              Sales revenue
            </label>
            <FieldShell error={errors.salesRevenue}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="dol-sales"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.salesRevenue}
                aria-invalid={errors.salesRevenue ? true : undefined}
                onChange={(e) => set({ salesRevenue: e.target.value })}
              />
            </FieldShell>
            {errors.salesRevenue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.salesRevenue}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="dol-vc" className={labelClass}>
              Variable costs
            </label>
            <FieldShell error={errors.variableCosts}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="dol-vc"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.variableCosts}
                aria-invalid={errors.variableCosts ? true : undefined}
                onChange={(e) => set({ variableCosts: e.target.value })}
              />
            </FieldShell>
            {errors.variableCosts ? (
              <p className="mt-1 text-xs text-rose-600">{errors.variableCosts}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="dol-fc" className={labelClass}>
              Fixed operating costs
            </label>
            <FieldShell error={errors.fixedOperatingCosts}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="dol-fc"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.fixedOperatingCosts}
                aria-invalid={errors.fixedOperatingCosts ? true : undefined}
                onChange={(e) => set({ fixedOperatingCosts: e.target.value })}
              />
            </FieldShell>
            {errors.fixedOperatingCosts ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.fixedOperatingCosts}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="dol-cm-out" className={labelClass}>
              Degree of operating leverage
            </label>
            <FieldShell muted>
              <input
                id="dol-cm-out"
                type="text"
                className={`${inputClass} font-semibold`}
                readOnly
                tabIndex={-1}
                value={result?.formattedDegreeOfOperatingLeverage ?? ''}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        </fieldset>
      )}

      {errors.form ? (
        <p className="text-xs text-amber-800" role="status">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
