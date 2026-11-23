'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ConceptionFieldErrors,
  ConceptionInput,
  ConceptionResult,
} from './types';
import { CYCLE_DAY_OPTIONS } from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

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

interface Props {
  input: ConceptionInput;
  errors: ConceptionFieldErrors;
  result: ConceptionResult | null;
  onChange: (input: ConceptionInput) => void;
  onLoadExample: () => void;
}

export function ConceptionForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="text-sm leading-relaxed text-accent">
        To calculate the conception date, please enter the{' '}
        <span className="font-semibold">due date</span> or the{' '}
        <span className="font-semibold">
          first day of your last period (LMP)
        </span>
        .
      </p>

      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Educational ACOG-style estimate (conception ≈ EDD − 266 days). Not an
        exact conception day or paternity proof. Entries stay in your browser.
      </p>

      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (LMP 2026-01-01 · 28-day cycle)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="conception-due">
          <span>Due date</span>
          <InfoTooltip
            label="Due date"
            text="Estimated due date (EDD). When this is the last field you edit, conception and gestational age are derived from it."
          />
        </label>
        <FieldShell error={errors.dueDate}>
          <input
            id="conception-due"
            type="date"
            className={inputClass}
            value={input.dueDate}
            aria-invalid={Boolean(errors.dueDate)}
            onChange={(e) =>
              onChange({
                ...input,
                dueDate: e.target.value,
                lastEdited: 'dueDate',
              })
            }
          />
        </FieldShell>
        {errors.dueDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="conception-lmp">
          <span>1st day of last period (LMP)</span>
          <InfoTooltip
            label="LMP"
            text="First day of the last menstrual period. With average cycle length, EDD = LMP + 280 + (cycle − 28)."
          />
        </label>
        <FieldShell error={errors.lmpDate}>
          <input
            id="conception-lmp"
            type="date"
            className={inputClass}
            value={input.lmpDate}
            aria-invalid={Boolean(errors.lmpDate)}
            onChange={(e) =>
              onChange({
                ...input,
                lmpDate: e.target.value,
                lastEdited: 'lmp',
              })
            }
          />
        </FieldShell>
        {errors.lmpDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.lmpDate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="conception-cycle">
          <span>Average cycle duration</span>
          <InfoTooltip
            label="Average cycle duration"
            text="Typical cycle length in days used only for LMP dating (21–45). Default 28."
          />
        </label>
        <select
          id="conception-cycle"
          className={selectClass}
          value={input.cycleDays}
          aria-invalid={Boolean(errors.cycleDays)}
          onChange={(e) =>
            onChange({ ...input, cycleDays: e.target.value })
          }
        >
          {CYCLE_DAY_OPTIONS.map((d) => (
            <option key={d} value={String(d)}>
              {d}
            </option>
          ))}
        </select>
        {errors.cycleDays ? (
          <p className="mt-1 text-xs text-rose-600">{errors.cycleDays}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="conception-ga-wks">
          <span>You are…</span>
          <InfoTooltip
            label="Gestational age"
            text="Educational gestational age as of today from the resolved EDD (280 − days until EDD). Read-only."
          />
        </label>
        <FieldShell muted>
          <output
            id="conception-ga-wks"
            className="flex w-full items-center gap-2 px-3 text-sm tabular-nums text-accent"
            aria-live="polite"
          >
            <span className="font-medium">
              {result ? result.gestationalWeeks : ''}
            </span>
            <span className="text-muted-foreground">wks</span>
            <span className="text-muted-foreground" aria-hidden>
              |
            </span>
            <span className="font-medium">
              {result ? result.gestationalDaysRemainder : ''}
            </span>
            <span className="text-muted-foreground">days</span>
            <span className="ml-auto text-xs text-muted-foreground">
              pregnant
            </span>
          </output>
        </FieldShell>
      </div>

      <div>
        <label className={labelClass} htmlFor="conception-out">
          <span>Conception date</span>
          <InfoTooltip
            label="Conception date"
            text="Estimated as EDD − 266 days. Approximate only — not clinical confirmation."
          />
        </label>
        <FieldShell muted>
          <output
            id="conception-out"
            className="w-full px-3 text-sm tabular-nums font-medium text-accent"
            aria-live="polite"
          >
            {result ? result.formattedConception : ''}
          </output>
        </FieldShell>
        {!result ? (
          <p className="mt-1 text-xs text-muted-foreground">MM/DD/YYYY</p>
        ) : (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {result.explanation}
            {result.conflictNote ? ` ${result.conflictNote}` : ''}
          </p>
        )}
        {errors.form ? (
          <p className="mt-1 text-xs text-rose-600">{errors.form}</p>
        ) : null}
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {result?.disclaimer ??
            'Educational estimate only — not exact conception or paternity.'}
        </p>
      </div>
    </form>
  );
}
