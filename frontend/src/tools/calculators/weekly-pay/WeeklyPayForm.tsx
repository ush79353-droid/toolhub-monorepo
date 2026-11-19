'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { CURRENCY_DENOMINATION_NOTE, getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { MAX_WEEKS_PER_YEAR } from './calculation';
import type {
  PaySource,
  ScheduleDriver,
  WeeklyPayFieldErrors,
  WeeklyPayInput,
  WeeklyPayResult,
} from './types';

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

function Disclosure({
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
    <div className="rounded-xl border border-border bg-muted/15">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>
      {open ? <div className="space-y-3 border-t border-border px-3.5 py-3">{children}</div> : null}
    </div>
  );
}

interface WeeklyPayFormProps {
  input: WeeklyPayInput;
  errors: WeeklyPayFieldErrors;
  result: WeeklyPayResult | null;
  onChange: (input: WeeklyPayInput) => void;
  onCurrencyChange: (currency: WeeklyPayInput['currency']) => void;
  onLoadHourlyExample: () => void;
  onLoadMonthlyExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function WeeklyPayForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onLoadHourlyExample,
  onLoadMonthlyExample,
  onClear,
  onReset,
}: WeeklyPayFormProps) {
  const symbol = getCurrencySymbol(input.currency);

  const setPay = (source: PaySource, value: string) => {
    onChange({ ...input, source, [source]: value });
  };

  const setSchedule = (
    patch: Partial<WeeklyPayInput>,
    scheduleDriver?: ScheduleDriver,
  ) => {
    const next = { ...input, ...patch, ...(scheduleDriver ? { scheduleDriver } : {}) };

    if (scheduleDriver === 'hoursPerDay' || scheduleDriver === 'daysPerWeek') {
      const hpd = Number((next.hoursPerDay || '').replace(/,/g, ''));
      const dpw = Number((next.daysPerWeek || '').replace(/,/g, ''));
      if (Number.isFinite(hpd) && Number.isFinite(dpw) && hpd > 0 && dpw > 0) {
        next.hoursPerWeek = String(hpd * dpw);
      }
    } else if (scheduleDriver === 'hoursPerWeek') {
      const hpw = Number((next.hoursPerWeek || '').replace(/,/g, ''));
      const dpw = Number((next.daysPerWeek || '').replace(/,/g, ''));
      if (Number.isFinite(hpw) && Number.isFinite(dpw) && hpw > 0 && dpw > 0) {
        next.hoursPerDay = String(hpw / dpw);
      }
    }

    if (patch.unpaidWeeksOff !== undefined) {
      const unpaid = Number((next.unpaidWeeksOff || '').replace(/,/g, ''));
      if (Number.isFinite(unpaid) && unpaid >= 0 && unpaid < MAX_WEEKS_PER_YEAR) {
        next.paidWeeksPerYear = String(MAX_WEEKS_PER_YEAR - unpaid);
      }
    }
    if (patch.paidWeeksPerYear !== undefined) {
      const paid = Number((next.paidWeeksPerYear || '').replace(/,/g, ''));
      if (Number.isFinite(paid) && paid > 0 && paid <= MAX_WEEKS_PER_YEAR) {
        next.unpaidWeeksOff = String(MAX_WEEKS_PER_YEAR - paid);
      }
    }

    onChange(next);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Gross pay conversions before taxes and deductions. Currency changes the display symbol
        only — amounts are not converted.
      </p>

      <form
        className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
        <h3 className="text-sm font-semibold text-accent">Data</h3>

        {(
          [
            ['hourly', 'Hourly wage', input.hourly, errors.hourly],
            ['daily', 'Daily pay', input.daily, errors.daily],
            ['monthly', 'Monthly pay', input.monthly, errors.monthly],
            ['annual', 'Annual salary', input.annual, errors.annual],
          ] as const
        ).map(([key, label, value, error]) => (
          <div key={key}>
            <label className={labelClass} htmlFor={`wp-${key}`}>
              <span>{label}</span>
            </label>
            <FieldShell error={error}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden>
                {symbol}
              </span>
              <input
                id={`wp-${key}`}
                className={inputClass}
                inputMode="decimal"
                value={value}
                aria-invalid={Boolean(error)}
                onChange={(e) => setPay(key, e.target.value)}
              />
            </FieldShell>
            {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
          </div>
        ))}

        <div>
          <label className={labelClass} htmlFor="wp-currency">
            <span>Display currency</span>
          </label>
          <CurrencySelect
            id="wp-currency"
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label="Display currency"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">{CURRENCY_DENOMINATION_NOTE}</p>
        </div>
      </form>

      <Disclosure
        title="Hours and days you work"
        open={input.scheduleOpen}
        onToggle={() => onChange({ ...input, scheduleOpen: !input.scheduleOpen })}
      >
        <div>
          <label className={labelClass} htmlFor="wp-hpd">
            <span>Hours per day</span>
            <InfoTooltip label="Hours per day" text="Paid hours in one working day. Default 8." />
          </label>
          <FieldShell error={errors.hoursPerDay}>
            <input
              id="wp-hpd"
              className={inputClass}
              inputMode="decimal"
              value={input.hoursPerDay}
              onChange={(e) => setSchedule({ hoursPerDay: e.target.value }, 'hoursPerDay')}
            />
          </FieldShell>
          {errors.hoursPerDay ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hoursPerDay}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="wp-dpw">
            <span>Days per week</span>
          </label>
          <FieldShell error={errors.daysPerWeek}>
            <input
              id="wp-dpw"
              className={inputClass}
              inputMode="decimal"
              value={input.daysPerWeek}
              onChange={(e) => setSchedule({ daysPerWeek: e.target.value }, 'daysPerWeek')}
            />
          </FieldShell>
          {errors.daysPerWeek ? (
            <p className="mt-1 text-xs text-rose-600">{errors.daysPerWeek}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="wp-hpw">
            <span>Hours per week</span>
            <InfoTooltip
              label="Hours per week"
              text="Synced as hours/day × days/week. Editing this keeps days/week fixed and updates hours/day."
            />
          </label>
          <FieldShell error={errors.hoursPerWeek}>
            <input
              id="wp-hpw"
              className={inputClass}
              inputMode="decimal"
              value={input.hoursPerWeek}
              onChange={(e) => setSchedule({ hoursPerWeek: e.target.value }, 'hoursPerWeek')}
            />
          </FieldShell>
          {errors.hoursPerWeek ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hoursPerWeek}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="wp-wpy">
            <span>Paid weeks per year</span>
          </label>
          <FieldShell error={errors.paidWeeksPerYear}>
            <input
              id="wp-wpy"
              className={inputClass}
              inputMode="decimal"
              value={input.paidWeeksPerYear}
              onChange={(e) => setSchedule({ paidWeeksPerYear: e.target.value })}
            />
          </FieldShell>
          {errors.paidWeeksPerYear ? (
            <p className="mt-1 text-xs text-rose-600">{errors.paidWeeksPerYear}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="wp-unpaid">
            <span>Unpaid weeks off</span>
            <InfoTooltip
              label="Unpaid weeks off"
              text="Synced with paid weeks: paid weeks = 52 − unpaid weeks. Paid vacation is not unpaid leave."
            />
          </label>
          <FieldShell error={errors.unpaidWeeksOff}>
            <input
              id="wp-unpaid"
              className={inputClass}
              inputMode="decimal"
              value={input.unpaidWeeksOff}
              onChange={(e) => setSchedule({ unpaidWeeksOff: e.target.value })}
            />
          </FieldShell>
          {errors.unpaidWeeksOff ? (
            <p className="mt-1 text-xs text-rose-600">{errors.unpaidWeeksOff}</p>
          ) : null}
        </div>

        {result ? (
          <p className="rounded-lg border border-border bg-white px-3 py-2 text-xs text-muted-foreground">
            Schedule: {result.hoursPerDay} h/day · {result.daysPerWeek} days/week ·{' '}
            {result.hoursPerWeek} h/week · {result.paidWeeksPerYear} paid weeks/year · ≈{' '}
            {result.averageWeeksPerMonth.toFixed(4)} paid weeks/month
          </p>
        ) : null}
      </Disclosure>

      <div className="space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Result</h3>
        <div className="rounded-lg border border-border bg-white px-3 py-3">
          {result ? (
            <>
              <p className="text-xs text-muted-foreground">Weekly pay</p>
              <p className="text-2xl font-semibold tabular-nums text-accent">
                {symbol}
                {result.formattedWeekly}
                <span className="ml-2 text-sm font-medium text-muted-foreground">per week</span>
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter a pay amount and a valid schedule to see weekly pay.
            </p>
          )}
        </div>

        <Disclosure
          title="Pay breakdown"
          open={input.breakdownOpen}
          onToggle={() => onChange({ ...input, breakdownOpen: !input.breakdownOpen })}
        >
          {result ? (
            <ul className="space-y-1.5 text-sm text-foreground/90">
              <li>
                Hourly: {symbol}
                {result.formattedHourly}
              </li>
              <li>
                Daily: {symbol}
                {result.formattedDaily}
              </li>
              <li>
                Weekly: {symbol}
                {result.formattedWeekly}
              </li>
              <li>
                Monthly (avg): {symbol}
                {result.formattedMonthly}
              </li>
              <li>
                Annual: {symbol}
                {result.formattedAnnual}
              </li>
              <li>Paid hours/week: {result.hoursPerWeek}</li>
              <li>Paid weeks/year: {result.paidWeeksPerYear}</li>
              <li>Annual paid hours: {result.annualPaidHours}</li>
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">Breakdown appears after a valid calculation.</p>
          )}
        </Disclosure>
      </div>

      <Disclosure
        title="Check our examples"
        open={input.examplesOpen}
        onToggle={() => onChange({ ...input, examplesOpen: !input.examplesOpen })}
      >
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="h-10" onClick={onLoadHourlyExample}>
            Example 1 — Hourly wage ($18)
          </Button>
          <Button type="button" variant="outline" className="h-10" onClick={onLoadMonthlyExample}>
            Example 2 — Monthly salary ($4,000)
          </Button>
        </div>
      </Disclosure>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Reload calculator
        </Button>
        <Button type="button" variant="ghost" className="h-11" onClick={onClear}>
          Clear all changes
        </Button>
      </div>
    </div>
  );
}
