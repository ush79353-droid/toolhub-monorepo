'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ENERGY_FIELD_LABELS,
  ENERGY_UNITS,
  ENERGY_UNIT_SYMBOLS,
  LARGE_UNITS,
  MICROSCOPIC_UNITS,
  OTHER_UNITS,
  SI_UNITS,
  type EnergyFieldErrors,
  type EnergyUnit,
} from './types';

export interface EnergyDraft {
  texts: Record<EnergyUnit, string>;
  activeField: EnergyUnit | null;
  siOpen: boolean;
  largeOpen: boolean;
  microscopicOpen: boolean;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<EnergyUnit, string> {
  const texts = {} as Record<EnergyUnit, string>;
  for (const unit of ENERGY_UNITS) texts[unit] = '';
  return texts;
}

export function emptyDraft(): EnergyDraft {
  return {
    texts: emptyTexts(),
    activeField: null,
    siOpen: true,
    largeOpen: true,
    microscopicOpen: false,
    otherOpen: false,
  };
}

interface EnergyFormProps {
  draft: EnergyDraft;
  errors: EnergyFieldErrors;
  onDraftChange: (draft: EnergyDraft) => void;
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
  unit: EnergyUnit;
  draft: EnergyDraft;
  errors: EnergyFieldErrors;
  onDraftChange: (draft: EnergyDraft) => void;
}) {
  const id = `energy-${unit}`;
  const error = errors[unit];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {ENERGY_FIELD_LABELS[unit]}
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
        <span className="flex h-11 min-w-[4.75rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-center text-sm font-medium text-accent">
          {ENERGY_UNIT_SYMBOLS[unit]}
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

export function EnergyForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: EnergyFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Enter a value in any field; all other units update from joules. Calories (kcal) are food
        kilocalories (1 kcal = 4184 J). Therm uses the US definition. Hartree and Rydberg use CODATA
        2018 values. Signed values are allowed.
      </div>

      <AccordionSection
        title="SI unit for energy"
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
        title="Big energies"
        open={draft.largeOpen}
        onToggle={() => onDraftChange({ ...draft, largeOpen: !draft.largeOpen })}
      >
        {LARGE_UNITS.map((unit) => (
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
        title="Microscopic world"
        open={draft.microscopicOpen}
        onToggle={() => onDraftChange({ ...draft, microscopicOpen: !draft.microscopicOpen })}
      >
        {MICROSCOPIC_UNITS.map((unit) => (
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
        title="Other energy units"
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
