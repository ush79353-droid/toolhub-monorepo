'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatSgrMoney, formatSgrPercent } from './calculation';
import type {
  SustainableGrowthRateFieldErrors,
  SustainableGrowthRateInput,
  SustainableGrowthRateResult,
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

interface SustainableGrowthRateFormProps {
  input: SustainableGrowthRateInput;
  errors: SustainableGrowthRateFieldErrors;
  result: SustainableGrowthRateResult | null;
  onChange: (input: SustainableGrowthRateInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function SustainableGrowthRateForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: SustainableGrowthRateFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<SustainableGrowthRateInput>) =>
    onChange({ ...input, ...patch });
  const isDirect = input.mode === 'direct';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        SGR = ROE × retention ratio. Build from net income, dividends, and
 equity, or enter ROE and retention directly.
      </p>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => set({ mode: 'build' })}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
            !isDirect
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-accent hover:bg-muted/30'
          }`}
        >
          Build from statements
        </button>
        <button
          type="button"
          onClick={() => set({ mode: 'direct' })}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
            isDirect
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-white text-accent hover:bg-muted/30'
          }`}
        >
          Direct ROE × retention
        </button>
      </div>

      {!isDirect ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[13px] font-medium text-accent">Currency</span>
            <CurrencySelect
              id="sgr-currency"
              value={input.currency}
              onChange={onCurrencyChange}
              aria-label="Currency for SGR monetary inputs"
            />
          </div>
          <p className="text-xs text-muted-foreground">
 Money fields share one currency and scale (denomination only; no
            FX).
          </p>
        </>
      ) : null}

      <p className="text-xs">
        <a
          href="#what-is"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          What is sustainable growth rate?
        </a>
      </p>

      {isDirect ? (
        <details open className={`group ${sectionClass}`}>
          <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
            <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
            Direct inputs
          </summary>
          <div className="mt-3.5 space-y-3.5">
            <div>
              <label htmlFor="sgr-roe-direct" className={labelClass}>
                Return on equity (ROE)
              </label>
              <FieldShell error={errors.roePercent}>
                <input
                  id="sgr-roe-direct"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.roePercent}
                  onChange={(e) => set({ roePercent: e.target.value })}
                  placeholder="18"
                  aria-invalid={Boolean(errors.roePercent)}
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  %
                </span>
              </FieldShell>
              {errors.roePercent ? (
                <p className="mt-1 text-xs text-rose-600">{errors.roePercent}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="sgr-ret-direct" className={labelClass}>
                Retention ratio
              </label>
              <FieldShell error={errors.retentionPercent}>
                <input
                  id="sgr-ret-direct"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.retentionPercent}
                  onChange={(e) => set({ retentionPercent: e.target.value })}
                  placeholder="60"
                  aria-invalid={Boolean(errors.retentionPercent)}
                />
                <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
                  %
                </span>
              </FieldShell>
              {errors.retentionPercent ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.retentionPercent}
                </p>
              ) : null}
            </div>
          </div>
        </details>
      ) : (
        <>
          <details open className={`group ${sectionClass}`}>
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
              <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
              Retention ratio
            </summary>
            <div className="mt-3.5 space-y-3.5">
              <div>
                <label htmlFor="sgr-ni" className={labelClass}>
                  Net income
                  <InfoTooltip
                    label="Net income"
                    text="Net income is the company's profit after expenses, interest, and taxes. It is used to calculate the portion of earnings retained and the return generated on shareholders' equity."
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
                    id="sgr-ni"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.netIncome}
                    onChange={(e) => set({ netIncome: e.target.value })}
                    placeholder="2,000,000"
                    aria-invalid={Boolean(errors.netIncome)}
                  />
                </FieldShell>
                {errors.netIncome ? (
                  <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="sgr-div" className={labelClass}>
                  Dividends paid
                  <InfoTooltip
                    label="Dividends paid"
                    text="Dividends paid represent the total earnings distributed to shareholders during the same financial period as net income."
                  />
                </label>
                <FieldShell error={errors.dividendsPaid}>
                  <span
                    className="pl-3 text-sm text-muted-foreground"
                    aria-hidden
                  >
                    {symbol}
                  </span>
                  <input
                    id="sgr-div"
                    type="text"
                    inputMode="decimal"
                    className={inputClass}
                    value={input.dividendsPaid}
                    onChange={(e) => set({ dividendsPaid: e.target.value })}
                    placeholder="1,000,000"
                    aria-invalid={Boolean(errors.dividendsPaid)}
                  />
                </FieldShell>
                {errors.dividendsPaid ? (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.dividendsPaid}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="sgr-retention" className={labelClass}>
                  Retention ratio
                </label>
                <FieldShell muted>
                  <input
                    id="sgr-retention"
                    type="text"
                    readOnly
                    tabIndex={-1}
                    className={`${inputClass} cursor-default font-semibold text-accent`}
                    value={
                      result && !result.usedDirectInputs
                        ? formatSgrPercent(result.retentionRatioPercent)
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
              Return on equity (ROE)
            </summary>
            <div className="mt-3.5 space-y-3.5">
              <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                  checked={input.useAverageEquity}
                  onChange={(e) => set({ useAverageEquity: e.target.checked })}
                />
                <span>Use average shareholders&apos; equity</span>
              </label>

              {!input.useAverageEquity ? (
                <div>
                  <label htmlFor="sgr-equity" className={labelClass}>
                    Total shareholders&apos; equity
                    <InfoTooltip
                      label="Shareholders' equity"
                      text="Shareholders' equity represents the residual interest in the company's assets after deducting its liabilities. It is used as the capital base for the return on equity calculation."
                    />
                  </label>
                  <FieldShell error={errors.shareholdersEquity}>
                    <span
                      className="pl-3 text-sm text-muted-foreground"
                      aria-hidden
                    >
                      {symbol}
                    </span>
                    <input
                      id="sgr-equity"
                      type="text"
                      inputMode="decimal"
                      className={inputClass}
                      value={input.shareholdersEquity}
                      onChange={(e) =>
                        set({ shareholdersEquity: e.target.value })
                      }
                      placeholder="10,000,000"
                      aria-invalid={Boolean(errors.shareholdersEquity)}
                    />
                  </FieldShell>
                  {errors.shareholdersEquity ? (
                    <p className="mt-1 text-xs text-rose-600">
                      {errors.shareholdersEquity}
                    </p>
                  ) : null}
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="sgr-begin" className={labelClass}>
                      Beginning equity
                    </label>
                    <FieldShell error={errors.beginningEquity}>
                      <span
                        className="pl-3 text-sm text-muted-foreground"
                        aria-hidden
                      >
                        {symbol}
                      </span>
                      <input
                        id="sgr-begin"
                        type="text"
                        inputMode="decimal"
                        className={inputClass}
                        value={input.beginningEquity}
                        onChange={(e) =>
                          set({ beginningEquity: e.target.value })
                        }
                        placeholder="9,000,000"
                        aria-invalid={Boolean(errors.beginningEquity)}
                      />
                    </FieldShell>
                    {errors.beginningEquity ? (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.beginningEquity}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="sgr-end" className={labelClass}>
                      Ending equity
                    </label>
                    <FieldShell error={errors.endingEquity}>
                      <span
                        className="pl-3 text-sm text-muted-foreground"
                        aria-hidden
                      >
                        {symbol}
                      </span>
                      <input
                        id="sgr-end"
                        type="text"
                        inputMode="decimal"
                        className={inputClass}
                        value={input.endingEquity}
                        onChange={(e) => set({ endingEquity: e.target.value })}
                        placeholder="11,000,000"
                        aria-invalid={Boolean(errors.endingEquity)}
                      />
                    </FieldShell>
                    {errors.endingEquity ? (
                      <p className="mt-1 text-xs text-rose-600">
                        {errors.endingEquity}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="sgr-avg" className={labelClass}>
                      Average equity
                    </label>
                    <FieldShell muted>
                      <span
                        className="pl-3 text-sm text-muted-foreground"
                        aria-hidden
                      >
                        {symbol}
                      </span>
                      <input
                        id="sgr-avg"
                        type="text"
                        readOnly
                        tabIndex={-1}
                        className={`${inputClass} cursor-default font-semibold text-accent`}
                        value={
                          result?.usedAverageEquity && result.equityBase != null
                            ? formatSgrMoney(result.equityBase, input.currency)
                            : ''
                        }
                        placeholder="—"
                        aria-readonly="true"
                      />
                    </FieldShell>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="sgr-roe" className={labelClass}>
                  ROE
                </label>
                <FieldShell muted>
                  <input
                    id="sgr-roe"
                    type="text"
                    readOnly
                    tabIndex={-1}
                    className={`${inputClass} cursor-default font-semibold text-accent`}
                    value={
                      result && !result.usedDirectInputs
                        ? formatSgrPercent(result.returnOnEquityPercent)
                        : ''
                    }
                    placeholder="—"
                    aria-readonly="true"
                  />
                </FieldShell>
              </div>
            </div>
          </details>
        </>
      )}

      <details open className={`group ${sectionClass}`}>
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <ChevronDown className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
          Sustainable growth rate (SGR)
        </summary>
        <div className="mt-3.5">
          <label htmlFor="sgr-result" className={labelClass}>
            SGR
          </label>
          <FieldShell muted>
            <input
              id="sgr-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={
                result != null
                  ? formatSgrPercent(result.sustainableGrowthRatePercent)
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
