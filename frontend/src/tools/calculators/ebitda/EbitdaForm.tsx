'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EbitdaCalculationMode,
  EbitdaFieldErrors,
  EbitdaInput,
  EbitdaResult,
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

interface EbitdaFormProps {
  input: EbitdaInput;
  errors: EbitdaFieldErrors;
  result: EbitdaResult | null;
  onChange: (input: EbitdaInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function EbitdaForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: EbitdaFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const opReadOnly = input.mode === 'operatingProfit';
  const aReadOnly = input.mode === 'amortization';
  const dReadOnly = input.mode === 'depreciation';
  const ebitdaReadOnly = input.mode === 'ebitda';

  const set = (patch: Partial<EbitdaInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Amounts use one display currency (denomination). Switching currency
          changes the symbol only — it does not convert values. EBITDA =
          Operating profit + Amortization + Depreciation (add back D&amp;A
          already deducted in operating profit).
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="ebitda-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>Calculate</legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-4">
          {(
            [
              ['ebitda', 'EBITDA'],
              ['operatingProfit', 'Operating profit'],
              ['amortization', 'Amortization'],
              ['depreciation', 'Depreciation'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="ebitda-mode"
                className="h-4 w-4 accent-primary"
                checked={input.mode === value}
                onChange={() =>
                  set({ mode: value satisfies EbitdaCalculationMode })
                }
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="ebitda-op" className={labelClass}>
          Operating profit
          <InfoTooltip
            label="Operating profit"
            text="Use an operating profit measure equivalent to EBIT under your accounting assumptions, with depreciation and amortization already deducted. Negative operating profit is allowed."
          />
        </label>
        <FieldShell error={errors.operatingProfit} muted={opReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ebitda-op"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={opReadOnly}
            tabIndex={opReadOnly ? -1 : undefined}
            value={
              opReadOnly
                ? (result?.formattedOperatingProfit ?? '')
                : input.operatingProfit
            }
            aria-invalid={errors.operatingProfit ? true : undefined}
            aria-live={opReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ operatingProfit: e.target.value })}
          />
        </FieldShell>
        {errors.operatingProfit ? (
          <p className="mt-1 text-xs text-rose-600">{errors.operatingProfit}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ebitda-amort" className={labelClass}>
          Amortization expense
          <InfoTooltip
            label="Amortization expense"
            text="Periodic allocation of certain intangible asset costs. Add back only amounts already deducted in operating profit."
          />
        </label>
        <FieldShell error={errors.amortizationExpense} muted={aReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ebitda-amort"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={aReadOnly}
            tabIndex={aReadOnly ? -1 : undefined}
            value={
              aReadOnly
                ? (result?.formattedAmortizationExpense ?? '')
                : input.amortizationExpense
            }
            aria-invalid={errors.amortizationExpense ? true : undefined}
            aria-live={aReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ amortizationExpense: e.target.value })}
          />
        </FieldShell>
        {errors.amortizationExpense ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.amortizationExpense}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ebitda-depr" className={labelClass}>
          Depreciation expense
          <InfoTooltip
            label="Depreciation expense"
            text="Periodic allocation of depreciable tangible asset costs. Add back only amounts already deducted in operating profit."
          />
        </label>
        <FieldShell error={errors.depreciationExpense} muted={dReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ebitda-depr"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={dReadOnly}
            tabIndex={dReadOnly ? -1 : undefined}
            value={
              dReadOnly
                ? (result?.formattedDepreciationExpense ?? '')
                : input.depreciationExpense
            }
            aria-invalid={errors.depreciationExpense ? true : undefined}
            aria-live={dReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ depreciationExpense: e.target.value })}
          />
        </FieldShell>
        {errors.depreciationExpense ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.depreciationExpense}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ebitda-result" className={labelClass}>
          EBITDA
          <InfoTooltip
            label="EBITDA"
            text="Earnings Before Interest, Taxes, Depreciation, and Amortization = Operating profit + Amortization + Depreciation."
          />
        </label>
        <FieldShell error={errors.ebitda} muted={ebitdaReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ebitda-result"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={ebitdaReadOnly}
            tabIndex={ebitdaReadOnly ? -1 : undefined}
            value={
              ebitdaReadOnly
                ? (result?.formattedEbitda ?? '')
                : input.ebitda
            }
            aria-invalid={errors.ebitda ? true : undefined}
            aria-live={ebitdaReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ ebitda: e.target.value })}
          />
        </FieldShell>
        {errors.ebitda ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ebitda}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ebitda-revenue" className={labelClass}>
          Revenue{' '}
          <span className="font-normal text-muted-foreground">(optional)</span>
          <InfoTooltip
            label="Revenue"
            text="Optional. Used only to compute EBITDA margin = EBITDA ÷ Revenue × 100. Not required for EBITDA."
          />
        </label>
        <FieldShell error={errors.revenue}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ebitda-revenue"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.revenue}
            aria-invalid={errors.revenue ? true : undefined}
            onChange={(e) => set({ revenue: e.target.value })}
            placeholder="For margin only"
          />
        </FieldShell>
        {errors.revenue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.revenue}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
