'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EbitdaMultipleFieldErrors,
  EbitdaMultipleInput,
  EbitdaMultipleResult,
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

interface EbitdaMultipleFormProps {
  input: EbitdaMultipleInput;
  errors: EbitdaMultipleFieldErrors;
  result: EbitdaMultipleResult | null;
  onChange: (input: EbitdaMultipleInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function EbitdaMultipleForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: EbitdaMultipleFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Build enterprise value from market cap, debt, minority interest,
        preferred equity, and cash, then divide by EBITDA for EV/EBITDA.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="evm-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for EBITDA multiple amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 All money fields share one currency and scale (denomination only; no
        FX).
      </p>
      <p className="text-xs">
        <a
          href="#how-to-use"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use the EBITDA multiple calculator
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          EV / EBITDA inputs
        </legend>

        {(
          [
            {
              id: 'evm-cash',
              key: 'cash' as const,
              label: 'Cash and cash equivalents',
              tip: 'Cash and highly liquid assets held by the company. This amount is subtracted when calculating enterprise value.',
              placeholder: '20,000,000',
            },
            {
              id: 'evm-mcap',
              key: 'marketCap' as const,
              label: 'Market capitalization',
              tip: "The total market value of a company's outstanding common equity.",
              placeholder: '450,000,000',
            },
            {
              id: 'evm-mi',
              key: 'minorityInterest' as const,
              label: 'Minority interest',
              tip: 'The value of non-controlling interests included in the company\'s consolidated enterprise valuation.',
              placeholder: '0',
            },
            {
              id: 'evm-pe',
              key: 'preferredEquity' as const,
              label: 'Preferred shares',
              tip: 'Enter the monetary value of outstanding preferred equity, not the number of preferred shares.',
              placeholder: '0',
            },
            {
              id: 'evm-debt',
              key: 'debt' as const,
              label: 'Value of debt',
              tip: 'The value of financial debt included in the enterprise value calculation.',
              placeholder: '100,000,000',
            },
          ] as const
        ).map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className={labelClass}>
              {field.label}
              <InfoTooltip label={field.label} text={field.tip} />
            </label>
            <FieldShell error={errors[field.key]}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id={field.id}
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input[field.key]}
                onChange={(e) =>
                  onChange({ ...input, [field.key]: e.target.value })
                }
                placeholder={field.placeholder}
                aria-invalid={Boolean(errors[field.key])}
              />
            </FieldShell>
            {errors[field.key] ? (
              <p className="mt-1 text-xs text-rose-600">{errors[field.key]}</p>
            ) : null}
          </div>
        ))}

        <div>
          <label htmlFor="evm-ev" className={labelClass}>
            Enterprise value
            <InfoTooltip
              label="Enterprise value"
              text="EV = Market cap + Debt + Minority interest + Preferred equity − Cash."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="evm-ev"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedEv.replace(symbol, '') ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>

        <div>
          <label htmlFor="evm-ebitda" className={labelClass}>
            EBITDA
            <InfoTooltip
              label="EBITDA"
              text="Earnings before interest, taxes, depreciation, and amortization for the selected reporting period."
            />
          </label>
          <FieldShell error={errors.ebitda}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="evm-ebitda"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.ebitda}
              onChange={(e) => onChange({ ...input, ebitda: e.target.value })}
              placeholder="50,000,000"
              aria-invalid={Boolean(errors.ebitda)}
            />
          </FieldShell>
          {errors.ebitda ? (
            <p className="mt-1 text-xs text-rose-600">{errors.ebitda}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="evm-multiple" className={labelClass}>
            EBITDA multiple
            <InfoTooltip
              label="EBITDA multiple"
              text="Enterprise value divided by EBITDA (EV/EBITDA), shown as a multiple of ×."
            />
          </label>
          <FieldShell muted>
            <input
              id="evm-multiple"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result
                  ? (result.formattedMultiple?.replace('×', '') ?? 'Unavailable')
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
              aria-label={
                result?.formattedMultiple
                  ? `EBITDA multiple ${result.formattedMultiple}`
                  : 'EBITDA multiple unavailable'
              }
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              ×
            </span>
          </FieldShell>
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
