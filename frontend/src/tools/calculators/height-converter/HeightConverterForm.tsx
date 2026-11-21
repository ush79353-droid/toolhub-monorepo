'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  OTHER_UNIT_LABELS,
  OTHER_UNIT_SYMBOLS,
  type HeightFieldErrors,
  type HeightInput,
  type HeightSource,
  type OtherHeightUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface HeightDraft {
  source: HeightSource;
  centimeters: string;
  meters: string;
  metersPart: string;
  centimetersPart: string;
  inches: string;
  feet: string;
  feetPart: string;
  inchesPart: string;
  otherUnit: OtherHeightUnit;
  otherValue: string;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';

export function emptyDraft(): HeightDraft {
  return {
    source: 'centimeters',
    centimeters: '',
    meters: '',
    metersPart: '',
    centimetersPart: '',
    inches: '',
    feet: '',
    feetPart: '',
    inchesPart: '',
    otherUnit: 'km',
    otherValue: '',
    otherOpen: false,
  };
}

export function draftToInput(draft: HeightDraft): HeightInput {
  return {
    source: draft.source,
    centimeters: parseOptionalNumber(draft.centimeters),
    meters: parseOptionalNumber(draft.meters),
    metersPart: parseOptionalNumber(draft.metersPart),
    centimetersPart: parseOptionalNumber(draft.centimetersPart),
    inches: parseOptionalNumber(draft.inches),
    feet: parseOptionalNumber(draft.feet),
    feetPart: parseOptionalNumber(draft.feetPart),
    inchesPart: parseOptionalNumber(draft.inchesPart),
    otherUnit: draft.otherUnit,
    otherValue: parseOptionalNumber(draft.otherValue),
  };
}

interface HeightConverterFormProps {
  draft: HeightDraft;
  errors: HeightFieldErrors;
  onDraftChange: (draft: HeightDraft) => void;
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

export function HeightConverterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: HeightConverterFormProps) {
  const set = (patch: Partial<HeightDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact factors: 1 in = 2.54 cm, 1 ft = 12 in = 30.48 cm. Edit any row; others update
        instantly. Decimal feet (5.9) are not the same as 5 ft 9 in.
      </div>

      <FieldShell
        label="Height in centimeters"
        htmlFor="hc-cm"
        tip="Primary metric height. 100 cm = 1 m."
        error={errors.centimeters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="hc-cm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.centimeters}
              placeholder="Enter centimeters"
              aria-invalid={Boolean(errors.centimeters)}
              onChange={(event) =>
                set({ source: 'centimeters', centimeters: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            cm
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Height in meters"
        htmlFor="hc-m"
        tip="Decimal meters. 1.75 m = 175 cm."
        error={errors.meters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="hc-m"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.meters}
              placeholder="Enter meters"
              aria-invalid={Boolean(errors.meters)}
              onChange={(event) => set({ source: 'meters', meters: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            m
          </span>
        </div>
      </FieldShell>

      <div>
        <p className={labelClass}>
          Height in meters and centimeters
          <InfoTooltip
            label="Height in meters and centimeters"
            text="Compound metric height. Values such as 1 m 100 cm normalize to 2 m 0 cm in other fields."
          />
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="hc-m-part"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.metersPart}
                  placeholder="Meters"
                  aria-label="Meters part"
                  aria-invalid={Boolean(errors.metersPart)}
                  onChange={(event) =>
                    set({ source: 'metersCm', metersPart: event.target.value })
                  }
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                m
              </span>
            </div>
            {errors.metersPart ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.metersPart}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="hc-cm-part"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.centimetersPart}
                  placeholder="Centimeters"
                  aria-label="Centimeters part"
                  aria-invalid={Boolean(errors.centimetersPart)}
                  onChange={(event) =>
                    set({ source: 'metersCm', centimetersPart: event.target.value })
                  }
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                cm
              </span>
            </div>
            {errors.centimetersPart ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.centimetersPart}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <FieldShell
        label="Height in inches"
        htmlFor="hc-in"
        tip="Total inches. 12 in = 1 ft."
        error={errors.inches}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="hc-in"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.inches}
              placeholder="Enter inches"
              aria-invalid={Boolean(errors.inches)}
              onChange={(event) => set({ source: 'inches', inches: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            in
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Height in feet"
        htmlFor="hc-ft"
        tip="Decimal feet (for example 5.5 ft). Not the same as 5 ft 5 in."
        error={errors.feet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="hc-ft"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.feet}
              placeholder="Enter feet"
              aria-invalid={Boolean(errors.feet)}
              onChange={(event) => set({ source: 'feet', feet: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft
          </span>
        </div>
      </FieldShell>

      <div>
        <p className={labelClass}>
          Height in feet and inches
          <InfoTooltip
            label="Height in feet and inches"
            text="Compound imperial height. Values such as 5 ft 14 in normalize to 6 ft 2 in in other fields."
          />
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="hc-ft-part"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.feetPart}
                  placeholder="Feet"
                  aria-label="Feet part"
                  aria-invalid={Boolean(errors.feetPart)}
                  onChange={(event) =>
                    set({ source: 'feetInches', feetPart: event.target.value })
                  }
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                ft
              </span>
            </div>
            {errors.feetPart ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.feetPart}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="hc-in-part"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.inchesPart}
                  placeholder="Inches"
                  aria-label="Inches part"
                  aria-invalid={Boolean(errors.inchesPart)}
                  onChange={(event) =>
                    set({ source: 'feetInches', inchesPart: event.target.value })
                  }
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                in
              </span>
            </div>
            {errors.inchesPart ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.inchesPart}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          onClick={() => set({ otherOpen: !draft.otherOpen })}
          aria-expanded={draft.otherOpen}
        >
          <span>Other units</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3">
            <FieldShell
              label={OTHER_UNIT_LABELS[draft.otherUnit]}
              htmlFor="hc-other"
              tip="Additional length units for the same height."
              error={errors.otherValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="hc-other"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.otherValue}
                    placeholder="Enter value"
                    aria-invalid={Boolean(errors.otherValue)}
                    onChange={(event) =>
                      set({ source: 'other', otherValue: event.target.value })
                    }
                  />
                </div>
                <select
                  className={selectClass}
                  value={draft.otherUnit}
                  aria-label="Other unit"
                  onChange={(event) => {
                    const otherUnit = event.target.value as OtherHeightUnit;
                    set({
                      otherUnit,
                      source: draft.otherValue.trim() ? 'other' : draft.source,
                    });
                  }}
                >
                  {(Object.keys(OTHER_UNIT_SYMBOLS) as OtherHeightUnit[]).map((unit) => (
                    <option key={unit} value={unit}>
                      {OTHER_UNIT_SYMBOLS[unit]}
                    </option>
                  ))}
                </select>
              </div>
            </FieldShell>
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
