'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMass } from './calculation';
import {
  GRAMS_PER_AVOIRDUPOIS_OUNCE,
  type GOSource,
  type GramsToOuncesFieldErrors,
  type GramsToOuncesInput,
  type OtherUnitRow,
} from './types';
import { parseOptionalNumber } from './validation';

export interface GramsToOuncesDraft {
  source: GOSource;
  g: string;
  oz: string;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(
  input: GramsToOuncesInput,
  moreOpen = false
): GramsToOuncesDraft {
  return {
    source: input.source,
    g: input.g === null ? '' : formatMass(input.g),
    oz: input.oz === null ? '' : formatMass(input.oz),
    moreOpen,
  };
}

export function draftToInput(draft: GramsToOuncesDraft): GramsToOuncesInput {
  return {
    source: draft.source,
    g: parseOptionalNumber(draft.g),
    oz: parseOptionalNumber(draft.oz),
  };
}

interface GramsToOuncesFormProps {
  draft: GramsToOuncesDraft;
  errors: GramsToOuncesFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: GramsToOuncesDraft) => void;
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

export function GramsToOuncesForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: GramsToOuncesFormProps) {
  const set = (patch: Partial<GramsToOuncesDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        This calculator converts mass between grams and standard avoirdupois ounces. It
        does not convert fluid ounces.
      </div>

      <FieldShell
        label="Grams (g)"
        htmlFor="g-oz-g"
        tip={`Exact: 1 avoirdupois ounce = ${GRAMS_PER_AVOIRDUPOIS_OUNCE} g. Ounces = grams ÷ ${GRAMS_PER_AVOIRDUPOIS_OUNCE}.`}
        error={errors.g}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="g-oz-g"
              inputMode="decimal"
              className={inputClass}
              value={draft.g}
              placeholder="Enter grams"
              aria-invalid={Boolean(errors.g)}
              onChange={(event) => set({ source: 'g', g: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            g
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Ounces (oz)"
        htmlFor="g-oz-oz"
        tip="Avoirdupois mass ounces — not fluid ounces (fl oz) and not troy ounces."
        error={errors.oz}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="g-oz-oz"
              inputMode="decimal"
              className={inputClass}
              value={draft.oz}
              placeholder="Enter ounces"
              aria-invalid={Boolean(errors.oz)}
              onChange={(event) => set({ source: 'oz', oz: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            oz
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
                Enter a valid mass to see mg, dag, kg, lb, short tons, and tonnes.
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
