'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  CarriedInterestFieldErrors,
  CarriedInterestInput,
  CarriedInterestResult,
  GpCatchUp,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';
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

interface CarriedInterestFormProps {
  input: CarriedInterestInput;
  errors: CarriedInterestFieldErrors;
  result: CarriedInterestResult | null;
  fundReturnDisplay: string;
  onChange: (input: CarriedInterestInput) => void;
  onReset: () => void;
}

export function CarriedInterestForm({
  input,
  errors,
  result,
  fundReturnDisplay,
  onChange,
  onReset,
}: CarriedInterestFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CarriedInterestInput>) => onChange({ ...input, ...patch });

  const onMoney =
    (key: 'initialFundValue' | 'finalFundValue') => (event: ChangeEvent<HTMLInputElement>) => {
      set({ [key]: event.target.value });
    };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className={sectionClass}>
        <legend className="px-1 text-[13px] font-semibold text-accent">Fund return</legend>

        <div>
          <label className={labelClass} htmlFor="ci-initial">
            <span>Initial fund value</span>
            <InfoTooltip
              label="Initial fund value"
              text="Starting fund capital. Must be greater than zero. Currency labels amounts only."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.initialFundValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="ci-initial"
                className={inputClass}
                inputMode="decimal"
                value={input.initialFundValue}
                aria-invalid={Boolean(errors.initialFundValue)}
                onChange={onMoney('initialFundValue')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ci-initial-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Initial fund value currency"
              />
            </div>
          </div>
          {errors.initialFundValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialFundValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ci-final">
            <span>Final fund value</span>
            <InfoTooltip
              label="Final fund value"
              text="Ending fund value. May be zero for a total loss; cannot be negative."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.finalFundValue}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="ci-final"
                className={inputClass}
                inputMode="decimal"
                value={input.finalFundValue}
                aria-invalid={Boolean(errors.finalFundValue)}
                onChange={onMoney('finalFundValue')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="ci-final-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Final fund value currency"
              />
            </div>
          </div>
          {errors.finalFundValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.finalFundValue}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ci-fund-return">
            <span>Fund return</span>
            <InfoTooltip
              label="Fund return"
              text="((Final − Initial) / Initial) × 100. Positive, zero, and negative returns are allowed."
            />
          </label>
          <FieldShell muted>
            <input
              id="ci-fund-return"
              className={`${inputClass} pr-8 font-semibold`}
              readOnly
              value={fundReturnDisplay}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className="px-1 text-[13px] font-semibold text-accent">Carry interest</legend>

        <div>
          <label className={labelClass} htmlFor="ci-hold">
            <span>Hold period</span>
            <InfoTooltip
              label="Hold period"
              text="Investment duration in years used for the annually compounded hurdle."
            />
          </label>
          <FieldShell error={errors.holdPeriodYears}>
            <input
              id="ci-hold"
              className={`${inputClass} pr-12`}
              inputMode="decimal"
              value={input.holdPeriodYears}
              aria-invalid={Boolean(errors.holdPeriodYears)}
              onChange={(e) => set({ holdPeriodYears: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              yrs
            </span>
          </FieldShell>
          {errors.holdPeriodYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.holdPeriodYears}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ci-hurdle">
            <span>Hurdle rate</span>
            <InfoTooltip
              label="Hurdle rate"
              text="Preferred annual return for LPs before carry applies, compounded annually over the hold period."
            />
          </label>
          <FieldShell error={errors.hurdleRatePercent}>
            <input
              id="ci-hurdle"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.hurdleRatePercent}
              aria-invalid={Boolean(errors.hurdleRatePercent)}
              onChange={(e) => set({ hurdleRatePercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.hurdleRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hurdleRatePercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="ci-carry">
            <span>Carried interest</span>
            <InfoTooltip
              label="Carried interest"
              text="GP performance fee as a percent of eligible profits (typically 20%). Must be below 100%."
            />
          </label>
          <FieldShell error={errors.carriedInterestPercent}>
            <input
              id="ci-carry"
              className={`${inputClass} pr-8`}
              inputMode="decimal"
              value={input.carriedInterestPercent}
              aria-invalid={Boolean(errors.carriedInterestPercent)}
              onChange={(e) => set({ carriedInterestPercent: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.carriedInterestPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.carriedInterestPercent}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className={labelClass}>GP (general partner) catch-up</legend>
          <div className="flex flex-wrap gap-4">
            {(
              [
                ['no', 'No'],
                ['yes', 'Yes'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="ci-gp-catch-up"
                  className="h-4 w-4 border-border accent-primary"
                  checked={input.gpCatchUp === value}
                  onChange={() => set({ gpCatchUp: value as GpCatchUp })}
                />
                {label}
              </label>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {input.gpCatchUp === 'no'
              ? 'Carry applies only to profit above the compounded hurdle.'
              : 'Full catch-up: GP receives post-hurdle profit first until its share equals the carry rate of total profit, then residual splits at the carry rate.'}
          </p>
        </fieldset>

        {result ? (
          <div className="rounded-lg border border-border bg-white p-3.5">
            <p className="text-[13px] font-medium text-muted-foreground">
              GP carried interest amount
            </p>
            <p className="mt-1 text-xl font-semibold tabular-nums text-accent" aria-live="polite">
              {symbol}
              {result.formattedGpCarriedInterestAmount}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Total profit {symbol}
              {result.formattedTotalProfit}
              {result.hurdleProfit > 0
                ? ` · Hurdle ${symbol}${result.formattedHurdleProfit}`
                : null}
            </p>
          </div>
        ) : null}

        {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
      </fieldset>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
