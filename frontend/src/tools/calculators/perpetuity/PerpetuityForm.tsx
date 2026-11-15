'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  PerpetuityFieldErrors,
  PerpetuityInput,
  PerpetuityResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface PerpetuityFormProps {
  input: PerpetuityInput;
  errors: PerpetuityFieldErrors;
  result: PerpetuityResult | null;
  onChange: (input: PerpetuityInput) => void;
  onReset: () => void;
}

export function PerpetuityForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: PerpetuityFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<PerpetuityInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Perpetuity Calculator
        </legend>

        <div>
          <label className={labelClass} htmlFor="perp-dividend">
            <span>Dividend</span>
            <InfoTooltip
              label="Dividend"
              text="Next-period payment (D₁). Currency labels amounts only; it does not convert."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.dividend}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="perp-dividend"
                className={inputClass}
                inputMode="decimal"
                value={input.dividend}
                aria-invalid={Boolean(errors.dividend)}
                onChange={(e) => set({ dividend: e.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="perp-dividend-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Dividend currency"
              />
            </div>
          </div>
          {errors.dividend ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dividend}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="perp-discount">
            <span>Discount rate</span>
            <InfoTooltip
              label="Discount rate"
              text="Required return for the same period as the dividend. Must be greater than the growth rate."
            />
          </label>
          <FieldShell error={errors.discountRatePercent}>
            <input
              id="perp-discount"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.discountRatePercent}
              aria-invalid={Boolean(errors.discountRatePercent)}
              onChange={(e) => set({ discountRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.discountRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.discountRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="perp-growth">
            <span>Growth rate</span>
            <InfoTooltip
              label="Growth rate"
              text="Constant growth of the dividend each period. Zero is a level perpetuity; negative growth is allowed when still below the discount rate."
            />
          </label>
          <FieldShell error={errors.growthRatePercent}>
            <input
              id="perp-growth"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.growthRatePercent}
              aria-invalid={Boolean(errors.growthRatePercent)}
              onChange={(e) => set({ growthRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.growthRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.growthRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="perp-pv">
            <span>Present value</span>
            <InfoTooltip
              label="Present value"
              text="Present value = Dividend ÷ (Discount rate − Growth rate), with rates as decimals."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="perp-pv"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedPresentValue : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="perp-pv-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Present value currency"
              />
            </div>
          </div>
        </div>

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
