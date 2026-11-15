'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatDays, formatMoney } from './calculation';
import {
  type ConsultingFeesFieldErrors,
  type ConsultingFeesInput,
  type ConsultingFeesResult,
  type OperatingCostKey,
} from './types';

const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';

function numberOrBlank(value: number): string {
  return Number.isFinite(value) ? String(value) : '';
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div
      className={`flex h-11 min-w-0 flex-1 items-center rounded-lg border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : 'border-border'
      }`}
    >
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="rounded-xl border border-border bg-muted/15">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="space-y-3.5 px-4 pb-4">{children}</div>
    </details>
  );
}

const COST_FIELDS: { key: OperatingCostKey; label: string; tip?: string }[] = [
  { key: 'advertising', label: 'Advertising and marketing' },
  { key: 'equipment', label: 'Equipment, hardware and software' },
  { key: 'training', label: 'Training and education' },
  { key: 'memberships', label: 'Memberships and associations' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'healthcare', label: 'Healthcare' },
  {
    key: 'officeExpenses',
    label: 'Office expenses',
    tip: 'Utilities, internet, phone, and other recurring office costs (excluding rent).',
  },
  { key: 'officeRent', label: 'Office space rent' },
  {
    key: 'supplies',
    label: 'Supplies',
    tip: 'Consumables and general office supplies for the year.',
  },
  {
    key: 'professionalFees',
    label: 'Professional fees',
    tip: 'Legal, accounting, bookkeeping, and similar professional services.',
  },
];

interface ConsultingFeesFormProps {
  input: ConsultingFeesInput;
  errors: ConsultingFeesFieldErrors;
  result: ConsultingFeesResult | null;
  billableDays: number | null;
  annualOperatingCosts: number;
  onChange: (input: ConsultingFeesInput) => void;
  onReset: () => void;
}

export function ConsultingFeesForm({
  input,
  errors,
  result,
  billableDays,
  annualOperatingCosts,
  onChange,
  onReset,
}: ConsultingFeesFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ConsultingFeesInput>) => onChange({ ...input, ...patch });

  const onNumber = (key: keyof ConsultingFeesInput) => (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<ConsultingFeesInput>);
  };

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">Display currency</span>
        <div className="w-[140px]">
          <CurrencySelect
            id="consulting-fees-currency"
            value={input.currency}
            onChange={(currency) => set({ currency })}
          />
        </div>
      </div>

      <Section title="Billable days a year">
        <div>
          <label htmlFor="cf-hours" className={labelClass}>
            Working hours per day
            <InfoTooltip
              label="Working hours per day"
              text="Hours you typically work on a billable day. Used to convert the daily rate into an hourly rate."
            />
          </label>
          <div className="relative">
            <FieldShell error={errors.workingHoursPerDay}>
              <input
                id="cf-hours"
                className={`${inputClass} pr-12`}
                inputMode="decimal"
                value={numberOrBlank(input.workingHoursPerDay)}
                aria-invalid={Boolean(errors.workingHoursPerDay)}
                onChange={onNumber('workingHoursPerDay')}
              />
            </FieldShell>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
              hrs
            </span>
          </div>
          {errors.workingHoursPerDay ? (
            <p className="mt-1 text-xs text-rose-600">{errors.workingHoursPerDay}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cf-weekdays" className={labelClass}>
            Number of weekdays in a year
          </label>
          <FieldShell error={errors.weekdaysPerYear}>
            <input
              id="cf-weekdays"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.weekdaysPerYear)}
              aria-invalid={Boolean(errors.weekdaysPerYear)}
              onChange={onNumber('weekdaysPerYear')}
            />
          </FieldShell>
          {errors.weekdaysPerYear ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weekdaysPerYear}</p>
          ) : null}
        </div>

        {(
          [
            ['holidayDays', 'Number of holiday days each year?', 'days'],
            ['sickDays', 'Number of sick days each year?', 'days'],
            [
              'nonClientDays',
              'Number of marketing, admin, non-client work days each year?',
              'days',
            ],
          ] as const
        ).map(([key, label, unit]) => (
          <div key={key}>
            <label htmlFor={`cf-${key}`} className={labelClass}>
              {label}
            </label>
            <div className="relative">
              <FieldShell error={errors[key]}>
                <input
                  id={`cf-${key}`}
                  className={`${inputClass} pr-12`}
                  inputMode="decimal"
                  value={numberOrBlank(input[key])}
                  aria-invalid={Boolean(errors[key])}
                  onChange={onNumber(key)}
                />
              </FieldShell>
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
                {unit}
              </span>
            </div>
            {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
          </div>
        ))}

        <div>
          <label htmlFor="cf-billable" className={labelClass}>
            Number of billable days
          </label>
          <div className="relative">
            <FieldShell>
              <input
                id="cf-billable"
                className={`${inputClass} bg-muted/20 pr-12 font-semibold`}
                readOnly
                value={
                  billableDays !== null && Number.isFinite(billableDays)
                    ? formatDays(billableDays)
                    : ''
                }
                aria-live="polite"
              />
            </FieldShell>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-muted-foreground">
              days
            </span>
          </div>
          {errors.billableDays ? (
            <p className="mt-1 text-xs text-rose-600">{errors.billableDays}</p>
          ) : null}
        </div>
      </Section>

      <Section title="Annual operating costs">
        {COST_FIELDS.map(({ key, label, tip }) => (
          <div key={key}>
            <label htmlFor={`cf-${key}`} className={labelClass}>
              {label}
              {tip ? <InfoTooltip label={label} text={tip} /> : null}
            </label>
            <div className="relative">
              <FieldShell error={errors[key]}>
                <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
                <input
                  id={`cf-${key}`}
                  className={inputClass}
                  inputMode="decimal"
                  value={numberOrBlank(input[key])}
                  aria-invalid={Boolean(errors[key])}
                  onChange={onNumber(key)}
                />
              </FieldShell>
            </div>
            {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
          </div>
        ))}

        <div>
          <label htmlFor="cf-op-total" className={labelClass}>
            Annual operating costs
          </label>
          <div className="relative">
            <FieldShell>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cf-op-total"
                className={`${inputClass} bg-muted/20 font-semibold`}
                readOnly
                value={formatMoney(annualOperatingCosts, input.currency)}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        </div>
      </Section>

      <Section title="Project size and target income">
        <div>
          <label htmlFor="cf-project" className={labelClass}>
            Average project value
            <InfoTooltip
              label="Average project value"
              text="Optional planning context for typical engagement size. It does not change the daily or hourly rate formulas."
            />
          </label>
          <div className="relative">
            <FieldShell error={errors.averageProjectValue}>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cf-project"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.averageProjectValue)}
                aria-invalid={Boolean(errors.averageProjectValue)}
                onChange={onNumber('averageProjectValue')}
              />
            </FieldShell>
          </div>
          {errors.averageProjectValue ? (
            <p className="mt-1 text-xs text-rose-600">{errors.averageProjectValue}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cf-target" className={labelClass}>
            Target income
            <InfoTooltip
              label="Target income"
              text="Desired take-home or owner income for the year before dividing by billable days."
            />
          </label>
          <div className="relative">
            <FieldShell error={errors.targetIncome}>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cf-target"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.targetIncome)}
                aria-invalid={Boolean(errors.targetIncome)}
                onChange={onNumber('targetIncome')}
              />
            </FieldShell>
          </div>
          {errors.targetIncome ? (
            <p className="mt-1 text-xs text-rose-600">{errors.targetIncome}</p>
          ) : null}
        </div>
      </Section>

      <Section title="Results">
        <div>
          <label htmlFor="cf-daily" className={labelClass}>
            Daily billable rate
          </label>
          <div className="relative">
            <FieldShell>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cf-daily"
                className={`${inputClass} bg-muted/20 font-semibold`}
                readOnly
                value={result ? formatMoney(result.dailyBillableRate, result.currency) : ''}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        </div>
        <div>
          <label htmlFor="cf-hourly" className={labelClass}>
            Hourly rate
          </label>
          <div className="relative">
            <FieldShell>
              <span className="pl-3 text-sm text-muted-foreground">{symbol}</span>
              <input
                id="cf-hourly"
                className={`${inputClass} bg-muted/20 font-semibold`}
                readOnly
                value={result ? formatMoney(result.hourlyRate, result.currency) : ''}
                aria-live="polite"
              />
            </FieldShell>
          </div>
        </div>
      </Section>

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
