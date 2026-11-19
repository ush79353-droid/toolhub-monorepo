'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FloridaSalesTaxFieldErrors,
  FloridaSalesTaxInput,
  FloridaSalesTaxResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface FloridaSalesTaxFormProps {
  input: FloridaSalesTaxInput;
  errors: FloridaSalesTaxFieldErrors;
  result: FloridaSalesTaxResult | null;
  onChange: (input: FloridaSalesTaxInput) => void;
}

export function FloridaSalesTaxForm({
  input,
  errors,
  result,
  onChange,
}: FloridaSalesTaxFormProps) {
  const set = (patch: Partial<FloridaSalesTaxInput>) =>
    onChange({ ...input, ...patch });

  const showCountyPicker =
    result &&
    (result.status === 'ambiguous' || result.status === 'county_required') &&
    result.candidateCounties.length > 1;

  return (
    <form
      className="space-y-3.5"
      noValidate
      autoComplete="off"
      onSubmit={(event) => event.preventDefault()}
    >
      <div>
        <label className={labelClass} htmlFor="fl-sales-tax-purchase">
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
            id="fl-sales-tax-purchase"
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
        <label className={labelClass} htmlFor="fl-sales-tax-zip">
          <span>Purchase location ZIP Code</span>
          <InfoTooltip
            label="Purchase location ZIP Code"
            text="Enter a five-digit Florida ZIP. Mapping uses Census 2020 ZCTA→county intersections. Multi-county ZIPs require an explicit county selection — rates are never guessed."
          />
        </label>
        <FieldShell error={errors.zipCode}>
          <input
            id="fl-sales-tax-zip"
            className={inputClass}
            inputMode="numeric"
            maxLength={5}
            value={input.zipCode}
            placeholder="#####"
            aria-invalid={Boolean(errors.zipCode)}
            onChange={(e) =>
              set({
                zipCode: e.target.value.replace(/[^\d]/g, '').slice(0, 5),
                selectedCountyFips: '',
              })
            }
          />
        </FieldShell>
        {errors.zipCode ? (
          <p className="mt-1 text-xs text-rose-600">{errors.zipCode}</p>
        ) : null}
      </div>

      {showCountyPicker ? (
        <div>
          <label className={labelClass} htmlFor="fl-sales-tax-county">
            <span>Purchase county</span>
            <InfoTooltip
              label="Purchase county"
              text="This ZIP intersects multiple counties. Choose the county where the purchase occurs so the correct DR-15DSS discretionary surtax applies."
            />
          </label>
          <FieldShell error={errors.selectedCountyFips}>
            <select
              id="fl-sales-tax-county"
              className="h-11 w-full min-w-0 bg-transparent px-3 text-sm text-accent outline-none"
              value={input.selectedCountyFips}
              aria-invalid={Boolean(errors.selectedCountyFips)}
              onChange={(e) => set({ selectedCountyFips: e.target.value })}
            >
              <option value="">Select county…</option>
              {result.candidateCounties.map((c) => (
                <option key={c.fips} value={c.fips}>
                  {c.name} County
                </option>
              ))}
            </select>
          </FieldShell>
        </div>
      ) : null}

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
