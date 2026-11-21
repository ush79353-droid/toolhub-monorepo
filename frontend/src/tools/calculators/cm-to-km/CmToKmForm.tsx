'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { UNIT_LABELS, UNIT_SYMBOLS } from '../centimeter/units';
import {
  EXTRA_LENGTH_UNITS,
  type CmToKmFieldErrors,
  type CmToKmInput,
  type CmToKmSource,
  type ExtraLengthUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CmToKmDraft {
  source: CmToKmSource;
  centimeters: string;
  kilometers: string;
  extras: Partial<Record<ExtraLengthUnit, string>>;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): CmToKmDraft {
  return {
    source: 'cm',
    centimeters: '',
    kilometers: '',
    extras: {},
    otherOpen: false,
  };
}

export function draftToInput(draft: CmToKmDraft): CmToKmInput {
  if (draft.source === 'cm') {
    return { source: 'cm', value: parseOptionalNumber(draft.centimeters) };
  }
  if (draft.source === 'km') {
    return { source: 'km', value: parseOptionalNumber(draft.kilometers) };
  }
  return {
    source: draft.source,
    value: parseOptionalNumber(draft.extras[draft.source] ?? ''),
  };
}

interface CmToKmFormProps {
  draft: CmToKmDraft;
  errors: CmToKmFieldErrors;
  onDraftChange: (draft: CmToKmDraft) => void;
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

export function CmToKmForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CmToKmFormProps) {
  const set = (patch: Partial<CmToKmDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact factor: 1 km = 100,000 cm. Edit centimeters or kilometers: the other updates
        instantly. Expand other units for mm, m, inches, feet, and more.
      </div>

      <FieldShell
        label="Length in centimeters"
        htmlFor="cm-km-cm"
        tip="Enter a length in centimeters. Kilometers = cm ÷ 100,000."
        error={errors.cm}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm-km-cm"
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
        label="Length in kilometers"
        htmlFor="cm-km-km"
        tip="Enter a length in kilometers. Centimeters = km × 100,000."
        error={errors.km}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm-km-km"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.kilometers}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.km)}
              onChange={(event) => set({ source: 'km', kilometers: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            km
          </span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => set({ otherOpen: !draft.otherOpen })}
        >
          <span>Other metric/imperial length units</span>
          {draft.otherOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">
            {EXTRA_LENGTH_UNITS.map((unit) => (
              <FieldShell
                key={unit}
                label={UNIT_LABELS[unit]}
                htmlFor={`cm-km-${unit}`}
                error={errors[unit]}
              >
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id={`cm-km-${unit}`}
                      inputMode="decimal"
                      autoComplete="off"
                      className={inputClass}
                      value={draft.extras[unit] ?? ''}
                      placeholder={`Enter ${UNIT_SYMBOLS[unit]}`}
                      aria-invalid={Boolean(errors[unit])}
                      onChange={(event) =>
                        set({
                          source: unit,
                          extras: { ...draft.extras, [unit]: event.target.value },
                        })
                      }
                    />
                  </div>
                  <span className={unitBadgeClass} aria-hidden="true">
                    {UNIT_SYMBOLS[unit]}
                  </span>
                </div>
              </FieldShell>
            ))}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">1 km = 100,000 cm · 1 cm = 0.00001 km</p>

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
