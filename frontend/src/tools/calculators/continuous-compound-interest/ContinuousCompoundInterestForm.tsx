'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DEPOSIT_FREQUENCY_OPTIONS,
  type ContinuousCompoundInterestFieldErrors,
  type ContinuousCompoundInterestInput,
  type ContinuousCompoundInterestResult,
} from './types';

interface ContinuousCompoundInterestFormProps {
  input: ContinuousCompoundInterestInput;
  errors: ContinuousCompoundInterestFieldErrors;
  result: ContinuousCompoundInterestResult | null;
  onChange: (input: ContinuousCompoundInterestInput) => void;
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

export function ContinuousCompoundInterestForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: ContinuousCompoundInterestFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ContinuousCompoundInterestInput>) =>
    onChange({ ...input, ...patch });
  const showDepositFields = input.depositFrequency !== 'never';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <section className="space-y-4" aria-label="Main inputs">
        <div>
          <FieldLabel
            htmlFor="cci-balance"
            label="Initial balance"
            tip="Starting principal. Currency labels the amount only; it does not convert."
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="cci-balance"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.initialBalance}
                aria-invalid={Boolean(errors.initialBalance)}
                onChange={(event) => set({ initialBalance: event.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cci-balance-currency"
                value={input.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
          {errors.initialBalance ? (
            <p className="mt-1 text-xs text-rose-600">{errors.initialBalance}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="cci-rate"
            label="Interest rate"
            tip="Annual nominal interest rate as a percent. Zero and negative rates are allowed."
          />
          <div className="relative">
            <input
              id="cci-rate"
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
            htmlFor="cci-years"
            label="Term"
            tip="Investment length as whole years and months. Duration must be greater than zero."
          />
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <input
                id="cci-years"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={input.termYears}
                aria-label="Term years"
                aria-invalid={Boolean(errors.termYears)}
                onChange={(event) => set({ termYears: event.target.value })}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                yrs
              </span>
            </div>
            <div className="relative">
              <input
                id="cci-months"
                className={`${inputClass} pr-12`}
                inputMode="numeric"
                value={input.termMonths}
                aria-label="Term months"
                aria-invalid={Boolean(errors.termMonths)}
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
      </section>

      <section className="space-y-4" aria-labelledby="cci-deposits-heading">
        <h3 id="cci-deposits-heading" className="text-sm font-semibold text-accent">
          Additional deposits
        </h3>
        <div>
          <FieldLabel
            htmlFor="cci-deposit-freq"
            label="How often?"
            tip="Choose Never for a single initial balance, or a recurring deposit schedule."
          />
          <select
            id="cci-deposit-freq"
            className={selectClass}
            value={input.depositFrequency}
            onChange={(event) =>
              set({
                depositFrequency: event.target
                  .value as ContinuousCompoundInterestInput['depositFrequency'],
              })
            }
          >
            {DEPOSIT_FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {showDepositFields ? (
          <>
            <div>
              <FieldLabel
                htmlFor="cci-deposit-amount"
                label="Deposit amount"
                tip="Amount added on each deposit date. Continuously compounded for the remaining term."
              />
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="cci-deposit-amount"
                  className={`${inputClass} pl-8`}
                  inputMode="decimal"
                  value={input.depositAmount}
                  aria-invalid={Boolean(errors.depositAmount)}
                  onChange={(event) => set({ depositAmount: event.target.value })}
                />
              </div>
              {errors.depositAmount ? (
                <p className="mt-1 text-xs text-rose-600">{errors.depositAmount}</p>
              ) : null}
            </div>
            <fieldset>
              <legend className="mb-1.5 text-[13px] font-medium text-accent">Deposit timing</legend>
              <div className="flex flex-wrap gap-4">
                {(
                  [
                    ['end', 'End of period'],
                    ['beginning', 'Beginning of period'],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 text-sm text-accent">
                    <input
                      type="radio"
                      name="cci-deposit-timing"
                      className="h-4 w-4 border-border"
                      checked={input.depositTiming === value}
                      onChange={() => set({ depositTiming: value })}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        ) : null}
      </section>

      <section className="space-y-4" aria-labelledby="cci-results-heading">
        <h3 id="cci-results-heading" className="text-sm font-semibold text-accent">
          Results
        </h3>
        <div>
          <FieldLabel
            htmlFor="cci-final"
            label="Final balance"
            tip="Continuously compounded ending balance: P × e^(r × t), plus deposit future values."
          />
          <div className="flex gap-2">
            <input
              id="cci-final"
              className={`${inputClass} bg-muted/10 font-semibold text-accent`}
              readOnly
              value={result ? result.formattedFinalBalance : ''}
              aria-live="polite"
            />
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cci-final-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Final balance currency"
              />
            </div>
          </div>
        </div>
        <div>
          <FieldLabel
            htmlFor="cci-interest"
            label="Compound interest"
            tip="Final balance minus total cash deposited (initial balance plus recurring deposits)."
          />
          <div className="flex gap-2">
            <input
              id="cci-interest"
              className={`${inputClass} bg-muted/10 font-semibold text-accent`}
              readOnly
              value={result ? result.formattedCompoundInterest : ''}
              aria-live="polite"
            />
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="cci-interest-currency"
                value={input.currency}
                onChange={onCurrencyChange}
                aria-label="Compound interest currency"
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
