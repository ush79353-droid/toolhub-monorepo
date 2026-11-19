'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CaliforniaSalesTaxFieldErrors,
  CaliforniaSalesTaxInput,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm text-accent outline-none';
const inputNumericClass = `${inputClass} tabular-nums`;

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

interface CaliforniaSalesTaxFormProps {
  input: CaliforniaSalesTaxInput;
  errors: CaliforniaSalesTaxFieldErrors;
  onChange: (input: CaliforniaSalesTaxInput) => void;
  disabled?: boolean;
}

export function CaliforniaSalesTaxForm({
  input,
  errors,
  onChange,
  disabled = false,
}: CaliforniaSalesTaxFormProps) {
  const set = (patch: Partial<CaliforniaSalesTaxInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      className="space-y-3.5"
      noValidate
      autoComplete="off"
      onSubmit={(event) => event.preventDefault()}
    >
      <div>
        <label className={labelClass} htmlFor="ca-sales-tax-purchase">
          <span>Purchase amount</span>
        </label>
        <FieldShell error={errors.purchaseAmount}>
          <span
            className="shrink-0 pl-3 text-sm text-muted-foreground"
            aria-hidden
          >
            $
          </span>
          <input
            id="ca-sales-tax-purchase"
            className={inputNumericClass}
            inputMode="decimal"
            value={input.purchaseAmount}
            placeholder="0.00"
            disabled={disabled}
            aria-invalid={Boolean(errors.purchaseAmount)}
            onChange={(e) => set({ purchaseAmount: e.target.value })}
          />
        </FieldShell>
        {errors.purchaseAmount ? (
          <p className="mt-1 text-xs text-rose-600">{errors.purchaseAmount}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ca-sales-tax-street">
          <span>Street address</span>
          <InfoTooltip
            label="Street address"
            text="Required for CDTFA address-based tax rate lookup. California ZIP codes can span multiple tax jurisdictions, so street + city + ZIP are used together."
          />
        </label>
        <FieldShell error={errors.streetAddress}>
          <input
            id="ca-sales-tax-street"
            className={inputClass}
            value={input.streetAddress}
            placeholder="Street number and name"
            disabled={disabled}
            aria-invalid={Boolean(errors.streetAddress)}
            onChange={(e) => set({ streetAddress: e.target.value })}
          />
        </FieldShell>
        {errors.streetAddress ? (
          <p className="mt-1 text-xs text-rose-600">{errors.streetAddress}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ca-sales-tax-city">
          <span>City</span>
        </label>
        <FieldShell error={errors.city}>
          <input
            id="ca-sales-tax-city"
            className={inputClass}
            value={input.city}
            placeholder="City"
            disabled={disabled}
            aria-invalid={Boolean(errors.city)}
            onChange={(e) => set({ city: e.target.value })}
          />
        </FieldShell>
        {errors.city ? (
          <p className="mt-1 text-xs text-rose-600">{errors.city}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="ca-sales-tax-zip">
          <span>ZIP code</span>
          <InfoTooltip
            label="ZIP code"
            text="Enter a five-digit California ZIP. State is fixed to California. Leading zeros are preserved."
          />
        </label>
        <FieldShell error={errors.zipCode}>
          <input
            id="ca-sales-tax-zip"
            className={inputNumericClass}
            inputMode="numeric"
            maxLength={5}
            value={input.zipCode}
            placeholder="#####"
            disabled={disabled}
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

      <p className="text-xs text-muted-foreground">
        State: California (fixed). Fixed USD — no currency conversion.
      </p>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
