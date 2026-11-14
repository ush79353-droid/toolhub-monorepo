'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatVolume } from './calculation';
import {
  CUP_FRACTION_PRESETS,
  CUP_STANDARD_OPTIONS,
  type CupStandard,
  type MlCupsSource,
  type MlToCupsFieldErrors,
  type MlToCupsInput,
  type OtherUnitRow,
} from './types';
import { parseVolumeField } from './validation';

export interface MlToCupsDraft {
  source: MlCupsSource;
  ml: string;
  cups: string;
  cupStandard: CupStandard;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: MlToCupsInput, moreOpen = false): MlToCupsDraft {
  return {
    source: input.source,
    ml: input.ml === null ? '' : formatVolume(input.ml),
    cups: input.cups === null ? '' : formatVolume(input.cups),
    cupStandard: input.cupStandard,
    moreOpen,
  };
}

export function draftToInput(draft: MlToCupsDraft): MlToCupsInput {
  const mlParsed = parseVolumeField(draft.ml, false);
  const cupsParsed = parseVolumeField(draft.cups, true);
  return {
    source: draft.source,
    ml: mlParsed.value,
    cups: cupsParsed.value,
    cupStandard: draft.cupStandard,
  };
}

interface MlToCupsFormProps {
  draft: MlToCupsDraft;
  errors: MlToCupsFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: MlToCupsDraft) => void;
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

export function MlToCupsForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: MlToCupsFormProps) {
  const set = (patch: Partial<MlToCupsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Milliliters (mL)"
        htmlFor="ml-cups-ml"
        tip="Editing milliliters recalculates cups using the selected cup standard."
        error={errors.ml}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ml-cups-ml"
              inputMode="decimal"
              className={inputClass}
              value={draft.ml}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.ml)}
              onChange={(event) => set({ source: 'ml', ml: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mL
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Cups"
        htmlFor="ml-cups-cups"
        tip="Decimals or cooking fractions such as 1/2 or 1 1/2. Editing cups recalculates milliliters."
        error={errors.cups}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ml-cups-cups"
              inputMode="decimal"
              className={inputClass}
              value={draft.cups}
              placeholder="Enter cups (e.g. 1/2)"
              aria-invalid={Boolean(errors.cups)}
              onChange={(event) => set({ source: 'cups', cups: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            cup
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CUP_FRACTION_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="rounded-md border border-border bg-muted/40 px-2 py-1 text-xs font-medium text-accent hover:bg-muted"
              onClick={() =>
                set({
                  source: 'cups',
                  cups: formatVolume(preset.value),
                })
              }
            >
              {preset.label}
            </button>
          ))}
        </div>
      </FieldShell>

      <FieldShell
        label="Cup standard"
        htmlFor="ml-cups-standard"
        tip="Cup sizes differ by convention. Changing the standard preserves the last-edited field (mL or cups)."
      >
        <select
          id="ml-cups-standard"
          className={selectClass}
          value={draft.cupStandard}
          onChange={(event) =>
            set({ cupStandard: event.target.value as CupStandard })
          }
        >
          {CUP_STANDARD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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
            <p className="mb-2 text-xs text-muted-foreground">
              US tablespoon, teaspoon, and fluid ounce values use exact US customary
              definitions—not rounded metric cooking shortcuts (5 mL / 15 mL).
            </p>
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
                Enter a valid volume to see liters, fluid ounces, and related units.
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
