'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { MillionBillionFieldErrors, SourceField } from './types';

export interface MillionToBillionDraft {
  sourceField: SourceField;
  million: string;
  billion: string;
  fullNumber: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function defaultDraft(): MillionToBillionDraft {
  return {
    sourceField: 'million',
    million: '1000',
    billion: '1',
    fullNumber: '1000000000',
  };
}

export function emptyDraft(): MillionToBillionDraft {
  return {
    sourceField: 'million',
    million: '',
    billion: '',
    fullNumber: '',
  };
}

interface MillionToBillionFormProps {
  draft: MillionToBillionDraft;
  errors: MillionBillionFieldErrors;
  onDraftChange: (draft: MillionToBillionDraft) => void;
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

export function MillionToBillionForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
}: MillionToBillionFormProps) {
  const set = (patch: Partial<MillionToBillionDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Short scale: 1 billion = 1,000 million = 1,000,000,000. Edit any field; the other two update
        instantly.
      </div>

      <FieldShell label="Million" htmlFor="m2b-million" error={errors.million}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="m2b-million"
              inputMode="decimal"
              className={inputClass}
              value={draft.million}
              placeholder="Enter millions"
              aria-invalid={Boolean(errors.million)}
              onChange={(event) =>
                set({ sourceField: 'million', million: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} title="Million" aria-label="Million unit">
            million
          </span>
        </div>
      </FieldShell>

      <FieldShell label="Billion" htmlFor="m2b-billion" error={errors.billion}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="m2b-billion"
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
          <span className={unitBadgeClass} title="Billion" aria-label="Billion unit">
            billion
          </span>
        </div>
      </FieldShell>

      <FieldShell label="Full number" htmlFor="m2b-full" error={errors.fullNumber}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="m2b-full"
              inputMode="decimal"
              className={inputClass}
              value={draft.fullNumber}
              placeholder="Enter full number"
              aria-invalid={Boolean(errors.fullNumber)}
              aria-describedby="m2b-full-hint"
              onChange={(event) =>
                set({ sourceField: 'fullNumber', fullNumber: event.target.value })
              }
            />
          </div>
        </div>
        <p id="m2b-full-hint" className="text-xs text-muted-foreground">
          Ordinary number equal to millions × 10⁶ or billions × 10⁹.
        </p>
      </FieldShell>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, '1,000 million = 1 billion'],
              [2, '2,500 million = 2.5 billion'],
              [3, '500 million = 0.5 billion'],
              [4, '1.25 billion = 1,250 million'],
              [5, '12,345 million = 12.345 billion'],
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
