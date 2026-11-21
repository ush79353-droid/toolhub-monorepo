'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatRiMoney } from './calculation';
import type {
  ResidualIncomeFieldErrors,
  ResidualIncomeInput,
  ResidualIncomeResult,
} from './types';

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

interface ResidualIncomeFormProps {
  input: ResidualIncomeInput;
  errors: ResidualIncomeFieldErrors;
  result: ResidualIncomeResult | null;
  onChange: (input: ResidualIncomeInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function ResidualIncomeForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: ResidualIncomeFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ResidualIncomeInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Residual income = net income − equity charge, where equity charge =
        equity capital × (cost of equity % ÷ 100).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="ri-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for residual income monetary inputs"
        />
      </div>
      <p className="text-xs text-muted-foreground">
 Money fields share one currency and scale (denomination only; no FX).
      </p>
      <p className="text-xs">
        <a
          href="#what-is"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is residual income?
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Equity charge
        </legend>

        <div>
          <label htmlFor="ri-equity" className={labelClass}>
            Equity capital
            <InfoTooltip
              label="Equity capital"
              text="Shareholder equity or book value of equity used for the capital charge. Must be zero or greater."
            />
          </label>
          <FieldShell error={errors.equityCapital}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ri-equity"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.equityCapital}
              onChange={(e) => set({ equityCapital: e.target.value })}
              placeholder="800,000"
              aria-invalid={Boolean(errors.equityCapital)}
            />
          </FieldShell>
          {errors.equityCapital ? (
            <p className="mt-1 text-xs text-rose-600">{errors.equityCapital}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ri-cost" className={labelClass}>
            Cost of equity
            <InfoTooltip
              label="Cost of equity"
              text="Required shareholder return as a percent (e.g. 12 means 12%, not 0.12)."
            />
          </label>
          <FieldShell error={errors.costOfEquity}>
            <input
              id="ri-cost"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.costOfEquity}
              onChange={(e) => set({ costOfEquity: e.target.value })}
              placeholder="10"
              aria-invalid={Boolean(errors.costOfEquity)}
            />
            <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
              %
            </span>
          </FieldShell>
          {errors.costOfEquity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.costOfEquity}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ri-charge" className={labelClass}>
            Equity charge
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ri-charge"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result
                  ? formatRiMoney(result.equityCharge, input.currency)
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </fieldset>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Residual income
        </legend>

        <div>
          <label htmlFor="ri-ni" className={labelClass}>
            Net income
            <InfoTooltip
              label="Net income"
              text="Earnings after expenses, interest, and taxes for the period. Losses may be entered as negative amounts."
            />
          </label>
          <FieldShell error={errors.netIncome}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ri-ni"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.netIncome}
              onChange={(e) => set({ netIncome: e.target.value })}
              placeholder="140,000"
              aria-invalid={Boolean(errors.netIncome)}
            />
          </FieldShell>
          {errors.netIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="ri-result" className={labelClass}>
            Residual income
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="ri-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result
                  ? formatRiMoney(result.residualIncome, input.currency)
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </fieldset>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
