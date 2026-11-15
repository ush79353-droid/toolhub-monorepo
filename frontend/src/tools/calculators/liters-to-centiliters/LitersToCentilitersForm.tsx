'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatVolume } from './calculation';
import {
  type LitersCentilitersSource,
  type LitersToCentilitersFieldErrors,
  type LitersToCentilitersInput,
  type OtherUnitRow,
} from './types';
import { parseOptionalNumber } from './validation';

export interface LitersToCentilitersDraft {
  source: LitersCentilitersSource;
  liters: string;
  centiliters: string;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(
  input: LitersToCentilitersInput,
  moreOpen = false
): LitersToCentilitersDraft {
  return {
    source: input.source,
    liters: input.liters === null ? '' : formatVolume(input.liters),
    centiliters: input.centiliters === null ? '' : formatVolume(input.centiliters),
    moreOpen,
  };
}

export function draftToInput(draft: LitersToCentilitersDraft): LitersToCentilitersInput {
  return {
    source: draft.source,
    liters: parseOptionalNumber(draft.liters),
    centiliters: parseOptionalNumber(draft.centiliters),
  };
}

interface LitersToCentilitersFormProps {
  draft: LitersToCentilitersDraft;
  errors: LitersToCentilitersFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: LitersToCentilitersDraft) => void;
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

export function LitersToCentilitersForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: LitersToCentilitersFormProps) {
  const set = (patch: Partial<LitersToCentilitersDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Volume in liters (L)"
        htmlFor="l-cl-liters"
        tip="Enter a volume in liters. Centiliters update as liters × 100."
        error={errors.liters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="l-cl-liters"
              inputMode="decimal"
              className={inputClass}
              value={draft.liters}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.liters)}
              onChange={(event) => set({ source: 'liters', liters: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            L
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Volume in centiliters (cL)"
        htmlFor="l-cl-centiliters"
        tip="Enter a volume in centiliters. Liters update as centiliters ÷ 100."
        error={errors.centiliters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="l-cl-centiliters"
              inputMode="decimal"
              className={inputClass}
              value={draft.centiliters}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.centiliters)}
              onChange={(event) =>
                set({ source: 'centiliters', centiliters: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            cL
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
                      {formatVolume(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid volume to see milliliters, deciliters, cubic centimeters, cubic
                meters, US gallons, and US fluid ounces.
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
