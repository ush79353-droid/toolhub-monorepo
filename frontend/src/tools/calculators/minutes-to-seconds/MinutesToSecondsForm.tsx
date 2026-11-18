'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MinSecSource, MinutesToSecondsFieldErrors } from './types';

export interface MinutesToSecondsDraft {
  texts: Record<MinSecSource, string>;
  activeField: MinSecSource | null;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

function emptyTexts(): Record<MinSecSource, string> {
  return { minutes: '', seconds: '', combinedMinutes: '', combinedSeconds: '' };
}

export function emptyDraft(): MinutesToSecondsDraft {
  return { texts: emptyTexts(), activeField: null };
}

interface MinutesToSecondsFormProps {
  draft: MinutesToSecondsDraft;
  errors: MinutesToSecondsFieldErrors;
  onDraftChange: (draft: MinutesToSecondsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldRow({
  field,
  label,
  suffix,
  draft,
  errors,
  onDraftChange,
}: {
  field: MinSecSource;
  label: string;
  suffix: string;
  draft: MinutesToSecondsDraft;
  errors: MinutesToSecondsFieldErrors;
  onDraftChange: (draft: MinutesToSecondsDraft) => void;
}) {
  const id = `m2s-${field}`;
  const error = errors[field];
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
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
          {suffix}
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

export function MinutesToSecondsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MinutesToSecondsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 minute = 60 seconds. Minutes and Seconds below normalize so remaining seconds stay
        in [0, 60). Decimal minutes (e.g. 1.5) equal 1 min 30 sec — not 1 min 50 sec.
      </div>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 px-3.5 py-3.5">
        <legend className="px-1 text-sm font-semibold text-accent">Minutes</legend>
        <FieldRow
          field="minutes"
          label="Minutes"
          suffix="min"
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 px-3.5 py-3.5">
        <legend className="px-1 text-sm font-semibold text-accent">Seconds</legend>
        <FieldRow
          field="seconds"
          label="Seconds"
          suffix="sec"
          draft={draft}
          errors={errors}
          onDraftChange={onDraftChange}
        />
      </fieldset>

      <fieldset className="space-y-3 rounded-xl border border-border bg-muted/15 px-3.5 py-3.5">
        <legend className="px-1 text-sm font-semibold text-accent">Minutes and Seconds</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FieldRow
            field="combinedMinutes"
            label="Minutes"
            suffix="min"
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
          <FieldRow
            field="combinedSeconds"
            label="Seconds"
            suffix="sec"
            draft={draft}
            errors={errors}
            onDraftChange={onDraftChange}
          />
        </div>
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
