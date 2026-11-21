'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  MoneyMultiplierFieldErrors,
  MoneyMultiplierInput,
  MoneyMultiplierResult,
  ReserveSource,
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

interface MoneyMultiplierFormProps {
  input: MoneyMultiplierInput;
  errors: MoneyMultiplierFieldErrors;
  result: MoneyMultiplierResult | null;
  onChange: (input: MoneyMultiplierInput) => void;
  onLoadExample: () => void;
}

export function MoneyMultiplierForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: MoneyMultiplierFormProps) {
  const set = (patch: Partial<MoneyMultiplierInput>) =>
    onChange({ ...input, ...patch });

  const setReserveSource = (source: ReserveSource) => {
    set({ reserveSource: source });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Simplified model: M = currency + checkable deposits; B = currency + bank
        reserves; m = M/B. Currency labels denomination only — no FX conversion.
        Default 10% reserve ratio is a teaching example, not a universal legal
        requirement.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="mm-currency"
          value={input.currency}
          onChange={(code: SupportedCurrency) => set({ currency: code })}
          aria-label="Money denomination"
        />
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Reserve calculation mode"
      >
        <button
          type="button"
          role="radio"
          aria-checked={input.reserveSource === 'ratio'}
          onClick={() => setReserveSource('ratio')}
          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
            input.reserveSource === 'ratio'
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-accent hover:bg-muted/30'
          }`}
        >
          From reserve ratio
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={input.reserveSource === 'reserves'}
          onClick={() => setReserveSource('reserves')}
          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
            input.reserveSource === 'reserves'
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-accent hover:bg-muted/30'
          }`}
        >
          From bank reserves
        </button>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($1M · 10% · $200k → 4.00×)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label htmlFor="mm-deposits" className={labelClass}>
          Checkable deposits
          <InfoTooltip
            label="Checkable deposits"
            text="Deposits that account holders can generally withdraw or transfer on demand."
          />
        </label>
        <FieldShell error={errors.checkableDeposits}>
          <input
            id="mm-deposits"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.checkableDeposits}
            onChange={(e) => set({ checkableDeposits: e.target.value })}
            placeholder="1,000,000"
          />
        </FieldShell>
        {errors.checkableDeposits ? (
          <p className="mt-1 text-xs text-rose-600">{errors.checkableDeposits}</p>
        ) : null}
      </div>

      {input.reserveSource === 'ratio' ? (
        <div>
          <label htmlFor="mm-ratio" className={labelClass}>
            Reserve ratio
            <InfoTooltip
              label="Reserve ratio"
              text="Bank reserves as a percentage of checkable deposits (0–100%)."
            />
          </label>
          <FieldShell error={errors.reserveRatio}>
            <input
              id="mm-ratio"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.reserveRatio}
              onChange={(e) =>
                set({ reserveRatio: e.target.value, reserveSource: 'ratio' })
              }
              placeholder="10"
            />
            <span className="pr-2 text-[10px] text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
          {errors.reserveRatio ? (
            <p className="mt-1 text-xs text-rose-600">{errors.reserveRatio}</p>
          ) : null}
        </div>
      ) : (
        <div>
          <label htmlFor="mm-reserves-in" className={labelClass}>
            Bank reserves
          </label>
          <FieldShell error={errors.bankReserves}>
            <input
              id="mm-reserves-in"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.bankReserves}
              onChange={(e) =>
                set({
                  bankReserves: e.target.value,
                  reserveSource: 'reserves',
                })
              }
              placeholder="100,000"
            />
          </FieldShell>
          {errors.bankReserves ? (
            <p className="mt-1 text-xs text-rose-600">{errors.bankReserves}</p>
          ) : null}
        </div>
      )}

      <div>
        <label htmlFor="mm-reserves-out" className={labelClass}>
          {input.reserveSource === 'ratio' ? 'Bank reserves' : 'Reserve ratio'}
        </label>
        <FieldShell muted>
          <input
            id="mm-reserves-out"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold`}
            value={
              input.reserveSource === 'ratio'
                ? (result?.formattedReserves ?? '')
                : (result?.formattedReserveRatio ?? '')
            }
            placeholder="—"
          />
        </FieldShell>
      </div>

      <div>
        <label htmlFor="mm-currency-circ" className={labelClass}>
          Currency in circulation
          <InfoTooltip
            label="Currency in circulation"
            text="Currency held by the public outside the banking system, consistent with this calculator’s simplified M and B definitions."
          />
        </label>
        <FieldShell error={errors.currencyInCirculation}>
          <input
            id="mm-currency-circ"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.currencyInCirculation}
            onChange={(e) => set({ currencyInCirculation: e.target.value })}
            placeholder="200,000"
          />
        </FieldShell>
        {errors.currencyInCirculation ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.currencyInCirculation}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mm-base" className={labelClass}>
          Monetary base
        </label>
        <FieldShell muted>
          <input
            id="mm-base"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold`}
            value={result?.formattedBase ?? ''}
            placeholder="—"
          />
        </FieldShell>
      </div>

      <div>
        <label htmlFor="mm-supply" className={labelClass}>
          Money supply
        </label>
        <FieldShell muted>
          <input
            id="mm-supply"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold`}
            value={result?.formattedSupply ?? ''}
            placeholder="—"
          />
        </FieldShell>
      </div>

      <div>
        <label htmlFor="mm-m" className={labelClass}>
          Money multiplier
        </label>
        <FieldShell muted>
          <input
            id="mm-m"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold`}
            value={result?.formattedMultiplier ?? ''}
            placeholder="—"
          />
        </FieldShell>
      </div>
    </form>
  );
}
