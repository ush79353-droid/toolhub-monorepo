'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { methodLabel, primaryDateLabel } from './calculation';
import type {
  IvfEmbryoAge,
  PregnancyFieldErrors,
  PregnancyInput,
  PregnancyMethod,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function FieldShell({
  error,
  children,
}: {
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={error ? '[&_*]:border-rose-400' : undefined}>{children}</div>
  );
}

interface PregnancyFormProps {
  input: PregnancyInput;
  errors: PregnancyFieldErrors;
  onChange: (input: PregnancyInput) => void;
  onCalculate: () => void;
}

export function PregnancyForm({
  input,
  errors,
  onChange,
  onCalculate,
}: PregnancyFormProps) {
  const set = (patch: Partial<PregnancyInput>) =>
    onChange({ ...input, ...patch });

  return (
    <form
      className="space-y-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      noValidate
      autoComplete="off"
    >
      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-muted-foreground">
        Estimate a pregnancy schedule from due date, last period, ultrasound,
        conception, or IVF transfer date.
      </p>

      <div>
        <label htmlFor="pregnancy-method" className={labelClass}>
          Calculate Based On
          <InfoTooltip text="ACOG-style educational dating. Method changes which date and extra fields are required." />
        </label>
        <FieldShell error={errors.form}>
          <select
            id="pregnancy-method"
            className={inputClass}
            value={input.method}
            onChange={(e) =>
              set({ method: e.target.value as PregnancyMethod })
            }
          >
            {(
              [
                'dueDate',
                'lmp',
                'ultrasound',
                'conception',
                'ivf',
              ] as const
            ).map((m) => (
              <option key={m} value={m}>
                {methodLabel(m)}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      <div>
        <label htmlFor="pregnancy-primary-date" className={labelClass}>
          {primaryDateLabel(input.method)}
        </label>
        <FieldShell error={errors.primaryDate}>
          <input
            id="pregnancy-primary-date"
            type="date"
            className={inputClass}
            value={input.primaryDate}
            onChange={(e) => set({ primaryDate: e.target.value })}
            aria-invalid={Boolean(errors.primaryDate)}
          />
        </FieldShell>
        {errors.primaryDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.primaryDate}</p>
        ) : null}
      </div>

      {input.method === 'lmp' ? (
        <div>
          <label htmlFor="pregnancy-cycle" className={labelClass}>
            Average cycle length (days)
          </label>
          <FieldShell error={errors.cycleDays}>
            <input
              id="pregnancy-cycle"
              className={inputClass}
              inputMode="numeric"
              value={input.cycleDays}
              onChange={(e) => set({ cycleDays: e.target.value })}
            />
          </FieldShell>
          {errors.cycleDays ? (
            <p className="mt-1 text-xs text-rose-600">{errors.cycleDays}</p>
          ) : null}
        </div>
      ) : null}

      {input.method === 'ultrasound' ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="pregnancy-us-weeks" className={labelClass}>
              GA weeks at scan
            </label>
            <input
              id="pregnancy-us-weeks"
              className={inputClass}
              inputMode="numeric"
              value={input.usWeeks}
              onChange={(e) => set({ usWeeks: e.target.value })}
            />
            {errors.usWeeks ? (
              <p className="mt-1 text-xs text-rose-600">{errors.usWeeks}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="pregnancy-us-days" className={labelClass}>
              Extra days (0–6)
            </label>
            <input
              id="pregnancy-us-days"
              className={inputClass}
              inputMode="numeric"
              value={input.usDays}
              onChange={(e) => set({ usDays: e.target.value })}
            />
            {errors.usDays ? (
              <p className="mt-1 text-xs text-rose-600">{errors.usDays}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {input.method === 'ivf' ? (
        <div>
          <label htmlFor="pregnancy-ivf-age" className={labelClass}>
            Embryo age at transfer
          </label>
          <select
            id="pregnancy-ivf-age"
            className={inputClass}
            value={input.ivfEmbryoAge}
            onChange={(e) =>
              set({ ivfEmbryoAge: e.target.value as IvfEmbryoAge })
            }
          >
            <option value="day3">Day-3 embryo</option>
            <option value="day5">Day-5 blastocyst</option>
          </select>
        </div>
      ) : null}

      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
      >
        Calculate
      </button>
    </form>
  );
}
