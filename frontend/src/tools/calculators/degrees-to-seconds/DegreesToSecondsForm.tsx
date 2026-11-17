'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  OTHER_UNITS,
  UNIT_LABEL,
  UNIT_TITLE,
  type AngleFieldUnit,
  type DegreesSecondsSource,
  type DegreesToSecondsFieldErrors,
} from './types';
import { parseOptionalNumber } from './validation';

export interface DegreesToSecondsDraft {
  source: DegreesSecondsSource;
  degrees: string;
  arcseconds: string;
  arcminutes: string;
  radians: string;
  gradians: string;
  revolutions: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const suffixClass =
  'flex h-11 shrink-0 items-center rounded-r-lg border-l border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): DegreesToSecondsDraft {
  return {
    source: 'degrees',
    degrees: '',
    arcseconds: '',
    arcminutes: '',
    radians: '',
    gradians: '',
    revolutions: '',
  };
}

export function draftToInput(draft: DegreesToSecondsDraft) {
  return {
    source: draft.source,
    value: parseOptionalNumber(draft[draft.source]),
  };
}

interface DegreesToSecondsFormProps {
  draft: DegreesToSecondsDraft;
  errors: DegreesToSecondsFieldErrors;
  onDraftChange: (draft: DegreesToSecondsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function UnitField({
  unit,
  value,
  error,
  tip,
  placeholder,
  onChange,
}: {
  unit: AngleFieldUnit;
  value: string;
  error?: string;
  tip?: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const id = `dts-${unit}`;
  return (
    <FieldShell label={UNIT_TITLE[unit]} htmlFor={id} tip={tip} error={error}>
      <div className="flex overflow-hidden rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          className={inputClass}
          value={value}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className={suffixClass} aria-hidden="true">
          {UNIT_LABEL[unit]}
        </span>
      </div>
    </FieldShell>
  );
}

export function DegreesToSecondsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: DegreesToSecondsFormProps) {
  const setUnit = (unit: DegreesSecondsSource, text: string) =>
    onDraftChange({ ...draft, source: unit, [unit]: text });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Converts angular degrees to arcseconds (″), not clock time. Exactly 1° = 3,600″. Negative
        angles and values beyond 360° are allowed.
      </div>

      <UnitField
        unit="degrees"
        value={draft.degrees}
        error={errors.degrees}
        tip="Enter an angle in degrees (°). Arcseconds update as degrees × 3600."
        placeholder="Enter degrees"
        onChange={(text) => setUnit('degrees', text)}
      />
      <UnitField
        unit="arcseconds"
        value={draft.arcseconds}
        error={errors.arcseconds}
        tip="Arcseconds (″) measure angles — 1/3600 of a degree — not seconds of time."
        placeholder="Enter arcseconds"
        onChange={(text) => setUnit('arcseconds', text)}
      />

      <details className="rounded-xl border border-border bg-muted/15">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-accent [&::-webkit-details-marker]:hidden">
          <span>Other angle units</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        </summary>
        <div className="space-y-3 border-t border-border px-4 py-3">
          {OTHER_UNITS.map((unit) => (
            <UnitField
              key={unit}
              unit={unit}
              value={draft[unit]}
              error={errors[unit]}
              tip={
                unit === 'arcminutes'
                  ? '1° = 60′. Edit to reverse-convert through degrees.'
                  : unit === 'radians'
                    ? '1° = π/180 rad.'
                    : unit === 'gradians'
                      ? '1° = 10/9 gon.'
                      : '1° = 1/360 rev.'
              }
              placeholder="—"
              onChange={(text) => setUnit(unit, text)}
            />
          ))}
        </div>
      </details>

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
