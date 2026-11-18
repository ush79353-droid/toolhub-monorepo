'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  BondFieldErrors,
  BondInput,
  BondResult,
  CouponFrequency,
  CouponMode,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface BondFormProps {
  input: BondInput;
  errors: BondFieldErrors;
  result: BondResult | null;
  onChange: (input: BondInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function BondForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: BondFormProps) {
  const set = (patch: Partial<BondInput>) => onChange({ ...input, ...patch });

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-foreground/90">
        Leave exactly one of Price, Face value, Yield, Time to maturity, or Annual coupon blank
        to solve for that value. Coupon frequency is always selected. This calculator is for
        bonds issued/traded at the coupon date.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onCalculate();
          }}
          className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
          noValidate
          autoComplete="off"
        >
          <div>
            <label className={labelClass} htmlFor="bond-price">
              <span>Price</span>
              <InfoTooltip
                label="Price"
                text="Current market price of the bond in USD. Leave blank to solve for price."
              />
            </label>
            <FieldShell error={errors.price}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="bond-price"
                className={inputClass}
                inputMode="decimal"
                value={input.price}
                placeholder="Leave blank to solve"
                aria-invalid={Boolean(errors.price)}
                onChange={(e) => set({ price: e.target.value })}
              />
            </FieldShell>
            {errors.price ? (
              <p className="mt-1 text-xs text-rose-600">{errors.price}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="bond-face">
              <span>Face value</span>
              <InfoTooltip
                label="Face value"
                text="Par / redemption amount paid at maturity, in USD."
              />
            </label>
            <FieldShell error={errors.faceValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                $
              </span>
              <input
                id="bond-face"
                className={inputClass}
                inputMode="decimal"
                value={input.faceValue}
                aria-invalid={Boolean(errors.faceValue)}
                onChange={(e) => set({ faceValue: e.target.value })}
              />
            </FieldShell>
            {errors.faceValue ? (
              <p className="mt-1 text-xs text-rose-600">{errors.faceValue}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="bond-yield">
              <span>Yield</span>
              <InfoTooltip
                label="Yield"
                text="Annual nominal yield to maturity (percent). Leave blank to solve for yield."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.yieldPercent}>
                <input
                  id="bond-yield"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.yieldPercent}
                  aria-invalid={Boolean(errors.yieldPercent)}
                  onChange={(e) => set({ yieldPercent: e.target.value })}
                />
              </FieldShell>
              <span className="flex h-11 items-center text-sm text-muted-foreground">%</span>
            </div>
            {errors.yieldPercent ? (
              <p className="mt-1 text-xs text-rose-600">{errors.yieldPercent}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="bond-maturity">
              <span>Time to maturity</span>
              <InfoTooltip
                label="Time to maturity"
                text="Years until maturity. Maturity × coupon frequency must be a whole number of periods."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.timeToMaturityYears}>
                <input
                  id="bond-maturity"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.timeToMaturityYears}
                  aria-invalid={Boolean(errors.timeToMaturityYears)}
                  onChange={(e) => set({ timeToMaturityYears: e.target.value })}
                />
              </FieldShell>
              <span className="flex h-11 items-center text-sm text-muted-foreground">
                years
              </span>
            </div>
            {errors.timeToMaturityYears ? (
              <p className="mt-1 text-xs text-rose-600">{errors.timeToMaturityYears}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="bond-coupon">
              <span>Annual coupon</span>
              <InfoTooltip
                label="Annual coupon"
                text="Choose % of face value or a fixed USD amount per year. Periodic coupon = annual ÷ frequency."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.annualCoupon}>
                {input.couponMode === 'amount' ? (
                  <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                    $
                  </span>
                ) : null}
                <input
                  id="bond-coupon"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.annualCoupon}
                  aria-invalid={Boolean(errors.annualCoupon)}
                  onChange={(e) => set({ annualCoupon: e.target.value })}
                />
              </FieldShell>
              <select
                className={selectClass}
                aria-label="Annual coupon unit"
                value={input.couponMode}
                onChange={(e) => set({ couponMode: e.target.value as CouponMode })}
              >
                <option value="percent">%</option>
                <option value="amount">$</option>
              </select>
            </div>
            {errors.annualCoupon ? (
              <p className="mt-1 text-xs text-rose-600">{errors.annualCoupon}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="bond-frequency">
              <span>Coupon frequency</span>
              <InfoTooltip
                label="Coupon frequency"
                text="How many coupon payments per year (m). Always required."
              />
            </label>
            <select
              id="bond-frequency"
              className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
              value={input.couponFrequency}
              onChange={(e) =>
                set({ couponFrequency: e.target.value as CouponFrequency })
              }
            >
              <option value="annually">annually</option>
              <option value="semiannually">semiannually</option>
              <option value="quarterly">quarterly</option>
              <option value="monthly">monthly</option>
            </select>
          </div>

          {errors.form ? (
            <p className="text-xs text-rose-600" role="alert">
              {errors.form}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="submit" className="h-10 rounded-xl px-4 text-xs font-semibold">
              Calculate
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl px-4 text-xs font-semibold"
              onClick={onClear}
            >
              Clear
            </Button>
          </div>
        </form>

        <div className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4">
          <div className="rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white">
            Results
          </div>
          {result ? (
            <p className="text-sm leading-relaxed text-foreground/90">
              {result.summaryLead}{' '}
              <strong className="font-semibold text-accent">{result.summaryValue}</strong>.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter four of the five variable fields (leave one blank), choose coupon frequency,
              and click Calculate.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
