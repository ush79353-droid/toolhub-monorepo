'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { VatDriver, VatFieldErrors, VatInput, VatMode, VatResult } from './types';

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

interface VatFormProps {
  input: VatInput;
  errors: VatFieldErrors;
  result: VatResult | null;
  onChange: (input: VatInput) => void;
  onCurrencyChange: (currency: VatInput['currency']) => void;
  onClear: () => void;
  onReset: () => void;
}

export function VatForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onClear,
  onReset,
}: VatFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<VatInput>, driver?: VatDriver) => {
    onChange({ ...input, ...patch, ...(driver ? { driver } : {}) });
  };

  const setMode = (mode: VatMode) => {
    onChange({ ...input, mode, driver: 'amount' });
  };

  return (
    <div className="space-y-4">
      <form
        className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
        <h3 className="text-sm font-semibold text-accent">VAT calculation</h3>

        <fieldset className="space-y-2">
          <legend className="mb-1.5 text-[13px] font-medium text-accent">Amount type</legend>
          <div className="flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-foreground/90">
              <input
                type="radio"
                name="vat-mode"
                checked={input.mode === 'excluded'}
                onChange={() => setMode('excluded')}
              />
              <span>VAT excluded (add VAT)</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-foreground/90">
              <input
                type="radio"
                name="vat-mode"
                checked={input.mode === 'included'}
                onChange={() => setMode('included')}
              />
              <span>VAT included (remove VAT)</span>
            </label>
          </div>
        </fieldset>

        <div>
          <label className={labelClass} htmlFor="vat-amount">
            <span>{input.mode === 'excluded' ? 'Net amount' : 'Gross amount'}</span>
            <InfoTooltip
              label="Amount"
              text={
                input.mode === 'excluded'
                  ? 'Enter the price before VAT. Gross and VAT are calculated from this net amount.'
                  : 'Enter the price including VAT. Net and VAT are recovered using reverse VAT (÷ by 1 + rate), not by subtracting the percentage.'
              }
            />
          </label>
          <FieldShell error={errors.amount}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="vat-amount"
              className={inputClass}
              inputMode="decimal"
              value={input.amount}
              aria-invalid={Boolean(errors.amount)}
              onChange={(e) => set({ amount: e.target.value }, 'amount')}
            />
          </FieldShell>
          {errors.amount ? <p className="mt-1 text-xs text-rose-600">{errors.amount}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="vat-rate">
            <span>VAT rate</span>
            <InfoTooltip
              label="VAT rate"
              text="Enter any VAT percentage for your jurisdiction. The default 20% is only an example — it is not universal."
            />
          </label>
          <FieldShell error={errors.vatRate}>
            <input
              id="vat-rate"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.vatRate}
              aria-invalid={Boolean(errors.vatRate)}
              onChange={(e) => set({ vatRate: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.vatRate ? <p className="mt-1 text-xs text-rose-600">{errors.vatRate}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="vat-currency">
            <span>Display currency</span>
          </label>
          <CurrencySelect
            id="vat-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
      </form>

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Results</h3>
        <p className="text-xs text-muted-foreground">
          Edit net or gross below to reverse-solve. The last edited price drives the calculation.
        </p>

        <div>
          <label className={labelClass} htmlFor="vat-net">
            <span>Net price</span>
          </label>
          <FieldShell error={errors.netPrice}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="vat-net"
              className={inputClass}
              inputMode="decimal"
              value={input.netPrice}
              aria-invalid={Boolean(errors.netPrice)}
              onChange={(e) => set({ netPrice: e.target.value, mode: 'excluded' }, 'net')}
            />
          </FieldShell>
          {errors.netPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.netPrice}</p>
          ) : null}
        </div>

        <div>
          <p className="mb-1.5 text-[13px] font-medium text-accent">VAT amount</p>
          <FieldShell className="bg-muted/30">
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              className={`${inputClass} text-primary`}
              readOnly
              value={result?.formattedVatAmount ?? ''}
              aria-readonly="true"
              aria-label="VAT amount"
            />
          </FieldShell>
        </div>

        <div>
          <label className={labelClass} htmlFor="vat-gross">
            <span>Gross price</span>
          </label>
          <FieldShell error={errors.grossPrice}>
            <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="vat-gross"
              className={inputClass}
              inputMode="decimal"
              value={input.grossPrice}
              aria-invalid={Boolean(errors.grossPrice)}
              onChange={(e) => set({ grossPrice: e.target.value, mode: 'included' }, 'gross')}
            />
          </FieldShell>
          {errors.grossPrice ? (
            <p className="mt-1 text-xs text-rose-600">{errors.grossPrice}</p>
          ) : null}
        </div>

        {result ? (
          <div className="rounded-lg border border-border bg-white px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            <p>
              Summary: net {symbol}
              {result.formattedNetPrice} · VAT {result.formattedVatRate}% = {symbol}
              {result.formattedVatAmount} · gross {symbol}
              {result.formattedGrossPrice}
            </p>
          </div>
        ) : null}

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="button" variant="outline" className="h-11" onClick={onReset}>
            Reset
          </Button>
          <Button type="button" variant="ghost" className="h-11" onClick={onClear}>
            Clear all
          </Button>
        </div>
      </div>
    </div>
  );
}
