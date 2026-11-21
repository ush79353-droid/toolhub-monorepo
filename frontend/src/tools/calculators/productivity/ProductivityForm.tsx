'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CurrencySelect } from '@/tools/shared/CurrencySelect';
import { getCurrencySymbol, type SupportedCurrency } from '@/tools/shared/currency';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  WORKING_TIME_UNITS,
  type ProductivityFieldErrors,
  type ProductivityInput,
  type ProductivityResult,
  type WorkingTimeUnit,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

function CollapsibleSection({
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
    <fieldset className="rounded-xl border border-border bg-muted/15">
      <legend className="sr-only">{title}</legend>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-[13px] font-semibold text-accent sm:px-4"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-primary transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="space-y-3.5 border-t border-border px-3.5 py-3.5 sm:px-4 sm:py-4">
          {children}
        </div>
      ) : null}
    </fieldset>
  );
}

interface ProductivityFormProps {
  input: ProductivityInput;
  errors: ProductivityFieldErrors;
  result: ProductivityResult | null;
  onChange: (input: ProductivityInput) => void;
  onCurrencyChange: (next: SupportedCurrency) => void;
}

export function ProductivityForm({
  input,
  errors,
  result,
  onChange,
  onCurrencyChange,
}: ProductivityFormProps) {
  const [employeeOpen, setEmployeeOpen] = useState(true);
  const [hourOpen, setHourOpen] = useState(true);
  const symbol = getCurrencySymbol(input.currency);

  const set = (patch: Partial<ProductivityInput>) => {
    onChange({ ...input, ...patch });
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[13px] font-medium text-accent">Currency</span>
        <CurrencySelect
          value={input.currency}
          onChange={onCurrencyChange}
          aria-label="Currency for productivity amounts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Amounts share one currency label (no FX). Use the same reporting period
        for revenue, employees, and labor hours. Working time converts to hours
        (seconds ÷ 3,600; minutes ÷ 60).
      </p>
      <p className="text-xs">
        <a
          href="#how-to-use"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          How to use this calculator
        </a>
      </p>

      <div>
        <label htmlFor="prod-revenue" className={labelClass}>
          Revenue
          <InfoTooltip
            label="Revenue"
            text="Total revenue generated during the measurement period, before deducting expenses."
          />
        </label>
        <FieldShell error={errors.revenue}>
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
            {symbol}
          </span>
          <input
            id="prod-revenue"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.revenue}
            onChange={(e) => set({ revenue: e.target.value })}
            placeholder="0"
            aria-invalid={Boolean(errors.revenue)}
          />
        </FieldShell>
        {errors.revenue ? (
          <p className="mt-1 text-xs text-rose-600">{errors.revenue}</p>
        ) : null}
      </div>

      <CollapsibleSection
        title="Productivity per employee"
        open={employeeOpen}
        onToggle={() => setEmployeeOpen((o) => !o)}
      >
        <div>
          <label htmlFor="prod-employees" className={labelClass}>
            Number of employees
            <InfoTooltip
              label="Number of employees"
              text="Headcount (or FTE as a decimal) contributing to revenue in the same period."
            />
          </label>
          <FieldShell error={errors.numberOfEmployees}>
            <input
              id="prod-employees"
              type="text"
              inputMode="decimal"
              className={inputClass}
              value={input.numberOfEmployees}
              onChange={(e) => set({ numberOfEmployees: e.target.value })}
              placeholder="0"
              aria-invalid={Boolean(errors.numberOfEmployees)}
            />
          </FieldShell>
          {errors.numberOfEmployees ? (
            <p className="mt-1 text-xs text-rose-600">
              {errors.numberOfEmployees}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="prod-rpe" className={labelClass}>
            Revenue per employee
            <InfoTooltip
              label="Revenue per employee"
              text="Revenue ÷ number of employees (or FTE)."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="prod-rpe"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={result?.formattedRevenuePerEmployee ?? ''}
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Productivity per hour"
        open={hourOpen}
        onToggle={() => setHourOpen((o) => !o)}
      >
        <div>
          <label htmlFor="prod-hours" className={labelClass}>
            Number of working hours
            <InfoTooltip
              label="Number of working hours"
              text="Total workforce labor hours in the same period; not per-employee hours multiplied again."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.workingHours}>
              <input
                id="prod-hours"
                type="text"
                inputMode="decimal"
                className={inputClass}
                value={input.workingHours}
                onChange={(e) => set({ workingHours: e.target.value })}
                placeholder="0"
                aria-invalid={Boolean(errors.workingHours)}
              />
            </FieldShell>
            <select
              className={selectClass}
              value={input.workingHoursUnit}
              aria-label="Working time unit"
              onChange={(e) =>
                set({
                  workingHoursUnit: e.target.value as WorkingTimeUnit,
                })
              }
            >
              {WORKING_TIME_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          {errors.workingHours ? (
            <p className="mt-1 text-xs text-rose-600">{errors.workingHours}</p>
          ) : null}
          <p className="mt-1 text-xs text-muted-foreground">
            Result is always revenue per hour after converting the entered unit.
          </p>
        </div>
        <div>
          <label htmlFor="prod-rph" className={labelClass}>
            Revenue per working hour
            <InfoTooltip
              label="Revenue per working hour"
              text="Revenue ÷ total working hours (converted to hours)."
            />
          </label>
          <FieldShell muted>
            <span className="pl-3 text-sm text-muted-foreground" aria-hidden>
              {symbol}
            </span>
            <input
              id="prod-rph"
              type="text"
              readOnly
              tabIndex={-1}
              className={`${inputClass} cursor-default text-muted-foreground`}
              value={
                result?.formattedRevenuePerWorkingHour
                  ? `${result.formattedRevenuePerWorkingHour}/hour`
                  : ''
              }
              placeholder="—"
              aria-readonly="true"
            />
          </FieldShell>
        </div>
      </CollapsibleSection>

      {errors.form ? (
        <p className="text-xs text-rose-700" role="alert">
          {errors.form}
        </p>
      ) : null}
    </form>
  );
}
