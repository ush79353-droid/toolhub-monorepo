'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { CentsEurosFieldErrors, SourceField } from './types';

export interface CentsToEurosDraft {
  sourceField: SourceField;
  cents: string;
  euros: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function defaultDraft(): CentsToEurosDraft {
  return { sourceField: 'cents', cents: '100', euros: '1' };
}

export function emptyDraft(): CentsToEurosDraft {
  return { sourceField: 'cents', cents: '', euros: '' };
}

interface CentsToEurosFormProps {
  draft: CentsToEurosDraft;
  errors: CentsEurosFieldErrors;
  onDraftChange: (draft: CentsToEurosDraft) => void;
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

export function CentsToEurosForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  onApplyExample,
}: CentsToEurosFormProps) {
  const set = (patch: Partial<CentsToEurosDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact denomination: 1 euro = 100 cents. This is not a foreign-exchange converter. ¢ = euro
        cents, € = euros.
      </div>

      <FieldShell label="Cents" htmlFor="c2e-cents" error={errors.cents}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="c2e-cents"
              inputMode="decimal"
              className={inputClass}
              value={draft.cents}
              placeholder="Enter cents"
              aria-invalid={Boolean(errors.cents)}
              onChange={(event) => set({ sourceField: 'cents', cents: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} title="Euro cents" aria-label="Euro cents unit">
            ¢
          </span>
        </div>
      </FieldShell>

      <FieldShell label="Euros" htmlFor="c2e-euros" error={errors.euros}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="c2e-euros"
              inputMode="decimal"
              className={inputClass}
              value={draft.euros}
              placeholder="Enter euros"
              aria-invalid={Boolean(errors.euros)}
              onChange={(event) => set({ sourceField: 'euros', euros: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} title="Euros" aria-label="Euros unit">
            €
          </span>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border bg-muted/30 px-3.5 py-3.5">
        <p className="text-sm font-medium text-accent">Try these examples:</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(
            [
              [1, '100 cents = €1.00'],
              [2, '250 cents = €2.50'],
              [3, '50 cents = €0.50'],
              [4, '€12.50 = 1,250 cents'],
              [5, '0.5 cent = €0.005'],
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
