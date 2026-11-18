'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  RealEstateCommissionFieldErrors,
  RealEstateCommissionInput,
  RealEstateCommissionResult,
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

interface RealEstateCommissionFormProps {
  input: RealEstateCommissionInput;
  errors: RealEstateCommissionFieldErrors;
  result: RealEstateCommissionResult | null;
  onChange: (input: RealEstateCommissionInput) => void;
  onHousePriceCurrencyChange: (next: SupportedCurrency) => void;
  onCommissionAmountCurrencyChange: (next: SupportedCurrency) => void;
  onOwnerReceivesCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function RealEstateCommissionForm({
  input,
  errors,
  result,
  onChange,
  onHousePriceCurrencyChange,
  onCommissionAmountCurrencyChange,
  onOwnerReceivesCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: RealEstateCommissionFormProps) {
  const houseSymbol = getCurrencySymbol(input.housePriceCurrency);
  const commissionSymbol = getCurrencySymbol(input.commissionAmountCurrency);
  const ownerSymbol = getCurrencySymbol(input.ownerReceivesCurrency);

  const set = (patch: Partial<RealEstateCommissionInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <label className={labelClass} htmlFor="rec-house-price">
          <span>House price</span>
          <InfoTooltip
            label="House price"
            text="Sale price of the property before commission. Changing currency converts this amount with stored FX rates."
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
              id="rec-house-price"
              className={inputClass}
              inputMode="decimal"
              value={input.housePrice}
              aria-invalid={Boolean(errors.housePrice)}
              onChange={(e) => set({ housePrice: e.target.value })}
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="rec-house-price-currency"
              value={input.housePriceCurrency}
              onChange={onHousePriceCurrencyChange}
              aria-label="House price currency"
            />
          </div>
        </div>
        {errors.housePrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.housePrice}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rec-commission">
          <span>Commission</span>
        </label>
        <FieldShell error={errors.commissionPercent}>
          <input
            id="rec-commission"
            className={`${inputClass} pr-8`}
            inputMode="decimal"
            value={input.commissionPercent}
            aria-invalid={Boolean(errors.commissionPercent)}
            onChange={(e) => set({ commissionPercent: e.target.value })}
          />
          <span
            className="pointer-events-none absolute right-3 text-sm text-muted-foreground"
            aria-hidden="true"
          >
            %
          </span>
        </FieldShell>
        {errors.commissionPercent ? (
          <p className="mt-1 text-xs text-rose-600">{errors.commissionPercent}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rec-commission-amount">
          <span>Commission amount</span>
        </label>
        <div className="flex gap-2">
          <FieldShell muted>
            <span
              className="shrink-0 pl-3 text-sm text-muted-foreground"
              aria-hidden="true"
            >
              {commissionSymbol}
            </span>
            <input
              id="rec-commission-amount"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedCommissionAmount ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="rec-commission-amount-currency"
              value={input.commissionAmountCurrency}
              onChange={onCommissionAmountCurrencyChange}
              aria-label="Commission amount currency"
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="rec-owner-receives">
          <span>Owner receives</span>
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
              id="rec-owner-receives"
              className={`${inputClass} text-accent`}
              readOnly
              tabIndex={-1}
              value={result?.formattedOwnerReceives ?? ''}
              aria-live="polite"
            />
          </FieldShell>
          <div className="w-[110px] shrink-0 sm:w-[120px]">
            <CurrencySelect
              id="rec-owner-receives-currency"
              value={input.ownerReceivesCurrency}
              onChange={onOwnerReceivesCurrencyChange}
              aria-label="Owner receives currency"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-brand-softTeal/35 px-3 py-2.5 text-sm text-accent">
        Check out{' '}
        <a
          href="#how-to-use"
          className="font-semibold text-primary underline underline-offset-2"
        >
          how to use this calculator!
        </a>
      </div>

      {conversionError ? (
        <p className="text-xs text-rose-600" role="alert">
          {conversionError}
        </p>
      ) : null}
      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}
      {ratesWarning && !conversionError ? (
        <p className="text-xs text-amber-700">{ratesWarning}</p>
      ) : null}
    </form>
  );
}
