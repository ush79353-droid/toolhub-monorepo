'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  LBS_TO_POUNDS_FACTOR,
  type LbsPoundsSource,
  type LbsToPoundsFieldErrors,
  type LbsToPoundsInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface LbsToPoundsDraft {
  source: LbsPoundsSource;
  lbs: string;
  pounds: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: LbsToPoundsDraft): LbsToPoundsInput {
  return {
    source: draft.source,
    lbs: parseOptionalNumber(draft.lbs),
    pounds: parseOptionalNumber(draft.pounds),
  };
}

/** Screenshot default: both fields start at 1. */
export function defaultDraft(): LbsToPoundsDraft {
  return { source: 'lbs', lbs: '1', pounds: '1' };
}

/** Clear All Changes empties both fields. */
export function emptyDraft(): LbsToPoundsDraft {
  return { source: 'lbs', lbs: '', pounds: '' };
}

interface LbsToPoundsFormProps {
  draft: LbsToPoundsDraft;
  errors: LbsToPoundsFieldErrors;
  onDraftChange: (draft: LbsToPoundsDraft) => void;
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

export function LbsToPoundsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: LbsToPoundsFormProps) {
  const set = (patch: Partial<LbsToPoundsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Identity conversion: 1 lb = 1 pound. The abbreviations lb / lbs and the word pounds name
        the same avoirdupois mass unit (factor {LBS_TO_POUNDS_FACTOR}).
      </div>

      <FieldShell
        label="Weight in lbs"
        htmlFor="lbs-to-pounds-lbs"
        tip="Enter a mass using the lbs abbreviation. The pounds field mirrors the same number."
        error={errors.lbs}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lbs-to-pounds-lbs"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.lbs}
              placeholder="Enter value"
              aria-invalid={Boolean(errors.lbs)}
              onChange={(event) => set({ source: 'lbs', lbs: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            lb(s)
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Weight in pounds"
        htmlFor="lbs-to-pounds-pounds"
        tip="Enter a mass in pounds. The lbs field mirrors the same number."
        error={errors.pounds}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lbs-to-pounds-pounds"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.pounds}
              placeholder="Enter value"
              aria-invalid={Boolean(errors.pounds)}
              onChange={(event) => set({ source: 'pounds', pounds: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            pound(s)
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">
        pounds = lbs × {LBS_TO_POUNDS_FACTOR} · lbs = pounds × {LBS_TO_POUNDS_FACTOR}
      </p>

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
