'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DecimalSource, MinutesToDecimalFieldErrors } from './types';

export interface MinutesToDecimalDraft {
  texts: Record<DecimalSource, string>;
  activeField: DecimalSource | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

const FIELD_META: Record<
  DecimalSource,
  { label: string; suffix: string; section: 'clock' | 'decimal' }
> = {
  clockMinutes: { label: 'Minutes (mm)', suffix: 'min', section: 'clock' },
  hours: { label: 'Hours', suffix: 'hrs', section: 'decimal' },
  minutes: { label: 'Minutes', suffix: 'min', section: 'decimal' },
  seconds: { label: 'Seconds', suffix: 'sec', section: 'decimal' },
};

function emptyTexts(): Record<DecimalSource, string> {
  return { clockMinutes: '', hours: '', minutes: '', seconds: '' };
}

export function emptyDraft(): MinutesToDecimalDraft {
  return { texts: emptyTexts(), activeField: null };
}

interface MinutesToDecimalFormProps {
  draft: MinutesToDecimalDraft;
  errors: MinutesToDecimalFieldErrors;
  onDraftChange: (draft: MinutesToDecimalDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldRow({
  field,
  draft,
  errors,
  onDraftChange,
}: {
  field: DecimalSource;
  draft: MinutesToDecimalDraft;
  errors: MinutesToDecimalFieldErrors;
  onDraftChange: (draft: MinutesToDecimalDraft) => void;
}) {
  const id = `m2dec-${field}`;
  const meta = FIELD_META[field];
  const error = errors[field];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {meta.label}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={draft.texts[field]}
            placeholder="Enter value"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                texts: { ...draft.texts, [field]: event.target.value },
                activeField: field,
              })
            }
          />
        </div>
        <span className="flex h-11 min-w-[3.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
          {meta.suffix}
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function MinutesToDecimalForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MinutesToDecimalFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Decimal hours, not clock notation: 1 hour 30 minutes = 1.5 hours, not 1.30. Hours, Minutes,
        and Seconds below are the same duration expressed three ways (not additive HMS parts). Exact:
        1 hour = 60 minutes = 3,600 seconds.
      </div>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 px-3.5 py-3.5">
        <legend className="px-1 text-sm font-semibold text-accent">Clock time in minutes</legend>
        <FieldRow
          field="clockMinutes"
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 px-3.5 py-3.5">
        <legend className="px-1 text-sm font-semibold text-accent">Decimal time</legend>
        <FieldRow field="hours" draft={draft} errors={errors} onDraftChange={onDraftChange} />
        <FieldRow field="minutes" draft={draft} errors={errors} onDraftChange={onDraftChange} />
        <FieldRow field="seconds" draft={draft} errors={errors} onDraftChange={onDraftChange} />
      </fieldset>

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
