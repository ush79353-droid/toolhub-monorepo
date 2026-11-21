'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  YieldToCallFieldErrors,
  YieldToCallInput,
  YieldToCallResult,
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

interface YieldToCallFormProps {
  input: YieldToCallInput;
  errors: YieldToCallFieldErrors;
  result: YieldToCallResult | null;
  onChange: (input: YieldToCallInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function YieldToCallForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: YieldToCallFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<YieldToCallInput>) =>
    onChange({ ...input, ...patch });

  const ytcDisplay = result?.formattedYtc.replace(/%$/, '') ?? '';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Yield to call is the annual discount rate that equates market price with
        the present value of annual interest through the call date plus the call
        price. Solved numerically (bisection); not the simplified approximate
        YTC formula. Currency is denomination only (not FX). Years must be a
        whole number under this annual payment convention.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="ytc-currency"
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
        Load example ($80 interest · $1,000 call · $950 market · 5y → ≈9.30%)
      </button>

      <div>
        <label htmlFor="ytc-interest" className={labelClass}>
          Annual interest
          <InfoTooltip
            label="Annual interest"
            text="The bond’s total coupon cash paid per year (amount, not a percent). Under the annual convention this is also the payment each year until call."
          />
        </label>
        <FieldShell error={errors.annualInterest}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="ytc-interest"
            className={inputClass}
            inputMode="decimal"
            value={input.annualInterest}
            onChange={(e) => set({ annualInterest: e.target.value })}
            placeholder="80"
          />
        </FieldShell>
        {errors.annualInterest ? (
          <p className="mt-1 text-xs text-rose-600">{errors.annualInterest}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ytc-call" className={labelClass}>
          Call price
          <InfoTooltip
            label="Call price"
            text="The redemption amount the issuer pays if the bond is called on the modeled call date (often at or above par). Replaces maturity face value in the YTC cash-flow set."
          />
        </label>
        <FieldShell error={errors.callPrice}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="ytc-call"
            className={inputClass}
            inputMode="decimal"
            value={input.callPrice}
            onChange={(e) => set({ callPrice: e.target.value })}
            placeholder="1000"
          />
        </FieldShell>
        {errors.callPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.callPrice}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ytc-market" className={labelClass}>
          Market price
          <InfoTooltip
            label="Market price"
            text="The current purchase price used as the present value of remaining coupons through call plus the call redemption."
          />
        </label>
        <FieldShell error={errors.marketPrice}>
          <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
          <input
            id="ytc-market"
            className={inputClass}
            inputMode="decimal"
            value={input.marketPrice}
            onChange={(e) => set({ marketPrice: e.target.value })}
            placeholder="950"
          />
        </FieldShell>
        {errors.marketPrice ? (
          <p className="mt-1 text-xs text-rose-600">{errors.marketPrice}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ytc-years" className={labelClass}>
          Number of years until call
        </label>
        <FieldShell error={errors.yearsUntilCall}>
          <input
            id="ytc-years"
            className={inputClass}
            inputMode="decimal"
            value={input.yearsUntilCall}
            onChange={(e) => set({ yearsUntilCall: e.target.value })}
            placeholder="5"
          />
          <span className="pr-3 text-sm text-muted-foreground">yrs</span>
        </FieldShell>
        {errors.yearsUntilCall ? (
          <p className="mt-1 text-xs text-rose-600">{errors.yearsUntilCall}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="ytc-result" className={labelClass}>
          Yield to call
        </label>
        <FieldShell muted>
          <input
            id="ytc-result"
            className={inputClass}
            readOnly
            aria-readonly="true"
            value={ytcDisplay}
            placeholder="—"
          />
          <span className="pr-3 text-sm text-muted-foreground">%</span>
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
