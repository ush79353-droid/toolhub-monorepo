'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  MILLIGRAMS_PER_POUND,
  type MgLbsSource,
  type MgToLbsFieldErrors,
  type MgToLbsInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MgToLbsDraft {
  source: MgLbsSource;
  milligrams: string;
  pounds: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: MgToLbsDraft): MgToLbsInput {
  return {
    source: draft.source,
    milligrams: parseOptionalNumber(draft.milligrams),
    pounds: parseOptionalNumber(draft.pounds),
  };
}

export function emptyDraft(): MgToLbsDraft {
  return { source: 'milligrams', milligrams: '', pounds: '' };
}

interface MgToLbsFormProps {
  draft: MgToLbsDraft;
  errors: MgToLbsFieldErrors;
  onDraftChange: (draft: MgToLbsDraft) => void;
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

export function MgToLbsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MgToLbsFormProps) {
  const set = (patch: Partial<MgToLbsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact conversion: 1 lb = {MILLIGRAMS_PER_POUND} mg (international avoirdupois pound). Both
        fields are synchronized.
      </div>

      <FieldShell
        label="Milligrams"
        htmlFor="mg-to-lbs-mg"
        tip={`Enter a mass in milligrams. Pounds update as milligrams ÷ ${MILLIGRAMS_PER_POUND}.`}
        error={errors.milligrams}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mg-to-lbs-mg"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.milligrams}
              placeholder="Enter milligrams"
              aria-invalid={Boolean(errors.milligrams)}
              onChange={(event) =>
                set({ source: 'milligrams', milligrams: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mg
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Pounds"
        htmlFor="mg-to-lbs-lb"
        tip={`Enter a mass in pounds. Milligrams update as pounds × ${MILLIGRAMS_PER_POUND}.`}
        error={errors.pounds}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mg-to-lbs-lb"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.pounds}
              placeholder="Enter pounds"
              aria-invalid={Boolean(errors.pounds)}
              onChange={(event) => set({ source: 'pounds', pounds: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            lb
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        lb = mg ÷ {MILLIGRAMS_PER_POUND} · mg = lb × {MILLIGRAMS_PER_POUND}
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
