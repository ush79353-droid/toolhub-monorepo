'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { formatUsd } from './calculation';
import type {
  IncomeType,
  UsIncomePercentileFieldErrors,
  UsIncomePercentileInput,
  UsIncomePercentileResult,
} from './types';
import { datasetFor } from './datasets';

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex h-11 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface UsIncomePercentileFormProps {
  input: UsIncomePercentileInput;
  errors: UsIncomePercentileFieldErrors;
  result: UsIncomePercentileResult | null;
  onChange: (next: UsIncomePercentileInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
}

export function UsIncomePercentileForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
}: UsIncomePercentileFormProps) {
  const individual = datasetFor('individual');
  const household = datasetFor('household');
  const active = input.incomeType === 'household' ? household : individual;

  return (
    <form
      className="space-y-4"
      noValidate
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        Compare your income with American income statistics to understand where you
        rank among individuals or households in the United States.
      </p>

      <fieldset>
        <legend className={labelClass}>Income type</legend>
        <div className="flex flex-wrap gap-4 text-sm" role="radiogroup" aria-label="Income type">
          {(
            [
              ['individual', 'Individual'],
              ['household', 'Household'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="income-type"
                className="h-4 w-4 accent-primary"
                checked={input.incomeType === value}
                onChange={() =>
                  onChange({ ...input, incomeType: value as IncomeType })
                }
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={labelClass} htmlFor="us-income">
          Income
        </label>
        <FieldShell error={Boolean(errors.annualIncome)}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            $
          </span>
          <input
            id="us-income"
            className={inputClass}
            inputMode="decimal"
            value={input.annualIncome}
            aria-invalid={Boolean(errors.annualIncome)}
            onChange={(event) =>
              onChange({ ...input, annualIncome: event.target.value })
            }
          />
          <span className="pr-3 text-xs text-muted-foreground">/year</span>
        </FieldShell>
        {errors.annualIncome ? (
          <p className="mt-1 text-xs text-rose-600">{errors.annualIncome}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-muted/15 p-3.5 text-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {active.referenceYear} CPS money income
        </p>
        <dl className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Median individual</dt>
            <dd className="font-medium tabular-nums text-accent">
              {formatUsd(individual.medianIncome)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Mean individual</dt>
            <dd className="font-medium tabular-nums text-accent">
              {formatUsd(individual.meanIncome)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Median household</dt>
            <dd className="font-medium tabular-nums text-accent">
              {formatUsd(household.medianIncome)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Mean household</dt>
            <dd className="font-medium tabular-nums text-accent">
              {formatUsd(household.meanIncome)}
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Active comparison: {active.populationLabel}. {active.source}
        </p>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2.5">
        <Button type="submit" className="h-11 font-medium">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onClear}>
          Clear all changes
        </Button>
      </div>

      {result ? (
        <section
          aria-live="polite"
          aria-labelledby="income-percentile-result"
          className="space-y-3 rounded-xl border border-border bg-white p-3.5"
        >
          <h3 id="income-percentile-result" className="text-sm font-semibold text-accent">
            Your income percentile
          </h3>
          {result.percentile !== null && result.rangeStatus === 'inside' ? (
            <p className="text-base font-semibold text-accent">
              Your income is higher than {result.percentile}% of{' '}
              {result.incomeType === 'household' ? 'households' : 'people with income'}{' '}
              in the {result.referenceYear} Census tables.
            </p>
          ) : (
            <p className="text-sm font-medium text-accent">{result.rangeNote}</p>
          )}
          <p className="text-sm leading-relaxed text-foreground/90">{result.explanation}</p>
          <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Entered annual income</dt>
              <dd className="font-medium tabular-nums">{formatUsd(result.annualIncome)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Percentile</dt>
              <dd className="font-medium tabular-nums">
                {result.rangeStatus === 'inside' && result.percentile !== null
                  ? `${result.percentile}th`
                  : 'Not estimated'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Median ({result.incomeType})</dt>
              <dd className="font-medium tabular-nums">{formatUsd(result.medianIncome)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Mean ({result.incomeType})</dt>
              <dd className="font-medium tabular-nums">{formatUsd(result.meanIncome)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Percentage earning less or the same</dt>
              <dd className="font-medium tabular-nums">
                {result.percentageBelow === null ? '—' : `${result.percentageBelow}%`}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Percentage earning more</dt>
              <dd className="font-medium tabular-nums">
                {result.rangeStatus === 'inside' && result.percentageAbove !== null
                  ? `${result.percentageAbove}%`
                  : '—'}
              </dd>
            </div>
          </dl>
          {result.rangeStatus === 'inside' ? (
            <p className="text-xs leading-relaxed text-muted-foreground">{result.rangeNote}</p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Reference year {result.referenceYear}. Fixed USD. Amounts are not inflation-adjusted
            to a later year.
          </p>
        </section>
      ) : null}
    </form>
  );
}
