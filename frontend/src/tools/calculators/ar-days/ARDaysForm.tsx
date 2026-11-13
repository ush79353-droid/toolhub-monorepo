'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  type ARDaysInput,
  type BalanceMethod,
  type SolveFor,
  averageBalanceIsInput,
} from './types';

interface ARDaysFormProps {
  input: ARDaysInput;
  errors: Record<string, string>;
  onChange: (input: ARDaysInput) => void;
  onSubmit: (event: React.FormEvent) => void;
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

export function ARDaysForm({ input, errors, onChange, onSubmit, onReset }: ARDaysFormProps) {
  const set = (patch: Partial<ARDaysInput>) => onChange({ ...input, ...patch });
  const showAverage = averageBalanceIsInput(input);
  const showReceivable = input.solveFor !== 'receivables' && input.balanceMethod === 'ending';

  const onNumber = (key: keyof ARDaysInput) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<ARDaysInput>);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <FieldLabel
            htmlFor="ar-solve"
            label="Calculate"
            tip="Choose the unknown. The other fields are inputs, so the page does not solve a value you also typed."
          />
          <select
            id="ar-solve"
            className={inputClass}
            value={input.solveFor}
            onChange={(event) => set({ solveFor: event.target.value as SolveFor })}
          >
            <option value="arDays">A/R days</option>
            <option value="receivables">Accounts receivable</option>
            <option value="creditSales">Net credit sales</option>
            <option value="periodDays">Days in the period</option>
          </select>
        </div>
        <div>
          <FieldLabel
            htmlFor="ar-method"
            label="Receivables used"
            tip="Ending uses the single receivables amount. Average uses the midpoint of the beginning and ending balances, and only when you select it."
          />
          <select
            id="ar-method"
            className={inputClass}
            value={input.balanceMethod}
            onChange={(event) => set({ balanceMethod: event.target.value as BalanceMethod })}
          >
            <option value="ending">Ending balance</option>
            <option value="average">Average of beginning and ending</option>
          </select>
        </div>
      </div>

      {input.solveFor === 'receivables' && input.balanceMethod === 'average' ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Solving for receivables gives the balance in the formula. Beginning and ending balances are not used, and
          the result is not split between them.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        {showReceivable ? (
          <div>
            <FieldLabel
              htmlFor="ar-receivable"
              label="Accounts receivable"
              tip="The unpaid credit balance you want to test. Use the same currency as net credit sales."
            />
            <input
              id="ar-receivable"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.accountsReceivable)}
              aria-invalid={Boolean(errors.accountsReceivable)}
              onChange={onNumber('accountsReceivable')}
            />
            {errors.accountsReceivable ? (
              <p className="mt-1 text-xs text-rose-600">{errors.accountsReceivable}</p>
            ) : null}
          </div>
        ) : null}
        {input.solveFor !== 'creditSales' ? (
          <div>
            <FieldLabel
              htmlFor="ar-sales"
              label="Net credit sales"
              tip="Credit sales for the period, after returns and allowances. Do not include cash sales."
            />
            <input
              id="ar-sales"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.netCreditSales)}
              aria-invalid={Boolean(errors.netCreditSales)}
              onChange={onNumber('netCreditSales')}
            />
            {errors.netCreditSales ? (
              <p className="mt-1 text-xs text-rose-600">{errors.netCreditSales}</p>
            ) : null}
          </div>
        ) : null}
        {input.solveFor !== 'periodDays' ? (
          <div>
            <FieldLabel
              htmlFor="ar-days-period"
              label="Days in the period"
              tip="Length of the sales period. A common full-year figure is 365. Use 90 for a quarter if that matches the sales."
            />
            <input
              id="ar-days-period"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.periodDays)}
              aria-invalid={Boolean(errors.periodDays)}
              onChange={onNumber('periodDays')}
            />
            {errors.periodDays ? <p className="mt-1 text-xs text-rose-600">{errors.periodDays}</p> : null}
          </div>
        ) : null}
        {input.solveFor !== 'arDays' ? (
          <div>
            <FieldLabel
              htmlFor="ar-days-known"
              label="A/R days"
              tip="The day count you already have. The page solves one of the other amounts from it."
            />
            <input
              id="ar-days-known"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.arDays)}
              aria-invalid={Boolean(errors.arDays)}
              onChange={onNumber('arDays')}
            />
            {errors.arDays ? <p className="mt-1 text-xs text-rose-600">{errors.arDays}</p> : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-background/50 p-3.5">
        <h3 className="text-sm font-medium text-accent">Average balance</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {showAverage
            ? 'The formula uses (beginning + ending) / 2. The single ending-balance field is not used.'
            : 'These amounts are used only when you select the average method. The ending-balance method ignores them.'}
        </p>
        {showAverage ? (
          <div className="mt-3 grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
            <div>
              <FieldLabel
                htmlFor="ar-begin"
                label="Beginning accounts receivable"
                tip="Receivables at the start of the same period as the credit sales."
              />
              <input
                id="ar-begin"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.beginningReceivable)}
                aria-invalid={Boolean(errors.beginningReceivable)}
                onChange={onNumber('beginningReceivable')}
              />
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
              <input
                id="ar-end"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.endingReceivable)}
                aria-invalid={Boolean(errors.endingReceivable)}
                onChange={onNumber('endingReceivable')}
              />
              {errors.endingReceivable ? (
                <p className="mt-1 text-xs text-rose-600">{errors.endingReceivable}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {errors.form ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs leading-relaxed text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="submit" className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
