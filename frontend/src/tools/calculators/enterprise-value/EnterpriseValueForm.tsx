'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  EnterpriseValueFieldErrors,
  EnterpriseValueInput,
  EnterpriseValueResult,
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

interface EnterpriseValueFormProps {
  input: EnterpriseValueInput;
  errors: EnterpriseValueFieldErrors;
  result: EnterpriseValueResult | null;
  onChange: (input: EnterpriseValueInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function EnterpriseValueForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: EnterpriseValueFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const fields = [
    {
      id: 'ev-mcap',
      key: 'marketCap' as const,
      label: 'Market capitalization',
      tip: "The market value of a company's outstanding common shares, calculated by multiplying the current share price by the number of shares outstanding.",
      placeholder: '500,000,000',
    },
    {
      id: 'ev-mi',
      key: 'minorityInterest' as const,
      label: 'Minority interest',
      tip: 'The value of non-controlling interests included when calculating enterprise value using consolidated financial information.',
      placeholder: '0',
    },
    {
      id: 'ev-ps',
      key: 'preferredShares' as const,
      label: 'Preferred shares',
      tip: 'The value of outstanding preferred equity included in the company\'s financing structure.',
      placeholder: '0',
    },
    {
      id: 'ev-debt',
      key: 'debt' as const,
      label: 'Value of debt',
      tip: 'The value of interest-bearing financial debt included in the enterprise value calculation.',
      placeholder: '100,000,000',
    },
    {
      id: 'ev-cash',
      key: 'cash' as const,
      label: 'Cash and cash equivalents',
      tip: 'Cash and highly liquid cash equivalents deducted when calculating enterprise value, subject to the chosen valuation convention.',
      placeholder: '50,000,000',
    },
  ] as const;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        EV = Market cap + Minority interest + Preferred shares + Debt − Cash.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="ev-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for enterprise value amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        All money fields share one currency and scale (denomination only — no
        FX).
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate enterprise value
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Enterprise value inputs
        </legend>

        {fields.map((field) => (
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
          <label htmlFor="ev-result" className={labelClass}>
            Enterprise value
            <InfoTooltip
              label="Enterprise value"
              text="EV = Market capitalization + Debt + Minority interest + Preferred shares − Cash."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ev-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={result?.formattedEv.replace(symbol, '') ?? ''}
              placeholder="—"
              aria-readonly="true"
              aria-label={
                result
                  ? `Enterprise value ${result.formattedEv}`
                  : 'Enterprise value unavailable'
              }
            />
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
