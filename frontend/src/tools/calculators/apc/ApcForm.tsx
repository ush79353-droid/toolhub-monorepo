'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMoney, formatPercent, formatRatio } from './calculation';
import type { ApcFieldErrors, ApcInput, ApcResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
  className = '',
}: {
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface ApcFormProps {
  input: ApcInput;
  errors: ApcFieldErrors;
  result: ApcResult | null;
  onChange: (next: ApcInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function ApcForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: ApcFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ApcInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-5"
      noValidate
      autoComplete="off"
    >
      <section aria-labelledby="apc-inputs-heading" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 id="apc-inputs-heading" className="text-sm font-semibold text-accent">
              Average propensity to consume
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Make sure consumption and disposable income refer to the same time period (monthly,
              quarterly, or annual).
            </p>
          </div>
          <Button type="button" variant="ghost" className="h-8 px-2 text-xs" onClick={onLoadExample}>
            Load example
          </Button>
        </div>

        <div>
          <label className={labelClass} htmlFor="apc-currency">
            <span>Display currency</span>
          </label>
          <div className="max-w-[140px]">
            <CurrencySelect
              id="apc-currency"
              value={input.currency}
              onChange={(currency) => set({ currency })}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="apc-consumption">Total consumption</label>
            <InfoTooltip
              label="Total consumption"
              text="Enter the total amount spent on goods and services during the selected period."
              align="left"
            />
          </div>
          <FieldShell error={errors.totalConsumption}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="apc-consumption"
              className={inputClass}
              inputMode="decimal"
              placeholder="Enter total consumption"
              value={input.totalConsumption}
              aria-invalid={Boolean(errors.totalConsumption)}
              onChange={(event) => set({ totalConsumption: event.target.value })}
            />
          </FieldShell>
          {errors.totalConsumption ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalConsumption}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="apc-income">Total disposable income</label>
            <InfoTooltip
              label="Total disposable income"
              text="Enter the total income available after direct taxes during the same period used for your consumption figure."
              align="left"
            />
          </div>
          <FieldShell error={errors.totalDisposableIncome}>
            <span className="pl-3 text-sm font-medium text-muted-foreground">{symbol}</span>
            <input
              id="apc-income"
              className={inputClass}
              inputMode="decimal"
              placeholder="Enter total disposable income"
              value={input.totalDisposableIncome}
              aria-invalid={Boolean(errors.totalDisposableIncome)}
              onChange={(event) => set({ totalDisposableIncome: event.target.value })}
            />
          </FieldShell>
          {errors.totalDisposableIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.totalDisposableIncome}</p>
          ) : null}
        </div>

        <div>
          <div className={labelClass}>
            <label htmlFor="apc-result">Average propensity to consume (APC)</label>
            <InfoTooltip
              label="APC"
              text="APC = total consumption ÷ total disposable income. Shown as a decimal ratio and as a percentage."
              align="left"
            />
          </div>
          <FieldShell>
            <input
              id="apc-result"
              className={`${inputClass} bg-muted/10 font-semibold`}
              readOnly
              value={result ? formatRatio(result.apcRatio) : ''}
              aria-live="polite"
            />
          </FieldShell>
        </div>
      </section>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section
          aria-labelledby="apc-results-heading"
          className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        >
          <h3 id="apc-results-heading" className="text-sm font-semibold text-accent">
            Results
          </h3>
          <div>
            <p className="text-[13px] font-medium text-accent">Average propensity to consume</p>
            <p className="text-3xl font-semibold tabular-nums text-accent">
              {formatRatio(result.apcRatio)}
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-accent">
              {formatPercent(result.apcPercentage)}%
            </p>
          </div>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Total consumption</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.totalConsumption, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Total disposable income</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.totalDisposableIncome, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Implied savings</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.impliedSavings, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Average propensity to save (APS)</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatPercent(result.averagePropensityToSave * 100)}%
              </dd>
            </div>
          </dl>
          <div className="rounded-lg border border-border bg-white p-3 text-xs leading-relaxed text-muted-foreground">
            {result.interpretation}
          </div>
          <p className="text-xs text-muted-foreground">
            Under the simplified model, APC + APS = 1 when disposable income is split between
            consumption and saving.
          </p>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter consumption and disposable income, then Calculate to see APC.
        </p>
      )}
    </form>
  );
}
