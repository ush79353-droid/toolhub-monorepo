'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { NumberBillionFieldErrors, SourceField } from './types';

export interface NumberToBillionDraft {
  sourceField: SourceField;
  number: string;
  billion: string;
  scientific: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function defaultDraft(): NumberToBillionDraft {
  return {
    sourceField: 'number',
    number: '1000000000',
    billion: '1',
    scientific: '1 × 10⁹',
  };
}

export function emptyDraft(): NumberToBillionDraft {
  return {
    sourceField: 'number',
    number: '',
    billion: '',
    scientific: '',
  };
}

interface NumberToBillionFormProps {
  draft: NumberToBillionDraft;
  errors: NumberBillionFieldErrors;
  onDraftChange: (draft: NumberToBillionDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  onApplyExample: (id: 1 | 2 | 3 | 4 | 5) => void;
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

export function NumberToBillionForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
}: NumberToBillionFormProps) {
  const set = (patch: Partial<NumberToBillionDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Short scale: 1 billion = 1,000,000,000 = 10⁹. Number and billion fields sync both ways;
        scientific notation shows the absolute value (also editable).
      </div>

      <FieldShell label="Number" htmlFor="n2b-number" error={errors.number}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="n2b-number"
              inputMode="decimal"
              className={inputClass}
              value={draft.number}
              placeholder="Enter a number"
              aria-invalid={Boolean(errors.number)}
              onChange={(event) =>
                set({ sourceField: 'number', number: event.target.value })
              }
            />
          </div>
        </div>
      </FieldShell>

      <FieldShell label="Billion(s)" htmlFor="n2b-billion" error={errors.billion}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="n2b-billion"
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
          <span className={unitBadgeClass} title="Billion(s)" aria-label="Billion unit">
            billion
          </span>
        </div>
      </FieldShell>

      <FieldShell label="Scientific notation" htmlFor="n2b-sci" error={errors.scientific}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="n2b-sci"
              inputMode="text"
              className={inputClass}
              value={draft.scientific}
              placeholder="e.g. 1 × 10⁹ or 1e9"
              aria-invalid={Boolean(errors.scientific)}
              aria-describedby="n2b-sci-hint"
              onChange={(event) =>
                set({ sourceField: 'scientific', scientific: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            a×10ⁿ
          </span>
        </div>
        <p id="n2b-sci-hint" className="text-xs text-muted-foreground">
          Absolute value in scientific form (short-scale billion = 10⁹).
        </p>
      </FieldShell>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, '1,000,000,000 = 1 billion'],
              [2, '2,500,000,000 = 2.5 billion'],
              [3, '500,000,000 = 0.5 billion'],
              [4, '7.5 billion = 7,500,000,000'],
              [5, '1e12 = 1,000 billion'],
            ] as const
          ).map(([id, label]) => (
            <li key={id}>
              <button
                type="button"
                className="text-left text-primary underline-offset-2 hover:underline"
                onClick={() => onApplyExample(id)}
              >
                Example {id} — {label}
              </button>
            </li>
          ))}
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
