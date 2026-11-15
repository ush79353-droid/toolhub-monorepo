'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CD_COMPOUNDING_OPTIONS,
  type CdFieldErrors,
  type CdInput,
  type CdResult,
} from './types';

interface CdFormProps {
  input: CdInput;
  errors: CdFieldErrors;
  result: CdResult | null;
  onChange: (input: CdInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
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

export function CdForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: CdFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CdInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <section aria-labelledby="cd-details-heading" className="space-y-4">
        <h3 id="cd-details-heading" className="text-sm font-semibold text-accent">
          CD details
        </h3>

        <div>
          <FieldLabel
            htmlFor="cd-deposit"
            label="Initial deposit"
            tip="Starting principal. Changing currency converts the deposit using stored rates."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="cd-deposit"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.initialDeposit}
                aria-invalid={Boolean(errors.initialDeposit)}
                onChange={(event) => set({ initialDeposit: event.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cd-deposit-currency"
                value={input.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
          {errors.initialDeposit ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialDeposit}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="cd-rate"
            label="Interest rate"
            tip="Annual nominal interest rate as a percent (for example 5 for 5%)."
          />
          <div className="relative">
            <input
              id="cd-rate"
              className={`${inputClass} pr-10`}
              inputMode="decimal"
              value={input.interestRate}
              aria-invalid={Boolean(errors.interestRate)}
              onChange={(event) => set({ interestRate: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              %
            </span>
          </div>
          {errors.interestRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.interestRate}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="cd-years"
            label="Term"
            tip="Certificate length as whole years and months. Duration must be greater than zero."
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                id="cd-years"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={input.termYears}
                aria-invalid={Boolean(errors.termYears)}
                aria-label="Term years"
                onChange={(event) => set({ termYears: event.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                yrs
              </span>
            </div>
            <div className="relative">
              <input
                id="cd-months"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={input.termMonths}
                aria-invalid={Boolean(errors.termMonths)}
                aria-label="Term months"
                onChange={(event) => set({ termMonths: event.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                mos
              </span>
            </div>
          </div>
          {errors.termYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
          ) : null}
          {errors.termMonths ? (
            <p className="mt-1 text-xs text-rose-600">{errors.termMonths}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="cd-compounding"
            label="Compounding frequency"
            tip="How often interest is compounded each year. Default is yearly."
          />
          <select
            id="cd-compounding"
            className={selectClass}
            value={input.compounding}
            aria-invalid={Boolean(errors.compounding)}
            onChange={(event) =>
              set({ compounding: event.target.value as CdInput['compounding'] })
            }
          >
            {CD_COMPOUNDING_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.compounding ? (
            <p className="mt-1 text-xs text-rose-600">{errors.compounding}</p>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="cd-results-heading" className="space-y-4">
        <h3 id="cd-results-heading" className="text-sm font-semibold text-accent">
          Results
        </h3>

        <div>
          <FieldLabel
            htmlFor="cd-final"
            label="Final balance"
            tip="Compounded ending balance: P × (1 + r/n)^(n × t)."
          />
          <div className="flex gap-2">
            <input
              id="cd-final"
              className={`${inputClass} bg-muted/10 font-semibold text-accent`}
              readOnly
              value={result ? result.formattedFinalBalance : ''}
              aria-live="polite"
            />
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cd-final-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Final balance currency"
              />
            </div>
          </div>
        </div>

        <div>
          <FieldLabel
            htmlFor="cd-interest"
            label="Interest earned"
            tip="Final balance minus the initial deposit."
          />
          <div className="flex gap-2">
            <input
              id="cd-interest"
              className={`${inputClass} bg-muted/10 font-semibold text-accent`}
              readOnly
              value={result ? result.formattedInterestEarned : ''}
              aria-live="polite"
            />
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cd-interest-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Interest earned currency"
              />
            </div>
          </div>
        </div>
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
