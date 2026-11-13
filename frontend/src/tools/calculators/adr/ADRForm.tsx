'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/tools/shared/currency';
import type { AdrFieldErrors, AdrInput, AdrSolveFor } from './types';

export interface AdrDraft {
  solveFor: AdrSolveFor;
  roomRevenue: string;
  roomsSold: string;
  adr: string;
  availableRoomNights: string;
  daysInPeriod: string;
  physicalRooms: string;
  currency: AdrInput['currency'];
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export const EMPTY_ADR_DRAFT: AdrDraft = {
  solveFor: 'adr',
  roomRevenue: '',
  roomsSold: '',
  adr: '',
  availableRoomNights: '',
  daysInPeriod: '',
  physicalRooms: '',
  currency: 'PKR',
};

function parseOptionalNumber(raw: string): number | null {
  const cleaned = raw.trim();
  if (cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.') return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : Number.NaN;
}

export function draftToInput(draft: AdrDraft): AdrInput {
  return {
    solveFor: draft.solveFor,
    roomRevenue: draft.solveFor === 'revenue' ? null : parseOptionalNumber(draft.roomRevenue),
    roomsSold: draft.solveFor === 'roomsSold' ? null : parseOptionalNumber(draft.roomsSold),
    adr: draft.solveFor === 'adr' ? null : parseOptionalNumber(draft.adr),
    availableRoomNights: parseOptionalNumber(draft.availableRoomNights),
    daysInPeriod: parseOptionalNumber(draft.daysInPeriod),
    physicalRooms: parseOptionalNumber(draft.physicalRooms),
    currency: draft.currency,
  };
}

interface AdrFormProps {
  draft: AdrDraft;
  errors: AdrFieldErrors;
  onDraftChange: (draft: AdrDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

const TARGETS: readonly { value: AdrSolveFor; label: string }[] = [
  { value: 'adr', label: 'ADR' },
  { value: 'revenue', label: 'Room revenue' },
  { value: 'roomsSold', label: 'Room-nights sold' },
];

export function AdrForm({ draft, errors, onDraftChange, onSubmit, onReset }: AdrFormProps) {
  const symbol = getCurrencySymbol(draft.currency);
  const patch = (next: Partial<AdrDraft>) => onDraftChange({ ...draft, ...next });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset>
        <legend className={labelClass}>Solve for</legend>
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
          {TARGETS.map((target) => (
            <label
              key={target.value}
              className={`flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm ${
                draft.solveFor === target.value ? 'border-primary bg-primary/5 text-accent' : 'border-border'
              }`}
            >
              <input
                type="radio"
                name="adr-solve-for"
                checked={draft.solveFor === target.value}
                onChange={() => patch({ solveFor: target.value })}
              />
              {target.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        {draft.solveFor !== 'revenue' ? (
          <Field
            id="adr-revenue"
            label="Total room revenue"
            prefix={symbol}
            value={draft.roomRevenue}
            error={errors.roomRevenue}
            hint="Room sales only. Exclude food, beverage, spa, and other non-room charges."
            onChange={(roomRevenue) => patch({ roomRevenue })}
          />
        ) : null}
        {draft.solveFor !== 'roomsSold' ? (
          <Field
            id="adr-sold"
            label="Room-nights sold"
            value={draft.roomsSold}
            error={errors.roomsSold}
            hint="Sum of rooms occupied each night in the period, not the count of unique rooms."
            onChange={(roomsSold) => patch({ roomsSold })}
          />
        ) : null}
        {draft.solveFor !== 'adr' ? (
          <Field
            id="adr-rate"
            label="Average daily rate"
            prefix={symbol}
            value={draft.adr}
            error={errors.adr}
            hint="Amount per sold room-night, in the same currency as room revenue."
            onChange={(adr) => patch({ adr })}
          />
        ) : null}
      </div>

      <details className="rounded-xl border border-border bg-muted/20 px-3 py-2">
        <summary className="cursor-pointer text-[13px] font-medium text-accent">
          Occupancy and RevPAR
        </summary>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Optional. Physical rooms are keys in the hotel. Available room-nights are those keys multiplied by days in
          the period. Leave these blank to calculate ADR only.
        </p>
        <div className="grid grid-cols-1 gap-3.5 pb-2 pt-3 min-[420px]:grid-cols-3">
          <Field
            id="adr-available"
            label="Available room-nights"
            value={draft.availableRoomNights}
            error={errors.availableRoomNights}
            onChange={(availableRoomNights) => patch({ availableRoomNights })}
          />
          <Field
            id="adr-days"
            label="Days in period"
            value={draft.daysInPeriod}
            error={errors.daysInPeriod}
            onChange={(daysInPeriod) => patch({ daysInPeriod })}
          />
          <Field
            id="adr-physical"
            label="Physical rooms"
            value={draft.physicalRooms}
            error={errors.physicalRooms}
            onChange={(physicalRooms) => patch({ physicalRooms })}
          />
        </div>
      </details>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button
          type="submit"
          className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]"
        >
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  hint,
  prefix,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  prefix?: string;
  onChange: (value: string) => void;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {label}
      </label>
      <div
        className={`flex h-11 items-center overflow-hidden rounded-lg border bg-white ${
          error ? 'border-rose-500' : 'border-border'
        } focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1`}
      >
        {prefix ? (
          <span className="pl-3 text-sm text-muted-foreground" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          inputMode="decimal"
          className={inputClass}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        />
      </div>
      {hint ? (
        <p id={hintId} className="mt-1 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
