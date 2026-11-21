'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import {
  getCurrencySymbol,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatPercent, formatRetentionMoney } from './calculation';
import type {
  RetentionRatioFieldErrors,
  RetentionRatioInput,
  RetentionRatioResult,
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

interface RetentionRatioFormProps {
  input: RetentionRatioInput;
  errors: RetentionRatioFieldErrors;
  result: RetentionRatioResult | null;
  onChange: (input: RetentionRatioInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function RetentionRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: RetentionRatioFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<RetentionRatioInput>) =>
    onChange({ ...input, ...patch });

  const ratioDisplay =
    result?.formattedRetentionRatio ??
    (result?.status === 'undefined' ? 'Undefined' : '');

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Retention ratio (%) = ((net income − dividends) ÷ net income) × 100.
        Period retained earnings ≠ cumulative balance-sheet retained earnings.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          id="rr-currency"
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for retention ratio monetary inputs"
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
          What is the retention ratio?
        </a>
      </p>

      <div>
        <label htmlFor="rr-ni" className={labelClass}>
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
            id="rr-ni"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.netIncome}
            onChange={(e) => set({ netIncome: e.target.value })}
            placeholder="1,000,000"
            aria-invalid={Boolean(errors.netIncome)}
          />
        </FieldShell>
        {errors.netIncome ? (
          <p className="mt-1 text-xs text-rose-600">{errors.netIncome}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="rr-div" className={labelClass}>
          Dividends paid
          <InfoTooltip
            label="Dividends paid"
            text="Cash dividends distributed during the period. Use 0 if none. Must be zero or greater."
          />
        </label>
        <FieldShell error={errors.dividendsPaid}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="rr-div"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.dividendsPaid}
            onChange={(e) => set({ dividendsPaid: e.target.value })}
            placeholder="350,000"
            aria-invalid={Boolean(errors.dividendsPaid)}
          />
        </FieldShell>
        {errors.dividendsPaid ? (
          <p className="mt-1 text-xs text-rose-600">{errors.dividendsPaid}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="rr-re" className={labelClass}>
          Retained earnings (period)
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="rr-re"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            value={
              result?.retainedEarnings != null
                ? formatRetentionMoney(result.retainedEarnings, input.currency)
                : ''
            }
            placeholder="—"
            aria-readonly="true"
          />
        </FieldShell>
      </div>

      <div>
        <label htmlFor="rr-ratio" className={labelClass}>
          Retention ratio
        </label>
        <FieldShell muted>
          <input
            id="rr-ratio"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            value={ratioDisplay}
            placeholder="—"
            aria-readonly="true"
          />
          {result?.retentionRatioPercent != null ? (
            <span className="sr-only">
              {formatPercent(result.retentionRatioPercent)}
            </span>
          ) : null}
        </FieldShell>
        {result?.unavailableReason ? (
          <p className="mt-1 text-xs text-amber-800" role="status">
            {result.unavailableReason}
          </p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
