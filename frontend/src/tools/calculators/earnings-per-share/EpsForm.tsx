'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { EpsFieldErrors, EpsInput } from './types';

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

interface EpsFormProps {
  input: EpsInput;
  errors: EpsFieldErrors;
  onChange: (input: EpsInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function EpsForm({
  input,
  errors,
  onChange,
  onCurrencyChange,
}: EpsFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Basic EPS = (Net income − Preferred dividends) ÷ Weighted-average
        common shares outstanding.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="eps-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for EPS amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Money fields share one currency label (denomination only — no FX).
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to calculate earnings per share
        </a>
      </p>

      <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <legend className="px-1 text-[13px] font-semibold text-accent">
          Earnings per share inputs
        </legend>

        <div>
          <label htmlFor="eps-ni" className={labelClass}>
            Net income
            <InfoTooltip
              label="Net income"
              text="Net income is a company's profit after expenses, interest, and taxes."
            />
          </label>
          <FieldShell error={errors.netIncome}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="eps-ni"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.netIncome}
              onChange={(e) =>
                onChange({ ...input, netIncome: e.target.value })
              }
              placeholder="13,120,000,000"
              aria-invalid={Boolean(errors.netIncome)}
            />
          </FieldShell>
          {errors.netIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="eps-pref" className={labelClass}>
            Preferred dividends
            <InfoTooltip
              label="Preferred dividends"
              text="Preferred dividends are deducted from net income before calculating earnings available to common shareholders."
            />
          </label>
          <FieldShell error={errors.preferredDividends}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="eps-pref"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.preferredDividends}
              onChange={(e) =>
                onChange({ ...input, preferredDividends: e.target.value })
              }
              placeholder="0"
              aria-invalid={Boolean(errors.preferredDividends)}
            />
          </FieldShell>
          {errors.preferredDividends ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.preferredDividends}
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Use 0 when there are no preferred shares.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="eps-shares" className={labelClass}>
            Common shares
            <InfoTooltip
              label="Common shares"
              text="Enter the weighted-average number of common shares outstanding during the reporting period."
            />
          </label>
          <FieldShell error={errors.commonShares}>
            <input
              id="eps-shares"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.commonShares}
              onChange={(e) =>
                onChange({ ...input, commonShares: e.target.value })
              }
              placeholder="333,400,000"
              aria-invalid={Boolean(errors.commonShares)}
            />
            <span className="pr-3 text-xs text-muted-foreground" aria-hidden>
              Shares
            </span>
          </FieldShell>
          {errors.commonShares ? (
            <p className="mt-1 text-xs text-rose-600">{errors.commonShares}</p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Weighted-average common shares outstanding (not ending shares).
            </p>
          )}
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
