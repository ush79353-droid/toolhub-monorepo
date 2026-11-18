'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  NANOMETERS_PER_METER,
  type NmMSource,
  type NmToMFieldErrors,
  type NmToMInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface NmToMDraft {
  source: NmMSource;
  nm: string;
  m: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: NmToMDraft): NmToMInput {
  return {
    source: draft.source,
    nm: parseOptionalNumber(draft.nm),
    m: parseOptionalNumber(draft.m),
  };
}

export function emptyDraft(): NmToMDraft {
  return { source: 'nm', nm: '', m: '' };
}

interface NmToMFormProps {
  draft: NmToMDraft;
  errors: NmToMFieldErrors;
  onDraftChange: (draft: NmToMDraft) => void;
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

export function NmToMForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: NmToMFormProps) {
  const set = (patch: Partial<NmToMDraft>) => onDraftChange({ ...draft, ...patch });
  const billion = NANOMETERS_PER_METER.toLocaleString('en-US');

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact SI: 1 nm = 10⁻⁹ m (1 m = {billion} nm). Edit either field — the other updates
        instantly. Signed values and scientific notation are allowed.
      </div>

      <FieldShell
        label="Measurement in nanometers"
        htmlFor="nm-m-nm"
        tip={`m = nm ÷ ${billion}.`}
        error={errors.nm}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="nm-m-nm"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.nm}
              placeholder="Enter nanometers"
              aria-invalid={Boolean(errors.nm)}
              onChange={(event) => set({ source: 'nm', nm: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            nm
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Measurement in meters"
        htmlFor="nm-m-m"
        tip={`nm = m × ${billion}.`}
        error={errors.m}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="nm-m-m"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.m}
              placeholder="Enter meters"
              aria-invalid={Boolean(errors.m)}
              onChange={(event) => set({ source: 'm', m: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            m
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        1 nm = 10⁻⁹ m · m = nm ÷ {billion} · nm = m × {billion}
      </p>

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
