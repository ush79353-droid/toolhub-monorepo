'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatRoicMoney, formatRoicPercent } from './calculation';
import type { RoicFieldErrors, RoicInput, RoicResult } from './types';

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

interface RoicFormProps {
  input: RoicInput;
  errors: RoicFieldErrors;
  result: RoicResult | null;
  onChange: (input: RoicInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function RoicForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: RoicFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<RoicInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        ROIC = NOPAT ÷ invested capital × 100. NOPAT = EBIT × (1 − tax rate).
        Invested capital ≈ equity + interest-bearing debt (simplified).
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="roic-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for ROIC monetary inputs"
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
          What is return on invested capital?
        </a>
      </p>

      <details open className={`group ${sectionClass}`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
          Net Income / NOPAT
        </summary>
        <div className="mt-3.5 space-y-3.5">
          <div>
            <label htmlFor="roic-ebit" className={labelClass}>
              EBIT
              <InfoTooltip
                label="EBIT"
                text="EBIT represents operating earnings before interest expenses and income taxes. It is commonly used as the starting point for calculating NOPAT."
              />
            </label>
            <FieldShell error={errors.ebit}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="roic-ebit"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.ebit}
                onChange={(e) => set({ ebit: e.target.value })}
                placeholder="500,000"
                aria-invalid={Boolean(errors.ebit)}
              />
            </FieldShell>
            {errors.ebit ? (
              <p className="mt-1 text-xs text-rose-600">{errors.ebit}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="roic-tax" className={labelClass}>
              Tax rate
              <InfoTooltip
                label="Tax rate"
                text="The assumed tax rate applied to EBIT to estimate net operating profit after taxes. Use an appropriate normalized or marginal operating tax rate when evaluating sustainable ROIC."
              />
            </label>
            <FieldShell error={errors.taxRate}>
              <input
                id="roic-tax"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.taxRate}
                onChange={(e) => set({ taxRate: e.target.value })}
                placeholder="25"
                aria-invalid={Boolean(errors.taxRate)}
              />
              <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                %
              </span>
            </FieldShell>
            {errors.taxRate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.taxRate}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="roic-nopat" className={labelClass}>
              NOPAT
              <InfoTooltip
                label="NOPAT"
                text="Net Operating Profit After Taxes = EBIT × (1 − tax rate). It estimates after-tax operating profit before interest expense."
              />
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="roic-nopat"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold text-accent`}
                value={
                  result ? formatRoicMoney(result.nopat, input.currency) : ''
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
          Invested Capital
        </summary>
        <div className="mt-3.5 space-y-3.5">
          <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
              checked={input.useAverageCapital}
              onChange={(e) => set({ useAverageCapital: e.target.checked })}
            />
            <span>Calculate using average invested capital</span>
          </label>

          {!input.useAverageCapital ? (
            <>
              <div>
                <label htmlFor="roic-equity" className={labelClass}>
                  Equity
                  <InfoTooltip
                    label="Equity"
                    text="Equity represents shareholders' capital included in the company's financing structure."
                  />
                </label>
                <FieldShell error={errors.equity}>
                  <span
                    className="pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {symbol}
                  </span>
                  <input
                    id="roic-equity"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.equity}
                    onChange={(e) => set({ equity: e.target.value })}
                    placeholder="1,200,000"
                    aria-invalid={Boolean(errors.equity)}
                  />
                </FieldShell>
                {errors.equity ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.equity}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="roic-debt" className={labelClass}>
                  Debt
                  <InfoTooltip
                    label="Debt"
                    text="Debt represents interest-bearing borrowing included in invested capital, such as relevant short-term and long-term financial debt."
                  />
                </label>
                <FieldShell error={errors.debt}>
                  <span
                    className="pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {symbol}
                  </span>
                  <input
                    id="roic-debt"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.debt}
                    onChange={(e) => set({ debt: e.target.value })}
                    placeholder="800,000"
                    aria-invalid={Boolean(errors.debt)}
                  />
                </FieldShell>
                {errors.debt ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.debt}</p>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="roic-begin" className={labelClass}>
                  Beginning invested capital
                </label>
                <FieldShell error={errors.beginningCapital}>
                  <span
                    className="pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {symbol}
                  </span>
                  <input
                    id="roic-begin"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.beginningCapital}
                    onChange={(e) => set({ beginningCapital: e.target.value })}
                    placeholder="1,800,000"
                    aria-invalid={Boolean(errors.beginningCapital)}
                  />
                </FieldShell>
                {errors.beginningCapital ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.beginningCapital}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="roic-end" className={labelClass}>
                  Ending invested capital
                </label>
                <FieldShell error={errors.endingCapital}>
                  <span
                    className="pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {symbol}
                  </span>
                  <input
                    id="roic-end"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.endingCapital}
                    onChange={(e) => set({ endingCapital: e.target.value })}
                    placeholder="2,200,000"
                    aria-invalid={Boolean(errors.endingCapital)}
                  />
                </FieldShell>
                {errors.endingCapital ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.endingCapital}
                  </p>
                ) : null}
              </div>
            </>
          )}

          <div>
            <label htmlFor="roic-ic" className={labelClass}>
              {input.useAverageCapital
                ? 'Average invested capital'
                : 'Invested capital'}
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="roic-ic"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold text-accent`}
                value={
                  result
                    ? formatRoicMoney(result.investedCapital, input.currency)
                    : ''
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
          Return on Invested Capital
        </summary>
        <div className="mt-3.5">
          <label htmlFor="roic-result" className={labelClass}>
            ROIC
          </label>
          <FieldShell muted>
            <input
              id="roic-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result?.roicPercentage != null
                  ? formatRoicPercent(result.roicPercentage)
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
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
