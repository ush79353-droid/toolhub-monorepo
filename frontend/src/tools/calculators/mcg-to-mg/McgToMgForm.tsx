'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMass } from './calculation';
import {
  type McgMgSource,
  type McgToMgFieldErrors,
  type McgToMgInput,
  type OtherUnitRow,
} from './types';
import { parseOptionalNumber } from './validation';

export interface McgToMgDraft {
  source: McgMgSource;
  mcg: string;
  mg: string;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: McgToMgInput, moreOpen = false): McgToMgDraft {
  return {
    source: input.source,
    mcg: input.mcg === null ? '' : formatMass(input.mcg),
    mg: input.mg === null ? '' : formatMass(input.mg),
    moreOpen,
  };
}

export function draftToInput(draft: McgToMgDraft): McgToMgInput {
  return {
    source: draft.source,
    mcg: parseOptionalNumber(draft.mcg),
    mg: parseOptionalNumber(draft.mg),
  };
}

interface McgToMgFormProps {
  draft: McgToMgDraft;
  errors: McgToMgFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: McgToMgDraft) => void;
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

export function McgToMgForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: McgToMgFormProps) {
  const set = (patch: Partial<McgToMgDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Micrograms (mcg)"
        htmlFor="mcg-mg-mcg"
        tip="mcg and µg both mean micrograms. Milligrams update as mcg ÷ 1000."
        error={errors.mcg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mcg-mg-mcg"
              inputMode="decimal"
              className={inputClass}
              value={draft.mcg}
              placeholder="Enter mass"
              aria-invalid={Boolean(errors.mcg)}
              onChange={(event) => set({ source: 'mcg', mcg: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mcg
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Milligrams (mg)"
        htmlFor="mcg-mg-mg"
        tip="One milligram equals exactly 1000 micrograms. Micrograms update as mg × 1000."
        error={errors.mg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mcg-mg-mg"
              inputMode="decimal"
              className={inputClass}
              value={draft.mg}
              placeholder="Enter mass"
              aria-invalid={Boolean(errors.mg)}
              onChange={(event) => set({ source: 'mg', mg: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mg
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
                      {formatMass(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid mass to see nanograms, centigrams, decigrams, grams, and kilograms.
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
