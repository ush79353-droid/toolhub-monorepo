'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  HORSEPOWER_UNITS,
  OTHER_UNITS,
  POWER_FIELD_LABELS,
  POWER_UNIT_SYMBOLS,
  SI_UNITS,
  type PowerFieldErrors,
  type PowerUnit,
} from './types';

export interface PowerDraft {
  texts: Record<PowerUnit, string>;
  activeField: PowerUnit | null;
  siOpen: boolean;
  horsepowerOpen: boolean;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<PowerUnit, string> {
  return {
    milliwatt: '',
    watt: '',
    kilowatt: '',
    mechanicalHorsepower: '',
    metricHorsepower: '',
    footPoundPerHour: '',
    footPoundPerMinute: '',
    footPoundPerSecond: '',
    btuPerHour: '',
  };
}

export function emptyDraft(): PowerDraft {
  return {
    texts: emptyTexts(),
    activeField: null,
    siOpen: true,
    horsepowerOpen: true,
    otherOpen: true,
  };
}

interface PowerFormProps {
  draft: PowerDraft;
  errors: PowerFieldErrors;
  onDraftChange: (draft: PowerDraft) => void;
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
  unit: PowerUnit;
  draft: PowerDraft;
  errors: PowerFieldErrors;
  onDraftChange: (draft: PowerDraft) => void;
}) {
  const id = `power-${unit}`;
  const error = errors[unit];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {POWER_FIELD_LABELS[unit]}
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
            placeholder=""
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
        <span className="flex h-11 min-w-[4.75rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
          {POWER_UNIT_SYMBOLS[unit]}
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

function AccordionSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>{title}</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open ? <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">{children}</div> : null}
    </div>
  );
}

export function PowerForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: PowerFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Enter a value in any field; all other units update from watts as the base. Mechanical
        horsepower hp(I) and metric horsepower PS are different. BTU/h uses the international-table
        (IT) definition. Negative values are allowed for signed power flow.
      </div>

      <AccordionSection
        title="SI Units"
        open={draft.siOpen}
        onToggle={() => onDraftChange({ ...draft, siOpen: !draft.siOpen })}
      >
        {SI_UNITS.map((unit) => (
          <FieldRow
            key={unit}
            unit={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
      </AccordionSection>

      <AccordionSection
        title="Horsepower"
        open={draft.horsepowerOpen}
        onToggle={() => onDraftChange({ ...draft, horsepowerOpen: !draft.horsepowerOpen })}
      >
        {HORSEPOWER_UNITS.map((unit) => (
          <FieldRow
            key={unit}
            unit={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
      </AccordionSection>

      <AccordionSection
        title="Other Power Units"
        open={draft.otherOpen}
        onToggle={() => onDraftChange({ ...draft, otherOpen: !draft.otherOpen })}
      >
        {OTHER_UNITS.map((unit) => (
          <FieldRow
            key={unit}
            unit={unit}
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        ))}
      </AccordionSection>

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
