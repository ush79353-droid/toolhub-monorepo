'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  COUPON_FREQUENCY_OPTIONS,
  type CouponFrequency,
  type CouponRateFieldErrors,
  type CouponRateInput,
  type CouponRateResult,
  type CouponSolveTarget,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

const SOLVE_LABELS: Record<CouponSolveTarget, string> = {
  couponRate: 'Coupon rate (%)',
  couponPerPeriod: 'Coupon per period',
  annualCoupon: 'Annual coupon',
  faceValue: 'Face value',
};

interface CouponRateFormProps {
  input: CouponRateInput;
  errors: CouponRateFieldErrors;
  result: CouponRateResult | null;
  onChange: (input: CouponRateInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function CouponRateForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: CouponRateFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CouponRateInput>) =>
    onChange({ ...input, ...patch });
  const solving = (t: CouponSolveTarget) => input.solveTarget === t;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Coupon rate = annual coupon ÷ face (par) value. It is not current yield
        or YTM. Currency is denomination only (not FX). Zero coupons are allowed
        for zero-coupon bonds.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="cr-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency denomination"
        />
      </div>

      <div>
        <label htmlFor="cr-solve" className={labelClass}>
          Solve for
        </label>
        <select
          id="cr-solve"
          className={selectClass}
          value={input.solveTarget}
          onChange={(e) =>
            set({ solveTarget: e.target.value as CouponSolveTarget })
          }
        >
          {(Object.keys(SOLVE_LABELS) as CouponSolveTarget[]).map((t) => (
            <option key={t} value={t}>
              {SOLVE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={onLoadExample}
        className="text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        Load example ($1,000 · $25 semi · 5%)
      </button>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label htmlFor="cr-face" className={labelClass}>
          Face value
          <InfoTooltip
            label="Face value"
            text="Face value is the bond's stated principal amount, not necessarily its current market price."
          />
        </label>
        <FieldShell error={errors.faceValue} muted={solving('faceValue')}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="cr-face"
            className={inputClass}
            inputMode="decimal"
            readOnly={solving('faceValue')}
            aria-readonly={solving('faceValue')}
            value={
              solving('faceValue')
                ? (result?.faceValue.toString() ?? '')
                : input.faceValue
            }
            onChange={(e) => set({ faceValue: e.target.value })}
            placeholder="1000"
          />
        </FieldShell>
        {errors.faceValue ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.faceValue}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cr-period" className={labelClass}>
          Coupon per period
          <InfoTooltip
            label="Coupon per period"
            text="For a semiannual bond, coupon per period is the interest payment received every six months."
          />
        </label>
        <FieldShell
          error={errors.couponPerPeriod}
          muted={
            solving('couponPerPeriod') ||
            solving('annualCoupon') ||
            solving('faceValue')
          }
        >
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="cr-period"
            className={inputClass}
            inputMode="decimal"
            readOnly={
              solving('couponPerPeriod') ||
              solving('annualCoupon') ||
              solving('faceValue')
            }
            aria-readonly={
              solving('couponPerPeriod') ||
              solving('annualCoupon') ||
              solving('faceValue')
            }
            value={
              solving('couponPerPeriod') ||
              solving('annualCoupon') ||
              solving('faceValue')
                ? (result?.couponPerPeriod.toString() ?? '')
                : input.couponPerPeriod
            }
            onChange={(e) => set({ couponPerPeriod: e.target.value })}
            placeholder="25"
          />
        </FieldShell>
        {errors.couponPerPeriod ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.couponPerPeriod}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cr-freq" className={labelClass}>
          Coupon frequency
          <InfoTooltip
            label="Coupon frequency"
            text="The number of scheduled coupon interest payments made during one year."
          />
        </label>
        <select
          id="cr-freq"
          className={selectClass}
          value={input.frequency}
          onChange={(e) =>
            set({ frequency: e.target.value as CouponFrequency })
          }
        >
          {COUPON_FREQUENCY_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label} ({o.paymentsPerYear}/year)
            </option>
          ))}
        </select>
        {errors.frequency ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.frequency}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cr-annual" className={labelClass}>
          Annual coupon
        </label>
        <FieldShell
          error={errors.annualCoupon}
          muted={!solving('faceValue')}
        >
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="cr-annual"
            className={inputClass}
            inputMode="decimal"
            readOnly={!solving('faceValue')}
            aria-readonly={!solving('faceValue')}
            value={
              solving('faceValue')
                ? input.annualCoupon
                : (result?.annualCoupon.toString() ?? '')
            }
            onChange={(e) => set({ annualCoupon: e.target.value })}
            placeholder="50"
          />
        </FieldShell>
        {errors.annualCoupon ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.annualCoupon}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="cr-rate" className={labelClass}>
          Coupon rate
        </label>
        <FieldShell
          error={errors.couponRatePercent}
          muted={solving('couponRate')}
        >
          <input
            id="cr-rate"
            className={inputClass}
            inputMode="decimal"
            readOnly={solving('couponRate')}
            aria-readonly={solving('couponRate')}
            value={
              solving('couponRate')
                ? (result?.couponRatePercent.toString() ?? '')
                : input.couponRatePercent
            }
            onChange={(e) => set({ couponRatePercent: e.target.value })}
            placeholder="5"
          />
          <span className="pr-3 text-xs text-muted-foreground">%</span>
        </FieldShell>
        {errors.couponRatePercent ? (
          <p className="mt-1 text-xs text-rose-600" role="alert">
            {errors.couponRatePercent}
          </p>
        ) : null}
      </div>
    </form>
  );
}
