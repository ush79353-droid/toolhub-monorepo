'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { EQUITY_OPTION_CONTRACT_MULTIPLIER } from './types';
import type {
  CallOptionFieldErrors,
  CallOptionInput,
  CallOptionResult,
  OptionMode,
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

interface CallOptionFormProps {
  input: CallOptionInput;
  errors: CallOptionFieldErrors;
  result: CallOptionResult | null;
  onChange: (input: CallOptionInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function CallOptionForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: CallOptionFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CallOptionInput>) =>
    onChange({ ...input, ...patch });
  const optionLabel =
    input.mode === 'call' ? 'Price of the call option' : 'Price of the put option';
  const totalLabel =
    input.mode === 'call'
      ? 'Total call cost (premium)'
      : 'Total put cost (premium)';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Total premium = quoted option price × {EQUITY_OPTION_CONTRACT_MULTIPLIER}{' '}
        (shares per standard equity contract) × number of contracts. Currency is
        denomination only (not FX). Fees, taxes, and early exercise are not
        modeled.
      </p>

      <fieldset>
        <legend className={labelClass}>Select calculator mode:</legend>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:gap-4">
          {(
            [
              ['call', 'Call option calculator'],
              ['put', 'Put option calculator'],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2 text-sm text-accent"
            >
              <input
                type="radio"
                name="call-option-mode"
                value={value}
                checked={input.mode === value}
                onChange={() => set({ mode: value as OptionMode })}
                className="h-4 w-4 accent-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="co-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example
      </button>

      <div>
        <label htmlFor="co-asset" className={labelClass}>
          Current asset price or target price
        </label>
        <FieldShell error={errors.assetPrice}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="co-asset"
            inputMode="decimal"
            className={inputClass}
            value={input.assetPrice}
            onChange={(e) => set({ assetPrice: e.target.value })}
            aria-invalid={Boolean(errors.assetPrice)}
            aria-describedby={
              errors.assetPrice ? 'co-asset-err' : 'co-asset-hint'
            }
          />
        </FieldShell>
        <p id="co-asset-hint" className="mt-1 text-xs text-muted-foreground">
          Used for moneyness, intrinsic value, and P/L at this price.
        </p>
        {errors.assetPrice ? (
          <p id="co-asset-err" className="mt-1 text-xs text-rose-600" role="alert">
            {errors.assetPrice}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="co-strike" className={labelClass}>
          Strike price
          <InfoTooltip text="Exercise price of the option. Call break-even ≈ strike + premium; put break-even ≈ strike − premium (per share, before fees)." />
        </label>
        <FieldShell error={errors.strikePrice}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="co-strike"
            inputMode="decimal"
            className={inputClass}
            value={input.strikePrice}
            onChange={(e) => set({ strikePrice: e.target.value })}
            aria-invalid={Boolean(errors.strikePrice)}
            aria-describedby={errors.strikePrice ? 'co-strike-err' : undefined}
          />
        </FieldShell>
        {errors.strikePrice ? (
          <p
            id="co-strike-err"
            className="mt-1 text-xs text-rose-600"
            role="alert"
          >
            {errors.strikePrice}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="co-premium" className={labelClass}>
          {optionLabel}
        </label>
        <FieldShell error={errors.optionPrice}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="co-premium"
            inputMode="decimal"
            className={inputClass}
            value={input.optionPrice}
            onChange={(e) => set({ optionPrice: e.target.value })}
            aria-invalid={Boolean(errors.optionPrice)}
            aria-describedby={
              errors.optionPrice ? 'co-premium-err' : 'co-premium-hint'
            }
          />
        </FieldShell>
        <p id="co-premium-hint" className="mt-1 text-xs text-muted-foreground">
          Quoted premium per share (not per contract).
        </p>
        {errors.optionPrice ? (
          <p
            id="co-premium-err"
            className="mt-1 text-xs text-rose-600"
            role="alert"
          >
            {errors.optionPrice}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="co-contracts" className={labelClass}>
          Number of option contracts
          <InfoTooltip
            text={`Each standard equity option contract typically covers ${EQUITY_OPTION_CONTRACT_MULTIPLIER} shares. Enter a whole number.`}
          />
        </label>
        <FieldShell error={errors.contracts}>
          <input
            id="co-contracts"
            inputMode="numeric"
            className={inputClass}
            value={input.contracts}
            onChange={(e) => set({ contracts: e.target.value })}
            aria-invalid={Boolean(errors.contracts)}
            aria-describedby={
              errors.contracts ? 'co-contracts-err' : undefined
            }
          />
        </FieldShell>
        {errors.contracts ? (
          <p
            id="co-contracts-err"
            className="mt-1 text-xs text-rose-600"
            role="alert"
          >
            {errors.contracts}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="co-total" className={labelClass}>
          {totalLabel}
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="co-total"
            readOnly
            className={`${inputClass} cursor-default`}
            value={
              result
                ? result.totalPremiumCost.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : ''
            }
            aria-live="polite"
          />
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
