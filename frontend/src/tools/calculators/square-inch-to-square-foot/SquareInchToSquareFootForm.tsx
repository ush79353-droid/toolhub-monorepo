'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  In2Ft2Source,
  SquareInchToSquareFootFieldErrors,
  SquareInchToSquareFootInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface SquareInchToSquareFootDraft {
  source: In2Ft2Source;
  squareInches: string;
  squareFeet: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): SquareInchToSquareFootDraft {
  return {
    source: 'squareInches',
    squareInches: '',
    squareFeet: '',
  };
}

export function draftToInput(draft: SquareInchToSquareFootDraft): SquareInchToSquareFootInput {
  if (draft.source === 'squareInches') {
    return {
      source: 'squareInches',
      value: parseOptionalNumber(draft.squareInches),
    };
  }
  return {
    source: 'squareFeet',
    value: parseOptionalNumber(draft.squareFeet),
  };
}

interface SquareInchToSquareFootFormProps {
  draft: SquareInchToSquareFootDraft;
  errors: SquareInchToSquareFootFieldErrors;
  onDraftChange: (draft: SquareInchToSquareFootDraft) => void;
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

export function SquareInchToSquareFootForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: SquareInchToSquareFootFormProps) {
  const set = (patch: Partial<SquareInchToSquareFootDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Exact: 1 ft² = 144 in² (because 1 ft = 12 in, and 12² = 144). Enter either field: the other
        updates instantly. Area cannot be negative.
      </div>

      <FieldShell
        label="Square inches"
        htmlFor="in2-ft2-in2"
        tip="ft² = in² ÷ 144."
        error={errors.squareInches}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="in2-ft2-in2"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.squareInches}
              placeholder="Enter area"
              aria-invalid={Boolean(errors.squareInches)}
              onChange={(event) =>
                set({ source: 'squareInches', squareInches: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            in²
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Square feet"
        htmlFor="in2-ft2-ft2"
        tip="in² = ft² × 144."
        error={errors.squareFeet}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="in2-ft2-ft2"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.squareFeet}
              placeholder="Converted area"
              aria-invalid={Boolean(errors.squareFeet)}
              onChange={(event) =>
                set({ source: 'squareFeet', squareFeet: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft²
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
