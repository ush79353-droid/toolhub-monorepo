'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatArea } from './calculation';
import {
  type AcresMi2Source,
  type AcresToSquareMilesFieldErrors,
  type AcresToSquareMilesInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface AcresToSquareMilesDraft {
  source: AcresMi2Source;
  acres: string;
  squareMiles: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: AcresToSquareMilesInput): AcresToSquareMilesDraft {
  return {
    source: input.source,
    acres: input.acres === null ? '' : formatArea(input.acres),
    squareMiles: input.squareMiles === null ? '' : formatArea(input.squareMiles),
  };
}

export function draftToInput(draft: AcresToSquareMilesDraft): AcresToSquareMilesInput {
  return {
    source: draft.source,
    acres: parseOptionalNumber(draft.acres),
    squareMiles: parseOptionalNumber(draft.squareMiles),
  };
}

interface AcresToSquareMilesFormProps {
  draft: AcresToSquareMilesDraft;
  errors: AcresToSquareMilesFieldErrors;
  onDraftChange: (draft: AcresToSquareMilesDraft) => void;
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

export function AcresToSquareMilesForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: AcresToSquareMilesFormProps) {
  const set = (patch: Partial<AcresToSquareMilesDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Acres"
        htmlFor="ac-mi2-acres"
        tip="Enter an area in acres. Square miles update as acres ÷ 640."
        error={errors.acres}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ac-mi2-acres"
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
        label="Square miles"
        htmlFor="ac-mi2-square-miles"
        tip="Enter an area in square miles. Acres update as square miles × 640."
        error={errors.squareMiles}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ac-mi2-square-miles"
              inputMode="decimal"
              className={inputClass}
              value={draft.squareMiles}
              placeholder="Enter square miles"
              aria-invalid={Boolean(errors.squareMiles)}
              onChange={(event) =>
                set({ source: 'squareMiles', squareMiles: event.target.value })
              }
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mi²
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
