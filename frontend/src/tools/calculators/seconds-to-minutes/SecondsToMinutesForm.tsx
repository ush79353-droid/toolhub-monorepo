'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  SecMinutesSource,
  SecondsToMinutesFieldErrors,
  SecondsToMinutesInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface SecondsToMinutesDraft {
  source: SecMinutesSource;
  seconds: string;
  minutes: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): SecondsToMinutesDraft {
  return {
    source: 'seconds',
    seconds: '',
    minutes: '',
  };
}

export function draftToInput(draft: SecondsToMinutesDraft): SecondsToMinutesInput {
  if (draft.source === 'seconds') {
    return { source: 'seconds', value: parseOptionalNumber(draft.seconds) };
  }
  return { source: 'minutes', value: parseOptionalNumber(draft.minutes) };
}

interface SecondsToMinutesFormProps {
  draft: SecondsToMinutesDraft;
  errors: SecondsToMinutesFieldErrors;
  onDraftChange: (draft: SecondsToMinutesDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function FieldShell({
  label,
  htmlFor,
  tip,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  tip?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {tip ? (
          <>
            {' '}
            <InfoTooltip label={label} text={tip} />
          </>
        ) : null}
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

export function SecondsToMinutesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: SecondsToMinutesFormProps) {
  const set = (patch: Partial<SecondsToMinutesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 minute = 60 seconds. Enter seconds or minutes — the other updates instantly.
        Negative values are allowed for signed durations.
      </div>

      <FieldShell
        label="Seconds"
        htmlFor="s2m-seconds"
        tip="Minutes = seconds ÷ 60."
        error={errors.seconds}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="s2m-seconds"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.seconds}
              placeholder="Enter seconds"
              aria-invalid={Boolean(errors.seconds)}
              onChange={(event) => set({ source: 'seconds', seconds: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            sec
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Minutes"
        htmlFor="s2m-minutes"
        tip="Seconds = minutes × 60."
        error={errors.minutes}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="s2m-minutes"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.minutes}
              placeholder="Enter minutes"
              aria-invalid={Boolean(errors.minutes)}
              onChange={(event) => set({ source: 'minutes', minutes: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            min
          </span>
        </div>
      </FieldShell>

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
