'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  type AngstromNmSource,
  type AngstromToNmFieldErrors,
  type AngstromToNmInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface AngstromToNmDraft {
  source: AngstromNmSource;
  angstroms: string;
  nanometers: string;
  mils: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function draftToInput(draft: AngstromToNmDraft): AngstromToNmInput {
  return {
    source: draft.source,
    angstroms: parseOptionalNumber(draft.angstroms),
    nanometers: parseOptionalNumber(draft.nanometers),
    mils: parseOptionalNumber(draft.mils),
  };
}

export function emptyDraft(): AngstromToNmDraft {
  return { source: 'angstroms', angstroms: '', nanometers: '', mils: '' };
}

interface AngstromToNmFormProps {
  draft: AngstromToNmDraft;
  errors: AngstromToNmFieldErrors;
  onDraftChange: (draft: AngstromToNmDraft) => void;
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

export function AngstromToNmForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: AngstromToNmFormProps) {
  const set = (patch: Partial<AngstromToNmDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact factors: 1 Å = 0.1 nm (10 Å = 1 nm); 1 mil = 25,400 nm. Edit any field: the others
        update from nanometers. Length cannot be negative. Scientific notation (e.g. 1e-10) is
        allowed.
      </div>

      <div className={sectionClass}>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Metric</p>
        <FieldShell
          label="Length in angstroms"
          htmlFor="a-nm-angstroms"
          tip="Enter a length in angstroms (Å). Nanometers = angstroms ÷ 10."
          error={errors.angstroms}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="a-nm-angstroms"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.angstroms}
                placeholder="Enter angstroms"
                aria-invalid={Boolean(errors.angstroms)}
                onChange={(event) => set({ source: 'angstroms', angstroms: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              Å
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label="Length in nanometers"
          htmlFor="a-nm-nanometers"
          tip="Enter a length in nanometers (nm). Angstroms = nanometers × 10."
          error={errors.nanometers}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="a-nm-nanometers"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.nanometers}
                placeholder="Enter nanometers"
                aria-invalid={Boolean(errors.nanometers)}
                onChange={(event) => set({ source: 'nanometers', nanometers: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              nm
            </span>
          </div>
        </FieldShell>
      </div>

      <div className={sectionClass}>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Imperial / US
        </p>
        <FieldShell
          label="Length in thousandths of an inch"
          htmlFor="a-nm-mils"
          tip="A mil is 0.001 international inch (not a millimeter). 1 mil = 25,400 nm."
          error={errors.mils}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="a-nm-mils"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.mils}
                placeholder="Enter mils"
                aria-invalid={Boolean(errors.mils)}
                onChange={(event) => set({ source: 'mils', mils: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              mil
            </span>
          </div>
        </FieldShell>
      </div>

      <p className="text-xs text-muted-foreground">1 Å = 0.1 nm · 1 mil = 25,400 nm</p>

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
