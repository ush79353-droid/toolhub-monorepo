'use client';

import type { ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  FullTimeEquivalentFieldErrors,
  FullTimeEquivalentInput,
  FullTimeEquivalentResult,
} from './types';

interface FullTimeEquivalentFormProps {
  input: FullTimeEquivalentInput;
  errors: FullTimeEquivalentFieldErrors;
  result: FullTimeEquivalentResult | null;
  onChange: (input: FullTimeEquivalentInput) => void;
  onReset: () => void;
}

const labelClass = 'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

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

export function FullTimeEquivalentForm({
  input,
  errors,
  result,
  onChange,
  onReset,
}: FullTimeEquivalentFormProps) {
  const set = (patch: Partial<FullTimeEquivalentInput>) => onChange({ ...input, ...patch });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <Section title="Full-time">
        <div>
          <label className={labelClass} htmlFor="fte-ft-employees">
            <span>Number of employees</span>
            <InfoTooltip
              label="Number of employees"
              text="Whole number of full-time employees (0 or more)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.fullTimeEmployees}>
              <input
                id="fte-ft-employees"
                className={inputClass}
                inputMode="numeric"
                value={input.fullTimeEmployees}
                aria-invalid={Boolean(errors.fullTimeEmployees)}
                onChange={(event) => set({ fullTimeEmployees: event.target.value })}
              />
            </FieldShell>
            <span className={unitClass} aria-hidden="true">
              people
            </span>
          </div>
          {errors.fullTimeEmployees ? (
            <p className="mt-1 text-xs text-rose-600">{errors.fullTimeEmployees}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fte-ft-hours">
            <span>Working hours</span>
            <InfoTooltip
              label="Working hours"
              text="Standard hours per full-time employee per week. Must be greater than zero."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.fullTimeHours}>
              <input
                id="fte-ft-hours"
                className={inputClass}
                inputMode="decimal"
                value={input.fullTimeHours}
                aria-invalid={Boolean(errors.fullTimeHours)}
                onChange={(event) => set({ fullTimeHours: event.target.value })}
              />
            </FieldShell>
            <span className={unitClass} aria-hidden="true">
              hrs / week
            </span>
          </div>
          {errors.fullTimeHours ? (
            <p className="mt-1 text-xs text-rose-600">{errors.fullTimeHours}</p>
          ) : null}
        </div>
      </Section>

      <Section title="Part-time">
        <div>
          <label className={labelClass} htmlFor="fte-pt-employees">
            <span>Number of employees</span>
            <InfoTooltip
              label="Number of employees"
              text="Whole number of part-time employees (0 or more)."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.partTimeEmployees}>
              <input
                id="fte-pt-employees"
                className={inputClass}
                inputMode="numeric"
                value={input.partTimeEmployees}
                aria-invalid={Boolean(errors.partTimeEmployees)}
                onChange={(event) => set({ partTimeEmployees: event.target.value })}
              />
            </FieldShell>
            <span className={unitClass} aria-hidden="true">
              people
            </span>
          </div>
          {errors.partTimeEmployees ? (
            <p className="mt-1 text-xs text-rose-600">{errors.partTimeEmployees}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="fte-pt-hours">
            <span>Working hours</span>
            <InfoTooltip
              label="Working hours"
              text="Hours per part-time employee per week. Use the same weekly period as full-time hours."
            />
          </label>
          <div className="flex gap-2">
            <FieldShell error={errors.partTimeHours}>
              <input
                id="fte-pt-hours"
                className={inputClass}
                inputMode="decimal"
                value={input.partTimeHours}
                aria-invalid={Boolean(errors.partTimeHours)}
                onChange={(event) => set({ partTimeHours: event.target.value })}
              />
            </FieldShell>
            <span className={unitClass} aria-hidden="true">
              hrs / week
            </span>
          </div>
          {errors.partTimeHours ? (
            <p className="mt-1 text-xs text-rose-600">{errors.partTimeHours}</p>
          ) : null}
        </div>
      </Section>

      <Section title="Full time equivalent">
        <div>
          <label className={labelClass} htmlFor="fte-result">
            <span>Full time equivalent</span>
            <InfoTooltip
              label="Full time equivalent"
              text="FTE = full-time employees + (part-time employees × part-time hours ÷ full-time hours)."
            />
          </label>
          <div className="flex gap-2">
            <div className="flex h-11 min-w-0 flex-1 items-center rounded-lg border border-border bg-muted/30">
              <input
                id="fte-result"
                className={`${inputClass} cursor-default font-semibold text-accent`}
                readOnly
                value={result?.formattedFte ?? ''}
                placeholder=""
                aria-live="polite"
              />
            </div>
            <span className={unitClass} aria-hidden="true">
              FTE
            </span>
          </div>
        </div>
      </Section>

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
