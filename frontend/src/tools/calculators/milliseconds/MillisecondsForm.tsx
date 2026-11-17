'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CORE_UNITS,
  DEFAULT_OTHER_UNIT,
  FIELD_LABELS,
  MS_PER_SECOND,
  OTHER_UNITS,
  TIME_UNIT_DEFS,
  type CoreTimeUnit,
  type MillisecondsFieldErrors,
  type OtherTimeUnit,
  type TimeUnit,
} from './types';

export interface MillisecondsDraft {
  texts: Record<CoreTimeUnit, string>;
  otherUnit: OtherTimeUnit;
  otherText: string;
  activeField: TimeUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function emptyCoreTexts(): Record<CoreTimeUnit, string> {
  return {
    milliseconds: '',
    seconds: '',
    minutes: '',
    hours: '',
    days: '',
  };
}

export function emptyDraft(otherUnit: OtherTimeUnit = DEFAULT_OTHER_UNIT): MillisecondsDraft {
  return {
    texts: emptyCoreTexts(),
    otherUnit,
    otherText: '',
    activeField: null,
  };
}

interface MillisecondsFormProps {
  draft: MillisecondsDraft;
  errors: MillisecondsFieldErrors;
  onDraftChange: (draft: MillisecondsDraft) => void;
  onOtherUnitChange: (unit: OtherTimeUnit) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function MillisecondsForm({
  draft,
  errors,
  onDraftChange,
  onOtherUnitChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MillisecondsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Convert milliseconds (1 s = {MS_PER_SECOND} ms exactly). Edit any field — all stay linked
        through seconds. Years use the shared Julian average (365.25 days), not a calendar date.
      </div>

      {CORE_UNITS.map((unit) => {
        const id = `ms-conv-${unit}`;
        const error = errors[unit];
        const def = TIME_UNIT_DEFS[unit];
        return (
          <div key={unit} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {FIELD_LABELS[unit]}
            </label>
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id={id}
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  className={inputClass}
                  value={draft.texts[unit]}
                  placeholder="Enter value"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `${id}-error` : undefined}
                  onChange={(event) =>
                    onDraftChange({
                      ...draft,
                      texts: { ...draft.texts, [unit]: event.target.value },
                      activeField: unit,
                    })
                  }
                />
              </div>
              <span className="flex h-11 min-w-[3.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
                {def.symbol}
              </span>
            </div>
            {error ? (
              <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="space-y-1.5">
        <label htmlFor="ms-other-unit" className={labelClass}>
          Time in other units
        </label>
        <select
          id="ms-other-unit"
          className={selectClass}
          value={draft.otherUnit}
          onChange={(event) => onOtherUnitChange(event.target.value as OtherTimeUnit)}
        >
          {OTHER_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {TIME_UNIT_DEFS[unit].label} ({TIME_UNIT_DEFS[unit].symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ms-other-value" className={labelClass}>
          {FIELD_LABELS[draft.otherUnit]}
        </label>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ms-other-value"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              className={inputClass}
              value={draft.otherText}
              placeholder="Enter value"
              aria-invalid={Boolean(errors[draft.otherUnit])}
              aria-describedby={errors[draft.otherUnit] ? 'ms-other-value-error' : undefined}
              onChange={(event) =>
                onDraftChange({
                  ...draft,
                  otherText: event.target.value,
                  activeField: draft.otherUnit,
                })
              }
            />
          </div>
          <span className="flex h-11 min-w-[3.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
            {TIME_UNIT_DEFS[draft.otherUnit].symbol}
          </span>
        </div>
        {errors[draft.otherUnit] ? (
          <p id="ms-other-value-error" className="text-xs text-red-600" role="alert">
            {errors[draft.otherUnit]}
          </p>
        ) : null}
      </div>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
        <button type="submit" className="sr-only">
          Convert
        </button>
      </div>
    </form>
  );
}
