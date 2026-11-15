'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { BradfordFactorFieldErrors } from './types';

export interface BradfordFactorDraft {
  spells: string;
  daysAbsent: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(): BradfordFactorDraft {
  return { spells: '', daysAbsent: '' };
}

interface BradfordFactorFormProps {
  draft: BradfordFactorDraft;
  factorDisplay: string;
  errors: BradfordFactorFieldErrors;
  onDraftChange: (draft: BradfordFactorDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
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

export function BradfordFactorForm({
  draft,
  factorDisplay,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
}: BradfordFactorFormProps) {
  const set = (patch: Partial<BradfordFactorDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell label="# of times absent (S)" htmlFor="bradford-spells" error={errors.spells}>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="bradford-spells"
            inputMode="decimal"
            className={inputClass}
            value={draft.spells}
            placeholder="Absence spells"
            aria-invalid={Boolean(errors.spells)}
            onChange={(event) => set({ spells: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell label="Days absent (D)" htmlFor="bradford-days" error={errors.daysAbsent}>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="bradford-days"
            inputMode="decimal"
            className={inputClass}
            value={draft.daysAbsent}
            placeholder="Total days absent"
            aria-invalid={Boolean(errors.daysAbsent)}
            onChange={(event) => set({ daysAbsent: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell label="Bradford factor (B)" htmlFor="bradford-result">
        <div className="rounded-lg border border-border bg-muted/30">
          <input
            id="bradford-result"
            readOnly
            tabIndex={0}
            className={`${inputClass} cursor-default`}
            value={factorDisplay}
            placeholder="—"
            aria-live="polite"
          />
        </div>
      </FieldShell>

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
