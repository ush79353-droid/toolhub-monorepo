'use client';

import type { ChangeEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { countFilledAdditionalCosts } from './calculation';
import type { LaborCostFieldErrors, LaborCostInput, LaborCostResult } from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-white p-3.5 sm:p-4';
const sectionTitleClass = 'text-sm font-semibold text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

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

interface LaborCostFormProps {
  input: LaborCostInput;
  errors: LaborCostFieldErrors;
  result: LaborCostResult | null;
  additionalOpen: boolean;
  percentageOpen: boolean;
  onChange: (input: LaborCostInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onToggleAdditional: () => void;
  onTogglePercentage: () => void;
  onReset: () => void;
}

export function LaborCostForm({
  input,
  errors,
  result,
  additionalOpen,
  percentageOpen,
  onChange,
  onCurrencyChange,
  onToggleAdditional,
  onTogglePercentage,
  onReset,
}: LaborCostFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<LaborCostInput>) => onChange({ ...input, ...patch });
  const filledExtra = countFilledAdditionalCosts(input);
  const revenueFilled = Number.isFinite(input.revenue) && input.revenue !== 0 ? 1 : 0;

  const onNumber =
    (key: keyof LaborCostInput) => (event: ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.trim();
      set({
        [key]: text === '' ? Number.NaN : Number(text),
      } as Partial<LaborCostInput>);
    };

  const moneyInput = (
    key: keyof LaborCostInput,
    id: string,
    label: string,
    tip: string,
    suffix?: string
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
            className={`${inputClass} ${suffix ? 'pr-16' : ''}`}
            inputMode="decimal"
            value={numberOrBlank(input[key] as number)}
            aria-invalid={Boolean(errors[key])}
            onChange={onNumber(key)}
          />
          {suffix ? (
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              {suffix}
            </span>
          ) : null}
        </FieldShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
            aria-label={`${label} currency`}
          />
        </div>
      </div>
      {errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null}
    </div>
  );

  const moneyOutput = (id: string, label: string, tip: string, display: string, suffix?: string) => (
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
            className={`${inputClass} cursor-default pr-16 font-semibold text-accent`}
            readOnly
            value={display}
            aria-live="polite"
          />
          {suffix ? (
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              {suffix}
            </span>
          ) : null}
        </ReadOnlyShell>
        <div className="w-[110px] shrink-0 sm:w-[120px]">
          <CurrencySelect
            id={`${id}-currency`}
            value={input.currency}
            onChange={onCurrencyChange}
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
      <section className={sectionClass} aria-labelledby="labor-gross-heading">
        <h3 id="labor-gross-heading" className={sectionTitleClass}>
          Gross pay
        </h3>

        <div>
          <label htmlFor="labor-weekly-hours" className={labelClass}>
            Gross hours per week
            <InfoTooltip label="Gross hours per week" text="Scheduled work hours each week." />
          </label>
          <FieldShell error={errors.weeklyHours}>
            <input
              id="labor-weekly-hours"
              className={`${inputClass} pr-16`}
              inputMode="decimal"
              value={numberOrBlank(input.weeklyHours)}
              aria-invalid={Boolean(errors.weeklyHours)}
              onChange={onNumber('weeklyHours')}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              hours
            </span>
          </FieldShell>
          {errors.weeklyHours ? (
            <p className="mt-1 text-xs text-rose-600">{errors.weeklyHours}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="labor-yearly-hours" className={labelClass}>
            Gross hours per year
            <InfoTooltip label="Gross hours per year" text="Weekly hours × 52." />
          </label>
          <ReadOnlyShell>
            <input
              id="labor-yearly-hours"
              className={`${inputClass} cursor-default pr-16 font-semibold text-accent`}
              readOnly
              value={result?.grossHoursPerYearDisplay ?? ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              hours
            </span>
          </ReadOnlyShell>
        </div>

        {moneyInput(
          'payRate',
          'labor-pay-rate',
          'Pay Rate',
          'Hourly wage. Currency labels amounts only; it does not convert.',
          '/ hours'
        )}

        {moneyOutput(
          'labor-gross-pay',
          'Gross pay',
          'Gross hours per year × pay rate.',
          result?.grossPayDisplay ?? ''
        )}
      </section>

      <section className={sectionClass} aria-labelledby="labor-net-heading">
        <h3 id="labor-net-heading" className={sectionTitleClass}>
          Net hours worked
        </h3>

        <div>
          <label htmlFor="labor-absent-days" className={labelClass}>
            Absent days per year
            <InfoTooltip
              label="Absent days per year"
              text="Vacation, sick, and other non-worked days per year."
            />
          </label>
          <FieldShell error={errors.absentDays}>
            <input
              id="labor-absent-days"
              className={`${inputClass} pr-14`}
              inputMode="decimal"
              value={numberOrBlank(input.absentDays)}
              aria-invalid={Boolean(errors.absentDays)}
              onChange={onNumber('absentDays')}
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              days
            </span>
          </FieldShell>
          {errors.absentDays ? (
            <p className="mt-1 text-xs text-rose-600">{errors.absentDays}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="labor-hours-not-worked" className={labelClass}>
            Hours not worked per year
            <InfoTooltip
              label="Hours not worked per year"
              text="Absent days × (weekly hours ÷ 5)."
            />
          </label>
          <ReadOnlyShell>
            <input
              id="labor-hours-not-worked"
              className={`${inputClass} cursor-default pr-16 font-semibold text-accent`}
              readOnly
              value={result?.hoursNotWorkedDisplay ?? ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              hours
            </span>
          </ReadOnlyShell>
        </div>

        <div>
          <label htmlFor="labor-net-hours" className={labelClass}>
            Net hours worked
            <InfoTooltip
              label="Net hours worked"
              text="Gross hours per year − hours not worked."
            />
          </label>
          <ReadOnlyShell>
            <input
              id="labor-net-hours"
              className={`${inputClass} cursor-default pr-16 font-semibold text-accent`}
              readOnly
              value={result?.netHoursWorkedDisplay ?? ''}
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-muted-foreground">
              hours
            </span>
          </ReadOnlyShell>
        </div>
      </section>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={additionalOpen}
          onClick={onToggleAdditional}
        >
          <span className="inline-flex items-center gap-2">
            Additional annual costs
            {filledExtra > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-white">
                {filledExtra}
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${additionalOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {additionalOpen ? (
          <div className="space-y-3.5 border-t border-border px-4 py-4">
            {moneyInput('taxes', 'labor-taxes', 'Taxes', 'Annual employer payroll taxes.')}
            {moneyInput('insurance', 'labor-insurance', 'Insurance', 'Annual employer insurance cost.')}
            {moneyInput('benefits', 'labor-benefits', 'Benefits', 'Annual employer benefits cost.')}
            {moneyInput('overtime', 'labor-overtime', 'Overtime', 'Annual overtime pay cost.')}
            {moneyInput('supplies', 'labor-supplies', 'Supplies', 'Annual supplies related to the role.')}
          </div>
        ) : null}
      </div>

      <section
        className="space-y-3.5 rounded-xl border border-border bg-muted/10 p-3.5 sm:p-4"
        aria-labelledby="labor-main-results-heading"
      >
        <h3 id="labor-main-results-heading" className={sectionTitleClass}>
          Main results
        </h3>
        {moneyOutput(
          'labor-annual-cost',
          'Annual payroll labor cost',
          'Gross pay + additional annual employment costs.',
          result?.annualPayrollLaborCostDisplay ?? ''
        )}
        {moneyOutput(
          'labor-hourly-cost',
          'Hourly labor cost',
          'Annual payroll labor cost ÷ net hours worked.',
          result?.hourlyLaborCostDisplay ?? '',
          '/ hour'
        )}
      </section>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-[13px] font-semibold text-accent"
          aria-expanded={percentageOpen}
          onClick={onTogglePercentage}
        >
          <span className="inline-flex items-center gap-2">
            Labor cost percentage
            {revenueFilled > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-white">
                {revenueFilled}
              </span>
            ) : null}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${percentageOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
        {percentageOpen ? (
          <div className="space-y-3.5 border-t border-border px-4 py-4">
            {moneyInput(
              'revenue',
              'labor-revenue',
              'Revenue',
              'Annual revenue used to compute labor cost percentage.'
            )}
            <div>
              <label htmlFor="labor-cost-percent" className={labelClass}>
                Labor cost percentage
                <InfoTooltip
                  label="Labor cost percentage"
                  text="(Annual payroll labor cost ÷ revenue) × 100."
                />
              </label>
              <ReadOnlyShell>
                <input
                  id="labor-cost-percent"
                  className={`${inputClass} cursor-default pr-8 font-semibold text-accent`}
                  readOnly
                  value={result?.laborCostPercentDisplay ?? ''}
                  aria-live="polite"
                />
                <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                  %
                </span>
              </ReadOnlyShell>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
