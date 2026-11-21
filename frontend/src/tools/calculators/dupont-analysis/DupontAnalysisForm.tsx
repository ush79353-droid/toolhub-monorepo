'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { DupontFieldErrors, DupontInput } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border focus-within:ring-2 focus-within:ring-ring border-border bg-white ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface DupontAnalysisFormProps {
  input: DupontInput;
  errors: DupontFieldErrors;
  onChange: (input: DupontInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function DupontAnalysisForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: DupontAnalysisFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Enter sales, net income, total assets, and total equity. The calculator
        decomposes ROE into net profit margin × asset turnover × financial
        leverage (three-factor DuPont).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="da-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for DuPont amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (denomination only — no FX).
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate ROE using DuPont analysis
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          DuPont analysis inputs
        </legend>

        <div>
          <label htmlFor="da-sales" className={labelClass}>
            Sales
            <InfoTooltip
              label="Sales"
              text="Total sales revenue for the period (must be greater than zero)."
            />
          </label>
          <FieldShell error={errors.sales}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="da-sales"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sales}
              onChange={(e) => onChange({ ...input, sales: e.target.value })}
              placeholder="1,000,000"
              aria-invalid={Boolean(errors.sales)}
            />
          </FieldShell>
          {errors.sales ? (
            <p className="mt-1 text-xs text-rose-600">{errors.sales}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="da-ni" className={labelClass}>
            Net income
            <InfoTooltip
              label="Net income"
              text="Profit after expenses, interest, and taxes. Negative values represent a net loss."
            />
          </label>
          <FieldShell error={errors.netIncome}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="da-ni"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.netIncome}
              onChange={(e) =>
                onChange({ ...input, netIncome: e.target.value })
              }
              placeholder="120,000"
              aria-invalid={Boolean(errors.netIncome)}
            />
          </FieldShell>
          {errors.netIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="da-assets" className={labelClass}>
            Total assets
            <InfoTooltip
              label="Total assets"
              text="Book value of all assets (must be greater than zero)."
            />
          </label>
          <FieldShell error={errors.totalAssets}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="da-assets"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.totalAssets}
              onChange={(e) =>
                onChange({ ...input, totalAssets: e.target.value })
              }
              placeholder="800,000"
              aria-invalid={Boolean(errors.totalAssets)}
            />
          </FieldShell>
          {errors.totalAssets ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalAssets}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="da-equity" className={labelClass}>
            Total equity
            <InfoTooltip
              label="Total equity"
              text="Shareholders' equity. Cannot be zero. Negative equity is allowed with a caution."
            />
          </label>
          <FieldShell error={errors.totalEquity}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="da-equity"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.totalEquity}
              onChange={(e) =>
                onChange({ ...input, totalEquity: e.target.value })
              }
              placeholder="400,000"
              aria-invalid={Boolean(errors.totalEquity)}
            />
          </FieldShell>
          {errors.totalEquity ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalEquity}</p>
          ) : null}
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
