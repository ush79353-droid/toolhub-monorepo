'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  DartDriver,
  DartRateFieldErrors,
  DartRateInput,
  DartRateResult,
} from './types';

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
        error ? 'border-rose-400' : ''
      }`}
    >
      {children}
    </div>
  );
}

interface DartRateFormProps {
  input: DartRateInput;
  errors: DartRateFieldErrors;
  result: DartRateResult | null;
  onChange: (input: DartRateInput) => void;
  onLoadExample: () => void;
  onClear: () => void;
  onReset: () => void;
}

export function DartRateForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
  onClear,
  onReset,
}: DartRateFormProps) {
  const setField = (field: DartDriver, value: string) => {
    onChange({ ...input, [field]: value, driver: field });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">
        OSHA DART incidence rate — Days Away, Restricted, or Transferred. Rate = (cases × 200,000)
        ÷ hours worked. Not a percentage.
      </p>

      <form
        className="space-y-3.5 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
        <div>
          <label className={labelClass} htmlFor="dart-incidents">
            <span>Total DART incidents</span>
            <InfoTooltip
              label="Total DART incidents"
              text="Enter the total number of OSHA-recordable cases involving days away from work, restricted duty, or job transfer. Count each qualifying case only once."
            />
          </label>
          <FieldShell error={errors.incidents}>
            <input
              id="dart-incidents"
              className={inputClass}
              inputMode="numeric"
              value={input.incidents}
              aria-invalid={Boolean(errors.incidents)}
              onChange={(e) => setField('incidents', e.target.value)}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">cases</span>
          </FieldShell>
          {errors.incidents ? (
            <p className="mt-1 text-xs text-rose-600">{errors.incidents}</p>
          ) : null}
          {result?.incidentsEstimated ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Estimated DART cases (may be fractional — not an observed count).
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dart-hours">
            <span>Total hours worked</span>
            <InfoTooltip
              label="Total hours worked"
              text="Enter the actual hours worked by all employees during the reporting period, including overtime. Do not include nonworking hours such as vacation, sick leave, or holidays."
            />
          </label>
          <FieldShell error={errors.hoursWorked}>
            <input
              id="dart-hours"
              className={inputClass}
              inputMode="decimal"
              value={input.hoursWorked}
              aria-invalid={Boolean(errors.hoursWorked)}
              onChange={(e) => setField('hoursWorked', e.target.value)}
            />
            <span className="shrink-0 pr-3 text-xs text-muted-foreground">hours</span>
          </FieldShell>
          {errors.hoursWorked ? (
            <p className="mt-1 text-xs text-rose-600">{errors.hoursWorked}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="dart-rate">
            <span>DART rate</span>
            <InfoTooltip
              label="DART rate"
              text="Calculated as (DART cases × 200,000) ÷ hours worked. Editing this field estimates cases from rate and hours, or solves hours when cases and rate are known."
            />
          </label>
          <FieldShell error={errors.dartRate}>
            <input
              id="dart-rate"
              className={inputClass}
              inputMode="decimal"
              value={input.dartRate}
              aria-invalid={Boolean(errors.dartRate)}
              onChange={(e) => setField('dartRate', e.target.value)}
            />
          </FieldShell>
          {errors.dartRate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dartRate}</p>
          ) : null}
          <p className="mt-1.5 text-xs text-muted-foreground">
            DART cases per 100 full-time-equivalent workers
          </p>
        </div>
      </form>

      <div className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Understanding your DART rate</h3>
        {result ? (
          <p className="text-sm leading-relaxed text-foreground/90" role="status">
            {result.interpretation}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Enter qualifying DART cases and actual hours worked to see the incidence rate.
          </p>
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">
          Illustrative categories such as “low / moderate / high” are not OSHA or BLS grading
          thresholds. A low DART rate alone does not prove a workplace is hazard-free.
        </p>
      </div>

      {errors.form ? <p className="text-xs text-rose-600">{errors.form}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" className="h-11" onClick={onLoadExample}>
          Load example (2.50)
        </Button>
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
