'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { averageReceivable } from './calculation';
import { averageBalanceIsInput, type ARDaysInput, type ARDaysResult } from './types';

interface ARDaysFormProps {
  input: ARDaysInput;
  errors: Record<string, string>;
  result: ARDaysResult | null;
  averageSectionOpen: boolean;
  onAverageSectionOpenChange: (open: boolean) => void;
  onChange: (input: ARDaysInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({ htmlFor, label, tip }: { htmlFor: string; label: string; tip: string }) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} />
    </div>
  );
}

function numberOrBlank(value: number): string | number {
  return Number.isFinite(value) ? value : '';
}

function formatDays(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function ARDaysForm({
  input,
  errors,
  result,
  averageSectionOpen,
  onAverageSectionOpenChange,
  onChange,
  onCurrencyChange,
  onReset,
}: ARDaysFormProps) {
  const set = (patch: Partial<ARDaysInput>) => onChange({ ...input, ...patch });
  const usingAverage = averageBalanceIsInput(input);
  const symbol = getCurrencySymbol(input.currency);
  const averageReady =
    Number.isFinite(input.beginningReceivable) && Number.isFinite(input.endingReceivable);
  const averageValue = averageReady
    ? averageReceivable(input.beginningReceivable, input.endingReceivable)
    : null;

  const onNumber = (key: keyof ARDaysInput) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<ARDaysInput>);
  };

  const arDisplay =
    usingAverage && averageValue !== null
      ? formatMoney(averageValue)
      : numberOrBlank(input.accountsReceivable);

  const arDaysDisplay =
    result?.defined && result.arDays !== null ? formatDays(result.arDays) : '';

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details open className="rounded-xl border border-border bg-muted/20">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-accent">
          A/R Days Calculator
        </summary>
        <div className="space-y-3.5 px-4 pb-4">
          <div>
            <FieldLabel
              htmlFor="ar-receivable"
              label="Accounts receivable"
              tip="Unpaid credit balance for the period. Use the same currency as net credit sales. When average balance is selected, this field shows the calculated average."
            />
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="ar-receivable"
                  className={`${inputClass} pl-8 ${usingAverage ? 'bg-muted/40 text-muted-foreground' : ''}`}
                  inputMode="decimal"
                  value={arDisplay}
                  readOnly={usingAverage}
                  aria-invalid={Boolean(errors.accountsReceivable)}
                  onChange={usingAverage ? undefined : onNumber('accountsReceivable')}
                />
              </div>
              <div className="w-[120px] shrink-0 sm:w-[130px]">
                <CurrencySelect
                  id="ar-currency"
                  value={input.currency}
                  onChange={onCurrencyChange}
                />
              </div>
            </div>
            {usingAverage ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Using average accounts receivable from the section below.
              </p>
            ) : null}
            {errors.accountsReceivable ? (
              <p className="mt-1 text-xs text-rose-600">{errors.accountsReceivable}</p>
            ) : null}
          </div>

          <div>
            <FieldLabel
              htmlFor="ar-sales"
              label="Net credit sales"
              tip="Credit sales for the period after returns and allowances. Do not include cash sales."
            />
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="ar-sales"
                className={`${inputClass} pl-8`}
                inputMode="decimal"
                value={numberOrBlank(input.netCreditSales)}
                aria-invalid={Boolean(errors.netCreditSales)}
                onChange={onNumber('netCreditSales')}
              />
            </div>
            {errors.netCreditSales ? (
              <p className="mt-1 text-xs text-rose-600">{errors.netCreditSales}</p>
            ) : null}
          </div>

          <div>
            <FieldLabel
              htmlFor="ar-days-period"
              label="Number of days in the period"
              tip="Length of the sales period. A common full-year figure is 365. Use 90 for a quarter if that matches the sales."
            />
            <div className="relative">
              <input
                id="ar-days-period"
                className={`${inputClass} pr-14`}
                inputMode="decimal"
                value={numberOrBlank(input.periodDays)}
                aria-invalid={Boolean(errors.periodDays)}
                onChange={onNumber('periodDays')}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                days
              </span>
            </div>
            {errors.periodDays ? <p className="mt-1 text-xs text-rose-600">{errors.periodDays}</p> : null}
          </div>

          <div>
            <FieldLabel
              htmlFor="ar-days-result"
              label="A/R days"
              tip="Days sales outstanding for the selected receivables method. Updates as you edit the inputs."
            />
            <div className="relative">
              <input
                id="ar-days-result"
                className={`${inputClass} bg-muted/30 pr-14 text-accent`}
                readOnly
                value={arDaysDisplay}
                aria-live="polite"
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                days
              </span>
            </div>
          </div>
        </div>
      </details>

      <details
        className="rounded-xl border border-border bg-muted/20"
        open={averageSectionOpen}
        onToggle={(event) => onAverageSectionOpenChange(event.currentTarget.open)}
      >
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-accent">
          Average balance calculation
        </summary>
        <div className="space-y-3.5 px-4 pb-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Optional. Average = (beginning + ending) ÷ 2. Values stay saved when this section is collapsed.
          </p>
          <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
            <div>
              <FieldLabel
                htmlFor="ar-begin"
                label="Beginning accounts receivable"
                tip="Receivables at the start of the same period as the credit sales."
              />
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="ar-begin"
                  className={`${inputClass} pl-8`}
                  inputMode="decimal"
                  value={numberOrBlank(input.beginningReceivable)}
                  aria-invalid={Boolean(errors.beginningReceivable)}
                  onChange={onNumber('beginningReceivable')}
                />
              </div>
              {errors.beginningReceivable ? (
                <p className="mt-1 text-xs text-rose-600">{errors.beginningReceivable}</p>
              ) : null}
            </div>
            <div>
              <FieldLabel
                htmlFor="ar-end"
                label="Ending accounts receivable"
                tip="Receivables at the end of that period. Averaged with the beginning balance."
              />
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  {symbol}
                </span>
                <input
                  id="ar-end"
                  className={`${inputClass} pl-8`}
                  inputMode="decimal"
                  value={numberOrBlank(input.endingReceivable)}
                  aria-invalid={Boolean(errors.endingReceivable)}
                  onChange={onNumber('endingReceivable')}
                />
              </div>
              {errors.endingReceivable ? (
                <p className="mt-1 text-xs text-rose-600">{errors.endingReceivable}</p>
              ) : null}
            </div>
          </div>

          <div>
            <FieldLabel
              htmlFor="ar-average"
              label="Average accounts receivable"
              tip="(Beginning + ending) ÷ 2. Use this figure in the main formula with the button below."
            />
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                {symbol}
              </span>
              <input
                id="ar-average"
                className={`${inputClass} bg-muted/30 pl-8`}
                readOnly
                value={averageValue !== null ? formatMoney(averageValue) : ''}
                aria-live="polite"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={usingAverage ? 'default' : 'outline'}
              className={`h-9 px-3 text-xs font-medium ${usingAverage ? 'bg-primary text-white hover:bg-[hsl(var(--primary-hover))]' : ''}`}
              disabled={!averageReady}
              onClick={() => set({ balanceMethod: 'average' })}
            >
              Use average A/R
            </Button>
            <Button
              type="button"
              variant={!usingAverage ? 'default' : 'outline'}
              className={`h-9 px-3 text-xs font-medium ${!usingAverage ? 'bg-primary text-white hover:bg-[hsl(var(--primary-hover))]' : ''}`}
              onClick={() => set({ balanceMethod: 'ending' })}
            >
              Use ending A/R
            </Button>
          </div>
          {errors.balanceMethod ? (
            <p className="text-xs text-rose-600">{errors.balanceMethod}</p>
          ) : null}
        </div>
      </details>

      {errors.form ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700"
          role="alert"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
