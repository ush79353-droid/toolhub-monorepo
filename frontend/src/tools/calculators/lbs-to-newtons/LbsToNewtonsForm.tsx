'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatForce } from './calculation';
import {
  NEWTONS_PER_POUND_FORCE,
  type ForceSource,
  type LbsToNewtonsFieldErrors,
  type LbsToNewtonsInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface LbsToNewtonsDraft {
  source: ForceSource;
  lbf: string;
  newtons: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: LbsToNewtonsInput): LbsToNewtonsDraft {
  return {
    source: input.source,
    lbf: input.lbf === null ? '' : formatForce(input.lbf),
    newtons: input.newtons === null ? '' : formatForce(input.newtons),
  };
}

export function draftToInput(draft: LbsToNewtonsDraft): LbsToNewtonsInput {
  return {
    source: draft.source,
    lbf: parseOptionalNumber(draft.lbf),
    newtons: parseOptionalNumber(draft.newtons),
  };
}

interface LbsToNewtonsFormProps {
  draft: LbsToNewtonsDraft;
  errors: LbsToNewtonsFieldErrors;
  onDraftChange: (draft: LbsToNewtonsDraft) => void;
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

export function LbsToNewtonsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: LbsToNewtonsFormProps) {
  const set = (patch: Partial<LbsToNewtonsDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Converts force between pound-force (lbf) and newtons (N). “Lbs” here means
        pounds-force, not pounds-mass. Exact: 1 lbf = {formatForce(NEWTONS_PER_POUND_FORCE)} N.
        Signed values keep direction.
      </div>

      <FieldShell
        label="Force in pounds"
        htmlFor="lbs-n-lbf"
        tip={`Interpreted as pound-force (lbf). Exact: 1 lbf = ${formatForce(NEWTONS_PER_POUND_FORCE)} N.`}
        error={errors.lbf}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lbs-n-lbf"
              inputMode="decimal"
              className={inputClass}
              value={draft.lbf}
              placeholder="Enter force"
              aria-invalid={Boolean(errors.lbf)}
              onChange={(event) => set({ source: 'lbf', lbf: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            lbf
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Force in newtons"
        htmlFor="lbs-n-newtons"
        tip={`Exact: lbf = N ÷ ${formatForce(NEWTONS_PER_POUND_FORCE)}.`}
        error={errors.newtons}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="lbs-n-newtons"
              inputMode="decimal"
              className={inputClass}
              value={draft.newtons}
              placeholder="Enter force"
              aria-invalid={Boolean(errors.newtons)}
              onChange={(event) => set({ source: 'N', newtons: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            N
          </span>
        </div>
      </FieldShell>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
