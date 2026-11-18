'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  Cm2Mm2Source,
  SquareCmToSquareMmFieldErrors,
  SquareCmToSquareMmInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface SquareCmToSquareMmDraft {
  source: Cm2Mm2Source;
  squareCentimeters: string;
  squareMillimeters: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): SquareCmToSquareMmDraft {
  return {
    source: 'squareCentimeters',
    squareCentimeters: '',
    squareMillimeters: '',
  };
}

export function draftToInput(draft: SquareCmToSquareMmDraft): SquareCmToSquareMmInput {
  if (draft.source === 'squareCentimeters') {
    return {
      source: 'squareCentimeters',
      value: parseOptionalNumber(draft.squareCentimeters),
    };
  }
  return {
    source: 'squareMillimeters',
    value: parseOptionalNumber(draft.squareMillimeters),
  };
}

interface SquareCmToSquareMmFormProps {
  draft: SquareCmToSquareMmDraft;
  errors: SquareCmToSquareMmFieldErrors;
  onDraftChange: (draft: SquareCmToSquareMmDraft) => void;
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

export function SquareCmToSquareMmForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: SquareCmToSquareMmFormProps) {
  const set = (patch: Partial<SquareCmToSquareMmDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 cm² = 100 mm² (because 1 cm = 10 mm, and 10² = 100). Enter either field — the other
        updates instantly. Area cannot be negative.
      </div>

      <FieldShell
        label="Area in square centimeters"
        htmlFor="cm2-mm2-cm2"
        tip="mm² = cm² × 100."
        error={errors.squareCentimeters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm2-mm2-cm2"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.squareCentimeters}
              placeholder="Enter area"
              aria-invalid={Boolean(errors.squareCentimeters)}
              onChange={(event) =>
                set({ source: 'squareCentimeters', squareCentimeters: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            cm²
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Area in square millimeters"
        htmlFor="cm2-mm2-mm2"
        tip="cm² = mm² ÷ 100."
        error={errors.squareMillimeters}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="cm2-mm2-mm2"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.squareMillimeters}
              placeholder="Enter area"
              aria-invalid={Boolean(errors.squareMillimeters)}
              onChange={(event) =>
                set({ source: 'squareMillimeters', squareMillimeters: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mm²
          </span>
        </div>
      </FieldShell>

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
