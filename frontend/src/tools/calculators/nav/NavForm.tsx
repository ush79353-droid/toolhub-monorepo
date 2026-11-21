'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatNavMoney } from './calculation';
import type { NavFieldErrors, NavInput, NavResult } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

function MoneyInput({
  id,
  label,
  tip,
  value,
  error,
  placeholder,
  symbol,
  onChange,
}: {
  id: string;
  label: string;
  tip: string;
  value: string;
  error?: string;
  placeholder: string;
  symbol: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <FieldShell error={error}>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />
      </FieldShell>
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function ReadonlyMoney({
  id,
  label,
  value,
  symbol,
  currency,
}: {
  id: string;
  label: string;
  value: number | null;
  symbol: string;
  currency: SupportedCurrency;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <FieldShell muted>
        <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          readOnly
          tabIndex={-1}
          className={`${inputClass} cursor-default font-semibold text-accent`}
          value={value === null ? '' : formatNavMoney(value, currency)}
          placeholder="—"
          aria-readonly="true"
          aria-label={
            value === null
              ? `${label} unavailable`
              : `${label} ${symbol}${formatNavMoney(value, currency)}`
          }
        />
      </FieldShell>
    </div>
  );
}

interface NavFormProps {
  input: NavInput;
  errors: NavFieldErrors;
  result: NavResult | null;
  onChange: (input: NavInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function NavForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: NavFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<NavInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        NAV = fund assets − fund liabilities. NAV per share = NAV ÷ outstanding
        shares. Enter nonnegative amounts; blank shares leave per-share empty.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="nav-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for NAV amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Money fields share one currency and scale (denomination only; no FX).
      </p>
      <p className="text-xs">
        <a
          href="#nav-formula"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          NAV formula
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Fund assets
        </legend>
        <MoneyInput
          id="nav-iv"
          label="Total investment value"
          tip="Market value of the fund's investment holdings."
          value={input.totalInvestmentValue}
          error={errors.totalInvestmentValue}
          placeholder="1,500,000"
          symbol={symbol}
          onChange={(v) => set({ totalInvestmentValue: v })}
        />
        <MoneyInput
          id="nav-cash"
          label="Cash and cash equivalents"
          tip="Cash and highly liquid short-term assets held by the fund."
          value={input.cashAndCashEquivalents}
          error={errors.cashAndCashEquivalents}
          placeholder="250,000"
          symbol={symbol}
          onChange={(v) => set({ cashAndCashEquivalents: v })}
        />
        <MoneyInput
          id="nav-ar"
          label="Accounts receivable"
          tip="Amounts owed to the fund that are included in this simplified asset total."
          value={input.accountsReceivable}
          error={errors.accountsReceivable}
          placeholder="50,000"
          symbol={symbol}
          onChange={(v) => set({ accountsReceivable: v })}
        />
        <ReadonlyMoney
          id="nav-fa"
          label="Fund assets"
          value={result ? result.fundAssets : null}
          symbol={symbol}
          currency={input.currency}
        />
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Fund liabilities
        </legend>
        <MoneyInput
          id="nav-stl"
          label="Short-term liabilities"
          tip="Obligations due in the near term, such as accrued expenses or payables."
          value={input.shortTermLiabilities}
          error={errors.shortTermLiabilities}
          placeholder="50,000"
          symbol={symbol}
          onChange={(v) => set({ shortTermLiabilities: v })}
        />
        <MoneyInput
          id="nav-ltl"
          label="Long-term liabilities"
          tip="Longer-dated fund obligations included in this simplified liability total."
          value={input.longTermLiabilities}
          error={errors.longTermLiabilities}
          placeholder="20,000"
          symbol={symbol}
          onChange={(v) => set({ longTermLiabilities: v })}
        />
        <ReadonlyMoney
          id="nav-fl"
          label="Fund liabilities"
          value={result ? result.fundLiabilities : null}
          symbol={symbol}
          currency={input.currency}
        />
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          NAV and NAV per share
        </legend>
        <ReadonlyMoney
          id="nav-total"
          label="Net asset value (NAV)"
          value={result ? result.netAssetValue : null}
          symbol={symbol}
          currency={input.currency}
        />
        <div>
          <label htmlFor="nav-shares" className={labelClass}>
            Number of shares outstanding
            <InfoTooltip
              label="Outstanding shares"
              text="Fund shares currently outstanding. Must be greater than zero to compute NAV per share."
            />
          </label>
          <FieldShell error={errors.outstandingShares}>
            <input
              id="nav-shares"
              type="text"
              inputMode="numeric"
              className={inputClass}
              value={input.outstandingShares}
              onChange={(e) => set({ outstandingShares: e.target.value })}
              placeholder="100,000"
              aria-invalid={Boolean(errors.outstandingShares)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              shares
            </span>
          </FieldShell>
          {errors.outstandingShares ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.outstandingShares}
            </p>
          ) : null}
        </div>
        <ReadonlyMoney
          id="nav-per-share"
          label="Net asset value per share"
          value={result?.navPerShare ?? null}
          symbol={symbol}
          currency={input.currency}
        />
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
