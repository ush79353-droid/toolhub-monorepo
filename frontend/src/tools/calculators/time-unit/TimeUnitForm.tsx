'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_EXTRA_UNIT,
  DEFAULT_HOURS,
  EXTRA_TIME_UNITS,
  MAIN_TIME_UNITS,
  TIME_UNIT_DEFS,
  type ExtraTimeUnit,
  type MainTimeUnit,
  type TimeUnit,
  type TimeUnitFieldErrors,
} from './types';

export interface TimeUnitDraft {
  texts: Record<MainTimeUnit, string>;
  extraUnit: ExtraTimeUnit;
  extraText: string;
  extraOpen: boolean;
  activeField: TimeUnit | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

function emptyMainTexts(): Record<MainTimeUnit, string> {
  return {
    years: '',
    months: '',
    weeks: '',
    days: '',
    hours: '',
    minutes: '',
    seconds: '',
  };
}

export function defaultDraft(): TimeUnitDraft {
  return {
    texts: {
      ...emptyMainTexts(),
      hours: DEFAULT_HOURS,
    },
    extraUnit: DEFAULT_EXTRA_UNIT,
    extraText: '',
    extraOpen: false,
    activeField: null,
  };
}

export function emptyDraft(extraUnit: ExtraTimeUnit = DEFAULT_EXTRA_UNIT): TimeUnitDraft {
  return {
    texts: emptyMainTexts(),
    extraUnit,
    extraText: '',
    extraOpen: false,
    activeField: null,
  };
}

interface TimeUnitFormProps {
  draft: TimeUnitDraft;
  errors: TimeUnitFieldErrors;
  extraRows: readonly { unit: ExtraTimeUnit; value: string }[] | null;
  onDraftChange: (draft: TimeUnitDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function TimeUnitForm({
  draft,
  errors,
  extraRows,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: TimeUnitFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Edit any field — the others update from the same duration in seconds. Years and months use
        average lengths (365.25-day year, 12 months), not a calendar start date.
      </div>

      {MAIN_TIME_UNITS.map((unit) => {
        const def = TIME_UNIT_DEFS[unit];
        const id = `time-unit-${unit}`;
        const error = errors[unit];
        return (
          <div key={unit} className="space-y-1.5">
            <label htmlFor={id} className={labelClass}>
              {def.label}
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
                  placeholder="0"
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
              <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
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

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.extraOpen}
          onClick={() => onDraftChange({ ...draft, extraOpen: !draft.extraOpen })}
        >
          <span>Other time units</span>
          {draft.extraOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.extraOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3.5">
            <div className="space-y-1.5">
              <label htmlFor="time-unit-extra-select" className={labelClass}>
                Select additional unit
              </label>
              <select
                id="time-unit-extra-select"
                className={selectClass}
                value={draft.extraUnit}
                onChange={(event) =>
                  onDraftChange({
                    ...draft,
                    extraUnit: event.target.value as ExtraTimeUnit,
                    activeField: draft.activeField,
                  })
                }
              >
                {EXTRA_TIME_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {TIME_UNIT_DEFS[unit].label} ({TIME_UNIT_DEFS[unit].symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="time-unit-extra" className={labelClass}>
                {TIME_UNIT_DEFS[draft.extraUnit].label}
              </label>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="time-unit-extra"
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    className={inputClass}
                    value={draft.extraText}
                    placeholder="0"
                    aria-invalid={Boolean(errors[draft.extraUnit])}
                    onChange={(event) =>
                      onDraftChange({
                        ...draft,
                        extraText: event.target.value,
                        activeField: draft.extraUnit,
                      })
                    }
                  />
                </div>
                <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
                  {TIME_UNIT_DEFS[draft.extraUnit].symbol}
                </span>
              </div>
              {errors[draft.extraUnit] ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors[draft.extraUnit]}
                </p>
              ) : null}
            </div>
            {extraRows ? (
              <ul className="divide-y divide-border rounded-lg border border-border">
                {extraRows.map((row) => (
                  <li
                    key={row.unit}
                    className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                  >
                    <span className="text-muted-foreground">
                      {TIME_UNIT_DEFS[row.unit].label} ({TIME_UNIT_DEFS[row.unit].symbol})
                    </span>
                    <span className="font-mono tabular-nums text-accent">{row.value}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Enter a duration to see other units.</p>
            )}
          </div>
        ) : null}
      </div>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Convert
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
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
