'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { SocialSecurityFieldErrors, SocialSecurityInput } from './types';
import { SocialSecurityResults } from './SocialSecurityResults';
import type { SocialSecurityResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  suffix,
  children,
}: {
  error?: string;
  suffix?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
      {suffix ? (
        <span className="shrink-0 pr-3 text-xs text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

interface SocialSecurityFormProps {
  input: SocialSecurityInput;
  errors: SocialSecurityFieldErrors;
  result: SocialSecurityResult | null;
  onChange: (input: SocialSecurityInput) => void;
  onCalculate: () => void;
  onClear: () => void;
}

export function SocialSecurityForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
}: SocialSecurityFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Compare claiming ages 62–70 using SSA full-retirement-age, early
        reduction, and delayed-retirement-credit factors. Enter your own
        estimated benefit at full retirement age (from SSA). Amounts are fixed
        USD. Educational only — not advice.
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Determine the ideal application age
        </legend>

        <div>
          <label htmlFor="ss-birth-year" className={labelClass}>
            Your birth year
            <InfoTooltip
              label="Birth year"
              text="Used only to look up your SSA full retirement age cohort and delayed-credit rate. Birth month is not required; claim ages are modeled on whole birthdays."
            />
          </label>
          <FieldShell error={errors.birthYear}>
            <input
              id="ss-birth-year"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.birthYear}
              onChange={(e) =>
                onChange({ ...input, birthYear: e.target.value })
              }
              placeholder="1970"
              aria-invalid={Boolean(errors.birthYear)}
            />
          </FieldShell>
          {errors.birthYear ? (
            <p className="mt-1 text-xs text-rose-600">{errors.birthYear}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ss-life-expectancy" className={labelClass}>
            Your life expectancy
            <InfoTooltip
              label="Life expectancy"
              text="Attained age through which monthly benefits (and investment growth of those checks) are modeled. Must be greater than 62."
            />
          </label>
          <FieldShell error={errors.lifeExpectancy}>
            <input
              id="ss-life-expectancy"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.lifeExpectancy}
              onChange={(e) =>
                onChange({ ...input, lifeExpectancy: e.target.value })
              }
              placeholder="83"
              aria-invalid={Boolean(errors.lifeExpectancy)}
            />
          </FieldShell>
          {errors.lifeExpectancy ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.lifeExpectancy}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ss-return" className={labelClass}>
            Your investment return
            <InfoTooltip
              label="Investment return"
              text="Expected annual return used to grow each benefit check until life expectancy. Higher returns tend to favor earlier claiming in this model."
            />
          </label>
          <FieldShell error={errors.investmentReturn} suffix="% per year">
            <input
              id="ss-return"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.investmentReturn}
              onChange={(e) =>
                onChange({ ...input, investmentReturn: e.target.value })
              }
              placeholder="5"
              aria-invalid={Boolean(errors.investmentReturn)}
            />
          </FieldShell>
          {errors.investmentReturn ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.investmentReturn}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ss-cola" className={labelClass}>
            Cost of living adjustment*
            <InfoTooltip
              label="COLA"
              text="Assumed annual cost-of-living increase applied on each claim anniversary. Not a forecast of official SSA COLAs."
            />
          </label>
          <FieldShell error={errors.cola} suffix="% per year">
            <input
              id="ss-cola"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.cola}
              onChange={(e) => onChange({ ...input, cola: e.target.value })}
              placeholder="3"
              aria-invalid={Boolean(errors.cola)}
            />
          </FieldShell>
          {errors.cola ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cola}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ss-pia" className={labelClass}>
            Estimated monthly benefit at full retirement age
            <InfoTooltip
              label="Benefit at FRA"
              text="Your primary insurance amount (PIA) estimate from SSA (my Social Security statement or estimator). Default $1,922 is the Dec 2024 average retired-worker benefit for illustration only — replace it with your figure."
            />
          </label>
          <FieldShell error={errors.piaMonthly} suffix="$ / mo">
            <input
              id="ss-pia"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.piaMonthly}
              onChange={(e) =>
                onChange({ ...input, piaMonthly: e.target.value })
              }
              placeholder="1922"
              aria-invalid={Boolean(errors.piaMonthly)}
            />
          </FieldShell>
          {errors.piaMonthly ? (
            <p className="mt-1 text-xs text-rose-600">{errors.piaMonthly}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Required. Do not leave the illustrative average if you have your
              own SSA estimate.
            </p>
          )}
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-sm text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="submit"
          className="h-11 min-w-[8.5rem] rounded-xl px-5 text-sm font-semibold"
        >
          Calculate
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 min-w-[6rem] rounded-xl border-border px-5 text-sm font-semibold text-accent"
          onClick={onClear}
        >
          Clear
        </Button>
      </div>

      <SocialSecurityResults result={result} />
    </form>
  );
}
