'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EbitCalculationMode,
  EbitFieldErrors,
  EbitInput,
  EbitResult,
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

interface EbitFormProps {
  input: EbitInput;
  errors: EbitFieldErrors;
  result: EbitResult | null;
  onChange: (input: EbitInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function EbitForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: EbitFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const revenueReadOnly = input.mode === 'revenue';
  const oeReadOnly = input.mode === 'operatingExpenses';
  const ebitReadOnly = input.mode === 'ebit';

  const set = (patch: Partial<EbitInput>) => {
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
          changes the symbol only — it does not convert values. EBIT = Revenue −
          Operating expenses (include COGS where applicable; exclude interest and
          taxes).
        </p>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id="ebit-currency"
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
              ['ebit', 'EBIT'],
              ['revenue', 'Revenue'],
              ['operatingExpenses', 'Operating expenses'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="ebit-mode"
                className="h-4 w-4 accent-primary"
                checked={input.mode === value}
                onChange={() =>
                  set({ mode: value satisfies EbitCalculationMode })
                }
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="ebit-revenue" className={labelClass}>
          Revenue
          <InfoTooltip
            label="Revenue"
            text="Amount earned from selling goods or providing services during the reporting period, after relevant sales adjustments when using net revenue."
          />
        </label>
        <FieldShell error={errors.revenue} muted={revenueReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ebit-revenue"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={revenueReadOnly}
            tabIndex={revenueReadOnly ? -1 : undefined}
            value={
              revenueReadOnly
                ? (result?.formattedRevenue ?? '')
                : input.revenue
            }
            aria-invalid={errors.revenue ? true : undefined}
            aria-live={revenueReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ revenue: e.target.value })}
          />
        </FieldShell>
        {errors.revenue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.revenue}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ebit-oe" className={labelClass}>
          Operating expenses
          <InfoTooltip
            label="Operating expenses"
            text="Total operating costs subtracted from revenue for this simplified EBIT — include COGS and other operating costs as applicable. Exclude interest expenses and income taxes. Do not subtract COGS twice."
          />
        </label>
        <FieldShell error={errors.operatingExpenses} muted={oeReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ebit-oe"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={oeReadOnly}
            tabIndex={oeReadOnly ? -1 : undefined}
            value={
              oeReadOnly
                ? (result?.formattedOperatingExpenses ?? '')
                : input.operatingExpenses
            }
            aria-invalid={errors.operatingExpenses ? true : undefined}
            aria-live={oeReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ operatingExpenses: e.target.value })}
          />
        </FieldShell>
        {errors.operatingExpenses ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.operatingExpenses}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ebit-result" className={labelClass}>
          EBIT
          <InfoTooltip
            label="EBIT"
            text="Earnings Before Interest and Taxes = Revenue − Operating expenses. Positive, zero, and negative results are all valid."
          />
        </label>
        <FieldShell error={errors.ebit} muted={ebitReadOnly}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="ebit-result"
            type="text"
            inputMode="decimal"
            className={inputClass}
            readOnly={ebitReadOnly}
            tabIndex={ebitReadOnly ? -1 : undefined}
            value={ebitReadOnly ? (result?.formattedEbit ?? '') : input.ebit}
            aria-invalid={errors.ebit ? true : undefined}
            aria-live={ebitReadOnly ? 'polite' : undefined}
            onChange={(e) => set({ ebit: e.target.value })}
          />
        </FieldShell>
        {errors.ebit ? (
          <p className="mt-1 text-xs text-rose-600">{errors.ebit}</p>
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
