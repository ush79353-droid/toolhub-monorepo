'use client';

import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  BUILD_TIME_UNITS,
  PAYBACK_UNITS,
  type BuildTimeUnit,
  type BuildVsBuyFieldErrors,
  type BuildVsBuyInput,
  type BuildVsBuyResult,
  type PaybackUnit,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-muted-foreground';

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

interface BuildVsBuyFormProps {
  input: BuildVsBuyInput;
  errors: BuildVsBuyFieldErrors;
  result: BuildVsBuyResult | null;
  onChange: (input: BuildVsBuyInput) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

export function BuildVsBuyForm({
  input,
  errors,
  result,
  onChange,
  onSubmit,
  onReset,
}: BuildVsBuyFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<BuildVsBuyInput>) => onChange({ ...input, ...patch });

  const onNumber = (key: keyof BuildVsBuyInput) => (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    set({ [key]: text === '' ? Number.NaN : Number(text) } as Partial<BuildVsBuyInput>);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <Section title="Buying an external service">
        <div>
          <label className={labelClass} htmlFor="bvb-buy-cost">
            <span>Cost</span>
            <InfoTooltip
              label="Cost"
              text="Annual cost of buying or licensing the external service. Same currency as build costs."
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.buyCostAnnual}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="bvb-buy-cost"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.buyCostAnnual)}
                aria-invalid={Boolean(errors.buyCostAnnual)}
                onChange={onNumber('buyCostAnnual')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bvb-buy-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
            <span className={selectClass} aria-hidden="true">
              / yr
            </span>
          </div>
          {errors.buyCostAnnual ? (
            <p className="mt-1 text-xs text-rose-600">{errors.buyCostAnnual}</p>
          ) : null}
        </div>
      </Section>

      <Section title="Building your own software">
        <div>
          <label className={labelClass} htmlFor="bvb-employees">
            Employees required
          </label>
          <FieldShell error={errors.employees}>
            <input
              id="bvb-employees"
              className={inputClass}
              inputMode="decimal"
              value={numberOrBlank(input.employees)}
              aria-invalid={Boolean(errors.employees)}
              onChange={onNumber('employees')}
            />
          </FieldShell>
          {errors.employees ? (
            <p className="mt-1 text-xs text-rose-600">{errors.employees}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bvb-build-time">
            Time to build
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.buildTime}>
              <input
                id="bvb-build-time"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.buildTime)}
                aria-invalid={Boolean(errors.buildTime)}
                onChange={onNumber('buildTime')}
              />
            </FieldShell>
            <select
              className={selectClass}
              aria-label="Build duration unit"
              value={input.buildTimeUnit}
              onChange={(event) => set({ buildTimeUnit: event.target.value as BuildTimeUnit })}
            >
              {BUILD_TIME_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit === 'weeks' ? 'wks' : unit === 'days' ? 'days' : unit === 'months' ? 'mo' : 'yrs'}
                </option>
              ))}
            </select>
          </div>
          {errors.buildTime ? (
            <p className="mt-1 text-xs text-rose-600">{errors.buildTime}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bvb-salary">
            Employee salary (gross)
          </label>
          <div className="flex flex-wrap gap-2">
            <FieldShell error={errors.salaryMonthly}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="bvb-salary"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.salaryMonthly)}
                aria-invalid={Boolean(errors.salaryMonthly)}
                onChange={onNumber('salaryMonthly')}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bvb-salary-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
              />
            </div>
            <span className={selectClass} aria-hidden="true">
              / mo
            </span>
          </div>
          {errors.salaryMonthly ? (
            <p className="mt-1 text-xs text-rose-600">{errors.salaryMonthly}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bvb-overhead">
            <span>Overhead</span>
            <InfoTooltip
              label="Overhead"
              text="Employer load on gross salary (benefits, taxes, equipment). Effective monthly cost = salary × (1 + overhead ÷ 100)."
            />
          </label>
          <div className="relative">
            <FieldShell error={errors.overheadPercent}>
              <input
                id="bvb-overhead"
                className={`${inputClass} pr-10`}
                inputMode="decimal"
                value={numberOrBlank(input.overheadPercent)}
                aria-invalid={Boolean(errors.overheadPercent)}
                onChange={onNumber('overheadPercent')}
              />
              <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </FieldShell>
          </div>
          {errors.overheadPercent ? (
            <p className="mt-1 text-xs text-rose-600">{errors.overheadPercent}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bvb-effective">
            Effective cost per employee
          </label>
          <div className="flex flex-wrap gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="bvb-effective"
                className={`${inputClass} cursor-default`}
                readOnly
                value={result?.effectiveMonthlyDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </div>
            <span className={selectClass} aria-hidden="true">
              / mo
            </span>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="bvb-maintenance-days">
            <span>Days of maintenance</span>
            <InfoTooltip
              label="Days of maintenance"
              text="Working days per month spent maintaining the built software. Annual maintenance uses 22 working days per month."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.maintenanceDaysPerMonth}>
              <input
                id="bvb-maintenance-days"
                className={inputClass}
                inputMode="decimal"
                value={numberOrBlank(input.maintenanceDaysPerMonth)}
                aria-invalid={Boolean(errors.maintenanceDaysPerMonth)}
                onChange={onNumber('maintenanceDaysPerMonth')}
              />
            </FieldShell>
            <span className={selectClass} aria-hidden="true">
              / mo
            </span>
          </div>
          {errors.maintenanceDaysPerMonth ? (
            <p className="mt-1 text-xs text-rose-600">{errors.maintenanceDaysPerMonth}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="bvb-cost-build">
            Cost to build
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="bvb-cost-build"
                className={`${inputClass} cursor-default`}
                readOnly
                value={result?.costToBuildDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bvb-build-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Cost to build currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="bvb-annual-maint">
            Annual maintenance
          </label>
          <div className="flex flex-wrap gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="bvb-annual-maint"
                className={`${inputClass} cursor-default`}
                readOnly
                value={result?.annualMaintenanceDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bvb-maint-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Annual maintenance currency"
              />
            </div>
            <span className={selectClass} aria-hidden="true">
              / yr
            </span>
          </div>
        </div>
      </Section>

      <Section title="Build or buy?">
        <div>
          <label className={labelClass} htmlFor="bvb-savings">
            Annual savings
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="bvb-savings"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.annualSavingsDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="bvb-savings-currency"
                value={input.currency}
                onChange={(currency) => set({ currency })}
                aria-label="Annual savings currency"
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="bvb-payback">
            Years to profit
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <input
                id="bvb-payback"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.paybackDisplay ?? ''}
                placeholder="—"
                aria-live="polite"
              />
            </div>
            <select
              className={selectClass}
              aria-label="Payback unit"
              value={input.paybackUnit}
              onChange={(event) => set({ paybackUnit: event.target.value as PaybackUnit })}
            >
              {PAYBACK_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit === 'years' ? 'yrs' : 'mo'}
                </option>
              ))}
            </select>
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

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
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
