'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { AbsencePercentageFieldErrors } from './types';

export interface AbsencePercentageDraft {
  totalEmployees: string;
  totalWorkdays: string;
  totalDaysAbsent: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): AbsencePercentageDraft {
  return { totalEmployees: '', totalWorkdays: '', totalDaysAbsent: '' };
}

interface AbsencePercentageFormProps {
  draft: AbsencePercentageDraft;
  rateDisplay: string;
  errors: AbsencePercentageFieldErrors;
  onDraftChange: (draft: AbsencePercentageDraft) => void;
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

export function AbsencePercentageForm({
  draft,
  rateDisplay,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
}: AbsencePercentageFormProps) {
  const set = (patch: Partial<AbsencePercentageDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Total employees"
        htmlFor="absence-employees"
        error={errors.totalEmployees}
      >
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="absence-employees"
            inputMode="numeric"
            className={inputClass}
            value={draft.totalEmployees}
            placeholder="Enter total employees"
            aria-invalid={Boolean(errors.totalEmployees)}
            onChange={(event) => set({ totalEmployees: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell
        label="Total workdays"
        htmlFor="absence-workdays"
        error={errors.totalWorkdays}
      >
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="absence-workdays"
            inputMode="numeric"
            className={inputClass}
            value={draft.totalWorkdays}
            placeholder="Workdays per employee"
            aria-invalid={Boolean(errors.totalWorkdays)}
            onChange={(event) => set({ totalWorkdays: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell
        label="Total days absent"
        htmlFor="absence-days-absent"
        error={errors.totalDaysAbsent}
      >
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="absence-days-absent"
            inputMode="numeric"
            className={inputClass}
            value={draft.totalDaysAbsent}
            placeholder="Sum of employee-days missed"
            aria-invalid={Boolean(errors.totalDaysAbsent)}
            onChange={(event) => set({ totalDaysAbsent: event.target.value })}
          />
        </div>
      </FieldShell>

      <FieldShell label="Absenteeism rate" htmlFor="absence-rate">
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-muted/30">
            <input
              id="absence-rate"
              readOnly
              tabIndex={0}
              className={`${inputClass} cursor-default`}
              value={rateDisplay}
              placeholder="—"
              aria-live="polite"
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            %
          </span>
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
