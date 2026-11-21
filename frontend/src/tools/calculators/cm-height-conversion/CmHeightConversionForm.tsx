'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { CmHeightFieldErrors, CmHeightInput, CmHeightSource } from './types';
import { parseOptionalNumber } from './validation';

export interface CmHeightDraft {
  source: CmHeightSource;
  centimeters: string;
  feet: string;
  inches: string;
  meters: string;
  millimeters: string;
  totalInches: string;
  decimalFeet: string;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): CmHeightDraft {
  return {
    source: 'centimeters',
    centimeters: '',
    feet: '',
    inches: '',
    meters: '',
    millimeters: '',
    totalInches: '',
    decimalFeet: '',
    otherOpen: false,
  };
}

export function draftToInput(draft: CmHeightDraft): CmHeightInput {
  return {
    source: draft.source,
    centimeters: parseOptionalNumber(draft.centimeters),
    feet: parseOptionalNumber(draft.feet),
    inches: parseOptionalNumber(draft.inches),
    meters: parseOptionalNumber(draft.meters),
    millimeters: parseOptionalNumber(draft.millimeters),
    totalInches: parseOptionalNumber(draft.totalInches),
    decimalFeet: parseOptionalNumber(draft.decimalFeet),
  };
}

interface CmHeightConversionFormProps {
  draft: CmHeightDraft;
  errors: CmHeightFieldErrors;
  onDraftChange: (draft: CmHeightDraft) => void;
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

export function CmHeightConversionForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CmHeightConversionFormProps) {
  const set = (patch: Partial<CmHeightDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact factors: 1 in = 2.54 cm, 1 ft = 30.48 cm. Edit any field; others update instantly.
        Decimal feet (5.5) are not the same as 5 ft 5 in.
      </div>

      <p className="text-sm font-medium text-accent">Input height</p>

      <FieldShell
        label="Height in centimeters"
        htmlFor="cmh-cm"
        tip="Primary metric height. 100 cm = 1 m."
        error={errors.centimeters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cmh-cm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.centimeters}
              placeholder="Enter height"
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

      <div>
        <p className={labelClass}>
          Height in feet / inches
          <InfoTooltip
            label="Height in feet / inches"
            text="Enter feet and inches separately. Values such as 5 ft 14 in normalize to 6 ft 2 in in the result."
          />
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="cmh-feet"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.feet}
                  placeholder="Feet"
                  aria-label="Feet"
                  aria-invalid={Boolean(errors.feet)}
                  onChange={(event) => set({ source: 'feetInches', feet: event.target.value })}
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                ft
              </span>
            </div>
            {errors.feet ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.feet}
              </p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="cmh-inches"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.inches}
                  placeholder="Inches"
                  aria-label="Inches"
                  aria-invalid={Boolean(errors.inches)}
                  onChange={(event) => set({ source: 'feetInches', inches: event.target.value })}
                />
              </div>
              <span className={unitBadgeClass} aria-hidden="true">
                in
              </span>
            </div>
            {errors.inches ? (
              <p className="text-xs text-red-600" role="alert">
                {errors.inches}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => set({ otherOpen: !draft.otherOpen })}
        >
          <span>Other units</span>
          {draft.otherOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.otherOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-3">
            <FieldShell
              label="Height in meters"
              htmlFor="cmh-m"
              tip="1 m = 100 cm exactly."
              error={errors.meters}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="cmh-m"
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

            <FieldShell
              label="Height in millimeters"
              htmlFor="cmh-mm"
              tip="1 cm = 10 mm exactly."
              error={errors.millimeters}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="cmh-mm"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.millimeters}
                    placeholder="Enter millimeters"
                    aria-invalid={Boolean(errors.millimeters)}
                    onChange={(event) =>
                      set({ source: 'millimeters', millimeters: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  mm
                </span>
              </div>
            </FieldShell>

            <FieldShell
              label="Height in inches"
              htmlFor="cmh-total-in"
              tip="Total inches (not the remaining inches next to feet)."
              error={errors.totalInches}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="cmh-total-in"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.totalInches}
                    placeholder="Total inches"
                    aria-invalid={Boolean(errors.totalInches)}
                    onChange={(event) =>
                      set({ source: 'totalInches', totalInches: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  in
                </span>
              </div>
            </FieldShell>

            <FieldShell
              label="Height in decimal feet"
              htmlFor="cmh-dec-ft"
              tip="5.5 decimal feet = 5 ft 6 in, not 5 ft 5 in."
              error={errors.decimalFeet}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="cmh-dec-ft"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.decimalFeet}
                    placeholder="Decimal feet"
                    aria-invalid={Boolean(errors.decimalFeet)}
                    onChange={(event) =>
                      set({ source: 'decimalFeet', decimalFeet: event.target.value })
                    }
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  ft
                </span>
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
