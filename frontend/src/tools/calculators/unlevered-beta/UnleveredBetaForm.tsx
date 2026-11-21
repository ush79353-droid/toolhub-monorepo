'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  formatUbBeta,
  formatUbPercent,
  formatUbRatio,
} from './calculation';
import type {
  UnleveredBetaFieldErrors,
  UnleveredBetaInput,
  UnleveredBetaResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const sectionClass =
  'space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

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

interface UnleveredBetaFormProps {
  input: UnleveredBetaInput;
  errors: UnleveredBetaFieldErrors;
  result: UnleveredBetaResult | null;
  onChange: (input: UnleveredBetaInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function UnleveredBetaForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: UnleveredBetaFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<UnleveredBetaInput>) =>
    onChange({ ...input, ...patch });
  const calculatedTax = input.taxRateMode === 'calculated';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        βU = βL ÷ [1 + (1 − T) × (D/E)]. Estimate T from income or enter it
        manually; D/E from debt and equity.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="ub-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for unlevered beta monetary inputs"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Money fields share one currency and scale (denomination only — no FX).
      </p>
      <p className="text-xs">
        <a
          href="#what-is"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is unlevered beta?
        </a>
      </p>

      <details open className={`group ${sectionClass}`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
          Corporate tax rate
        </summary>
        <div className="mt-3.5 space-y-3.5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => set({ taxRateMode: 'calculated' })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                calculatedTax
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
            >
              Estimate from income
            </button>
            <button
              type="button"
              onClick={() => set({ taxRateMode: 'manual' })}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                !calculatedTax
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-white text-accent hover:bg-muted/30'
              }`}
            >
              Enter tax rate
            </button>
          </div>

          {calculatedTax ? (
            <>
              <div>
                <label htmlFor="ub-ni" className={labelClass}>
                  Net income
                  <InfoTooltip
                    label="Net income"
                    text="Net income represents a company's profit after taxes and other recognized expenses for the selected financial period."
                  />
                </label>
                <FieldShell error={errors.netIncome}>
                  <span
                    className="pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {symbol}
                  </span>
                  <input
                    id="ub-ni"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.netIncome}
                    onChange={(e) => set({ netIncome: e.target.value })}
                    placeholder="80,000"
                    aria-invalid={Boolean(errors.netIncome)}
                  />
                </FieldShell>
                {errors.netIncome ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="ub-pre" className={labelClass}>
                  Pre-tax income
                  <InfoTooltip
                    label="Pre-tax income"
                    text="Pre-tax income is earnings before income taxes. Together with net income, it can be used to estimate the company's effective income tax rate."
                  />
                </label>
                <FieldShell error={errors.preTaxIncome}>
                  <span
                    className="pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {symbol}
                  </span>
                  <input
                    id="ub-pre"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.preTaxIncome}
                    onChange={(e) => set({ preTaxIncome: e.target.value })}
                    placeholder="100,000"
                    aria-invalid={Boolean(errors.preTaxIncome)}
                  />
                </FieldShell>
                {errors.preTaxIncome ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.preTaxIncome}
                  </p>
                ) : null}
              </div>
            </>
          ) : (
            <div>
              <label htmlFor="ub-tax-manual" className={labelClass}>
                Corporate tax rate (manual)
                <InfoTooltip
                  label="Corporate tax rate"
                  text="Enter a statutory, marginal, or normalized tax rate for the Hamada unlevering formula when you prefer not to estimate an effective rate from accounting income."
                />
              </label>
              <FieldShell error={errors.manualTaxRate}>
                <input
                  id="ub-tax-manual"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.manualTaxRate}
                  onChange={(e) => set({ manualTaxRate: e.target.value })}
                  placeholder="20"
                  aria-invalid={Boolean(errors.manualTaxRate)}
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  %
                </span>
              </FieldShell>
              {errors.manualTaxRate ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.manualTaxRate}
                </p>
              ) : null}
            </div>
          )}

          <div>
            <label htmlFor="ub-tax" className={labelClass}>
              Corporate tax rate
            </label>
            <FieldShell muted>
              <input
                id="ub-tax"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold text-accent`}
                value={
                  result ? formatUbPercent(result.corporateTaxRatePercent) : ''
                }
                placeholder="—"
                aria-readonly="true"
              />
            </FieldShell>
          </div>
        </div>
      </details>

      <details open className={`group ${sectionClass}`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
          Debt-to-equity ratio
        </summary>
        <div className="mt-3.5 space-y-3.5">
          <div>
            <label htmlFor="ub-debt" className={labelClass}>
              Total debt
              <InfoTooltip
                label="Total debt"
                text="Total debt represents interest-bearing borrowings, commonly including short-term and long-term debt. Use a debt definition consistent with the valuation model."
              />
            </label>
            <FieldShell error={errors.totalDebt}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="ub-debt"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.totalDebt}
                onChange={(e) => set({ totalDebt: e.target.value })}
                placeholder="2,000,000"
                aria-invalid={Boolean(errors.totalDebt)}
              />
            </FieldShell>
            {errors.totalDebt ? (
              <p className="mt-1 text-xs text-rose-600">{errors.totalDebt}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ub-equity" className={labelClass}>
              Total shareholders&apos; equity
              <InfoTooltip
                label="Shareholders' equity"
                text="Shareholders' equity represents the residual interest in a company's assets after deducting liabilities. The debt and equity values should be measured on a consistent basis."
              />
            </label>
            <FieldShell error={errors.shareholdersEquity}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="ub-equity"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.shareholdersEquity}
                onChange={(e) => set({ shareholdersEquity: e.target.value })}
                placeholder="1,000,000"
                aria-invalid={Boolean(errors.shareholdersEquity)}
              />
            </FieldShell>
            {errors.shareholdersEquity ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.shareholdersEquity}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ub-de" className={labelClass}>
              Debt-to-equity ratio
            </label>
            <FieldShell muted>
              <input
                id="ub-de"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold text-accent`}
                value={
                  result ? formatUbRatio(result.debtToEquityRatio) : ''
                }
                placeholder="—"
                aria-readonly="true"
              />
            </FieldShell>
          </div>
        </div>
      </details>

      <details open className={`group ${sectionClass}`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
          Unlevered beta
        </summary>
        <div className="mt-3.5 space-y-3.5">
          <div>
            <label htmlFor="ub-bl" className={labelClass}>
              Levered beta (equity beta)
              <InfoTooltip
                label="Levered beta"
                text="Levered beta measures a company's equity return sensitivity to market movements, incorporating the effects of its financial leverage."
              />
            </label>
            <FieldShell error={errors.leveredBeta}>
              <input
                id="ub-bl"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.leveredBeta}
                onChange={(e) => set({ leveredBeta: e.target.value })}
                placeholder="1.20"
                aria-invalid={Boolean(errors.leveredBeta)}
              />
            </FieldShell>
            {errors.leveredBeta ? (
              <p className="mt-1 text-xs text-rose-600">{errors.leveredBeta}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="ub-bu" className={labelClass}>
              Unlevered beta
            </label>
            <FieldShell muted>
              <input
                id="ub-bu"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold text-accent`}
                value={
                  result != null ? formatUbBeta(result.unleveredBeta) : ''
                }
                placeholder="—"
                aria-readonly="true"
              />
            </FieldShell>
          </div>
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
