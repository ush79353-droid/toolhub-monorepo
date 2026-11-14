'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatDecimal } from './calculation';
import {
  DEFAULT_PRECISION,
  OPERATION_OPTIONS,
  PRECISION_OPTIONS,
  type FeetAndInchesFieldErrors,
  type FeetInchesOperation,
  type FractionPrecision,
  type OtherUnitRow,
} from './types';

export interface FeetAndInchesDraft {
  operation: FeetInchesOperation;
  firstFeet: string;
  firstInches: string;
  secondFeet: string;
  secondInches: string;
  scalar: string;
  precision: FractionPrecision;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export const EMPTY_DRAFT: FeetAndInchesDraft = {
  operation: 'add',
  firstFeet: '',
  firstInches: '',
  secondFeet: '',
  secondInches: '',
  scalar: '',
  precision: DEFAULT_PRECISION,
  moreOpen: false,
};

export const DEFAULT_DRAFT: FeetAndInchesDraft = {
  operation: 'add',
  firstFeet: '5',
  firstInches: '8',
  secondFeet: '2',
  secondInches: '4',
  scalar: '2',
  precision: DEFAULT_PRECISION,
  moreOpen: false,
};

interface FeetAndInchesFormProps {
  draft: FeetAndInchesDraft;
  errors: FeetAndInchesFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: FeetAndInchesDraft) => void;
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

function LengthPair({
  feetId,
  inchesId,
  feetValue,
  inchesValue,
  feetError,
  inchesError,
  onFeetChange,
  onInchesChange,
}: {
  feetId: string;
  inchesId: string;
  feetValue: string;
  inchesValue: string;
  feetError?: string;
  inchesError?: string;
  onFeetChange: (value: string) => void;
  onInchesChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FieldShell label="Feet" htmlFor={feetId} error={feetError}>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id={feetId}
              inputMode="decimal"
              className={inputClass}
              value={feetValue}
              placeholder="0"
              aria-invalid={Boolean(feetError)}
              onChange={(event) => onFeetChange(event.target.value)}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            ft
          </span>
        </div>
      </FieldShell>
      <FieldShell
        label="Inches"
        htmlFor={inchesId}
        tip="Whole, decimal, fraction (3/8), or mixed (2 3/8)."
        error={inchesError}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id={inchesId}
              inputMode="text"
              className={inputClass}
              value={inchesValue}
              placeholder="0 or 3 1/2"
              aria-invalid={Boolean(inchesError)}
              onChange={(event) => onInchesChange(event.target.value)}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            in
          </span>
        </div>
      </FieldShell>
    </div>
  );
}

export function FeetAndInchesForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: FeetAndInchesFormProps) {
  const set = (patch: Partial<FeetAndInchesDraft>) => onDraftChange({ ...draft, ...patch });
  const usesScalar = draft.operation === 'multiply' || draft.operation === 'divide';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <p className="text-sm font-medium text-accent">Input your values</p>

      <div className="space-y-2">
        <p className="text-[13px] font-medium text-muted-foreground">First measurement</p>
        <LengthPair
          feetId="ft-in-first-ft"
          inchesId="ft-in-first-in"
          feetValue={draft.firstFeet}
          inchesValue={draft.firstInches}
          feetError={errors.firstFeet}
          inchesError={errors.firstInches}
          onFeetChange={(value) => set({ firstFeet: value })}
          onInchesChange={(value) => set({ firstInches: value })}
        />
      </div>

      <FieldShell
        label="Operation"
        htmlFor="ft-in-operation"
        tip="Addition and subtraction use two lengths. Multiplication and division use one length and a dimensionless scalar."
      >
        <select
          id="ft-in-operation"
          className={selectClass}
          value={draft.operation}
          onChange={(event) =>
            set({ operation: event.target.value as FeetInchesOperation })
          }
        >
          {OPERATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FieldShell>

      {usesScalar ? (
        <FieldShell
          label={draft.operation === 'multiply' ? 'Multiplier' : 'Divisor'}
          htmlFor="ft-in-scalar"
          tip="Dimensionless number. Division by zero is not allowed."
          error={errors.scalar}
        >
          <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="ft-in-scalar"
              inputMode="decimal"
              className={inputClass}
              value={draft.scalar}
              placeholder="Enter a number"
              aria-invalid={Boolean(errors.scalar)}
              onChange={(event) => set({ scalar: event.target.value })}
            />
          </div>
        </FieldShell>
      ) : (
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-muted-foreground">Second measurement</p>
          <LengthPair
            feetId="ft-in-second-ft"
            inchesId="ft-in-second-in"
            feetValue={draft.secondFeet}
            inchesValue={draft.secondInches}
            feetError={errors.secondFeet}
            inchesError={errors.secondInches}
            onFeetChange={(value) => set({ secondFeet: value })}
            onInchesChange={(value) => set({ secondInches: value })}
          />
        </div>
      )}

      <FieldShell
        label="Precision"
        htmlFor="ft-in-precision"
        tip="Smallest fractional inch used to display the result. Coarser steps may round."
      >
        <select
          id="ft-in-precision"
          className={selectClass}
          value={draft.precision}
          onChange={(event) =>
            set({ precision: Number(event.target.value) as FractionPrecision })
          }
        >
          {PRECISION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} inch
            </option>
          ))}
        </select>
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
                      {formatDecimal(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid measurement to see metric and decimal equivalents.
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
          Reset
        </Button>
      </div>
    </form>
  );
}
