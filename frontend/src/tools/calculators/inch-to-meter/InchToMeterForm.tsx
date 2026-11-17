'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type { InchToMeterFieldErrors, InchToMeterInput, InchToMeterSource } from './types';
import { parseOptionalNumber } from './validation';

export interface InchToMeterDraft {
  source: InchToMeterSource;
  inches: string;
  meters: string;
  feetPart: string;
  inchesPart: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): InchToMeterDraft {
  return { source: 'inches', inches: '', meters: '', feetPart: '', inchesPart: '' };
}

export function draftToInput(draft: InchToMeterDraft): InchToMeterInput {
  return {
    source: draft.source,
    inches: parseOptionalNumber(draft.inches),
    meters: parseOptionalNumber(draft.meters),
    feetPart: parseOptionalNumber(draft.feetPart),
    inchesPart: parseOptionalNumber(draft.inchesPart),
  };
}

interface InchToMeterFormProps {
  draft: InchToMeterDraft;
  errors: InchToMeterFieldErrors;
  onDraftChange: (draft: InchToMeterDraft) => void;
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

export function InchToMeterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: InchToMeterFormProps) {
  const set = (patch: Partial<InchToMeterDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact relationship: 1 inch = 0.0254 meters. Edit inches, meters, or feet and inches — the
        other fields update instantly. Signed values are supported for mathematical differences.
      </div>

      <FieldShell
        label="Inches"
        htmlFor="in-m-inches"
        tip="Enter a length in inches. Meters = inches × 0.0254."
        error={errors.inches}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="in-m-inches"
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
        label="Meters"
        htmlFor="in-m-meters"
        tip="Enter a length in meters. Inches = meters ÷ 0.0254."
        error={errors.meters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="in-m-meters"
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
          Other related units
          <InfoTooltip
            label="Other related units"
            text="Enter feet and leftover inches. 5 ft 8 in means 68 inches total — not 5.8 decimal feet."
          />
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="in-m-feet"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.feetPart}
                  placeholder="Feet"
                  aria-label="Feet"
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
                  id="in-m-inches-part"
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

      <p className="text-xs text-muted-foreground">1 in = 0.0254 m · 1 ft = 12 in</p>

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
