'use client';

import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SimpleInterestFieldErrors,
  SimpleInterestInput,
  SimpleInterestResult,
} from './types';

interface SimpleInterestFormProps {
  input: SimpleInterestInput;
  errors: SimpleInterestFieldErrors;
  result: SimpleInterestResult | null;
  onChange: (input: SimpleInterestInput) => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor?: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function SimpleInterestForm({
  input,
  errors,
  result,
  onChange,
}: SimpleInterestFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<SimpleInterestInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <fieldset className="space-y-3.5 rounded-xl border border-border p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">Simple interest</legend>

        <div>
          <FieldLabel
            htmlFor="si-principal"
            label="Principal"
            tip="Starting amount. Interest is calculated on this principal only (not compounded)."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="si-principal"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.principal}
                aria-invalid={Boolean(errors.principal)}
                onChange={(e) => set({ principal: e.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="si-principal-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.principal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.principal}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="si-rate"
            label="Interest rate"
            tip="Annual simple interest rate (% per year)."
          />
          <div className="relative">
            <input
              id="si-rate"
              className={`${inputClass} pr-14`}
              inputMode="decimal"
              value={input.interestRate}
              aria-invalid={Boolean(errors.interestRate)}
              onChange={(e) => set({ interestRate: e.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %/yr
            </span>
          </div>
          {errors.interestRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRate}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            label="Term"
            tip="Length of the loan or deposit in whole years and months. Months of 12 or more are normalized."
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                id="si-years"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={input.termYears}
                aria-label="Term years"
                aria-invalid={Boolean(errors.termYears)}
                onChange={(e) => set({ termYears: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                yrs
              </span>
            </div>
            <div className="relative">
              <input
                id="si-months"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={input.termMonths}
                aria-label="Term months"
                aria-invalid={Boolean(errors.termMonths)}
                onChange={(e) => set({ termMonths: e.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                mos
              </span>
            </div>
          </div>
          {errors.termYears || errors.termMonths ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.termYears || errors.termMonths}
            </p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="si-interest"
            label="Total interest"
            tip="I = P × (r ÷ 100) × t, where t is years + months ÷ 12."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="si-interest"
                type="text"
                readOnly
                className={`${inputClass} bg-muted/20 pl-8 font-semibold text-accent`}
                value={result ? result.formattedTotalInterest : ''}
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="si-interest-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
        </div>

        <div>
          <FieldLabel
            htmlFor="si-balance"
            label="Final balance"
            tip="A = P + I. Principal plus simple interest."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="si-balance"
                type="text"
                readOnly
                className={`${inputClass} bg-muted/20 pl-8 font-semibold text-accent`}
                value={result ? result.formattedFinalBalance : ''}
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="si-balance-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
        </div>
      </fieldset>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}
    </form>
  );
}
