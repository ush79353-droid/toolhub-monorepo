'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  OTHER_UNITS,
  TEMPERATURE_UNITS,
  TEMP_LABELS,
  TEMP_SYMBOLS,
  type FahrenheitFieldErrors,
  type TemperatureUnit,
} from './types';

export interface FahrenheitDraft {
  texts: Record<TemperatureUnit, string>;
  activeField: TemperatureUnit | null;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<TemperatureUnit, string> {
  const texts = {} as Record<TemperatureUnit, string>;
  for (const unit of TEMPERATURE_UNITS) texts[unit] = '';
  return texts;
}

export function emptyDraft(): FahrenheitDraft {
  return { texts: emptyTexts(), activeField: null, otherOpen: true };
}

interface FahrenheitConverterFormProps {
  draft: FahrenheitDraft;
  errors: FahrenheitFieldErrors;
  onDraftChange: (draft: FahrenheitDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldRow({
  unit,
  draft,
  errors,
  onDraftChange,
}: {
  unit: TemperatureUnit;
  draft: FahrenheitDraft;
  errors: FahrenheitFieldErrors;
  onDraftChange: (draft: FahrenheitDraft) => void;
}) {
  const id = `fahrenheit-conv-${unit}`;
  const error = errors[unit];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {TEMP_LABELS[unit]}
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
            placeholder="Enter temperature"
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
        <span className="flex h-11 min-w-[3.25rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
          {TEMP_SYMBOLS[unit]}
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FahrenheitConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: FahrenheitConverterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Enter a temperature in Fahrenheit or any other scale. Fields stay linked through Kelvin
        (via Celsius). Absolute zero is −459.67°F / −273.15°C / 0 K. Values below absolute zero are
        rejected.
      </div>

      <div className="rounded-xl border border-border">
        <div className="px-3.5 py-3 text-sm font-medium text-accent">Fahrenheit</div>
        <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
          <FieldRow
            unit="fahrenheit"
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => onDraftChange({ ...draft, otherOpen: !draft.otherOpen })}
        >
          <span>Other temperatures</span>
          {draft.otherOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            {OTHER_UNITS.map((unit) => (
              <FieldRow
                key={unit}
                unit={unit}
                draft={draft}
                errors={errors}
                onDraftChange={onDraftChange}
              />
            ))}
          </div>
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
