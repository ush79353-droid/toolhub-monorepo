'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  DURATION_UNITS,
  type TenureDraft,
  type TenureFieldErrors,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const shellClass =
  'rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring';

interface TenureFormProps {
  draft: TenureDraft;
  averageDisplay: string;
  specificDisplay: string;
  errors: TenureFieldErrors;
  onDraftChange: (draft: TenureDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

function FieldShell({
  label,
  htmlFor,
  error,
  tip,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  tip?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        <span>{label}</span>
        {tip ? <InfoTooltip label={label} text={tip} /> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="space-y-3.5 rounded-xl border border-border bg-muted/20 p-3.5 sm:p-4">
      <legend className="px-1 text-[13px] font-semibold text-accent">{title}</legend>
      {children}
    </fieldset>
  );
}

export function TenureForm({
  draft,
  averageDisplay,
  specificDisplay,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: TenureFormProps) {
  const set = (patch: Partial<TenureDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <SectionCard title="Average duration of service">
        <FieldShell
          label="Total number of employees"
          htmlFor="tenure-employees"
          error={errors.employeeCount}
          tip="Headcount used as the divisor for average tenure. Must be greater than zero."
        >
          <div className={shellClass}>
            <input
              id="tenure-employees"
              inputMode="decimal"
              className={inputClass}
              value={draft.employeeCount}
              placeholder=""
              aria-invalid={Boolean(errors.employeeCount)}
              onChange={(event) => set({ employeeCount: event.target.value })}
            />
          </div>
        </FieldShell>

        <FieldShell
          label="Combined duration of service"
          htmlFor="tenure-combined"
          error={errors.combinedDuration}
          tip="Sum of all employees’ service time. Converted to years before dividing by headcount."
        >
          <div className={`flex ${shellClass}`}>
            <input
              id="tenure-combined"
              inputMode="decimal"
              className={`${inputClass} min-w-0 flex-1`}
              value={draft.combinedDuration}
              placeholder=""
              aria-invalid={Boolean(errors.combinedDuration)}
              onChange={(event) => set({ combinedDuration: event.target.value })}
            />
            <select
              aria-label="Combined duration unit"
              className="h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm text-accent outline-none"
              value={draft.combinedUnit}
              onChange={(event) =>
                set({
                  combinedUnit: event.target.value as TenureDraft['combinedUnit'],
                })
              }
            >
              {DURATION_UNITS.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </FieldShell>

        <FieldShell
          label="Average tenure"
          htmlFor="tenure-average"
          tip="Combined duration (in years) ÷ total employees."
        >
          <div className="relative rounded-lg border border-border bg-muted/30">
            <input
              id="tenure-average"
              readOnly
              tabIndex={0}
              className={`${inputClass} cursor-default pr-12 font-semibold text-accent`}
              value={averageDisplay}
              placeholder="—"
              aria-live="polite"
            />
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
              yrs
            </span>
          </div>
        </FieldShell>
      </SectionCard>

      <SectionCard title="Specific duration of service">
        <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
          <FieldShell
            label="Starting date"
            htmlFor="tenure-start"
            error={errors.startDate}
          >
            <div className={shellClass}>
              <input
                id="tenure-start"
                type="date"
                className={`${inputClass} block`}
                value={draft.startDate}
                aria-invalid={Boolean(errors.startDate)}
                onChange={(event) => set({ startDate: event.target.value })}
              />
            </div>
          </FieldShell>

          <FieldShell
            label="Ending date"
            htmlFor="tenure-end"
            error={errors.endDate}
          >
            <div className={shellClass}>
              <input
                id="tenure-end"
                type="date"
                className={`${inputClass} block`}
                value={draft.endDate}
                aria-invalid={Boolean(errors.endDate)}
                onChange={(event) => set({ endDate: event.target.value })}
              />
            </div>
          </FieldShell>
        </div>

        <FieldShell label="Result" htmlFor="tenure-specific">
          <div className="rounded-lg border border-border bg-muted/30">
            <input
              id="tenure-specific"
              readOnly
              tabIndex={0}
              className={`${inputClass} cursor-default font-semibold text-accent`}
              value={specificDisplay}
              placeholder="Here, you'll find your result…"
              aria-live="polite"
            />
          </div>
        </FieldShell>
      </SectionCard>

      {errors.form ? (
        <p className="text-xs text-red-600" role="alert">
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
