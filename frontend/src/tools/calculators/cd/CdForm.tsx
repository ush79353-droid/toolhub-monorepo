'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { CdResults } from './CdResults';
import {
  CD_COMPOUNDING_OPTIONS,
  CD_RATE_CONVENTION_OPTIONS,
  type CdFieldErrors,
  type CdInput,
  type CdResult,
  type CdScheduleView,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface CdFormProps {
  input: CdInput;
  errors: CdFieldErrors;
  result: CdResult | null;
  onChange: (next: CdInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onLoadExample: () => void;
  onScheduleViewChange: (view: CdScheduleView) => void;
}

export function CdForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onLoadExample,
  onScheduleViewChange,
}: CdFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CdInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <section aria-labelledby="cd-inputs-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id="cd-inputs-heading" className="text-sm font-semibold text-accent">
            CD details
          </h3>
          <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
            Load example
          </Button>
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="cd-deposit">Initial deposit</label>
            <InfoTooltip
              label="Initial deposit"
              text="Principal placed in the CD at the start. No additional deposits or withdrawals are modeled during the term."
              align="left"
            />
          </div>
          <div className="flex gap-2">
            <FieldShell error={errors.initialDeposit}>
              <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
              <input
                id="cd-deposit"
                className={inputClass}
                inputMode="decimal"
                placeholder="Enter initial deposit"
                value={input.initialDeposit}
                aria-invalid={Boolean(errors.initialDeposit)}
                onChange={(event) => set({ initialDeposit: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cd-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
          </div>
          {errors.initialDeposit ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialDeposit}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className={labelClass}>
              <label htmlFor="cd-rate">Interest rate</label>
              <InfoTooltip
                label="Interest rate"
                text="Enter a nominal annual rate (APR) or an APY. When APY is selected, the rate is converted to the matching nominal rate for the chosen compounding frequency so compounding is not applied twice."
                align="left"
              />
            </div>
            <FieldShell error={errors.interestRate}>
              <input
                id="cd-rate"
                className={inputClass}
                inputMode="decimal"
                value={input.interestRate}
                aria-invalid={Boolean(errors.interestRate)}
                onChange={(event) => set({ interestRate: event.target.value })}
              />
              <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
            </FieldShell>
            {errors.interestRate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.interestRate}</p>
            ) : null}
          </div>
          <div>
            <div className={labelClass}>
              <label htmlFor="cd-rate-convention">Rate convention</label>
              <InfoTooltip
                label="Rate convention"
                text="Nominal APR is divided by compounding periods. APY is already an effective annual yield and is converted before compounding."
                align="left"
              />
            </div>
            <select
              id="cd-rate-convention"
              className={selectClass}
              value={input.rateConvention}
              onChange={(event) =>
                set({ rateConvention: event.target.value as CdInput['rateConvention'] })
              }
            >
              {CD_RATE_CONVENTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="cd-compound">Compound</label>
            <InfoTooltip
              label="Compound"
              text="How often earned interest is added to principal. More frequent compounding raises effective APY when the nominal rate is unchanged."
              align="left"
            />
          </div>
          <select
            id="cd-compound"
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

        <div>
          <div className={labelClass}>
            <span>Deposit length</span>
            <InfoTooltip
              label="Deposit length"
              text="Time the deposit remains invested until maturity. Months must be 0–11; total duration must be greater than zero."
              align="left"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldShell error={errors.depositYears}>
                <input
                  id="cd-years"
                  className={inputClass}
                  inputMode="numeric"
                  aria-label="Deposit length years"
                  value={input.depositYears}
                  aria-invalid={Boolean(errors.depositYears)}
                  onChange={(event) => set({ depositYears: event.target.value })}
                />
                <span className="pr-3 text-sm font-medium text-muted-foreground">Years</span>
              </FieldShell>
            </div>
            <div>
              <FieldShell error={errors.depositMonths}>
                <input
                  id="cd-months"
                  className={inputClass}
                  inputMode="numeric"
                  aria-label="Deposit length months"
                  value={input.depositMonths}
                  aria-invalid={Boolean(errors.depositMonths)}
                  onChange={(event) => set({ depositMonths: event.target.value })}
                />
                <span className="pr-3 text-sm font-medium text-muted-foreground">Months</span>
              </FieldShell>
            </div>
          </div>
          {errors.depositYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.depositYears}</p>
          ) : null}
          {errors.depositMonths ? (
            <p className="mt-1 text-xs text-rose-600">{errors.depositMonths}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="cd-tax">Marginal tax rate</label>
            <InfoTooltip
              label="Marginal tax rate"
              text="Simplified estimate applied to gross interest at maturity. Actual tax timing and liability vary by jurisdiction and account type — not tax advice."
              align="left"
            />
          </div>
          <FieldShell error={errors.marginalTaxRate} className="max-w-xs">
            <input
              id="cd-tax"
              className={inputClass}
              inputMode="decimal"
              value={input.marginalTaxRate}
              aria-invalid={Boolean(errors.marginalTaxRate)}
              onChange={(event) => set({ marginalTaxRate: event.target.value })}
            />
            <span className="pr-3 text-sm font-medium text-muted-foreground">%</span>
          </FieldShell>
          {errors.marginalTaxRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.marginalTaxRate}</p>
          ) : null}
        </div>
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onClear}>
          Clear
        </Button>
      </div>

      {result ? (
        <CdResults
          input={input}
          result={result}
          onScheduleViewChange={onScheduleViewChange}
        />
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter CD details and select Calculate to see end balance, tax estimate, charts, and
          accumulation schedules.
        </p>
      )}
    </form>
  );
}
