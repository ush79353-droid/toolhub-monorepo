'use client';

import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  CURRENCY_DENOMINATION_NOTE,
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  FD_COMPOUNDING_OPTIONS,
  type FdFieldErrors,
  type FdInput,
  type FdResult,
} from './types';

interface FdFormProps {
  input: FdInput;
  errors: FdFieldErrors;
  result: FdResult | null;
  onChange: (input: FdInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';
const readoutClass =
  'h-11 w-full rounded-lg border border-border bg-muted/10 px-3 text-sm font-semibold tabular-nums text-accent';

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

export function FdForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onReset,
}: FdFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<FdInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <section className="space-y-4" aria-labelledby="fd-details-heading">
        <h3 id="fd-details-heading" className="text-sm font-semibold text-accent">
          Fixed deposit details
        </h3>

        <fieldset>
          <legend className="mb-1.5 text-[13px] font-medium text-accent">Fixed deposit type</legend>
          <div className="flex flex-wrap gap-4">
            {(
              [
                ['simple', 'Simple'],
                ['cumulative', 'Cumulative'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="fd-type"
                  className="h-4 w-4 border-border"
                  checked={input.depositType === value}
                  onChange={() => set({ depositType: value })}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <FieldLabel
            htmlFor="fd-principal"
            label="Principal amount"
            tip={`Starting deposit. ${CURRENCY_DENOMINATION_NOTE}`}
          />
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="fd-principal"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={input.principal}
                aria-invalid={Boolean(errors.principal)}
                onChange={(event) => set({ principal: event.target.value })}
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="fd-principal-currency"
                value={input.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
          {errors.principal ? (
            <p className="mt-1 text-xs text-rose-600">{errors.principal}</p>
          ) : null}
        </div>

        <div>
          <FieldLabel
            htmlFor="fd-rate"
            label="Interest rate"
            tip="Annual nominal interest rate as a percent."
          />
          <div className="relative">
            <input
              id="fd-rate"
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
          <FieldLabel htmlFor="fd-term" label="Term" tip="Deposit length in whole or fractional years." />
          <div className="relative">
            <input
              id="fd-term"
              className={`${inputClass} pr-12`}
              inputMode="decimal"
              value={input.termYears}
              aria-invalid={Boolean(errors.termYears)}
              onChange={(event) => set({ termYears: event.target.value })}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              yrs
            </span>
          </div>
          {errors.termYears ? (
            <p className="mt-1 text-xs text-rose-600">{errors.termYears}</p>
          ) : null}
        </div>

        <fieldset>
          <legend className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent">
            Compounding frequency
            <InfoTooltip
              label="Compounding frequency"
              text="How often interest is compounded (cumulative) or paid out (simple)."
              align="left"
            />
          </legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {FD_COMPOUNDING_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 text-sm text-accent">
                <input
                  type="radio"
                  name="fd-compounding"
                  className="h-4 w-4 border-border"
                  checked={input.compounding === opt.value}
                  onChange={() => set({ compounding: opt.value })}
                />
                {opt.label}
              </label>
            ))}
          </div>
          {errors.compounding ? (
            <p className="mt-1 text-xs text-rose-600">{errors.compounding}</p>
          ) : null}
        </fieldset>
      </section>

      <section className="space-y-4" aria-labelledby="fd-results-heading">
        <h3 id="fd-results-heading" className="text-sm font-semibold text-accent">
          Results
        </h3>

        {(
          [
            [
              'fd-maturity',
              'Maturity amount',
              'Cumulative: compounded ending balance. Simple: principal returned at maturity.',
              result?.formattedMaturityAmount ?? '',
            ],
            [
              'fd-interest',
              'Total interest',
              'Cumulative: maturity minus principal. Simple: P × r × t.',
              result?.formattedTotalInterest ?? '',
            ],
            [
              'fd-payout-period',
              'Payout per interest period',
              'Simple: P × r / n paid each period. Cumulative: zero (interest is reinvested).',
              result?.formattedPayoutPerPeriod ?? '',
            ],
            [
              'fd-total-payout',
              'Total payout',
              'Cumulative: equals maturity. Simple: principal plus all interest payouts.',
              result?.formattedTotalPayout ?? '',
            ],
          ] as const
        ).map(([id, label, tip, value]) => (
          <div key={id}>
            <FieldLabel htmlFor={id} label={label} tip={tip} />
            <div className="flex gap-2">
              <input
                id={id}
                className={readoutClass}
                readOnly
                value={value}
                aria-live="polite"
              />
              <div className="w-[110px] shrink-0 sm:w-[120px]">
                <CurrencySelect
                  id={`${id}-currency`}
                  value={input.currency}
                  onChange={onCurrencyChange}
                  aria-label={`${label} currency`}
                />
              </div>
            </div>
          </div>
        ))}
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
