'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMeasure } from './calculation';
import {
  DEFAULT_PPI,
  PPI_PRESETS,
  type OtherUnitRow,
  type PixelsInchesSource,
  type PixelsToInchesFieldErrors,
  type PixelsToInchesInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface PixelsToInchesDraft {
  source: PixelsInchesSource;
  inches: string;
  pixels: string;
  ppi: string;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(
  input: PixelsToInchesInput,
  otherOpen = false
): PixelsToInchesDraft {
  return {
    source: input.source,
    inches: input.inches === null ? '' : formatMeasure(input.inches),
    pixels: input.pixels === null ? '' : formatMeasure(input.pixels),
    ppi: input.ppi === null ? String(DEFAULT_PPI) : formatMeasure(input.ppi),
    otherOpen,
  };
}

export function draftToInput(draft: PixelsToInchesDraft): PixelsToInchesInput {
  return {
    source: draft.source,
    inches: parseOptionalNumber(draft.inches),
    pixels: parseOptionalNumber(draft.pixels),
    ppi: parseOptionalNumber(draft.ppi),
  };
}

interface PixelsToInchesFormProps {
  draft: PixelsToInchesDraft;
  errors: PixelsToInchesFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: PixelsToInchesDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
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

export function PixelsToInchesForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: PixelsToInchesFormProps) {
  const set = (patch: Partial<PixelsToInchesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Inches"
        htmlFor="px-in-inches"
        tip="Enter a physical length in inches. Pixels update as inches × PPI. Zero is allowed; negatives are not."
        error={errors.inches}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="px-in-inches"
              inputMode="decimal"
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
        label="Pixels"
        htmlFor="px-in-pixels"
        tip="Enter a pixel count. Inches update as pixels ÷ PPI. Fractional pixels are allowed for math and CSS contexts."
        error={errors.pixels}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="px-in-pixels"
              inputMode="decimal"
              className={inputClass}
              value={draft.pixels}
              placeholder="Enter pixels"
              aria-invalid={Boolean(errors.pixels)}
              onChange={(event) => set({ source: 'pixels', pixels: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            px
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Pixels per inch (PPI)"
        htmlFor="px-in-ppi"
        tip="Adjust PPI to match your image or intended output resolution. Changing PPI keeps the field you last edited and recalculates the other."
        error={errors.ppi}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="px-in-ppi"
              inputMode="decimal"
              className={inputClass}
              value={draft.ppi}
              placeholder="Enter PPI"
              aria-invalid={Boolean(errors.ppi)}
              onChange={(event) => set({ ppi: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            PPI
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1" role="group" aria-label="PPI presets">
          {PPI_PRESETS.map((value) => {
            const active = draft.ppi.trim() === String(value);
            return (
              <Button
                key={value}
                type="button"
                variant={active ? 'default' : 'outline'}
                size="sm"
                className="h-8 px-2.5 text-xs tabular-nums"
                aria-pressed={active}
                onClick={() => set({ ppi: String(value) })}
              >
                {value}
              </Button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          Presets are workflow examples (CSS reference, print, scan). They are not universal
          physical screen densities.
        </p>
      </FieldShell>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => set({ otherOpen: !draft.otherOpen })}
        >
          <span>More conversion options</span>
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.otherOpen ? (
          <div className="border-t border-border px-3.5 pb-3.5 pt-2">
            {otherUnits && otherUnits.length > 0 ? (
              <ul className="divide-y divide-border">
                {otherUnits.map((row) => (
                  <li
                    key={row.unit}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="tabular-nums font-medium text-accent">
                      {formatMeasure(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid measurement to see millimeters, centimeters, and feet.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
