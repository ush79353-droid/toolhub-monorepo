'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CASH_FLOW_FREQUENCY_OPTIONS,
  COMPOUNDING_OPTIONS,
  TERM_UNIT_OPTIONS,
  type CashFlowFrequency,
  type CompoundFrequency,
  type PaymentTiming,
  type RateOfReturnFieldErrors,
  type RateOfReturnInput,
  type RateOfReturnResult,
  type TermUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent focus:outline-none focus:ring-2 focus:ring-ring';

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

interface RateOfReturnFormProps {
  input: RateOfReturnInput;
  errors: RateOfReturnFieldErrors;
  result: RateOfReturnResult | null;
  onChange: (input: RateOfReturnInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

export function RateOfReturnForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: RateOfReturnFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<RateOfReturnInput>) => onChange({ ...input, ...patch });

  const moneyField = (
    key: 'initialInvestment' | 'finalAmount' | 'periodicCashFlow',
    id: string,
    label: string,
    tip: string
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={errors[key]}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={input[key]}
            aria-invalid={Boolean(errors[key])}
            onChange={(event) => set({ [key]: event.target.value })}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-labelledby="ror-main-heading">
        <h3 id="ror-main-heading" className={sectionTitleClass}>
          Main specifications
        </h3>

        {moneyField(
          'initialInvestment',
          'ror-initial',
          'Initial investment',
          'Starting amount invested at the beginning. Must be greater than zero. Currency labels amounts only.'
        )}
        {moneyField(
          'finalAmount',
          'ror-final',
          'Final amount received',
          'Ending value of the investment after the holding period. May be zero for a total loss; cannot be negative.'
        )}

        <div>
          <label htmlFor="ror-term" className={labelClass}>
            Investment length
            <InfoTooltip
              label="Investment length"
              text="Holding period. Months convert to years as months ÷ 12."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.term}>
              <input
                id="ror-term"
                className={inputClass}
                inputMode="decimal"
                value={input.term}
                aria-invalid={Boolean(errors.term)}
                onChange={(event) => set({ term: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <select
                id="ror-term-unit"
                className={selectClass}
                value={input.termUnit}
                aria-label="Investment length unit"
                onChange={(event) => set({ termUnit: event.target.value as TermUnit })}
              >
                {TERM_UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {errors.term ? <p className="mt-1 text-xs text-rose-600">{errors.term}</p> : null}
        </div>

        <div>
          <label htmlFor="ror-compounding" className={labelClass}>
            Compounding method
            <InfoTooltip
              label="Compounding method"
              text="How often interest compounds each year when converting the solved periodic rate into an annual nominal rate."
            />
          </label>
          <select
            id="ror-compounding"
            className={selectClass}
            value={input.compounding}
            onChange={(event) =>
              set({ compounding: event.target.value as CompoundFrequency })
            }
          >
            {COMPOUNDING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="ror-cash-heading">
        <h3 id="ror-cash-heading" className={sectionTitleClass}>
          Interim periodic cash flows
        </h3>

        {moneyField(
          'periodicCashFlow',
          'ror-cash-flow',
          'Deposit or withdrawal',
          'Recurring cash flow during the investment. Positive values are additional deposits; negative values are withdrawals. Zero means no interim cash flows.'
        )}

        <div>
          <label htmlFor="ror-cash-freq" className={labelClass}>
            Cash flow frequency
            <InfoTooltip
              label="Cash flow frequency"
              text="How often the deposit or withdrawal occurs."
            />
          </label>
          <select
            id="ror-cash-freq"
            className={selectClass}
            value={input.cashFlowFrequency}
            onChange={(event) =>
              set({ cashFlowFrequency: event.target.value as CashFlowFrequency })
            }
          >
            {CASH_FLOW_FREQUENCY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ror-timing" className={labelClass}>
            Timing of periodic payment
            <InfoTooltip
              label="Timing of periodic payment"
              text="Whether each deposit or withdrawal occurs at the end or beginning of the cash-flow period."
            />
          </label>
          <select
            id="ror-timing"
            className={selectClass}
            value={input.paymentTiming}
            onChange={(event) => set({ paymentTiming: event.target.value as PaymentTiming })}
          >
            <option value="end">End of period</option>
            <option value="beginning">Beginning of period</option>
          </select>
        </div>
      </section>

      <section
        className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        aria-labelledby="ror-results-heading"
        aria-live="polite"
      >
        <h3 id="ror-results-heading" className={sectionTitleClass}>
          Results
        </h3>
        {result ? (
          <p className="text-sm leading-relaxed text-accent sm:text-base">
            The rate of return is{' '}
            <span className="font-semibold tabular-nums">{result.formattedRate}%</span>.
          </p>
        ) : errors.form ? (
          <p className="text-sm text-rose-600">{errors.form}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter valid inputs to calculate the annual rate of return.
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
