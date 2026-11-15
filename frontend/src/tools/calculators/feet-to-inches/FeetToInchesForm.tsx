'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatLength } from './calculation';
import {
  type FeetInchesSource,
  type FeetToInchesFieldErrors,
  type FeetToInchesInput,
  type OtherUnitRow,
} from './types';
import { parseOptionalNumber } from './validation';

export interface FeetToInchesDraft {
  source: FeetInchesSource;
  feet: string;
  inches: string;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: FeetToInchesInput, otherOpen = false): FeetToInchesDraft {
  return {
    source: input.source,
    feet: input.feet === null ? '' : formatLength(input.feet),
    inches: input.inches === null ? '' : formatLength(input.inches),
    otherOpen,
  };
}

export function draftToInput(draft: FeetToInchesDraft): FeetToInchesInput {
  return {
    source: draft.source,
    feet: parseOptionalNumber(draft.feet),
    inches: parseOptionalNumber(draft.inches),
  };
}

interface FeetToInchesFormProps {
  draft: FeetToInchesDraft;
  errors: FeetToInchesFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: FeetToInchesDraft) => void;
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

export function FeetToInchesForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: FeetToInchesFormProps) {
  const set = (patch: Partial<FeetToInchesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Feet"
        htmlFor="ft-in-feet"
        tip="Enter a length in feet. Decimals are allowed. The inches field updates from feet × 12."
        error={errors.feet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ft-in-feet"
              inputMode="decimal"
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

      <FieldShell
        label="Inches"
        htmlFor="ft-in-inches"
        tip="Enter a length in inches. The feet field updates from inches ÷ 12."
        error={errors.inches}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ft-in-inches"
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
                Enter a valid length to see other units.
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
