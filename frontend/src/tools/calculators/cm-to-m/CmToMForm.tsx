'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { UNIT_LABELS, UNIT_SYMBOLS } from '../centimeter/units';
import {
  DEFAULT_OTHER_UNIT,
  OTHER_LENGTH_UNITS,
  type CmToMFieldErrors,
  type CmToMInput,
  type CmToMSource,
  type OtherLengthUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CmToMDraft {
  source: CmToMSource;
  centimeters: string;
  meters: string;
  other: string;
  otherUnit: OtherLengthUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function emptyDraft(): CmToMDraft {
  return {
    source: 'cm',
    centimeters: '',
    meters: '',
    other: '',
    otherUnit: DEFAULT_OTHER_UNIT,
  };
}

export function draftToInput(draft: CmToMDraft): CmToMInput {
  if (draft.source === 'cm') {
    return {
      source: 'cm',
      value: parseOptionalNumber(draft.centimeters),
      otherUnit: draft.otherUnit,
    };
  }
  if (draft.source === 'm') {
    return {
      source: 'm',
      value: parseOptionalNumber(draft.meters),
      otherUnit: draft.otherUnit,
    };
  }
  return {
    source: 'other',
    value: parseOptionalNumber(draft.other),
    otherUnit: draft.otherUnit,
  };
}

interface CmToMFormProps {
  draft: CmToMDraft;
  errors: CmToMFieldErrors;
  onDraftChange: (draft: CmToMDraft) => void;
  onOtherUnitChange: (unit: OtherLengthUnit) => void;
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

export function CmToMForm({
  draft,
  errors,
  onDraftChange,
  onOtherUnitChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CmToMFormProps) {
  const set = (patch: Partial<CmToMDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact factor: 1 m = 100 cm. Edit centimeters or meters — the other updates instantly. Other
        units defaults to inches (1 in = 2.54 cm).
      </div>

      <FieldShell
        label="Centimeters"
        htmlFor="cm-m-cm"
        tip="Enter a length in centimeters. Meters = cm ÷ 100."
        error={errors.cm}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm-m-cm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.centimeters}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.cm)}
              onChange={(event) => set({ source: 'cm', centimeters: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            cm
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Meters"
        htmlFor="cm-m-m"
        tip="Enter a length in meters. Centimeters = m × 100."
        error={errors.m}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm-m-m"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.meters}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.m)}
              onChange={(event) => set({ source: 'm', meters: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            m
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Other units"
        htmlFor="cm-m-other"
        tip="Select an additional length unit. Default is inches."
        error={errors.other}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm-m-other"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.other}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.other)}
              aria-label={`Length in ${UNIT_LABELS[draft.otherUnit]}`}
              onChange={(event) => set({ source: 'other', other: event.target.value })}
            />
          </div>
          <select
            className={`${selectClass} w-[7.5rem] shrink-0`}
            value={draft.otherUnit}
            aria-label="Other length unit"
            onChange={(event) => onOtherUnitChange(event.target.value as OtherLengthUnit)}
          >
            {OTHER_LENGTH_UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {UNIT_SYMBOLS[unit]}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 m = 100 cm · 1 in = 2.54 cm · selected: {UNIT_LABELS[draft.otherUnit]}
      </p>

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
