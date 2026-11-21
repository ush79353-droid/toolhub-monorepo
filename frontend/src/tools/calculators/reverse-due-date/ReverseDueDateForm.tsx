'use client';

import type { ReactNode } from 'react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  LengthUnit,
  ReverseDueDateEditedField,
  ReverseDueDateFieldErrors,
  ReverseDueDateInput,
  ReverseDueDateResult,
} from './types';

const labelClass =
  'mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full min-w-0 bg-transparent px-3 text-sm tabular-nums text-accent outline-none';
const selectClass =
  'h-11 shrink-0 border-l border-border bg-transparent px-2 text-sm font-medium text-primary outline-none';

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

interface Props {
  input: ReverseDueDateInput;
  errors: ReverseDueDateFieldErrors;
  result: ReverseDueDateResult | null;
  onChange: (input: ReverseDueDateInput) => void;
  onLoadExample: () => void;
}

export function ReverseDueDateForm({
  input,
  errors,
  result,
  onChange,
  onLoadExample,
}: Props) {
  const setField = (field: ReverseDueDateEditedField, value: string) => {
    onChange({ ...input, [field]: value, lastEdited: field });
  };

  const dueDisplay =
    input.lastEdited === 'dueDate'
      ? input.dueDate
      : result
        ? result.dueDateIso
        : input.dueDate;
  const conceptionDisplay =
    input.lastEdited === 'conceptionDate'
      ? input.conceptionDate
      : result
        ? result.conceptionDateIso
        : input.conceptionDate;
  const intercourseDisplay =
    input.lastEdited === 'intercourseDate'
      ? input.intercourseDate
      : result
        ? result.intercourseStartIso
        : input.intercourseDate;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <p className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Enter any one date and a pregnancy length. Conception uses EDD −
        (length − 14 days). Intercourse shows the start of an approximate
        fertile window (conception − 7 days), not fertilization itself.
        Educational only — not medical advice.
      </p>
      <p className="text-xs">
        <button
          type="button"
          onClick={onLoadExample}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Load example (EDD 2023-08-01 · 40 wks → conception 2022-11-08)
        </button>
      </p>

      <div>
        <label className={labelClass} htmlFor="rdd-due">
          <span>Due date</span>
          <InfoTooltip
            label="Due date"
            text="Estimated delivery date (EDD). Editing this recalculates conception and the intercourse window start."
          />
        </label>
        <FieldShell error={errors.dueDate}>
          <input
            id="rdd-due"
            type="date"
            className={inputClass}
            value={dueDisplay}
            aria-invalid={Boolean(errors.dueDate)}
            onChange={(e) => setField('dueDate', e.target.value)}
          />
        </FieldShell>
        {errors.dueDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.dueDate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rdd-conception">
          <span>Conception date</span>
          <InfoTooltip
            label="Conception date"
            text="Estimated fertilization date ≈ EDD − (pregnancy length in days − 14)."
          />
        </label>
        <FieldShell error={errors.conceptionDate}>
          <input
            id="rdd-conception"
            type="date"
            className={inputClass}
            value={conceptionDisplay}
            aria-invalid={Boolean(errors.conceptionDate)}
            onChange={(e) => setField('conceptionDate', e.target.value)}
          />
        </FieldShell>
        {errors.conceptionDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.conceptionDate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rdd-intercourse">
          <span>Intercourse date</span>
          <InfoTooltip
            label="Intercourse date"
            text="Earliest day of an approximate fertile window (conception − 7 days). Not equated with fertilization."
          />
        </label>
        <FieldShell error={errors.intercourseDate}>
          <input
            id="rdd-intercourse"
            type="date"
            className={inputClass}
            value={intercourseDisplay}
            aria-invalid={Boolean(errors.intercourseDate)}
            onChange={(e) => setField('intercourseDate', e.target.value)}
          />
        </FieldShell>
        {errors.intercourseDate ? (
          <p className="mt-1 text-xs text-rose-600">{errors.intercourseDate}</p>
        ) : null}
      </div>

      <div>
        <label className={labelClass} htmlFor="rdd-length">
          <span>Pregnancy length</span>
          <InfoTooltip
            label="Pregnancy length"
            text="Default 40 weeks (280 days) for LMP-style dating. Adjust if you know a different gestational length."
          />
        </label>
        <FieldShell error={errors.pregnancyLength}>
          <input
            id="rdd-length"
            className={inputClass}
            inputMode="decimal"
            value={input.pregnancyLength}
            aria-invalid={Boolean(errors.pregnancyLength)}
            onChange={(e) => setField('pregnancyLength', e.target.value)}
          />
          <select
            className={selectClass}
            aria-label="Pregnancy length unit"
            value={input.lengthUnit}
            onChange={(e) => {
              const next = e.target.value as LengthUnit;
              onChange({
                ...input,
                lengthUnit: next,
                lastEdited: 'pregnancyLength',
              });
            }}
          >
            <option value="weeks">wks</option>
            <option value="days">days</option>
          </select>
        </FieldShell>
        {errors.pregnancyLength ? (
          <p className="mt-1 text-xs text-rose-600">{errors.pregnancyLength}</p>
        ) : null}
      </div>

      {errors.form ? (
        <p className="text-xs text-rose-600">{errors.form}</p>
      ) : null}
    </form>
  );
}
