'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SmokersCtcFieldErrors,
  SmokersCtcInput,
  SmokersCtcResult,
  WagePeriod,
} from './types';
import { WAGE_PERIOD_OPTIONS } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function numberOrBlank(value: number): string {
  return Number.isFinite(value) ? String(value) : '';
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function ReadOnlyShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/10">
      {children}
    </div>
  );
}

function wageLabel(period: WagePeriod): string {
  switch (period) {
    case 'hourly':
      return 'Hourly wage';
    case 'daily':
      return 'Daily wage';
    case 'weekly':
      return 'Weekly wage';
    case 'monthly':
      return 'Monthly wage';
    case 'yearly':
      return 'Yearly wage';
  }
}

interface SmokersCtcFormProps {
  input: SmokersCtcInput;
  errors: SmokersCtcFieldErrors;
  result: SmokersCtcResult | null;
  workdayOpen: boolean;
  smokingTimeOpen: boolean;
  onChange: (input: SmokersCtcInput) => void;
  onToggleWorkday: () => void;
  onToggleSmokingTime: () => void;
  onReset: () => void;
  onReload: () => void;
}

export function SmokersCtcForm({
  input,
  errors,
  result,
  workdayOpen,
  smokingTimeOpen,
  onChange,
  onToggleWorkday,
  onToggleSmokingTime,
  onReset,
  onReload,
}: SmokersCtcFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<SmokersCtcInput>) => onChange({ ...input, ...patch });

  const onNumber =
    (key: keyof SmokersCtcInput) => (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      set({
        [key]: text === '' ? Number.NaN : Number(text),
      } as Partial<SmokersCtcInput>);
    };

  const moneyInput = (
    key: 'wage' | 'packPrice',
    id: string,
    label: string,
    tip: string
  ) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <FieldShell error={errors[key]}>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={inputClass}
            inputMode="decimal"
            value={numberOrBlank(input[key])}
            aria-invalid={Boolean(errors[key])}
            onChange={onNumber(key)}
          />
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={(currency) => set({ currency })}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  const moneyOutput = (id: string, label: string, tip: string, display: string) => (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        <InfoTooltip label={label} text={tip} />
      </label>
      <div className="flex gap-2">
        <ReadOnlyShell>
          <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {symbol}
          </span>
          <input
            id={id}
            className={`${inputClass} cursor-default font-semibold text-accent`}
            readOnly
            value={display}
            aria-live="polite"
          />
        </ReadOnlyShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={(currency) => set({ currency })}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <section className={sectionClass} aria-labelledby="smokers-time-heading">
        <h3 id="smokers-time-heading" className={sectionTitleClass}>
          Time spent smoking at work
        </h3>

        <div>
          <label htmlFor="smokers-break-minutes" className={labelClass}>
            Avg smoke time break
            <InfoTooltip
              label="Avg smoke time break"
              text="Average length of one smoke break, including walking to and from the smoking area."
            />
          </label>
          <FieldShell error={errors.breakMinutes}>
            <input
              id="smokers-break-minutes"
              className={`${inputClass} pr-14`}
              inputMode="decimal"
              value={numberOrBlank(input.breakMinutes)}
              aria-invalid={Boolean(errors.breakMinutes)}
              onChange={onNumber('breakMinutes')}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              min
            </span>
          </FieldShell>
          {errors.breakMinutes ? (
            <p className="mt-1 text-xs text-rose-600">{errors.breakMinutes}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="smokers-breaks-per-day" className={labelClass}>
            Smoke breaks per day
            <InfoTooltip
              label="Smoke breaks per day"
              text="Number of smoke breaks during a typical workday. Cigarette cost and life lines assume one cigarette per break."
            />
          </label>
          <FieldShell error={errors.breaksPerDay}>
            <input
              id="smokers-breaks-per-day"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.breaksPerDay)}
              aria-invalid={Boolean(errors.breaksPerDay)}
              onChange={onNumber('breaksPerDay')}
            />
          </FieldShell>
          {errors.breaksPerDay ? (
            <p className="mt-1 text-xs text-rose-600">{errors.breaksPerDay}</p>
          ) : null}
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="smokers-wage-heading">
        <h3 id="smokers-wage-heading" className={sectionTitleClass}>
          What is the employee’s wage?
        </h3>

        <div>
          <label htmlFor="smokers-wage-period" className={labelClass}>
            Period
          </label>
          <select
            id="smokers-wage-period"
            className={selectClass}
            value={input.wagePeriod}
            onChange={(event) => set({ wagePeriod: event.target.value as WagePeriod })}
          >
            {WAGE_PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {moneyInput(
          'wage',
          'smokers-wage',
          wageLabel(input.wagePeriod),
          'Pay for the selected period. Converted to an hourly rate using work day settings. Currency changes the symbol only.'
        )}
      </section>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={workdayOpen}
          onClick={onToggleWorkday}
        >
          <span>Work day settings</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${workdayOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {workdayOpen ? (
          <div className="space-y-3.5 border-t border-border px-4 py-4">
            <div>
              <label htmlFor="smokers-hours-per-day" className={labelClass}>
                Hours worked per day
              </label>
              <FieldShell error={errors.hoursPerDay}>
                <input
                  id="smokers-hours-per-day"
                  className={`${inputClass} pr-16`}
                  inputMode="decimal"
                  value={numberOrBlank(input.hoursPerDay)}
                  aria-invalid={Boolean(errors.hoursPerDay)}
                  onChange={onNumber('hoursPerDay')}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  hrs / day
                </span>
              </FieldShell>
              {errors.hoursPerDay ? (
                <p className="mt-1 text-xs text-rose-600">{errors.hoursPerDay}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="smokers-days-per-week" className={labelClass}>
                Days worked per week
              </label>
              <FieldShell error={errors.daysPerWeek}>
                <input
                  id="smokers-days-per-week"
                  className={`${inputClass} pr-16`}
                  inputMode="decimal"
                  value={numberOrBlank(input.daysPerWeek)}
                  aria-invalid={Boolean(errors.daysPerWeek)}
                  onChange={onNumber('daysPerWeek')}
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                  days / wk
                </span>
              </FieldShell>
              {errors.daysPerWeek ? (
                <p className="mt-1 text-xs text-rose-600">{errors.daysPerWeek}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="smokers-holidays" className={labelClass}>
                Days holiday per year
                <InfoTooltip
                  label="Days holiday per year"
                  text="Subtracted from days/week × 52 for yearly money and smoking-time totals. Does not change the life-expectancy line."
                />
              </label>
              <FieldShell error={errors.holidayDays}>
                <input
                  id="smokers-holidays"
                  className={inputClass}
                  inputMode="decimal"
                  value={numberOrBlank(input.holidayDays)}
                  aria-invalid={Boolean(errors.holidayDays)}
                  onChange={onNumber('holidayDays')}
                />
              </FieldShell>
              {errors.holidayDays ? (
                <p className="mt-1 text-xs text-rose-600">{errors.holidayDays}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={smokingTimeOpen}
          onClick={onToggleSmokingTime}
        >
          <span>Time spent smoking</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${
              smokingTimeOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
        {smokingTimeOpen ? (
          <div className="space-y-3.5 border-t border-border px-4 py-4">
            {(
              [
                ['smokers-time-daily', 'Daily', result?.dailySmokingDisplay ?? ''],
                ['smokers-time-weekly', 'Weekly', result?.weeklySmokingDisplay ?? ''],
                ['smokers-time-monthly', 'Monthly', result?.monthlySmokingDisplay ?? ''],
                ['smokers-time-yearly', 'Yearly', result?.yearlySmokingDisplay ?? ''],
              ] as const
            ).map(([id, label, display]) => (
              <div key={id}>
                <label htmlFor={id} className={labelClass}>
                  {label}
                </label>
                <ReadOnlyShell>
                  <input
                    id={id}
                    className={`${inputClass} cursor-default font-semibold text-accent`}
                    readOnly
                    value={display}
                    aria-live="polite"
                  />
                </ReadOnlyShell>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <section
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
        aria-labelledby="smokers-labor-heading"
      >
        <h3 id="smokers-labor-heading" className={sectionTitleClass}>
          Money employee earned while smoking
        </h3>
        {moneyOutput(
          'smokers-labor-daily',
          'Daily',
          'Daily smoking hours × hourly wage.',
          result?.dailyLaborDisplay ?? ''
        )}
        {moneyOutput(
          'smokers-labor-weekly',
          'Weekly',
          'Daily labor cost × days worked per week.',
          result?.weeklyLaborDisplay ?? ''
        )}
        {moneyOutput(
          'smokers-labor-monthly',
          'Monthly',
          'Yearly labor cost ÷ 12.',
          result?.monthlyLaborDisplay ?? ''
        )}
        {moneyOutput(
          'smokers-labor-yearly',
          'Yearly',
          'Daily labor cost × (days/week × 52 − holiday days).',
          result?.yearlyLaborDisplay ?? ''
        )}
      </section>

      <section className={sectionClass} aria-labelledby="smokers-cig-heading">
        <h3 id="smokers-cig-heading" className={sectionTitleClass}>
          How much do all these cigarettes cost?
        </h3>

        {moneyInput(
          'packPrice',
          'smokers-pack-price',
          'Cost of a pack of cigarettes',
          'Price of one pack. Cost assumes one cigarette per smoke break at work.'
        )}

        <div>
          <label htmlFor="smokers-pack-count" className={labelClass}>
            Number of cigarettes in a packet
          </label>
          <FieldShell error={errors.cigarettesPerPack}>
            <input
              id="smokers-pack-count"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.cigarettesPerPack)}
              aria-invalid={Boolean(errors.cigarettesPerPack)}
              onChange={onNumber('cigarettesPerPack')}
            />
          </FieldShell>
          {errors.cigarettesPerPack ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cigarettesPerPack}</p>
          ) : null}
        </div>

        {moneyOutput(
          'smokers-cig-weekly',
          'Weekly cost',
          'Breaks × days/week × (pack price ÷ cigarettes per pack), one cigarette per break.',
          result?.weeklyCigaretteDisplay ?? ''
        )}
        {moneyOutput(
          'smokers-cig-yearly',
          'Yearly cost',
          'Breaks × workdays/year × cost per cigarette. Workdays = days/week × 52 − holidays.',
          result?.yearlyCigaretteDisplay ?? ''
        )}

        <div>
          <label htmlFor="smokers-life-days" className={labelClass}>
            Life expectancy cost
            <InfoTooltip
              label="Life expectancy cost"
              text="Illustrative only: one cigarette per break × (days/week × 52) × 11 minutes ÷ 1,440. A commonly cited heuristic — not medical advice or an individual prediction."
            />
          </label>
          <ReadOnlyShell>
            <input
              id="smokers-life-days"
              className={`${inputClass} cursor-default pr-14 font-semibold text-accent`}
              readOnly
              value={result?.lifeExpectancyDisplay ?? ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              days
            </span>
          </ReadOnlyShell>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
