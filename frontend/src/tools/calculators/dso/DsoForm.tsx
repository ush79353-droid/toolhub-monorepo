'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  calculateAverageAccountsReceivable,
  formatDsoMoney,
} from './calculation';
import type {
  AverageReceivablesMode,
  DsoFieldErrors,
  DsoInput,
  DsoResult,
  SalesBasis,
} from './types';

const PERIOD_PRESETS = [30, 90, 180, 365, 366] as const;

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

function CollapsibleSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

function parseNonneg(raw: string): number | null {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

interface DsoFormProps {
  input: DsoInput;
  errors: DsoFieldErrors;
  result: DsoResult | null;
  onChange: (input: DsoInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function DsoForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: DsoFormProps) {
  const [recvOpen, setRecvOpen] = useState(true);
  const [salesOpen, setSalesOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);
  const calculated = input.averageReceivablesMode === 'calculated';
  const salesLabel =
    input.salesBasis === 'netCreditSales' ? 'Net credit sales' : 'Total sales';

  const set = (patch: Partial<DsoInput>) => {
    onChange({ ...input, ...patch });
  };

  let averageDisplay = '';
  if (calculated) {
    if (result?.formattedAverageAccountsReceivable) {
      averageDisplay = result.formattedAverageAccountsReceivable;
    } else {
      const beg = parseNonneg(input.beginningAccountsReceivable);
      const end = parseNonneg(input.endingAccountsReceivable);
      if (beg !== null && end !== null) {
        const avg = calculateAverageAccountsReceivable(beg, end);
        if (avg !== null) averageDisplay = formatDsoMoney(avg, input.currency);
      }
    }
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for receivables and sales amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts are labeled in the selected currency. Changing currency does not
        convert figures.
      </p>

      <CollapsibleSection
        title="Receivables"
        open={recvOpen}
        onToggle={() => setRecvOpen((o) => !o)}
      >
        <fieldset>
          <legend className={labelClass}>Average receivables source</legend>
          <div className="flex flex-wrap gap-4" role="radiogroup">
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="dso-avg-mode"
                className="h-4 w-4 accent-primary"
                checked={input.averageReceivablesMode === 'calculated'}
                onChange={() =>
                  set({
                    averageReceivablesMode:
                      'calculated' satisfies AverageReceivablesMode,
                  })
                }
              />
              From beginning &amp; ending
            </label>
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="dso-avg-mode"
                className="h-4 w-4 accent-primary"
                checked={input.averageReceivablesMode === 'manual'}
                onChange={() =>
                  set({
                    averageReceivablesMode:
                      'manual' satisfies AverageReceivablesMode,
                  })
                }
              />
              Enter average directly
            </label>
          </div>
        </fieldset>

        {calculated ? (
          <>
            <div>
              <label htmlFor="dso-beg-ar" className={labelClass}>
                Beginning accounts receivable
                <InfoTooltip
                  label="Beginning accounts receivable"
                  text="Amount customers owe at the start of the selected accounting period."
                />
              </label>
              <FieldShell error={errors.beginningAccountsReceivable}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dso-beg-ar"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.beginningAccountsReceivable}
                  onChange={(e) =>
                    set({ beginningAccountsReceivable: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(errors.beginningAccountsReceivable)}
                  aria-describedby={
                    errors.beginningAccountsReceivable
                      ? 'dso-beg-ar-err'
                      : undefined
                  }
                />
              </FieldShell>
              {errors.beginningAccountsReceivable ? (
                <p id="dso-beg-ar-err" className="mt-1 text-xs text-rose-600">
                  {errors.beginningAccountsReceivable}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dso-end-ar" className={labelClass}>
                End accounts receivable
                <InfoTooltip
                  label="End accounts receivable"
                  text="Outstanding amount customers owe at the end of the selected accounting period."
                />
              </label>
              <FieldShell error={errors.endingAccountsReceivable}>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dso-end-ar"
                  type="text"
                  inputMode="decimal"
                  className={inputClass}
                  value={input.endingAccountsReceivable}
                  onChange={(e) =>
                    set({ endingAccountsReceivable: e.target.value })
                  }
                  placeholder="0"
                  aria-invalid={Boolean(errors.endingAccountsReceivable)}
                  aria-describedby={
                    errors.endingAccountsReceivable
                      ? 'dso-end-ar-err'
                      : undefined
                  }
                />
              </FieldShell>
              {errors.endingAccountsReceivable ? (
                <p id="dso-end-ar-err" className="mt-1 text-xs text-rose-600">
                  {errors.endingAccountsReceivable}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="dso-avg-ar" className={labelClass}>
                Average receivables
                <InfoTooltip
                  label="Average receivables"
                  text="(Beginning AR + ending AR) ÷ 2. A two-point average for the period."
                />
              </label>
              <FieldShell muted>
                <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                  {symbol}
                </span>
                <input
                  id="dso-avg-ar"
                  type="text"
                  readOnly
                  tabIndex={-1}
                  className={`${inputClass} cursor-default text-muted-foreground`}
                  value={averageDisplay}
                  placeholder="—"
                  aria-readonly="true"
                />
              </FieldShell>
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="dso-manual-ar" className={labelClass}>
              Average receivables
              <InfoTooltip
                label="Average receivables"
                text="Enter a known period average accounts receivable directly."
              />
            </label>
            <FieldShell error={errors.manualAverageReceivables}>
              <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id="dso-manual-ar"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.manualAverageReceivables}
                onChange={(e) =>
                  set({ manualAverageReceivables: e.target.value })
                }
                placeholder="0"
                aria-invalid={Boolean(errors.manualAverageReceivables)}
                aria-describedby={
                  errors.manualAverageReceivables
                    ? 'dso-manual-ar-err'
                    : undefined
                }
              />
            </FieldShell>
            {errors.manualAverageReceivables ? (
              <p id="dso-manual-ar-err" className="mt-1 text-xs text-rose-600">
                {errors.manualAverageReceivables}
              </p>
            ) : null}
          </div>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Sales"
        open={salesOpen}
        onToggle={() => setSalesOpen((o) => !o)}
      >
        <fieldset>
          <legend className={labelClass}>Sales basis</legend>
          <div className="flex flex-wrap gap-4" role="radiogroup">
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="dso-sales-basis"
                className="h-4 w-4 accent-primary"
                checked={input.salesBasis === 'totalSales'}
                onChange={() =>
                  set({ salesBasis: 'totalSales' satisfies SalesBasis })
                }
              />
              Total sales
            </label>
            <label className="flex items-center gap-2 text-sm text-accent">
              <input
                type="radio"
                name="dso-sales-basis"
                className="h-4 w-4 accent-primary"
                checked={input.salesBasis === 'netCreditSales'}
                onChange={() =>
                  set({ salesBasis: 'netCreditSales' satisfies SalesBasis })
                }
              />
              Net credit sales
            </label>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Total sales is the reference default. Net credit sales is generally
            preferable when receivables arise from credit transactions.
          </p>
        </fieldset>

        <div>
          <label htmlFor="dso-sales" className={labelClass}>
            {salesLabel}
            <InfoTooltip
              label={salesLabel}
              text={
                input.salesBasis === 'netCreditSales'
                  ? 'Net credit sales for the same accounting period as receivables. Prefer this basis when available.'
                  : 'Total sales revenue for the same accounting period. Acts as a proxy when net credit sales is unavailable; cash sales can understate DSO.'
              }
            />
          </label>
          <FieldShell error={errors.sales}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="dso-sales"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.sales}
              onChange={(e) => set({ sales: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.sales)}
              aria-describedby={errors.sales ? 'dso-sales-err' : undefined}
            />
          </FieldShell>
          {errors.sales ? (
            <p id="dso-sales-err" className="mt-1 text-xs text-rose-600">
              {errors.sales}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="dso-period" className={labelClass}>
            Accounting period
            <InfoTooltip
              label="Accounting period"
              text="Number of days in the reporting period that matches receivables and sales (default 365)."
            />
          </label>
          <FieldShell error={errors.accountingPeriodDays}>
            <input
              id="dso-period"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.accountingPeriodDays}
              onChange={(e) => set({ accountingPeriodDays: e.target.value })}
              placeholder="365"
              aria-invalid={Boolean(errors.accountingPeriodDays)}
              aria-describedby={
                errors.accountingPeriodDays ? 'dso-period-err' : undefined
              }
            />
            <span className="pr-3 text-sm text-muted-foreground" aria-hidden>
              days
            </span>
          </FieldShell>
          {errors.accountingPeriodDays ? (
            <p id="dso-period-err" className="mt-1 text-xs text-rose-600">
              {errors.accountingPeriodDays}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PERIOD_PRESETS.map((days) => (
              <button
                key={days}
                type="button"
                className={`rounded-md border px-2 py-1 text-xs tabular-nums transition-colors ${
                  input.accountingPeriodDays === String(days)
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-white text-accent hover:bg-muted/30'
                }`}
                onClick={() => set({ accountingPeriodDays: String(days) })}
              >
                {days}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="dso-result" className={labelClass}>
            Days sales outstanding (DSO)
            <InfoTooltip
              label="Days sales outstanding"
              text="DSO = (Average AR ÷ Sales) × days. Shown in days, not currency."
            />
          </label>
          <FieldShell muted>
            <input
              id="dso-result"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={
                result ? `${result.formattedDaysSalesOutstanding} days` : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>
    </form>
  );
}
