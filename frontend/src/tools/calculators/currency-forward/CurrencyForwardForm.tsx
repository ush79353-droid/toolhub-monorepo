'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import type { SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { QUOTE_CONVENTION_NOTE } from './calculation';
import type {
  CompoundingConvention,
  CurrencyForwardFieldErrors,
  CurrencyForwardInput,
  CurrencyForwardResult,
  DayCountBasis,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3 rounded-xl border border-border bg-muted/10 p-3 sm:p-4';

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

interface CurrencyForwardFormProps {
  input: CurrencyForwardInput;
  errors: CurrencyForwardFieldErrors;
  result: CurrencyForwardResult | null;
  onChange: (input: CurrencyForwardInput) => void;
}

export function CurrencyForwardForm({
  input,
  errors,
  result,
  onChange,
}: CurrencyForwardFormProps) {
  const set = (patch: Partial<CurrencyForwardInput>) =>
    onChange({ ...input, ...patch });

  const setBase = (baseCurrency: SupportedCurrency) =>
    set({ baseCurrency });
  const setQuote = (quoteCurrency: SupportedCurrency) =>
    set({ quoteCurrency });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
 {QUOTE_CONVENTION_NOTE} Theoretical CIP rate only; not a live dealer
        quote.
      </p>
      <p className="text-xs">
        <a
          href="#what-is"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is a currency forward?
        </a>
      </p>

      <section className={sectionClass} aria-labelledby="cf-contract">
        <h3 id="cf-contract" className="text-sm font-semibold text-accent">
          Currency Forward Contract
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className={labelClass}>
            Base currency
            <InfoTooltip
              label="Base currency"
              text="The currency being priced (1 unit of base). In EUR/USD, EUR is the base."
            />
          </label>
          <CurrencySelect
            id="cf-base"
            value={input.baseCurrency}
            onChange={setBase}
            aria-label="Base currency"
          />
        </div>
        {errors.baseCurrency ? (
          <p className="text-xs text-rose-600">{errors.baseCurrency}</p>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className={labelClass}>
            Quote currency
            <InfoTooltip
              label="Quote currency"
              text="Also called the price currency: units of this currency per one base unit. In EUR/USD, USD is the quote."
            />
          </label>
          <CurrencySelect
            id="cf-quote"
            value={input.quoteCurrency}
            onChange={setQuote}
            aria-label="Quote currency"
          />
        </div>
        {errors.quoteCurrency ? (
          <p className="text-xs text-rose-600">{errors.quoteCurrency}</p>
        ) : null}

        <div>
          <label htmlFor="cf-days" className={labelClass}>
            Number of days in the forward contract
          </label>
          <FieldShell error={errors.contractDays}>
            <input
              id="cf-days"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.contractDays}
              onChange={(e) => set({ contractDays: e.target.value })}
              placeholder="90"
              aria-invalid={Boolean(errors.contractDays)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              days
            </span>
          </FieldShell>
          {errors.contractDays ? (
            <p className="mt-1 text-xs text-rose-600">{errors.contractDays}</p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-basis" className={labelClass}>
              Day-count basis
            </label>
            <FieldShell>
              <select
                id="cf-basis"
                className={`${inputClass} appearance-none`}
                value={String(input.dayCountBasis)}
                onChange={(e) =>
                  set({
                    dayCountBasis: Number(e.target.value) as DayCountBasis,
                  })
                }
              >
                <option value="365">Actual/365</option>
                <option value="360">Actual/360</option>
              </select>
            </FieldShell>
          </div>
          <div>
            <label htmlFor="cf-comp" className={labelClass}>
              Compounding
            </label>
            <FieldShell>
              <select
                id="cf-comp"
                className={`${inputClass} appearance-none`}
                value={input.compounding}
                onChange={(e) =>
                  set({
                    compounding: e.target.value as CompoundingConvention,
                  })
                }
              >
                <option value="simple">Simple interest</option>
                <option value="annual">Annual compounding</option>
                <option value="continuous">Continuous compounding</option>
              </select>
            </FieldShell>
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="cf-quote-rate">
        <h3 id="cf-quote-rate" className="text-sm font-semibold text-accent">
          Quote Currency Interest Rate ({input.quoteCurrency})
        </h3>
        <div>
          <label htmlFor="cf-rq" className={labelClass}>
            Annualized quote currency interest rate
          </label>
          <FieldShell error={errors.annualQuoteRatePercent}>
            <input
              id="cf-rq"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.annualQuoteRatePercent}
              onChange={(e) => set({ annualQuoteRatePercent: e.target.value })}
              placeholder="5"
              aria-invalid={Boolean(errors.annualQuoteRatePercent)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              % p.a.
            </span>
          </FieldShell>
          {errors.annualQuoteRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.annualQuoteRatePercent}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="cf-rq-period" className={labelClass}>
            Period quote currency interest rate
          </label>
          <FieldShell muted>
            <input
              id="cf-rq-period"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={result?.formattedPeriodQuoteRate ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="cf-base-rate">
        <h3 id="cf-base-rate" className="text-sm font-semibold text-accent">
          Base Currency Interest Rate ({input.baseCurrency})
        </h3>
        <div>
          <label htmlFor="cf-rb" className={labelClass}>
            Annualized base currency interest rate
          </label>
          <FieldShell error={errors.annualBaseRatePercent}>
            <input
              id="cf-rb"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.annualBaseRatePercent}
              onChange={(e) => set({ annualBaseRatePercent: e.target.value })}
              placeholder="3"
              aria-invalid={Boolean(errors.annualBaseRatePercent)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              % p.a.
            </span>
          </FieldShell>
          {errors.annualBaseRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.annualBaseRatePercent}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="cf-rb-period" className={labelClass}>
            Period base currency interest rate
          </label>
          <FieldShell muted>
            <input
              id="cf-rb-period"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={result?.formattedPeriodBaseRate ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="cf-results">
        <h3 id="cf-results" className="text-sm font-semibold text-accent">
          Currency Forward Results
        </h3>
        <div>
          <label htmlFor="cf-spot" className={labelClass}>
            Spot price
            <InfoTooltip
              label="Spot price"
              text="Current exchange rate in quote currency units per one base currency unit."
            />
          </label>
          <FieldShell error={errors.spotRate}>
            <input
              id="cf-spot"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.spotRate}
              onChange={(e) => set({ spotRate: e.target.value })}
              placeholder="1.1000"
              aria-invalid={Boolean(errors.spotRate)}
            />
            <span className="pr-3 text-xs text-muted-foreground" aria-hidden>
              {input.quoteCurrency}/{input.baseCurrency}
            </span>
          </FieldShell>
          {errors.spotRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.spotRate}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="cf-fwd" className={labelClass}>
            Currency forward price
          </label>
          <FieldShell muted>
            <input
              id="cf-fwd"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={result?.formattedForwardRate ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </section>

      <details className="rounded-xl border border-border bg-muted/10 p-3 sm:p-4">
        <summary className="cursor-pointer text-sm font-semibold text-accent">
          Optional notional &amp; settlement scenario
        </summary>
        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="cf-notional" className={labelClass}>
              Base currency notional
            </label>
            <FieldShell error={errors.notionalBase}>
              <input
                id="cf-notional"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.notionalBase}
                onChange={(e) => set({ notionalBase: e.target.value })}
                placeholder="1,000,000"
              />
              <span className="pr-3 text-xs text-muted-foreground" aria-hidden>
                {input.baseCurrency}
              </span>
            </FieldShell>
            {errors.notionalBase ? (
              <p className="mt-1 text-xs text-rose-600">{errors.notionalBase}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="cf-st" className={labelClass}>
              Assumed future spot (settlement)
            </label>
            <FieldShell error={errors.futureSpotRate}>
              <input
                id="cf-st"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.futureSpotRate}
                onChange={(e) => set({ futureSpotRate: e.target.value })}
                placeholder="1.1200"
              />
            </FieldShell>
            {errors.futureSpotRate ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.futureSpotRate}
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
 Scenario only; not a forecast. Payoff uses long/short base.
              </p>
            )}
          </div>
          <fieldset className="flex flex-wrap gap-3 text-xs">
            <legend className="sr-only">Forward position</legend>
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                checked={input.longBase}
                onChange={() => set({ longBase: true })}
              />
              Long base ({input.baseCurrency})
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="radio"
                checked={!input.longBase}
                onChange={() => set({ longBase: false })}
              />
              Short base
            </label>
          </fieldset>
        </div>
      </details>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
