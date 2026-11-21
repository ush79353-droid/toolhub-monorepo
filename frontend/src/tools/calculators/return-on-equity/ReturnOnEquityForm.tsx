'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatRoeMoney, formatRoePercent } from './calculation';
import type {
  ReturnOnEquityFieldErrors,
  ReturnOnEquityInput,
  ReturnOnEquityResult,
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

interface ReturnOnEquityFormProps {
  input: ReturnOnEquityInput;
  errors: ReturnOnEquityFieldErrors;
  result: ReturnOnEquityResult | null;
  onChange: (input: ReturnOnEquityInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function ReturnOnEquityForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: ReturnOnEquityFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ReturnOnEquityInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        ROE = (net profit ÷ shareholders&apos; equity) × 100. Optional average
        equity = (beginning + ending) ÷ 2.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="roe-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for ROE monetary inputs"
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
          What is return on equity?
        </a>
      </p>

      <div>
        <label htmlFor="roe-np" className={labelClass}>
          Net profit
          <InfoTooltip
            label="Net profit"
            text="Net profit, also called net income, is the amount a company earns after deducting all expenses and taxes during a financial period."
          />
        </label>
        <FieldShell error={errors.netProfit}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="roe-np"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.netProfit}
            onChange={(e) => set({ netProfit: e.target.value })}
            placeholder="35,000"
            aria-invalid={Boolean(errors.netProfit)}
          />
        </FieldShell>
        {errors.netProfit ? (
          <p className="mt-1 text-xs text-rose-600">{errors.netProfit}</p>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-[13px] font-medium text-accent">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
          checked={input.useAverageEquity}
          onChange={(e) => set({ useAverageEquity: e.target.checked })}
        />
        <span>Calculate using average shareholders&apos; equity</span>
      </label>

      {!input.useAverageEquity ? (
        <div>
          <label htmlFor="roe-equity" className={labelClass}>
            Equity
            <InfoTooltip
              label="Shareholders' equity"
              text="Shareholders' equity is the difference between a company's total assets and total liabilities. Average shareholders' equity is often used when calculating ROE for a financial period."
            />
          </label>
          <FieldShell error={errors.shareholdersEquity}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="roe-equity"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.shareholdersEquity}
              onChange={(e) => set({ shareholdersEquity: e.target.value })}
              placeholder="450,000"
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
        <div className="space-y-3.5 rounded-lg border border-border bg-muted/15 p-3">
          <div>
            <label htmlFor="roe-begin" className={labelClass}>
              Beginning shareholders&apos; equity
            </label>
            <FieldShell error={errors.beginningEquity}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="roe-begin"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.beginningEquity}
                onChange={(e) => set({ beginningEquity: e.target.value })}
                placeholder="400,000"
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
            <label htmlFor="roe-end" className={labelClass}>
              Ending shareholders&apos; equity
            </label>
            <FieldShell error={errors.endingEquity}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="roe-end"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.endingEquity}
                onChange={(e) => set({ endingEquity: e.target.value })}
                placeholder="500,000"
                aria-invalid={Boolean(errors.endingEquity)}
              />
            </FieldShell>
            {errors.endingEquity ? (
              <p className="mt-1 text-xs text-rose-600">{errors.endingEquity}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="roe-avg" className={labelClass}>
              Average shareholders&apos; equity
            </label>
            <FieldShell muted>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="roe-avg"
                type="text"
                readOnly
                tabIndex={-1}
                className={`${inputClass} cursor-default font-semibold text-accent`}
                value={
                  result?.usedAverageEquity
                    ? formatRoeMoney(result.equityBase, input.currency)
                    : ''
                }
                placeholder="—"
                aria-readonly="true"
              />
            </FieldShell>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="roe-result" className={labelClass}>
          Return on equity (ROE)
        </label>
        <FieldShell muted>
          <input
            id="roe-result"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            value={
              result?.roePercentage != null
                ? formatRoePercent(result.roePercentage)
                : ''
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
