'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CouponFrequency,
  EffectiveAnnualYieldFieldErrors,
  EffectiveAnnualYieldInput,
  EffectiveAnnualYieldResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent focus:outline-none focus:ring-2 focus:ring-ring';

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

const FREQUENCY_OPTIONS: readonly { value: CouponFrequency; label: string }[] = [
  { value: 'annually', label: 'Annually' },
  { value: 'semiannually', label: 'Semiannually' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
];

interface EffectiveAnnualYieldFormProps {
  input: EffectiveAnnualYieldInput;
  errors: EffectiveAnnualYieldFieldErrors;
  result: EffectiveAnnualYieldResult | null;
  onChange: (input: EffectiveAnnualYieldInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function EffectiveAnnualYieldForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: EffectiveAnnualYieldFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<EffectiveAnnualYieldInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Coupon rate</legend>

        <div>
          <label className={labelClass} htmlFor="eay-face">
            <span>Face value</span>
            <InfoTooltip
              label="Face value"
              text="Bond par / face amount. Must be greater than zero."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.faceValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="eay-face"
                className={inputClass}
                inputMode="decimal"
                value={input.faceValue}
                aria-invalid={Boolean(errors.faceValue)}
                onChange={(event) => set({ faceValue: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="eay-face-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Face value currency"
              />
            </div>
          </div>
          {errors.faceValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.faceValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="eay-coupon">
            <span>Annual coupon payment</span>
            <InfoTooltip
              label="Annual coupon payment"
              text="Total coupon cash paid per year. Zero is allowed."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.annualCouponPayment}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="eay-coupon"
                className={inputClass}
                inputMode="decimal"
                value={input.annualCouponPayment}
                aria-invalid={Boolean(errors.annualCouponPayment)}
                onChange={(event) => set({ annualCouponPayment: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="eay-coupon-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Annual coupon payment currency"
              />
            </div>
          </div>
          {errors.annualCouponPayment ? (
            <p className="mt-1 text-xs text-rose-600">{errors.annualCouponPayment}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="eay-coupon-rate">
            <span>Coupon rate</span>
            <InfoTooltip
              label="Coupon rate"
              text="(Annual coupon payment ÷ face value) × 100."
            />
          </label>
          <FieldShell muted>
            <input
              id="eay-coupon-rate"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedCouponRatePercent : ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Effective annual yield</legend>

        <div>
          <label className={labelClass} htmlFor="eay-frequency">
            <span>Coupon frequency</span>
            <InfoTooltip
              label="Coupon frequency"
              text="How many times per year the annual coupon is assumed to compound (n in the EAY formula)."
            />
          </label>
          <select
            id="eay-frequency"
            className={selectClass}
            value={input.couponFrequency}
            onChange={(event) =>
              set({ couponFrequency: event.target.value as CouponFrequency })
            }
          >
            {FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="eay-result">
            <span>Effective annual yield</span>
            <InfoTooltip
              label="Effective annual yield"
              text="[(1 + r/n)^n − 1] × 100, with r = coupon rate. Not bond yield to maturity."
            />
          </label>
          <FieldShell muted>
            <input
              id="eay-result"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={result ? result.formattedEffectiveAnnualYieldPercent : ''}
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
