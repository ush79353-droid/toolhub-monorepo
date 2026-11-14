'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatArea } from './calculation';
import {
  type AresHectaresSource,
  type AresToHectaresFieldErrors,
  type AresToHectaresInput,
  type ExtraAreaRow,
} from './types';
import { parseOptionalNumber } from './validation';

export interface AresToHectaresDraft {
  source: AresHectaresSource;
  ares: string;
  hectares: string;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: AresToHectaresDraft): AresToHectaresInput {
  return {
    source: draft.source,
    ares: parseOptionalNumber(draft.ares),
    hectares: parseOptionalNumber(draft.hectares),
  };
}

interface AresToHectaresFormProps {
  draft: AresToHectaresDraft;
  errors: AresToHectaresFieldErrors;
  extras: readonly ExtraAreaRow[] | null;
  onDraftChange: (draft: AresToHectaresDraft) => void;
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

export function AresToHectaresForm({
  draft,
  errors,
  extras,
  onDraftChange,
  onSubmit,
  onReset,
}: AresToHectaresFormProps) {
  const set = (patch: Partial<AresToHectaresDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Ares"
        htmlFor="ares-ha-ares"
        tip="Enter an area in ares. Hectares update as ares ÷ 100."
        error={errors.ares}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ares-ha-ares"
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
        label="Hectares"
        htmlFor="ares-ha-hectares"
        tip="Enter an area in hectares. Ares update as hectares × 100."
        error={errors.hectares}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ares-ha-hectares"
              inputMode="decimal"
              className={inputClass}
              value={draft.hectares}
              placeholder="Enter hectares"
              aria-invalid={Boolean(errors.hectares)}
              onChange={(event) => set({ source: 'hectares', hectares: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ha
          </span>
        </div>
      </FieldShell>

      <div className="space-y-3">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-left text-sm font-semibold text-accent"
          aria-expanded={draft.moreOpen}
          onClick={() => set({ moreOpen: !draft.moreOpen })}
        >
          <span>More conversion options</span>
          {draft.moreOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {draft.moreOpen ? (
          extras && extras.length > 0 ? (
            <ul className="space-y-2 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm">
              {extras.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 tabular-nums text-accent"
                >
                  <span>
                    {row.label}{' '}
                    <span className="text-muted-foreground">({row.symbol})</span>
                  </span>
                  <span className="font-medium">{formatArea(row.value)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
              Enter an area to see additional units.
            </p>
          )
        ) : null}
      </div>

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
