'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  EXAMPLE_BEAT_INFLATION,
  EXAMPLE_PURCHASING_POWER_LOSS,
  type SalaryInflationFieldErrors,
  type SalaryInflationInput,
  type SalaryInflationResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

interface SalaryInflationFormProps {
  input: SalaryInflationInput;
  errors: SalaryInflationFieldErrors;
  result: SalaryInflationResult | null;
  onChange: (input: SalaryInflationInput) => void;
  onReferenceSalaryCurrencyChange: (next: SupportedCurrency) => void;
  onAdjustedSalaryCurrencyChange: (next: SupportedCurrency) => void;
  onCurrentSalaryCurrencyChange: (next: SupportedCurrency) => void;
  onGainLossCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function SalaryInflationForm({
  input,
  errors,
  result,
  onChange,
  onReferenceSalaryCurrencyChange,
  onAdjustedSalaryCurrencyChange,
  onCurrentSalaryCurrencyChange,
  onGainLossCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: SalaryInflationFormProps) {
  const referenceSymbol = getCurrencySymbol(input.referenceSalaryCurrency);
  const adjustedSymbol = getCurrencySymbol(input.adjustedSalaryCurrency);
  const currentSymbol = getCurrencySymbol(input.currentSalaryCurrency);
  const gainLossSymbol = getCurrencySymbol(input.gainLossCurrency);

  const set = (patch: Partial<SalaryInflationInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className={sectionClass}>
        <div>
          <label className={labelClass} htmlFor="si-reference-salary">
            <span>Salary in the reference period</span>
            <InfoTooltip
              label="Salary in the reference period"
              text="Pay from the comparison baseline period. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.referenceSalary}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {referenceSymbol}
              </span>
              <input
                id="si-reference-salary"
                className={inputClass}
                inputMode="decimal"
                value={input.referenceSalary}
                aria-invalid={Boolean(errors.referenceSalary)}
                onChange={(e) => set({ referenceSalary: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="si-reference-salary-currency"
                value={input.referenceSalaryCurrency}
                onChange={onReferenceSalaryCurrencyChange}
                aria-label="Reference salary currency"
              />
            </div>
          </div>
          {errors.referenceSalary ? (
            <p className="mt-1 text-xs text-rose-600">{errors.referenceSalary}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="si-inflation">
            <span>Inflation rate</span>
            <InfoTooltip
              label="Inflation rate"
              text="Single-period inflation percent. Zero leaves adjusted salary equal to the reference. Deflation above −100% is allowed. Never FX-converted."
            />
          </label>
          <FieldShell error={errors.inflationPercent}>
            <input
              id="si-inflation"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.inflationPercent}
              aria-invalid={Boolean(errors.inflationPercent)}
              onChange={(e) => set({ inflationPercent: e.target.value })}
            />
            <span
              className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              %
            </span>
          </FieldShell>
          {errors.inflationPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.inflationPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="si-adjusted-salary">
            <span>Inflation-adjusted salary</span>
            <InfoTooltip
              label="Inflation-adjusted salary"
              text="Reference salary × (1 + inflation%/100) for one period. Change currency to display in another denomination."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {adjustedSymbol}
              </span>
              <input
                id="si-adjusted-salary"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedAdjustedSalary ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="si-adjusted-salary-currency"
                value={input.adjustedSalaryCurrency}
                onChange={onAdjustedSalaryCurrencyChange}
                aria-label="Inflation-adjusted salary currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="si-current-salary">
            <span>Your current salary</span>
            <InfoTooltip
              label="Your current salary"
              text="Pay today. Mixed currencies are normalized into the reference currency before gain/loss. Changing currency converts this amount with stored FX rates."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.currentSalary}>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {currentSymbol}
              </span>
              <input
                id="si-current-salary"
                className={inputClass}
                inputMode="decimal"
                value={input.currentSalary}
                aria-invalid={Boolean(errors.currentSalary)}
                onChange={(e) => set({ currentSalary: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="si-current-salary-currency"
                value={input.currentSalaryCurrency}
                onChange={onCurrentSalaryCurrencyChange}
                aria-label="Current salary currency"
              />
            </div>
          </div>
          {errors.currentSalary ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentSalary}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="si-gain-loss">
            <span>Your gain or loss</span>
            <InfoTooltip
              label="Your gain or loss"
              text="Current salary minus inflation-adjusted salary. Positive means you beat inflation; negative means purchasing-power loss."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {gainLossSymbol}
              </span>
              <input
                id="si-gain-loss"
                className={`${inputClass} text-accent`}
                readOnly
                tabIndex={-1}
                value={result?.formattedGainLoss ?? ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="si-gain-loss-currency"
                value={input.gainLossCurrency}
                onChange={onGainLossCurrencyChange}
                aria-label="Gain or loss currency"
              />
            </div>
          </div>
          {result ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {result.gainLossCanonical >= 0
                ? 'Current pay exceeds the inflation-adjusted reference (gain).'
                : 'Current pay is below the inflation-adjusted reference (purchasing-power loss).'}
            </p>
          ) : null}
        </div>
      </div>

      {(errors.form || conversionError || ratesWarning) && (
        <div className="space-y-2">
          {errors.form ? (
            <p
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
              role="alert"
            >
              {errors.form}
            </p>
          ) : null}
          {conversionError ? (
            <p
              className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
              role="alert"
            >
              {conversionError}
            </p>
          ) : null}
          {ratesWarning ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
              {ratesWarning}
            </p>
          ) : null}
        </div>
      )}

      <div className="rounded-xl border border-border bg-white px-3.5 py-3 text-xs text-muted-foreground sm:px-4">
        <p className="font-medium text-accent">Check our examples:</p>
        <ul className="mt-1.5 list-disc space-y-1 pl-4">
          <li>
            <button
              type="button"
              className="text-primary underline-offset-2 hover:underline"
              onClick={() =>
                onChange({
                  ...EXAMPLE_BEAT_INFLATION,
                  referenceSalaryCurrency: input.referenceSalaryCurrency,
                  adjustedSalaryCurrency: input.adjustedSalaryCurrency,
                  currentSalaryCurrency: input.currentSalaryCurrency,
                  gainLossCurrency: input.gainLossCurrency,
                })
              }
            >
              Example 1 — Beat inflation
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-primary underline-offset-2 hover:underline"
              onClick={() =>
                onChange({
                  ...EXAMPLE_PURCHASING_POWER_LOSS,
                  referenceSalaryCurrency: input.referenceSalaryCurrency,
                  adjustedSalaryCurrency: input.adjustedSalaryCurrency,
                  currentSalaryCurrency: input.currentSalaryCurrency,
                  gainLossCurrency: input.gainLossCurrency,
                })
              }
            >
              Example 2 — Purchasing-power loss
            </button>
          </li>
        </ul>
      </div>
    </form>
  );
}
