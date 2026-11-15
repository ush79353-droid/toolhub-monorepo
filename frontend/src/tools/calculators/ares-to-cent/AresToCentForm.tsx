'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatArea } from './calculation';
import { type AresCentSource, type AresToCentFieldErrors, type AresToCentInput } from './types';
import { parseOptionalNumber } from './validation';

export interface AresToCentDraft {
  source: AresCentSource;
  ares: string;
  cents: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: AresToCentInput): AresToCentDraft {
  return {
    source: input.source,
    ares: input.ares === null ? '' : formatArea(input.ares),
    cents: input.cents === null ? '' : formatArea(input.cents),
  };
}

export function draftToInput(draft: AresToCentDraft): AresToCentInput {
  return {
    source: draft.source,
    ares: parseOptionalNumber(draft.ares),
    cents: parseOptionalNumber(draft.cents),
  };
}

interface AresToCentFormProps {
  draft: AresToCentDraft;
  errors: AresToCentFieldErrors;
  onDraftChange: (draft: AresToCentDraft) => void;
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

export function AresToCentForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: AresToCentFormProps) {
  const set = (patch: Partial<AresToCentDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Ares"
        htmlFor="ares-cent-ares"
        tip="Enter an area in ares. Cents update as ares ÷ 0.40468564224."
        error={errors.ares}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ares-cent-ares"
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

      <FieldShell
        label="Cents"
        htmlFor="ares-cent-cents"
        tip="Enter an area in cents (1/100 acre). Ares update as cents × 0.40468564224."
        error={errors.cents}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ares-cent-cents"
              inputMode="decimal"
              className={inputClass}
              value={draft.cents}
              placeholder="Enter cents"
              aria-invalid={Boolean(errors.cents)}
              onChange={(event) => set({ source: 'cents', cents: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            cent
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
