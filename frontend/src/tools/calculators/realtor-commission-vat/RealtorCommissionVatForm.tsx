'use client';

import * as React from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RealtorCommissionVatFieldErrors,
  RealtorCommissionVatInput,
  RealtorCommissionVatResult,
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

export interface RealtorCommissionVatFormProps {
  input: RealtorCommissionVatInput;
  errors: RealtorCommissionVatFieldErrors;
  result: RealtorCommissionVatResult | null;
  onChange: (input: RealtorCommissionVatInput) => void;
  /** Optional FX handlers — wired in the calculations commit. */
  onHouseCurrencyChange?: (next: SupportedCurrency) => void;
  onGrossCurrencyChange?: (next: SupportedCurrency) => void;
  onOwnerCurrencyChange?: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function RealtorCommissionVatForm({
  input,
  errors,
  result,
  onChange,
  onHouseCurrencyChange,
  onGrossCurrencyChange,
  onOwnerCurrencyChange,
  conversionError,
  ratesWarning,
}: RealtorCommissionVatFormProps) {
  const houseSymbol = getCurrencySymbol(input.housePriceCurrency);
  const grossSymbol = getCurrencySymbol(input.commissionGrossCurrency);
  const ownerSymbol = getCurrencySymbol(input.ownerReceivesCurrency);

  const set = (patch: Partial<RealtorCommissionVatInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="rcv-house-price">
          <span>House price</span>
          <InfoTooltip
            label="House price"
            text="Sale price of the property. Calculation currency for normalizing money results."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell error={errors.housePrice}>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {houseSymbol}
            </span>
            <input
              id="rcv-house-price"
              className={inputClass}
              inputMode="decimal"
              value={input.housePrice}
              aria-invalid={Boolean(errors.housePrice)}
              onChange={(e) => set({ housePrice: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="rcv-house-currency"
              value={input.housePriceCurrency}
              onChange={(next) =>
                onHouseCurrencyChange
                  ? onHouseCurrencyChange(next)
                  : set({ housePriceCurrency: next })
              }
              aria-label="House price currency"
            />
          </div>
        </div>
        {errors.housePrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.housePrice}</p>
        ) : null}
        {conversionError ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {conversionError}
          </p>
        ) : null}
        {ratesWarning && !conversionError ? (
          <p className="mt-1 text-xs text-amber-700">{ratesWarning}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rcv-commission">
          <span>Commission</span>
          <InfoTooltip
            label="Commission"
            text="VAT-exclusive commission rate as a percent of house price. Not FX-converted."
          />
        </label>
        <FieldShell error={errors.commissionPercent}>
          <input
            id="rcv-commission"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.commissionPercent}
            aria-invalid={Boolean(errors.commissionPercent)}
            onChange={(e) => set({ commissionPercent: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
        {errors.commissionPercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.commissionPercent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rcv-vat-rate">
          <span>VAT rate</span>
          <InfoTooltip
            label="VAT rate"
            text="VAT applied to the net commission only, not the house price. Not FX-converted."
          />
        </label>
        <FieldShell error={errors.vatRatePercent}>
          <input
            id="rcv-vat-rate"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.vatRatePercent}
            aria-invalid={Boolean(errors.vatRatePercent)}
            onChange={(e) => set({ vatRatePercent: e.target.value })}
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </FieldShell>
        {errors.vatRatePercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.vatRatePercent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rcv-commission-gross">
          <span>Commission gross</span>
          <InfoTooltip
            label="Commission gross"
            text="Net commission plus VAT on that commission, converted into this display currency."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {grossSymbol}
            </span>
            <input
              id="rcv-commission-gross"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedCommissionGross : ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="rcv-gross-currency"
              value={input.commissionGrossCurrency}
              onChange={(next) =>
                onGrossCurrencyChange
                  ? onGrossCurrencyChange(next)
                  : set({ commissionGrossCurrency: next })
              }
              aria-label="Commission gross currency"
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="rcv-owner-receives">
          <span>Owner receives</span>
          <InfoTooltip
            label="Owner receives"
            text="House price minus commission gross. May be zero or negative when fees exceed the price."
          />
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {ownerSymbol}
            </span>
            <input
              id="rcv-owner-receives"
              className={`${inputClass} font-semibold`}
              readOnly
              value={result ? result.formattedOwnerReceives : ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="rcv-owner-currency"
              value={input.ownerReceivesCurrency}
              onChange={(next) =>
                onOwnerCurrencyChange
                  ? onOwnerCurrencyChange(next)
                  : set({ ownerReceivesCurrency: next })
              }
              aria-label="Owner receives currency"
            />
          </div>
        </div>
      </div>

      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.breakdownOpen}
        onToggle={(event) => set({ breakdownOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.breakdownOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Net commission and VAT amount</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="rcv-net-commission">
              <span>Net commission</span>
              <InfoTooltip
                label="Net commission"
                text="House price × commission % / 100, before VAT. Shown in the house-price currency."
              />
            </label>
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {houseSymbol}
              </span>
              <input
                id="rcv-net-commission"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedNetCommission : ''}
                aria-live="polite"
              />
            </FieldShell>
          </div>
          <div>
            <label className={labelClass} htmlFor="rcv-vat-amount">
              <span>VAT amount</span>
              <InfoTooltip
                label="VAT amount"
                text="VAT charged on the net commission only. Shown in the house-price currency."
              />
            </label>
            <FieldShell muted>
              <span
                className="shrink-0 pl-3 text-sm text-muted-foreground"
                aria-hidden="true"
              >
                {houseSymbol}
              </span>
              <input
                id="rcv-vat-amount"
                className={`${inputClass} font-semibold`}
                readOnly
                value={result ? result.formattedVatAmount : ''}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        </div>
      </details>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
