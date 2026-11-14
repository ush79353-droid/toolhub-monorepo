'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { BillionTrillionFieldErrors, SourceField } from './types';

export interface BillionToTrillionDraft {
  sourceField: SourceField;
  billion: string;
  trillion: string;
  scientific: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function defaultDraft(): BillionToTrillionDraft {
  return {
    sourceField: 'billion',
    billion: '1000',
    trillion: '1',
    scientific: '1 × 10¹²',
  };
}

export function emptyDraft(): BillionToTrillionDraft {
  return {
    sourceField: 'billion',
    billion: '',
    trillion: '',
    scientific: '',
  };
}

interface BillionToTrillionFormProps {
  draft: BillionToTrillionDraft;
  errors: BillionTrillionFieldErrors;
  onDraftChange: (draft: BillionToTrillionDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (id: 1 | 2 | 3 | 4) => void;
}

function FieldShell({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
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

export function BillionToTrillionForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
}: BillionToTrillionFormProps) {
  const set = (patch: Partial<BillionToTrillionDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Short-scale numbering: 1 billion = 10⁹, 1 trillion = 10¹², so 1 trillion = 1,000 billion.
        Scientific notation shows the absolute count (not “billions” or “trillions”).
      </div>

      <FieldShell label="Billion" htmlFor="b2t-billion" error={errors.billion}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="b2t-billion"
              inputMode="decimal"
              className={inputClass}
              value={draft.billion}
              placeholder="Enter billions"
              aria-invalid={Boolean(errors.billion)}
              onChange={(event) =>
                set({ sourceField: 'billion', billion: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            billion
          </span>
        </div>
      </FieldShell>

      <FieldShell label="Trillion" htmlFor="b2t-trillion" error={errors.trillion}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="b2t-trillion"
              inputMode="decimal"
              className={inputClass}
              value={draft.trillion}
              placeholder="Enter trillions"
              aria-invalid={Boolean(errors.trillion)}
              onChange={(event) =>
                set({ sourceField: 'trillion', trillion: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            trillion
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Scientific notation"
        htmlFor="b2t-sci"
        error={errors.scientific}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="b2t-sci"
              inputMode="text"
              className={inputClass}
              value={draft.scientific}
              placeholder="e.g. 1 × 10¹² or 1e12"
              aria-invalid={Boolean(errors.scientific)}
              aria-describedby="b2t-sci-hint"
              onChange={(event) =>
                set({ sourceField: 'scientific', scientific: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            a×10ⁿ
          </span>
        </div>
        <p id="b2t-sci-hint" className="text-xs text-muted-foreground">
          Absolute value in scientific form (short scale).
        </p>
      </FieldShell>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Check our examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          <li>
            <button
              type="button"
              className="text-left text-primary underline-offset-2 hover:underline"
              onClick={() => onApplyExample(1)}
            >
              Example 1 — 1 billion = 0.001 trillion
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-left text-primary underline-offset-2 hover:underline"
              onClick={() => onApplyExample(2)}
            >
              Example 2 — 1000 billion = 1 trillion
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-left text-primary underline-offset-2 hover:underline"
              onClick={() => onApplyExample(3)}
            >
              Example 3 — 500 billion = 0.5 trillion
            </button>
          </li>
          <li>
            <button
              type="button"
              className="text-left text-primary underline-offset-2 hover:underline"
              onClick={() => onApplyExample(4)}
            >
              Example 4 — 2.5 trillion = 2500 billion
            </button>
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
