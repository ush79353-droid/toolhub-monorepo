'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type { ManHoursFieldErrors, ManHoursInput, ManHoursResult } from './types';

interface ManHoursFormProps {
  input: ManHoursInput;
  errors: ManHoursFieldErrors;
  result: ManHoursResult | null;
  onChange: (input: ManHoursInput) => void;
  onCurrencyChange: (currency: SupportedCurrency) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const sectionClass = 'space-y-3.5 rounded-xl border border-border bg-muted/20 p-4';
const sectionTitleClass = 'text-[13px] font-semibold text-accent';

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

export function ManHoursForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
  onSubmit,
  onReset,
}: ManHoursFormProps) {
  const symbol = getCurrencySymbol(input.currency);
  const set = (patch: Partial<ManHoursInput>) => onChange({ ...input, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate autoComplete="off">
      <section className={sectionClass} aria-labelledby="man-hours-section">
        <h3 id="man-hours-section" className={sectionTitleClass}>
          Man-hours calculator
        </h3>

        <div>
          <label className={labelClass} htmlFor="mh-people">
            <span>People</span>
            <InfoTooltip
              label="People"
              text="Whole number of people on the job (0 or more)."
            />
          </label>
          <FieldShell error={errors.people}>
            <input
              id="mh-people"
              className={inputClass}
              inputMode="numeric"
              value={input.people}
              aria-invalid={Boolean(errors.people)}
              onChange={(event) => set({ people: event.target.value })}
            />
          </FieldShell>
          {errors.people ? <p className="mt-1 text-xs text-rose-600">{errors.people}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mh-hours">
            <span>Hours per person</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.hoursPerPerson}>
              <input
                id="mh-hours"
                className={inputClass}
                inputMode="decimal"
                value={input.hoursPerPerson}
                aria-invalid={Boolean(errors.hoursPerPerson)}
                onChange={(event) => set({ hoursPerPerson: event.target.value })}
              />
            </FieldShell>
            <span className={unitClass} aria-hidden="true">
              hrs / person
            </span>
          </div>
          {errors.hoursPerPerson ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hoursPerPerson}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mh-man-hours">
            <span>Man-hours</span>
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <input
                id="mh-man-hours"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.manHoursDisplay ?? ''}
                aria-live="polite"
              />
            </div>
            <span className={unitClass} aria-hidden="true">
              hrs
            </span>
          </div>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="man-hours-cost-section">
        <h3 id="man-hours-cost-section" className={sectionTitleClass}>
          Total cost of man-hours
        </h3>

        <div>
          <label className={labelClass} htmlFor="mh-hourly-pay">
            <span>Hourly pay</span>
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.hourlyPay}>
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="mh-hourly-pay"
                className={inputClass}
                inputMode="decimal"
                value={input.hourlyPay}
                aria-invalid={Boolean(errors.hourlyPay)}
                onChange={(event) => set({ hourlyPay: event.target.value })}
              />
            </FieldShell>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mh-currency"
                value={input.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
          {errors.hourlyPay ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hourlyPay}</p>
          ) : null}
          {errors.currency ? <p className="mt-1 text-xs text-rose-600">{errors.currency}</p> : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="mh-cost-per-person">
            <span>Cost per person</span>
            <InfoTooltip
              label="Cost per person"
              text="Hours per person × hourly pay."
            />
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="mh-cost-per-person"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.costPerPersonDisplay ?? ''}
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mh-cost-per-person-currency"
                value={input.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="mh-total-cost">
            <span>Total cost</span>
            <InfoTooltip label="Total cost" text="Man-hours × hourly pay." />
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground" aria-hidden="true">
                {symbol}
              </span>
              <input
                id="mh-total-cost"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.totalCostDisplay ?? ''}
                aria-live="polite"
              />
            </div>
            <div className="w-[110px] shrink-0 sm:w-[120px]">
              <CurrencySelect
                id="mh-total-cost-currency"
                value={input.currency}
                onChange={onCurrencyChange}
              />
            </div>
          </div>
        </div>
      </section>

      {errors.form ? (
        <p className="text-xs text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 pt-1">
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
