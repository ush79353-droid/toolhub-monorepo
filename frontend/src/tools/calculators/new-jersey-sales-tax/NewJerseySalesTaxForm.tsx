'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  NewJerseySalesTaxFieldErrors,
  NewJerseySalesTaxInput,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface NewJerseySalesTaxFormProps {
  input: NewJerseySalesTaxInput;
  errors: NewJerseySalesTaxFieldErrors;
  onChange: (input: NewJerseySalesTaxInput) => void;
}

export function NewJerseySalesTaxForm({
  input,
  errors,
  onChange,
}: NewJerseySalesTaxFormProps) {
  const set = (patch: Partial<NewJerseySalesTaxInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      className="space-y-3.5"
      noValidate
      autoComplete="off"
      onSubmit={(event) => event.preventDefault()}
    >
      <div>
        <label className={labelClass} htmlFor="nj-sales-tax-purchase">
          <span>Purchase amount</span>
        </label>
        <FieldShell error={errors.purchaseAmount}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="nj-sales-tax-purchase"
            className={inputClass}
            inputMode="decimal"
            value={input.purchaseAmount}
            placeholder="0.00"
            aria-invalid={Boolean(errors.purchaseAmount)}
            onChange={(e) => set({ purchaseAmount: e.target.value })}
          />
        </FieldShell>
        {errors.purchaseAmount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.purchaseAmount}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="nj-sales-tax-zip">
          <span>ZIP code</span>
          <InfoTooltip
            label="ZIP code"
            text="Enter a five-digit New Jersey ZIP code (07001–08989 per NJ Division of Taxation). ZIP alone does not prove Urban Enterprise Zone eligibility; this tool applies the standard statewide rate."
          />
        </label>
        <FieldShell error={errors.zipCode}>
          <input
            id="nj-sales-tax-zip"
            className={inputClass}
            inputMode="numeric"
            maxLength={5}
            value={input.zipCode}
            placeholder="#####"
            aria-invalid={Boolean(errors.zipCode)}
            onChange={(e) =>
              set({ zipCode: e.target.value.replace(/[^\d]/g, '').slice(0, 5) })
            }
          />
        </FieldShell>
        {errors.zipCode ? (
          <p className="mt-1 text-xs text-rose-600">{errors.zipCode}</p>
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
