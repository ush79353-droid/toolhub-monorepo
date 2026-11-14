'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatTorque } from './calculation';
import {
  INCH_POUNDS_PER_FOOT_POUND,
  type InchPoundsToFootPoundsFieldErrors,
  type InchPoundsToFootPoundsInput,
  type TorqueSource,
} from './types';
import { parseOptionalNumber } from './validation';

export interface InchPoundsToFootPoundsDraft {
  source: TorqueSource;
  inlbf: string;
  ftlbf: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: InchPoundsToFootPoundsInput): InchPoundsToFootPoundsDraft {
  return {
    source: input.source,
    inlbf: input.inlbf === null ? '' : formatTorque(input.inlbf),
    ftlbf: input.ftlbf === null ? '' : formatTorque(input.ftlbf),
  };
}

export function draftToInput(draft: InchPoundsToFootPoundsDraft): InchPoundsToFootPoundsInput {
  return {
    source: draft.source,
    inlbf: parseOptionalNumber(draft.inlbf),
    ftlbf: parseOptionalNumber(draft.ftlbf),
  };
}

interface InchPoundsToFootPoundsFormProps {
  draft: InchPoundsToFootPoundsDraft;
  errors: InchPoundsToFootPoundsFieldErrors;
  onDraftChange: (draft: InchPoundsToFootPoundsDraft) => void;
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

export function InchPoundsToFootPoundsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
}: InchPoundsToFootPoundsFormProps) {
  const set = (patch: Partial<InchPoundsToFootPoundsDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Converts torque between inch-pound-force and foot-pound-force. Exact relationship:{' '}
        1 ft·lbf = {INCH_POUNDS_PER_FOOT_POUND} in·lbf. Signed values keep direction.
      </div>

      <FieldShell
        label="Inch-pounds"
        htmlFor="inlbf-ftlbf-inlbf"
        tip={`Exact: 1 ft·lbf = ${INCH_POUNDS_PER_FOOT_POUND} in·lbf. Foot-pounds = inch-pounds ÷ ${INCH_POUNDS_PER_FOOT_POUND}.`}
        error={errors.inlbf}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="inlbf-ftlbf-inlbf"
              inputMode="decimal"
              className={inputClass}
              value={draft.inlbf}
              placeholder="Enter torque"
              aria-invalid={Boolean(errors.inlbf)}
              onChange={(event) => set({ source: 'inlbf', inlbf: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            in·lbf
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Foot-pounds"
        htmlFor="inlbf-ftlbf-ftlbf"
        tip={`Exact: 1 ft·lbf = ${INCH_POUNDS_PER_FOOT_POUND} in·lbf. Inch-pounds = foot-pounds × ${INCH_POUNDS_PER_FOOT_POUND}.`}
        error={errors.ftlbf}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="inlbf-ftlbf-ftlbf"
              inputMode="decimal"
              className={inputClass}
              value={draft.ftlbf}
              placeholder="Enter torque"
              aria-invalid={Boolean(errors.ftlbf)}
              onChange={(event) => set({ source: 'ftlbf', ftlbf: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft·lbf
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
