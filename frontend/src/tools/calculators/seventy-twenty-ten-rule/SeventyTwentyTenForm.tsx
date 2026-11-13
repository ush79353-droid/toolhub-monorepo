'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { withFrequency } from './calculation';
import {
  periodNoun,
  type IncomeFrequency,
  type SeventyTwentyTenInput,
} from './types';

interface SeventyTwentyTenFormProps {
  input: SeventyTwentyTenInput;
  errors: Record<string, string>;
  onChange: (input: SeventyTwentyTenInput) => void;
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

export function SeventyTwentyTenForm({ input, errors, onChange, onSubmit, onReset }: SeventyTwentyTenFormProps) {
  const set = (patch: Partial<SeventyTwentyTenInput>) => onChange({ ...input, ...patch });
  const period = periodNoun(input.frequency);

  const onRequired = (key: 'income') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? Number.NaN : Number(text) });
  };

  const onOptional = (key: 'needsSpending' | 'savingsSpending' | 'lifestyleSpending') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? 0 : Number(text) });
  };

  const onPercent = (key: 'needsPercent' | 'savingsPercent' | 'lifestylePercent') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? Number.NaN : Number(text) });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <FieldLabel
            htmlFor="budget-frequency"
            label="Income frequency"
            tip="Monthly and annual are the same money shown over a different length. Switching multiplies or divides the amounts you already entered once."
          />
          <select
            id="budget-frequency"
            className={inputClass}
            value={input.frequency}
            onChange={(event) => onChange(withFrequency(input, event.target.value as IncomeFrequency))}
          >
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </div>
        <div>
          <FieldLabel
            htmlFor="budget-income"
            label={`After-tax income /${period}`}
            tip="Money you can allocate after tax. Use the same period as the spending fields."
          />
          <input
            id="budget-income"
            className={inputClass}
            inputMode="decimal"
            value={numberOrBlank(input.income)}
            aria-invalid={Boolean(errors.income)}
            onChange={onRequired('income')}
          />
          {errors.income ? <p className="mt-1 text-xs text-rose-600">{errors.income}</p> : null}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background/50 p-3.5">
        <h3 className="text-sm font-medium text-accent">Actual spending</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Optional. Amounts are per {period}, the same period as income. Leave a field blank to treat it as zero.
          Savings and debt payments are not ordinary consumption.
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3.5">
          <div>
            <FieldLabel
              htmlFor="budget-needs-spend"
              label={`Needs spending /${period}`}
              tip="Housing, utilities, groceries, transport, insurance, and other costs you treat as essentials."
            />
            <input
              id="budget-needs-spend"
              className={inputClass}
              inputMode="decimal"
              value={input.needsSpending === 0 ? '' : input.needsSpending}
              aria-invalid={Boolean(errors.needsSpending)}
              onChange={onOptional('needsSpending')}
            />
            {errors.needsSpending ? <p className="mt-1 text-xs text-rose-600">{errors.needsSpending}</p> : null}
          </div>
          <div>
            <FieldLabel
              htmlFor="budget-savings-spend"
              label={`Savings and debt repayment /${period}`}
              tip="Money moved to savings or used to repay debt. This is not lifestyle spending."
            />
            <input
              id="budget-savings-spend"
              className={inputClass}
              inputMode="decimal"
              value={input.savingsSpending === 0 ? '' : input.savingsSpending}
              aria-invalid={Boolean(errors.savingsSpending)}
              onChange={onOptional('savingsSpending')}
            />
            {errors.savingsSpending ? <p className="mt-1 text-xs text-rose-600">{errors.savingsSpending}</p> : null}
          </div>
          <div>
            <FieldLabel
              htmlFor="budget-lifestyle-spend"
              label={`Lifestyle spending /${period}`}
              tip="Dining out, hobbies, travel, and other choices you could reduce. Not rent, savings, or debt payments."
            />
            <input
              id="budget-lifestyle-spend"
              className={inputClass}
              inputMode="decimal"
              value={input.lifestyleSpending === 0 ? '' : input.lifestyleSpending}
              aria-invalid={Boolean(errors.lifestyleSpending)}
              onChange={onOptional('lifestyleSpending')}
            />
            {errors.lifestyleSpending ? (
              <p className="mt-1 text-xs text-rose-600">{errors.lifestyleSpending}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background/50 p-3.5">
        <label className="flex items-start gap-2 text-sm font-medium text-accent">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border"
            checked={input.customPercents}
            onChange={(event) => set({ customPercents: event.target.checked })}
          />
          Use custom percentages
        </label>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Leave this off to keep the standard 70% needs, 20% savings and debt, and 10% lifestyle split.
        </p>
        {input.customPercents ? (
          <div className="mt-3 grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-3">
            {(
              [
                ['needsPercent', 'Needs %', 'budget-pct-needs'],
                ['savingsPercent', 'Savings and debt %', 'budget-pct-savings'],
                ['lifestylePercent', 'Lifestyle %', 'budget-pct-lifestyle'],
              ] as const
            ).map(([key, label, id]) => (
              <div key={key}>
                <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-accent">
                  {label}
                </label>
                <input
                  id={id}
                  className={inputClass}
                  inputMode="decimal"
                  value={numberOrBlank(input[key])}
                  aria-invalid={Boolean(errors[key] || errors.percents)}
                  onChange={onPercent(key)}
                />
                {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
              </div>
            ))}
          </div>
        ) : null}
        {errors.percents ? (
          <p className="mt-2 text-xs text-rose-600" role="alert">
            {errors.percents}
          </p>
        ) : null}
      </div>

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
