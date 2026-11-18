'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  MONTH_OPTIONS,
  SALARY_PAY_PERIOD_OPTIONS,
  WEEKDAY_OPTIONS,
  WORKDAYS_PER_WEEK_OPTIONS,
  type ProratedSalaryFieldErrors,
  type ProratedSalaryInput,
  type ProratedSalaryResult,
  type SalaryPayPeriod,
  type Weekday,
  type WorkdaysPerWeek,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full appearance-none rounded-lg border border-border bg-white px-3 pr-9 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

function UnitSelect({
  id,
  value,
  ariaLabel,
  options,
  onChange,
  widthClass = 'w-[96px]',
  error,
}: {
  id: string;
  value: string;
  ariaLabel: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
  widthClass?: string;
  error?: string;
}) {
  return (
    <div className={`relative ${widthClass} shrink-0`}>
      <select
        id={id}
        className={`${selectClass} ${error ? 'border-rose-400' : ''}`}
        value={value}
        aria-label={ariaLabel}
        aria-invalid={Boolean(error)}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}

function offDayLabel(index: number): string {
  const ordinals = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
  ] as const;
  return `${ordinals[index] ?? `Day ${index + 1}`} day off`;
}

interface ProratedSalaryFormProps {
  input: ProratedSalaryInput;
  errors: ProratedSalaryFieldErrors;
  result: ProratedSalaryResult | null;
  onChange: (input: ProratedSalaryInput) => void;
  onGrossCurrencyChange: (next: SupportedCurrency) => void;
  onResultCurrencyChange: (next: SupportedCurrency) => void;
  conversionError?: string | null;
  ratesWarning?: string | null;
}

export function ProratedSalaryForm({
  input,
  errors,
  result,
  onChange,
  onGrossCurrencyChange,
  onResultCurrencyChange,
  conversionError = null,
  ratesWarning = null,
}: ProratedSalaryFormProps) {
  const grossSymbol = getCurrencySymbol(input.grossSalaryCurrency);
  const resultSymbol = getCurrencySymbol(
    result?.resultCurrency ?? input.resultCurrency
  );
  const offCount = 7 - input.workdaysPerWeek;

  const set = (patch: Partial<ProratedSalaryInput>) => {
    onChange({ ...input, ...patch });
  };

  const handleWorkdaysChange = (raw: string) => {
    const next = Number(raw) as WorkdaysPerWeek;
    if (![1, 2, 3, 4, 5, 6, 7].includes(next)) return;
    set({ workdaysPerWeek: next, daysOffOpen: next < 7 });
  };

  const handleDayOffChange = (index: number, raw: string) => {
    const next = Number(raw) as Weekday;
    if (![0, 1, 2, 3, 4, 5, 6].includes(next)) return;
    const daysOff = [...input.daysOff] as Weekday[];
    daysOff[index] = next;
    set({ daysOff });
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <details
        className="rounded-xl border border-border bg-muted/15"
        open={input.scheduleOpen}
        onToggle={(event) => set({ scheduleOpen: event.currentTarget.open })}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-primary transition-transform ${
              input.scheduleOpen ? '' : '-rotate-90'
            }`}
            aria-hidden="true"
          />
          <span>Work schedule and salary</span>
        </summary>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <div>
            <label className={labelClass} htmlFor="ps-year">
              <span>Year</span>
              <InfoTooltip
                label="Year"
                text="Calendar year for the month being prorated. Leap years affect February day counts. Never FX-converted."
              />
            </label>
            <FieldShell error={errors.year}>
              <input
                id="ps-year"
                className={inputClass}
                inputMode="numeric"
                value={input.year}
                aria-invalid={Boolean(errors.year)}
                onChange={(e) => set({ year: e.target.value })}
              />
            </FieldShell>
            {errors.year ? (
              <p className="mt-1 text-xs text-rose-600">{errors.year}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ps-month">
              <span>Month of the year</span>
            </label>
            <div className="relative">
              <select
                id="ps-month"
                className={`${selectClass} ${errors.month ? 'border-rose-400' : ''}`}
                value={input.month}
                aria-invalid={Boolean(errors.month)}
                onChange={(e) => set({ month: e.target.value })}
              >
                {MONTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            {errors.month ? (
              <p className="mt-1 text-xs text-rose-600">{errors.month}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ps-gross">
              <span>Gross salary</span>
              <InfoTooltip
                label="Gross salary"
                text="Pay amount for the selected period. Changing currency converts this amount with stored FX rates. Other periods normalize to a monthly figure before proration."
              />
            </label>
            <div className="flex gap-2">
              <FieldShell error={errors.grossSalary}>
                <span
                  className="shrink-0 pl-3 text-sm text-muted-foreground"
                  aria-hidden="true"
                >
                  {grossSymbol}
                </span>
                <input
                  id="ps-gross"
                  className={inputClass}
                  inputMode="decimal"
                  value={input.grossSalary}
                  aria-invalid={Boolean(errors.grossSalary)}
                  onChange={(e) => set({ grossSalary: e.target.value })}
                />
              </FieldShell>
              <div className="w-[100px] shrink-0 sm:w-[110px]">
                <CurrencySelect
                  id="ps-gross-currency"
                  value={input.grossSalaryCurrency}
                  onChange={onGrossCurrencyChange}
                  aria-label="Gross salary currency"
                />
              </div>
              <UnitSelect
                id="ps-pay-period"
                value={input.payPeriod}
                ariaLabel="Gross salary pay period"
                options={SALARY_PAY_PERIOD_OPTIONS}
                onChange={(v) => set({ payPeriod: v as SalaryPayPeriod })}
                widthClass="w-[88px]"
              />
            </div>
            {errors.grossSalary ? (
              <p className="mt-1 text-xs text-rose-600">{errors.grossSalary}</p>
            ) : null}
            {conversionError ? (
              <p className="mt-1 text-xs text-rose-600" role="alert">
                {conversionError}
              </p>
            ) : null}
            {ratesWarning && !conversionError ? (
              <p className="mt-1 text-xs text-amber-700">{ratesWarning}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ps-days-worked">
              <span>Number of days worked</span>
              <InfoTooltip
                label="Number of days worked"
                text="Payable attendance days in the month, counted separately from holidays and approved leave. Never FX-converted."
              />
            </label>
            <FieldShell error={errors.daysWorked}>
              <input
                id="ps-days-worked"
                className={inputClass}
                inputMode="decimal"
                value={input.daysWorked}
                aria-invalid={Boolean(errors.daysWorked)}
                onChange={(e) => set({ daysWorked: e.target.value })}
              />
            </FieldShell>
            {errors.daysWorked ? (
              <p className="mt-1 text-xs text-rose-600">{errors.daysWorked}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ps-holidays">
              <span>Number of holidays</span>
              <InfoTooltip
                label="Number of holidays"
                text="Paid holiday days that fall on scheduled working days. Counted as payable days and must not overlap days already entered as worked or leave."
              />
            </label>
            <FieldShell error={errors.holidays}>
              <input
                id="ps-holidays"
                className={inputClass}
                inputMode="decimal"
                value={input.holidays}
                aria-invalid={Boolean(errors.holidays)}
                onChange={(e) => set({ holidays: e.target.value })}
              />
            </FieldShell>
            {errors.holidays ? (
              <p className="mt-1 text-xs text-rose-600">{errors.holidays}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ps-leave">
              <span>Number of approved leave</span>
              <InfoTooltip
                label="Number of approved leave"
                text="Approved leave days treated as paid/compensated (payable). Entered separately from days worked and holidays — do not double-count the same calendar day."
              />
            </label>
            <FieldShell error={errors.approvedLeave}>
              <input
                id="ps-leave"
                className={inputClass}
                inputMode="decimal"
                value={input.approvedLeave}
                aria-invalid={Boolean(errors.approvedLeave)}
                onChange={(e) => set({ approvedLeave: e.target.value })}
              />
            </FieldShell>
            {errors.approvedLeave ? (
              <p className="mt-1 text-xs text-rose-600">{errors.approvedLeave}</p>
            ) : null}
          </div>

          <div>
            <label className={labelClass} htmlFor="ps-workdays">
              <span>Days worked per week</span>
              <InfoTooltip
                label="Days worked per week"
                text="Your regular workweek length. Days off selectors below fill the remaining weekdays. Never FX-converted."
              />
            </label>
            <div className="relative">
              <select
                id="ps-workdays"
                className={`${selectClass} ${
                  errors.workdaysPerWeek ? 'border-rose-400' : ''
                }`}
                value={String(input.workdaysPerWeek)}
                aria-invalid={Boolean(errors.workdaysPerWeek)}
                onChange={(e) => handleWorkdaysChange(e.target.value)}
              >
                {WORKDAYS_PER_WEEK_OPTIONS.map((opt) => (
                  <option key={opt.value} value={String(opt.value)}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
            {errors.workdaysPerWeek ? (
              <p className="mt-1 text-xs text-rose-600">
                {errors.workdaysPerWeek}
              </p>
            ) : null}
          </div>
        </div>
      </details>

      {offCount > 0 ? (
        <details
          className="rounded-xl border border-border bg-muted/15"
          open={input.daysOffOpen}
          onToggle={(event) => set({ daysOffOpen: event.currentTarget.open })}
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 px-3.5 py-3 text-[13px] font-semibold text-accent sm:px-4 [&::-webkit-details-marker]:hidden">
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-primary transition-transform ${
                input.daysOffOpen ? '' : '-rotate-90'
              }`}
              aria-hidden="true"
            />
            <span>Choose your days off per week</span>
          </summary>
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
            {Array.from({ length: offCount }, (_, index) => (
              <div key={index}>
                <label className={labelClass} htmlFor={`ps-day-off-${index}`}>
                  <span>{offDayLabel(index)}</span>
                </label>
                <div className="relative">
                  <select
                    id={`ps-day-off-${index}`}
                    className={`${selectClass} ${
                      errors.daysOff ? 'border-rose-400' : ''
                    }`}
                    value={String(input.daysOff[index] ?? 0)}
                    aria-invalid={Boolean(errors.daysOff)}
                    onChange={(e) => handleDayOffChange(index, e.target.value)}
                  >
                    {WEEKDAY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
            {errors.daysOff ? (
              <p className="mt-1 text-xs text-rose-600">{errors.daysOff}</p>
            ) : null}
          </div>
        </details>
      ) : null}

      <div className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-[13px] font-semibold text-accent">Prorated salary</h3>
        {result ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-accent">
              You have{' '}
              <span className="font-semibold tabular-nums">
                {result.scheduledWorkingDays}
              </span>{' '}
              working days in the month. Your prorated salary is:
            </p>
            <div>
              <label className={labelClass} htmlFor="ps-result">
                <span>Prorated salary</span>
                <InfoTooltip
                  label="Prorated salary"
                  text="MonthlySalary × PayableDays / ScheduledWorkingDays. Payable days = days worked + paid holidays + approved leave (each counted once). Change currency to re-express the same amount."
                />
              </label>
              <div className="flex gap-2">
                <FieldShell muted>
                  <span
                    className="shrink-0 pl-3 text-sm text-muted-foreground"
                    aria-hidden="true"
                  >
                    {resultSymbol}
                  </span>
                  <input
                    id="ps-result"
                    className={inputClass}
                    readOnly
                    value={result.formattedProratedSalary}
                    aria-label="Prorated salary"
                  />
                </FieldShell>
                <div className="w-[110px] shrink-0 sm:w-[120px]">
                  <CurrencySelect
                    id="ps-result-currency"
                    value={input.resultCurrency}
                    onChange={onResultCurrencyChange}
                    aria-label="Prorated salary currency"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Payable days {result.payableDays} of{' '}
              {result.scheduledWorkingDays} scheduled working days (
              {result.calendarDaysInMonth} calendar days in month). Holidays and
              approved leave are treated as paid.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter a valid schedule and salary to see eligible working days and
            prorated pay.
          </p>
        )}
        {errors.form ? (
          <p className="text-xs text-rose-600" role="alert">
            {errors.form}
          </p>
        ) : null}
      </div>
    </form>
  );
}
