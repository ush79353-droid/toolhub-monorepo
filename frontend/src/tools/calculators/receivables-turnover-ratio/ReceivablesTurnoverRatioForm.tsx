'use client';

import type { ReactNode } from 'react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ReceivablesTurnoverFieldErrors,
  ReceivablesTurnoverInput,
  ReceivablesTurnoverResult,
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

interface ReceivablesTurnoverRatioFormProps {
  input: ReceivablesTurnoverInput;
  errors: ReceivablesTurnoverFieldErrors;
  result: ReceivablesTurnoverResult | null;
  onChange: (input: ReceivablesTurnoverInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function ReceivablesTurnoverRatioForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: ReceivablesTurnoverRatioFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<ReceivablesTurnoverInput>) => {
    onChange({ ...input, ...patch });
  };

  const turnoverDisplay =
    result?.status === 'undefinedTurnover'
      ? 'Undefined'
      : (result?.formattedTurnoverRatio ?? '');

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-3.5"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for receivables amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (no FX). Use net credit sales for the
        same period as opening and closing AR. The turnover ratio is
        dimensionless (times), not a percentage.
      </p>
      <p className="text-xs">
        <a
          href="#how-to-calculate"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use this calculator
        </a>
      </p>

      <div>
        <label htmlFor="rtr-sales" className={labelClass}>
          Net credit sales
          <InfoTooltip
            label="Net credit sales"
            text="Credit sales for the period after applicable returns, allowances, and discounts — not total revenue including cash sales."
          />
        </label>
        <FieldShell error={errors.netCreditSales}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="rtr-sales"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.netCreditSales}
            onChange={(e) => set({ netCreditSales: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.netCreditSales)}
          />
        </FieldShell>
        {errors.netCreditSales ? (
          <p className="mt-1 text-xs text-rose-600">{errors.netCreditSales}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor="rtr-open" className={labelClass}>
          Accounts opening
          <InfoTooltip
            label="Accounts opening"
            text="Accounts receivable balance at the beginning of the reporting period."
          />
        </label>
        <FieldShell error={errors.openingAccountsReceivable}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="rtr-open"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.openingAccountsReceivable}
            onChange={(e) =>
              set({ openingAccountsReceivable: e.target.value })
            }
            placeholder="0"
            aria-invalid={Boolean(errors.openingAccountsReceivable)}
          />
        </FieldShell>
        {errors.openingAccountsReceivable ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.openingAccountsReceivable}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="rtr-close" className={labelClass}>
          Accounts closing
          <InfoTooltip
            label="Accounts closing"
            text="Accounts receivable balance at the end of the reporting period."
          />
        </label>
        <FieldShell error={errors.closingAccountsReceivable}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="rtr-close"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.closingAccountsReceivable}
            onChange={(e) =>
              set({ closingAccountsReceivable: e.target.value })
            }
            placeholder="0"
            aria-invalid={Boolean(errors.closingAccountsReceivable)}
          />
        </FieldShell>
        {errors.closingAccountsReceivable ? (
          <p className="mt-1 text-xs text-rose-600">
            {errors.closingAccountsReceivable}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="rtr-avg" className={labelClass}>
          Average accounts receivables
          <InfoTooltip
            label="Average accounts receivables"
            text="(Opening AR + Closing AR) ÷ 2 — a two-point average for the period."
          />
        </label>
        <FieldShell muted>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="rtr-avg"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default text-muted-foreground`}
            value={result?.formattedAverageAR ?? ''}
            placeholder="—"
            aria-readonly="true"
          />
        </FieldShell>
      </div>

      <div>
        <label htmlFor="rtr-ratio" className={labelClass}>
          Receivables turnover ratio
          <InfoTooltip
            label="Receivables turnover ratio"
            text="Net credit sales ÷ average accounts receivable. Reported as times per period — not a currency or percentage."
          />
        </label>
        <FieldShell muted>
          <input
            id="rtr-ratio"
            type="text"
            readOnly
            tabIndex={-1}
            className={`${inputClass} cursor-default text-muted-foreground`}
            value={turnoverDisplay}
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
