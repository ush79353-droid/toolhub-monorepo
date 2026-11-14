'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { convertTorque, formatTorque } from './calculation';
import {
  NEWTON_METERS_PER_FOOT_POUND,
  type NewtonMeterFieldErrors,
  type NewtonMeterInput,
  type OtherUnitRow,
  type TorqueSource,
  type TorqueUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface NewtonMeterDraft {
  source: TorqueSource;
  first: string;
  second: string;
  firstUnit: TorqueUnit;
  secondUnit: TorqueUnit;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

const UNIT_OPTIONS: readonly { value: TorqueUnit; label: string }[] = [
  { value: 'Nm', label: 'N·m' },
  { value: 'kNm', label: 'kN·m' },
  { value: 'mNm', label: 'mN·m' },
  { value: 'Ncm', label: 'N·cm' },
  { value: 'Nmm', label: 'N·mm' },
  { value: 'ftlbf', label: 'ft·lbf' },
  { value: 'inlbf', label: 'in·lbf' },
  { value: 'kgfm', label: 'kgf·m' },
  { value: 'kgfcm', label: 'kgf·cm' },
];

export function inputToDraft(input: NewtonMeterInput, moreOpen = false): NewtonMeterDraft {
  return {
    source: input.source,
    first: input.first === null ? '' : formatTorque(input.first),
    second: input.second === null ? '' : formatTorque(input.second),
    firstUnit: input.firstUnit,
    secondUnit: input.secondUnit,
    moreOpen,
  };
}

export function draftToInput(draft: NewtonMeterDraft): NewtonMeterInput {
  return {
    source: draft.source,
    first: parseOptionalNumber(draft.first),
    second: parseOptionalNumber(draft.second),
    firstUnit: draft.firstUnit,
    secondUnit: draft.secondUnit,
  };
}

interface NewtonMeterFormProps {
  draft: NewtonMeterDraft;
  errors: NewtonMeterFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: NewtonMeterDraft) => void;
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

function UnitSelect({
  value,
  ariaLabel,
  onChange,
}: {
  value: TorqueUnit;
  ariaLabel: string;
  onChange: (unit: TorqueUnit) => void;
}) {
  return (
    <select
      className={selectClass}
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.value as TorqueUnit)}
    >
      {UNIT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function NewtonMeterForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: NewtonMeterFormProps) {
  const set = (patch: Partial<NewtonMeterDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Converts torque between newton-meters and foot-pound-force (and related torque units). Exact:{' '}
        1 ft·lbf = {formatTorque(NEWTON_METERS_PER_FOOT_POUND)} N·m. Not force, energy, or power.
      </div>

      <FieldShell
        label="Torque in newton meters"
        htmlFor="nm-calc-first"
        tip={`Default unit N·m. Exact: 1 ft·lbf = ${formatTorque(NEWTON_METERS_PER_FOOT_POUND)} N·m.`}
        error={errors.first}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="nm-calc-first"
              inputMode="decimal"
              className={inputClass}
              value={draft.first}
              placeholder="Enter torque"
              aria-invalid={Boolean(errors.first)}
              onChange={(event) => set({ source: 'first', first: event.target.value })}
            />
          </div>
          <UnitSelect
            value={draft.firstUnit}
            ariaLabel="First torque unit"
            onChange={(next) => {
              const raw = parseOptionalNumber(draft.first);
              set({
                firstUnit: next,
                first:
                  raw === null || !Number.isFinite(raw)
                    ? draft.first
                    : formatTorque(convertTorque(raw, draft.firstUnit, next)),
              });
            }}
          />
        </div>
      </FieldShell>

      <FieldShell
        label="Torque in pound-force feet"
        htmlFor="nm-calc-second"
        tip="Default unit ft·lbf (not in·lbf). Signed values keep rotational direction."
        error={errors.second}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="nm-calc-second"
              inputMode="decimal"
              className={inputClass}
              value={draft.second}
              placeholder="Enter torque"
              aria-invalid={Boolean(errors.second)}
              onChange={(event) => set({ source: 'second', second: event.target.value })}
            />
          </div>
          <UnitSelect
            value={draft.secondUnit}
            ariaLabel="Second torque unit"
            onChange={(next) => {
              const raw = parseOptionalNumber(draft.second);
              set({
                secondUnit: next,
                second:
                  raw === null || !Number.isFinite(raw)
                    ? draft.second
                    : formatTorque(convertTorque(raw, draft.secondUnit, next)),
              });
            }}
          />
        </div>
      </FieldShell>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.moreOpen}
          onClick={() => set({ moreOpen: !draft.moreOpen })}
        >
          <span>More conversion options</span>
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
                Enter a torque to see related units.
              </p>
            )}
          </div>
        ) : null}
      </div>

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
