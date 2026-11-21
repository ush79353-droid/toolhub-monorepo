'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatWaccPercent } from './calculation';
import type { WaccFieldErrors, WaccInput, WaccResult } from './types';

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

interface WaccFormProps {
  input: WaccInput;
  errors: WaccFieldErrors;
  result: WaccResult | null;
  onChange: (input: WaccInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function WaccForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: WaccFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<WaccInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        WACC = (E/(E+D))×Re + (D/(E+D))×Rd×(1−T). Enter financing costs as
        percentages; capital amounts share one currency.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="wacc-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for WACC capital inputs"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Equity and debt share one currency and scale (denomination only; no
        FX).
      </p>
      <p className="text-xs">
        <a
          href="#what-is"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is WACC?
        </a>
      </p>

      <div>
        <label htmlFor="wacc-re" className={labelClass}>
          Cost of equity
          <InfoTooltip
            label="Cost of equity"
            text="The cost of equity is the return shareholders require to compensate for the risk of investing in a company's equity."
          />
        </label>
        <FieldShell error={errors.costOfEquity}>
          <input
            id="wacc-re"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.costOfEquity}
            onChange={(e) => set({ costOfEquity: e.target.value })}
            placeholder="15"
            aria-invalid={Boolean(errors.costOfEquity)}
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.costOfEquity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.costOfEquity}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="wacc-equity" className={labelClass}>
          Equity
          <InfoTooltip
            label="Equity"
            text="Enter the market value of the company's equity. For a publicly traded company, market capitalization is commonly used."
          />
        </label>
        <FieldShell error={errors.equity}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="wacc-equity"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.equity}
            onChange={(e) => set({ equity: e.target.value })}
            placeholder="700,000"
            aria-invalid={Boolean(errors.equity)}
          />
        </FieldShell>
        {errors.equity ? (
          <p className="mt-1 text-xs text-rose-600">{errors.equity}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="wacc-rd" className={labelClass}>
          Cost of debt
          <InfoTooltip
            label="Cost of debt"
            text="The cost of debt is the company's pre-tax borrowing cost, preferably based on the current market-required yield on its debt."
          />
        </label>
        <FieldShell error={errors.costOfDebt}>
          <input
            id="wacc-rd"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.costOfDebt}
            onChange={(e) => set({ costOfDebt: e.target.value })}
            placeholder="8"
            aria-invalid={Boolean(errors.costOfDebt)}
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.costOfDebt ? (
          <p className="mt-1 text-xs text-rose-600">{errors.costOfDebt}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="wacc-debt" className={labelClass}>
          Debt
          <InfoTooltip
            label="Debt"
            text="Enter the market value of the company's interest-bearing debt, including relevant short-term and long-term borrowings."
          />
        </label>
        <FieldShell error={errors.debt}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="wacc-debt"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.debt}
            onChange={(e) => set({ debt: e.target.value })}
            placeholder="500,000"
            aria-invalid={Boolean(errors.debt)}
          />
        </FieldShell>
        {errors.debt ? (
          <p className="mt-1 text-xs text-rose-600">{errors.debt}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="wacc-tax" className={labelClass}>
          Corporate tax rate
          <InfoTooltip
            label="Corporate tax rate"
            text="Enter the corporate tax rate applicable to the deductibility of interest expense. The marginal tax rate is commonly used for estimating WACC."
          />
        </label>
        <FieldShell error={errors.corporateTaxRate}>
          <input
            id="wacc-tax"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.corporateTaxRate}
            onChange={(e) => set({ corporateTaxRate: e.target.value })}
            placeholder="20"
            aria-invalid={Boolean(errors.corporateTaxRate)}
          />
          <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
            %
          </span>
        </FieldShell>
        {errors.corporateTaxRate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.corporateTaxRate}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="wacc-result" className={labelClass}>
          WACC
        </label>
        <FieldShell muted>
          <input
            id="wacc-result"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            value={
              result != null ? formatWaccPercent(result.waccPercent) : ''
            }
            placeholder="—"
            aria-readonly="true"
          />
        </FieldShell>
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
