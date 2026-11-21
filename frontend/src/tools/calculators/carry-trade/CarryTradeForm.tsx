'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { QUOTE_CONVENTION_NOTE } from './calculation';
import type {
  CarryTradeFieldErrors,
  CarryTradeInput,
  CarryTradeResult,
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

interface CarryTradeFormProps {
  input: CarryTradeInput;
  errors: CarryTradeFieldErrors;
  result: CarryTradeResult | null;
  onChange: (input: CarryTradeInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
  onLoadExample: () => void;
}

export function CarryTradeForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadExample,
}: CarryTradeFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<CarryTradeInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        {QUOTE_CONVENTION_NOTE}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">
          Funding currency
        </span>
        <CurrencySelect
          id="ct-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Funding currency for amount and profit"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amount and profit share one funding-currency denomination (labels only —
        no live FX conversion). Exchange rates are entered manually.
      </p>
      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load illustrative example
        </button>
        {' · '}
        <a
          href="#what-is"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is a carry trade?
        </a>
      </p>

      <section className={sectionClass} aria-labelledby="ct-spot-heading">
        <h3
          id="ct-spot-heading"
          className="text-sm font-semibold text-accent"
        >
          Spot Rate Differential
        </h3>
        <div>
          <label htmlFor="ct-s0" className={labelClass}>
            Initial Exchange Rate
            <InfoTooltip
              label="Initial Exchange Rate"
              text="The exchange rate at which the investor initially converts borrowed money into the investment currency."
            />
          </label>
          <FieldShell error={errors.initialExchangeRate}>
            <input
              id="ct-s0"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.initialExchangeRate}
              onChange={(e) => set({ initialExchangeRate: e.target.value })}
              placeholder="0.85"
              aria-invalid={Boolean(errors.initialExchangeRate)}
            />
          </FieldShell>
          {errors.initialExchangeRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.initialExchangeRate}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="ct-s1" className={labelClass}>
            Settlement Exchange Rate
            <InfoTooltip
              label="Settlement Exchange Rate"
              text="The exchange rate at which the invested funds are converted back into the original funding currency when the trade closes."
            />
          </label>
          <FieldShell error={errors.settlementExchangeRate}>
            <input
              id="ct-s1"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.settlementExchangeRate}
              onChange={(e) => set({ settlementExchangeRate: e.target.value })}
              placeholder="0.83"
              aria-invalid={Boolean(errors.settlementExchangeRate)}
            />
          </FieldShell>
          {errors.settlementExchangeRate ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.settlementExchangeRate}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="ct-spot-out" className={labelClass}>
            Spot Rate Differential
            <InfoTooltip
              label="Spot Rate Differential"
              text="The percentage change in the currency conversion value between the opening and closing exchange rates."
            />
          </label>
          <FieldShell muted>
            <input
              id="ct-spot-out"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={result?.formattedSpotRateDifferential ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          </FieldShell>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="ct-return-heading">
        <h3
          id="ct-return-heading"
          className="text-sm font-semibold text-accent"
        >
          Investment Return
        </h3>
        <div>
          <label htmlFor="ct-days" className={labelClass}>
            Days Until Trade Settles
          </label>
          <FieldShell error={errors.days}>
            <input
              id="ct-days"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.days}
              onChange={(e) => set({ days: e.target.value })}
              placeholder="180"
              aria-invalid={Boolean(errors.days)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              days
            </span>
          </FieldShell>
          {errors.days ? (
            <p className="mt-1 text-xs text-rose-600">{errors.days}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="ct-basis" className={labelClass}>
            Day-Count Basis
            <InfoTooltip
              label="Day-Count Basis"
              text="Simple-interest period fraction uses D÷B. Money-market conventions differ; choose 365 or 360 explicitly. Compounding is not applied."
            />
          </label>
          <FieldShell error={errors.dayCountBasis}>
            <select
              id="ct-basis"
              className={`${inputClass} appearance-none`}
              value={String(input.dayCountBasis)}
              onChange={(e) =>
                set({
                  dayCountBasis: Number(e.target.value) as DayCountBasis,
                })
              }
            >
              <option value="365">365 days</option>
              <option value="360">360 days</option>
            </select>
          </FieldShell>
        </div>
        <div>
          <label htmlFor="ct-lend" className={labelClass}>
            Lending Rate
            <InfoTooltip
              label="Lending Rate"
              text="The annual interest rate earned on the investment currency."
            />
          </label>
          <FieldShell error={errors.lendingRatePercent}>
            <input
              id="ct-lend"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.lendingRatePercent}
              onChange={(e) => set({ lendingRatePercent: e.target.value })}
              placeholder="6"
              aria-invalid={Boolean(errors.lendingRatePercent)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              % p.a.
            </span>
          </FieldShell>
          {errors.lendingRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.lendingRatePercent}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="ct-borrow" className={labelClass}>
            Borrowing Rate
            <InfoTooltip
              label="Borrowing Rate"
              text="The annual interest rate charged on the borrowed funding currency."
            />
          </label>
          <FieldShell error={errors.borrowingRatePercent}>
            <input
              id="ct-borrow"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.borrowingRatePercent}
              onChange={(e) => set({ borrowingRatePercent: e.target.value })}
              placeholder="2"
              aria-invalid={Boolean(errors.borrowingRatePercent)}
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              % p.a.
            </span>
          </FieldShell>
          {errors.borrowingRatePercent ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.borrowingRatePercent}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="ct-invest-return" className={labelClass}>
            Investment Return
            <InfoTooltip
              label="Investment Return"
              text="Net simple-interest differential for the holding period: lending-period return minus borrowing-period cost (Rl − Rb)."
            />
          </label>
          <FieldShell muted>
            <input
              id="ct-invest-return"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={result?.formattedNetInterestDifferential ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="ct-profit-heading">
        <h3
          id="ct-profit-heading"
          className="text-sm font-semibold text-accent"
        >
          Carry Trade Profit
        </h3>
        <div>
          <label htmlFor="ct-amount" className={labelClass}>
            Amount Invested
            <InfoTooltip
              label="Amount Invested"
              text="The amount borrowed and converted into the investment currency at the beginning of the carry trade."
            />
          </label>
          <FieldShell error={errors.amountInvested}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ct-amount"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.amountInvested}
              onChange={(e) => set({ amountInvested: e.target.value })}
              placeholder="5,000"
              aria-invalid={Boolean(errors.amountInvested)}
            />
          </FieldShell>
          {errors.amountInvested ? (
            <p className="mt-1 text-xs text-rose-600">{errors.amountInvested}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor="ct-profit" className={labelClass}>
            Carry Trade Profit
          </label>
          <FieldShell muted>
            <input
              id="ct-profit"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={result?.formattedCarryTradeProfit ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </section>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
