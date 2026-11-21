'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import type {
  ConceptionMethod,
  PregnancyConceptionFieldErrors,
  PregnancyConceptionInput,
  PregnancyConceptionResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
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

interface PregnancyConceptionFormProps {
  input: PregnancyConceptionInput;
  errors: PregnancyConceptionFieldErrors;
  result: PregnancyConceptionResult | null;
  onChange: (input: PregnancyConceptionInput) => void;
  onCalculate: () => void;
}

export function PregnancyConceptionForm({
  input,
  errors,
  result,
  onChange,
  onCalculate,
}: PregnancyConceptionFormProps) {
  const set = (patch: Partial<PregnancyConceptionInput>) =>
    onChange({ ...input, ...patch });

  const dateLabel =
    input.method === 'dueDate'
      ? 'Your Due Date'
      : input.method === 'lmp'
        ? 'First day of last period'
        : 'Ultrasound date';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate();
      }}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Modify the values and click Calculate. Estimates use ACOG-style calendar
        dating (conception ≈ due date − 266 days). Not medical advice.
      </p>

      {errors.form ? (
        <p className="text-sm text-rose-600" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div>
        <label className={labelClass} htmlFor="pc-method">
          Calculate Based On
        </label>
        <FieldShell>
          <select
            id="pc-method"
            className={inputClass}
            value={input.method}
            onChange={(e) =>
              set({ method: e.target.value as ConceptionMethod })
            }
          >
            <option value="dueDate">Due Date</option>
            <option value="lmp">Last Period Date</option>
            <option value="ultrasound">Ultrasound Date</option>
          </select>
        </FieldShell>
      </div>

      {input.method === 'dueDate' ? (
        <div>
          <label className={labelClass} htmlFor="pc-due">
            {dateLabel}
          </label>
          <FieldShell error={errors.dueDate}>
            <input
              id="pc-due"
              type="date"
              className={inputClass}
              value={input.dueDate}
              onChange={(e) => set({ dueDate: e.target.value })}
              aria-invalid={Boolean(errors.dueDate)}
            />
          </FieldShell>
          {errors.dueDate ? (
            <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>
          ) : null}
        </div>
      ) : null}

      {input.method === 'lmp' ? (
        <>
          <div>
            <label className={labelClass} htmlFor="pc-lmp">
              {dateLabel}
            </label>
            <FieldShell error={errors.lmpDate}>
              <input
                id="pc-lmp"
                type="date"
                className={inputClass}
                value={input.lmpDate}
                onChange={(e) => set({ lmpDate: e.target.value })}
                aria-invalid={Boolean(errors.lmpDate)}
              />
            </FieldShell>
            {errors.lmpDate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.lmpDate}</p>
            ) : null}
          </div>
          <div>
            <label className={labelClass} htmlFor="pc-cycle">
              Average cycle length
            </label>
            <FieldShell error={errors.cycleDays}>
              <input
                id="pc-cycle"
                className={inputClass}
                inputMode="numeric"
                value={input.cycleDays}
                onChange={(e) => set({ cycleDays: e.target.value })}
                aria-invalid={Boolean(errors.cycleDays)}
              />
              <span className="pr-3 text-xs text-muted-foreground">days</span>
            </FieldShell>
            {errors.cycleDays ? (
              <p className="mt-1 text-xs text-rose-600">{errors.cycleDays}</p>
            ) : null}
          </div>
        </>
      ) : null}

      {input.method === 'ultrasound' ? (
        <>
          <div>
            <label className={labelClass} htmlFor="pc-us">
              {dateLabel}
            </label>
            <FieldShell error={errors.ultrasoundDate}>
              <input
                id="pc-us"
                type="date"
                className={inputClass}
                value={input.ultrasoundDate}
                onChange={(e) => set({ ultrasoundDate: e.target.value })}
                aria-invalid={Boolean(errors.ultrasoundDate)}
              />
            </FieldShell>
            {errors.ultrasoundDate ? (
              <p className="mt-1 text-xs text-rose-600">{errors.ultrasoundDate}</p>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass} htmlFor="pc-us-w">
                Gestational age (weeks)
              </label>
              <FieldShell error={errors.ultrasoundWeeks}>
                <input
                  id="pc-us-w"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.ultrasoundWeeks}
                  onChange={(e) => set({ ultrasoundWeeks: e.target.value })}
                  aria-invalid={Boolean(errors.ultrasoundWeeks)}
                />
              </FieldShell>
              {errors.ultrasoundWeeks ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.ultrasoundWeeks}
                </p>
              ) : null}
            </div>
            <div>
              <label className={labelClass} htmlFor="pc-us-d">
                Days
              </label>
              <FieldShell error={errors.ultrasoundDays}>
                <input
                  id="pc-us-d"
                  className={inputClass}
                  inputMode="numeric"
                  value={input.ultrasoundDays}
                  onChange={(e) => set({ ultrasoundDays: e.target.value })}
                  aria-invalid={Boolean(errors.ultrasoundDays)}
                />
              </FieldShell>
              {errors.ultrasoundDays ? (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.ultrasoundDays}
                </p>
              ) : null}
            </div>
          </div>
        </>
      ) : null}

      <Button
        type="submit"
        className="h-11 w-full rounded-xl text-sm font-semibold"
      >
        Calculate
      </Button>

      {result ? (
        <div className="space-y-2 rounded-xl border border-border bg-muted/15 p-3.5 text-sm text-accent sm:p-4">
          <p>
            <span className="font-semibold">Estimated due date:</span>{' '}
            {result.formattedDueDate}
          </p>
          <p>
            <span className="font-semibold">Estimated conception date:</span>{' '}
            {result.formattedConception}
          </p>
          <p>
            <span className="font-semibold">
              Approximate intercourse window:
            </span>{' '}
            {result.formattedIntercourseRange}
          </p>
          {result.notes.map((n) => (
            <p key={n} className="text-xs leading-relaxed text-muted-foreground">
              {n}
            </p>
          ))}
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
            {result.disclaimer}
          </p>
        </div>
      ) : null}
    </form>
  );
}
