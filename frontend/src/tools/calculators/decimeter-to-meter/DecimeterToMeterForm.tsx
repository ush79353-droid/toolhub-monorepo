'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatLength } from './calculation';
import {
  type DecimeterMeterSource,
  type DecimeterToMeterFieldErrors,
  type DecimeterToMeterInput,
  type OtherUnitRow,
} from './types';
import { parseOptionalNumber } from './validation';

export interface DecimeterToMeterDraft {
  source: DecimeterMeterSource;
  decimeters: string;
  meters: string;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(
  input: DecimeterToMeterInput,
  moreOpen = false
): DecimeterToMeterDraft {
  return {
    source: input.source,
    decimeters: input.decimeters === null ? '' : formatLength(input.decimeters),
    meters: input.meters === null ? '' : formatLength(input.meters),
    moreOpen,
  };
}

export function draftToInput(draft: DecimeterToMeterDraft): DecimeterToMeterInput {
  return {
    source: draft.source,
    decimeters: parseOptionalNumber(draft.decimeters),
    meters: parseOptionalNumber(draft.meters),
  };
}

interface DecimeterToMeterFormProps {
  draft: DecimeterToMeterDraft;
  errors: DecimeterToMeterFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: DecimeterToMeterDraft) => void;
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

export function DecimeterToMeterForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: DecimeterToMeterFormProps) {
  const set = (patch: Partial<DecimeterToMeterDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Length in decimeters"
        htmlFor="dm-m-decimeters"
        tip="Enter a length in decimeters. Meters update as decimeters ÷ 10. One meter equals exactly ten decimeters."
        error={errors.decimeters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="dm-m-decimeters"
              inputMode="decimal"
              className={inputClass}
              value={draft.decimeters}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.decimeters)}
              onChange={(event) =>
                set({ source: 'decimeters', decimeters: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            dm
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Length in meters"
        htmlFor="dm-m-meters"
        tip="Enter a length in meters. Decimeters update as meters × 10."
        error={errors.meters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="dm-m-meters"
              inputMode="decimal"
              className={inputClass}
              value={draft.meters}
              placeholder="Enter length"
              aria-invalid={Boolean(errors.meters)}
              onChange={(event) => set({ source: 'meters', meters: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            m
          </span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.moreOpen}
          onClick={() => set({ moreOpen: !draft.moreOpen })}
        >
          <span>More conversion options</span>
          {draft.moreOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.moreOpen ? (
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
                      {formatLength(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid length to see millimeters, centimeters, kilometers, inches, feet,
                and yards.
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
