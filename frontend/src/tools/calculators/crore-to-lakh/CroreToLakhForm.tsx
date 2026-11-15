'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { CroreLakhFieldErrors, SourceField } from './types';

export interface CroreToLakhDraft {
  sourceField: SourceField;
  crore: string;
  lakh: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function defaultDraft(): CroreToLakhDraft {
  return { sourceField: 'crore', crore: '1', lakh: '100' };
}

export function emptyDraft(): CroreToLakhDraft {
  return { sourceField: 'crore', crore: '', lakh: '' };
}

interface CroreToLakhFormProps {
  draft: CroreToLakhDraft;
  errors: CroreLakhFieldErrors;
  onDraftChange: (draft: CroreToLakhDraft) => void;
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

export function CroreToLakhForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
}: CroreToLakhFormProps) {
  const set = (patch: Partial<CroreToLakhDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact Indian numbering: 1 crore = 100 lakh (1 crore = 10,000,000; 1 lakh = 100,000). Cr =
        crore(s), L = lakh(s). Not a currency converter.
      </div>

      <FieldShell label="Crore(s)" htmlFor="c2l-crore" error={errors.crore}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="c2l-crore"
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

      <FieldShell label="Lakh(s)" htmlFor="c2l-lakh" error={errors.lakh}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="c2l-lakh"
              inputMode="decimal"
              className={inputClass}
              value={draft.lakh}
              placeholder="Enter lakhs"
              aria-invalid={Boolean(errors.lakh)}
              onChange={(event) => set({ sourceField: 'lakh', lakh: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} title="Lakh(s)" aria-label="Lakh unit">
            L
          </span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, '1 crore = 100 lakh'],
              [2, '2.7 crore = 270 lakh'],
              [3, '0.5 crore = 50 lakh'],
              [4, '250 lakh = 2.5 crore'],
              [5, '0.125 crore = 12.5 lakh'],
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
