'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { formatMoney } from './calculation';
import { ASSUMED_WORK_HOURS_PER_WEEK } from './types';
import {
  countryById,
  UNPAID_ACTIVITIES,
  UNPAID_WORK_COUNTRIES,
  type IncomeFrequency,
  type UnpaidActivityId,
  type UnpaidWorkFieldErrors,
  type UnpaidWorkInput,
  type UnpaidWorkResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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
      className={`relative flex h-11 min-w-0 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="rounded-xl border border-border bg-muted/15"
    >
      <summary className="cursor-pointer list-none px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="space-y-3 border-t border-border px-3.5 py-3 sm:px-4">
        {children}
      </div>
    </details>
  );
}

interface UnpaidWorkFormProps {
  input: UnpaidWorkInput;
  errors: UnpaidWorkFieldErrors;
  result: UnpaidWorkResult | null;
  onChange: (next: UnpaidWorkInput) => void;
  onCalculate: () => void;
  onClear: () => void;
  onReload: () => void;
  onLoadExample: () => void;
}

export function UnpaidWorkForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
  onClear,
  onReload,
  onLoadExample,
}: UnpaidWorkFormProps) {
  const country = countryById(input.countryId);
  const symbol = getCurrencySymbol(country.currency);

  const setActivity = (
    id: UnpaidActivityId,
    patch: Partial<{ hoursPerWeek: string; outsourcingRate: string }>,
  ) => {
    onChange({
      ...input,
      activities: input.activities.map((row) =>
        row.id === id ? { ...row, ...patch } : row,
      ),
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      className="space-y-3"
      noValidate
      autoComplete="off"
    >
      <p className="text-xs text-muted-foreground">
        Estimate what unpaid household work would cost to hire out, and compare
        those hours with professional pay. Default rates are illustrative
        assumptions, not official prices. Country changes the currency symbol
        only.
      </p>

      <Section title="My professional work">
        <div>
          <label className={labelClass} htmlFor="uw-country">
            Country
          </label>
          <FieldShell>
            <select
              id="uw-country"
              className={inputClass}
              value={input.countryId}
              onChange={(event) =>
                onChange({ ...input, countryId: event.target.value })
              }
            >
              {UNPAID_WORK_COUNTRIES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </FieldShell>
        </div>
        <div>
          <label className={labelClass} htmlFor="uw-income">
            I earn…
          </label>
          <FieldShell error={Boolean(errors.income)}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="uw-income"
              className={inputClass}
              inputMode="decimal"
              value={input.income}
              aria-invalid={Boolean(errors.income)}
              onChange={(event) =>
                onChange({ ...input, income: event.target.value })
              }
            />
          </FieldShell>
          {errors.income ? (
            <p className="mt-1 text-xs text-rose-600">{errors.income}</p>
          ) : null}
        </div>
        <fieldset>
          <legend className={labelClass}>Income frequency</legend>
          <div className="flex flex-wrap gap-3 text-sm">
            {(
              [
                ['hourly', 'Hourly wage'],
                ['weekly', 'Weekly salary'],
                ['monthly', 'Monthly salary'],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="inline-flex items-center gap-1.5">
                <input
                  type="radio"
                  name="uw-frequency"
                  className="h-4 w-4 accent-primary"
                  checked={input.incomeFrequency === value}
                  onChange={() =>
                    onChange({
                      ...input,
                      incomeFrequency: value as IncomeFrequency,
                    })
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="text-sm text-accent">
          Hourly wage:{' '}
          <span className="font-semibold tabular-nums">
            {result
              ? formatMoney(result.hourlyIncome, result.currency)
              : '—'}
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            Weekly and monthly pay use {ASSUMED_WORK_HOURS_PER_WEEK} paid hours
            per week.
          </span>
        </p>
      </Section>

      <Section title="My unpaid work">
        <div className="space-y-2">
          {UNPAID_ACTIVITIES.map((def) => {
            const row = input.activities.find((item) => item.id === def.id);
            const value = result?.activities.find((item) => item.id === def.id);
            return (
              <div
                key={def.id}
                className="grid grid-cols-1 gap-2 rounded-lg border border-border bg-white p-2.5 sm:grid-cols-[1.2fr_0.8fr_0.9fr_auto] sm:items-end"
              >
                <p className="text-sm font-medium text-accent">{def.name}</p>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`${def.id}-hours`}>
                    Hours / week
                  </label>
                  <FieldShell error={Boolean(errors.hours)}>
                    <input
                      id={`${def.id}-hours`}
                      className={inputClass}
                      inputMode="decimal"
                      value={row?.hoursPerWeek ?? ''}
                      onChange={(event) =>
                        setActivity(def.id, { hoursPerWeek: event.target.value })
                      }
                    />
                  </FieldShell>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground" htmlFor={`${def.id}-rate`}>
                    Rate / hour
                  </label>
                  <FieldShell error={Boolean(errors.rates)}>
                    <span className="pl-3 text-xs text-muted-foreground" aria-hidden>
                      {symbol}
                    </span>
                    <input
                      id={`${def.id}-rate`}
                      className={inputClass}
                      inputMode="decimal"
                      value={row?.outsourcingRate ?? ''}
                      onChange={(event) =>
                        setActivity(def.id, {
                          outsourcingRate: event.target.value,
                        })
                      }
                    />
                  </FieldShell>
                </div>
                <p className="text-sm tabular-nums text-accent sm:pb-2.5">
                  {value && result
                    ? formatMoney(value.weeklyValue, result.currency)
                    : '—'}
                </p>
              </div>
            );
          })}
        </div>
        {errors.hours ? (
          <p className="text-xs text-rose-600">{errors.hours}</p>
        ) : null}
        {errors.rates ? (
          <p className="text-xs text-rose-600">{errors.rates}</p>
        ) : null}
      </Section>

      <Section title="Average cost of outsourcing" defaultOpen={false}>
        <p className="text-xs text-muted-foreground">
          These hourly rates are editable estimates. They are not official market
          prices. The same numbers feed the replacement-cost totals.
        </p>
        <ul className="space-y-1 text-sm">
          {UNPAID_ACTIVITIES.map((def) => {
            const row = input.activities.find((item) => item.id === def.id);
            return (
              <li key={def.id} className="flex justify-between gap-3">
                <span>{def.name}</span>
                <span className="tabular-nums text-accent">
                  {symbol}
                  {row?.outsourcingRate || '0'}
                  /hr
                </span>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Replacement cost of unpaid work">
        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Time spent</dt>
            <dd className="font-medium tabular-nums text-accent">
              {result ? `${result.totalWeeklyHours} h/week` : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">
              Average cost of unpaid work
            </dt>
            <dd className="font-medium tabular-nums text-accent">
              {result
                ? `${formatMoney(result.averageOutsourcingRate, result.currency)}/hr`
                : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">If I worked, I&apos;d make</dt>
            <dd className="font-medium tabular-nums text-accent">
              {result
                ? `${formatMoney(result.hourlyIncome, result.currency)}/hr`
                : '—'}
            </dd>
          </div>
        </dl>
        {result ? (
          <p className="text-xs text-muted-foreground">
            Opportunity cost this week (hours × professional hourly rate):{' '}
            <span className="font-medium text-accent">
              {formatMoney(result.potentialWeeklyEarnings, result.currency)}
            </span>
            . This is not added to the outsourcing replacement cost.
          </p>
        ) : null}
      </Section>

      <Section title="My opportunities">
        <div>
          <label className={labelClass} htmlFor="uw-budget">
            I want to outsource
          </label>
          <FieldShell error={Boolean(errors.outsourcingBudget)}>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="uw-budget"
              className={inputClass}
              inputMode="decimal"
              value={input.outsourcingBudget}
              aria-invalid={Boolean(errors.outsourcingBudget)}
              onChange={(event) =>
                onChange({ ...input, outsourcingBudget: event.target.value })
              }
            />
            <span className="pr-3 text-xs text-muted-foreground">/week</span>
          </FieldShell>
          {errors.outsourcingBudget ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.outsourcingBudget}
            </p>
          ) : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="uw-family">
            My family will share
          </label>
          <FieldShell error={Boolean(errors.familySharedHours)}>
            <input
              id="uw-family"
              className={inputClass}
              inputMode="decimal"
              value={input.familySharedHours}
              aria-invalid={Boolean(errors.familySharedHours)}
              onChange={(event) =>
                onChange({ ...input, familySharedHours: event.target.value })
              }
            />
            <span className="pr-3 text-xs text-muted-foreground">h/week</span>
          </FieldShell>
          <p className="mt-1 text-xs text-muted-foreground">
            Weekly hours other household members take on. Cannot exceed total
            unpaid hours.
          </p>
          {errors.familySharedHours ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.familySharedHours}
            </p>
          ) : null}
        </div>
      </Section>

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
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onLoadExample}>
          Load example
        </Button>
      </div>

      {result ? (
        <section
          aria-labelledby="uw-results"
          className="space-y-3 rounded-xl border border-border bg-white p-3.5 sm:p-4"
          role="status"
          aria-live="polite"
        >
          <h3 id="uw-results" className="text-sm font-semibold text-accent">
            Your results
          </h3>
          <dl className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Total unpaid hours</dt>
              <dd className="text-lg font-semibold tabular-nums text-accent">
                {result.totalWeeklyHours} h/week
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Weekly replacement value</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.weeklyReplacementCost, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Monthly replacement value</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.monthlyReplacementCost, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Annual replacement value</dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.annualReplacementCost, result.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                Potential professional earnings
              </dt>
              <dd className="font-medium tabular-nums text-accent">
                {formatMoney(result.potentialWeeklyEarnings, result.currency)}
                /week
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Potential time savings</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.potentialTimeSaved.toFixed(2)} h/week
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Hours still with you</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.remainingWeeklyHours} h after family share
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Budget coverage</dt>
              <dd className="font-medium tabular-nums text-accent">
                {result.budgetCoveragePercent.toFixed(1)}% of weekly replacement cost
              </dd>
            </div>
          </dl>
        </section>
      ) : (
        <p className="rounded-xl border border-dashed border-border bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Enter hours and rates to estimate the value of unpaid work.
        </p>
      )}
    </form>
  );
}
