'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CapitalGainsYieldFieldErrors,
  CapitalGainsYieldInput,
  CapitalGainsYieldResult,
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

interface CapitalGainsYieldFormProps {
  input: CapitalGainsYieldInput;
  errors: CapitalGainsYieldFieldErrors;
  result: CapitalGainsYieldResult | null;
  onChange: (input: CapitalGainsYieldInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function CapitalGainsYieldForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: CapitalGainsYieldFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CapitalGainsYieldInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Capital gains</legend>

        <div>
          <label className={labelClass} htmlFor="cgy-bought">
            <span>Bought price</span>
            <InfoTooltip
              label="Bought price"
              text="Purchase price of the asset. Must be greater than zero."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.boughtPrice}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="cgy-bought"
                className={inputClass}
                inputMode="decimal"
                value={input.boughtPrice}
                aria-invalid={Boolean(errors.boughtPrice)}
                onChange={(event) => set({ boughtPrice: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cgy-bought-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Bought price currency"
              />
            </div>
          </div>
          {errors.boughtPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.boughtPrice}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="cgy-current">
            <span>Current price</span>
            <InfoTooltip
              label="Current price"
              text="Current market price. Zero is allowed; negative values are not."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.currentPrice}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="cgy-current"
                className={inputClass}
                inputMode="decimal"
                value={input.currentPrice}
                aria-invalid={Boolean(errors.currentPrice)}
                onChange={(event) => set({ currentPrice: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cgy-current-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Current price currency"
              />
            </div>
          </div>
          {errors.currentPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.currentPrice}</p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Capital gains yield</legend>

        <div>
          <label className={labelClass} htmlFor="cgy-gains">
            <span>Capital gains</span>
            <InfoTooltip
              label="Capital gains"
              text="Current price − bought price. Negative values are capital losses."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell muted>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="cgy-gains"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedCapitalGains : ''}
                aria-live="polite"
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cgy-gains-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Capital gains currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="cgy-yield">
            <span>Capital gains yield</span>
            <InfoTooltip
              label="Capital gains yield"
              text="(Capital gains ÷ bought price) × 100."
            />
          </label>
          <FieldShell muted>
            <input
              id="cgy-yield"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedYieldPercent : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
