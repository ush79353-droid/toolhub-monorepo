'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatTorque } from './calculation';
import {
  NEWTON_METERS_PER_FOOT_POUND,
  type NmToFtLbsFieldErrors,
  type NmToFtLbsInput,
  type OtherUnitRow,
  type TorqueSource,
} from './types';
import { parseOptionalNumber } from './validation';

export interface NmToFtLbsDraft {
  source: TorqueSource;
  nm: string;
  ftlbf: string;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: NmToFtLbsInput, moreOpen = false): NmToFtLbsDraft {
  return {
    source: input.source,
    nm: input.nm === null ? '' : formatTorque(input.nm),
    ftlbf: input.ftlbf === null ? '' : formatTorque(input.ftlbf),
    moreOpen,
  };
}

export function draftToInput(draft: NmToFtLbsDraft): NmToFtLbsInput {
  return {
    source: draft.source,
    nm: parseOptionalNumber(draft.nm),
    ftlbf: parseOptionalNumber(draft.ftlbf),
  };
}

interface NmToFtLbsFormProps {
  draft: NmToFtLbsDraft;
  errors: NmToFtLbsFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: NmToFtLbsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
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

export function NmToFtLbsForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
}: NmToFtLbsFormProps) {
  const set = (patch: Partial<NmToFtLbsDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Converts torque between newton-meters (N·m) and foot-pound-force (ft·lbf). Exact: 1
        ft·lbf = {NEWTON_METERS_PER_FOOT_POUND} N·m. Signed values keep rotational direction. Not
        force, energy (joules), or power.
      </div>

      <FieldShell
        label="Torque in newton-meters"
        htmlFor="nm-ftlbf-nm"
        tip={`Exact: 1 ft·lbf = ${NEWTON_METERS_PER_FOOT_POUND} N·m. ft·lbf = N·m ÷ ${NEWTON_METERS_PER_FOOT_POUND}.`}
        error={errors.nm}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="nm-ftlbf-nm"
              inputMode="decimal"
              className={inputClass}
              value={draft.nm}
              placeholder="Enter torque"
              aria-invalid={Boolean(errors.nm)}
              onChange={(event) => set({ source: 'nm', nm: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            N·m
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Torque in foot-pounds"
        htmlFor="nm-ftlbf-ftlbf"
        tip="Foot-pound-force torque (ft·lbf), not energy and not inch-pounds. Exactly 1 ft·lbf = 12 in·lbf."
        error={errors.ftlbf}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="nm-ftlbf-ftlbf"
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

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.moreOpen}
          onClick={() => set({ moreOpen: !draft.moreOpen })}
        >
          <span>Other torque units</span>
          {draft.moreOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.moreOpen ? (
          <div className="border-t border-border px-3.5 pb-3.5 pt-2">
            {otherUnits && otherUnits.length > 0 ? (
              <ul className="divide-y divide-border">
                {otherUnits.map((row) => (
                  <li
                    key={row.unit}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="tabular-nums font-medium text-accent">
                      {formatTorque(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid torque to see kN·m, N·cm, N·mm, in·lbf, kgf·m, and related units.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
