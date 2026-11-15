'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatArea } from './calculation';
import { type AcreAreSource, type AcreToAreFieldErrors, type AcreToAreInput } from './types';
import { parseOptionalNumber } from './validation';

export interface AcreToAreDraft {
  source: AcreAreSource;
  acres: string;
  ares: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: AcreToAreInput): AcreToAreDraft {
  return {
    source: input.source,
    acres: input.acres === null ? '' : formatArea(input.acres),
    ares: input.ares === null ? '' : formatArea(input.ares),
  };
}

export function draftToInput(draft: AcreToAreDraft): AcreToAreInput {
  return {
    source: draft.source,
    acres: parseOptionalNumber(draft.acres),
    ares: parseOptionalNumber(draft.ares),
  };
}

interface AcreToAreFormProps {
  draft: AcreToAreDraft;
  errors: AcreToAreFieldErrors;
  onDraftChange: (draft: AcreToAreDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
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

export function AcreToAreForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: AcreToAreFormProps) {
  const set = (patch: Partial<AcreToAreDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Area in acres"
        htmlFor="acre-are-acres"
        tip="Enter an area in acres. Ares update as acres × 40.468564224."
        error={errors.acres}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="acre-are-acres"
              inputMode="decimal"
              className={inputClass}
              value={draft.acres}
              placeholder="Enter acres"
              aria-invalid={Boolean(errors.acres)}
              onChange={(event) => set({ source: 'acres', acres: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ac
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Area in ares"
        htmlFor="acre-are-ares"
        tip="Enter an area in ares. Acres update as ares ÷ 40.468564224."
        error={errors.ares}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="acre-are-ares"
              inputMode="decimal"
              className={inputClass}
              value={draft.ares}
              placeholder="Enter ares"
              aria-invalid={Boolean(errors.ares)}
              onChange={(event) => set({ source: 'ares', ares: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            a
          </span>
        </div>
      </FieldShell>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
