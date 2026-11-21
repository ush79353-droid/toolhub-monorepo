'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { CroreMillionFieldErrors, SourceField } from './types';

export interface CroreToMillionDraft {
  sourceField: SourceField;
  crore: string;
  million: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function defaultDraft(): CroreToMillionDraft {
  return { sourceField: 'crore', crore: '1', million: '10' };
}

export function emptyDraft(): CroreToMillionDraft {
  return { sourceField: 'crore', crore: '', million: '' };
}

interface CroreToMillionFormProps {
  draft: CroreToMillionDraft;
  errors: CroreMillionFieldErrors;
  onDraftChange: (draft: CroreToMillionDraft) => void;
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

export function CroreToMillionForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
}: CroreToMillionFormProps) {
  const set = (patch: Partial<CroreToMillionDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 crore = 10 million (1 crore = 10,000,000). Cr = crore(s), M = million(s). Not a
        currency converter.
      </div>

      <FieldShell label="Crore(s)" htmlFor="c2m-crore" error={errors.crore}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="c2m-crore"
              inputMode="decimal"
              className={inputClass}
              value={draft.crore}
              placeholder="Enter crores"
              aria-invalid={Boolean(errors.crore)}
              onChange={(event) => set({ sourceField: 'crore', crore: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} title="Crore(s)" aria-label="Crore unit">
            Cr
          </span>
        </div>
      </FieldShell>

      <FieldShell label="Million(s)" htmlFor="c2m-million" error={errors.million}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="c2m-million"
              inputMode="decimal"
              className={inputClass}
              value={draft.million}
              placeholder="Enter millions"
              aria-invalid={Boolean(errors.million)}
              onChange={(event) => set({ sourceField: 'million', million: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} title="Million(s)" aria-label="Million unit">
            M
          </span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, '1 crore = 10 million'],
              [2, '2.5 crore = 25 million'],
              [3, '12.75 crore = 127.5 million'],
              [4, '75 million = 7.5 crore'],
              [5, '0.1 crore = 1 million'],
            ] as const
          ).map(([id, label]) => (
            <li key={id}>
              <button
                type="button"
                className="text-left text-primary underline-offset-2 hover:underline"
                onClick={() => onApplyExample(id)}
              >
 Example {id}; {label}
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
