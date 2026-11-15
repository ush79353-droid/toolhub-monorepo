'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatPressure } from './calculation';
import {
  TORR_PER_ATMOSPHERE,
  type OtherUnitRow,
  type PressureSource,
  type TorrToAtmFieldErrors,
  type TorrToAtmInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface TorrToAtmDraft {
  source: PressureSource;
  torr: string;
  atm: string;
  primaryOpen: boolean;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: TorrToAtmInput): TorrToAtmDraft {
  return {
    source: input.source,
    torr: input.torr === null ? '' : formatPressure(input.torr),
    atm: input.atm === null ? '' : formatPressure(input.atm),
    primaryOpen: true,
    moreOpen: false,
  };
}

export function draftToInput(draft: TorrToAtmDraft): TorrToAtmInput {
  return {
    source: draft.source,
    torr: parseOptionalNumber(draft.torr),
    atm: parseOptionalNumber(draft.atm),
  };
}

interface TorrToAtmFormProps {
  draft: TorrToAtmDraft;
  errors: TorrToAtmFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: TorrToAtmDraft) => void;
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

export function TorrToAtmForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
}: TorrToAtmFormProps) {
  const set = (patch: Partial<TorrToAtmDraft>) =>
    onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Exact: 1 atm = {TORR_PER_ATMOSPHERE} Torr. Torr is defined as 1/760 of a standard
        atmosphere; conventional mmHg uses a mercury-column definition and is not treated as
        identical. Signed values are allowed as gauge or differential pressure, not as absolute
        pressure below zero.
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.primaryOpen}
          onClick={() => set({ primaryOpen: !draft.primaryOpen })}
        >
          <span>Torr to atm conversion</span>
          {draft.primaryOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.primaryOpen ? (
          <div className="space-y-4 border-t border-border px-3.5 pb-3.5 pt-3">
            <FieldShell
              label="Pressure in torrs"
              htmlFor="torr-atm-torr"
              tip={`Exact: 1 Torr = 1/${TORR_PER_ATMOSPHERE} atm. atm = Torr / ${TORR_PER_ATMOSPHERE}.`}
              error={errors.torr}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="torr-atm-torr"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.torr}
                    placeholder="Enter pressure"
                    aria-invalid={Boolean(errors.torr)}
                    onChange={(event) => set({ source: 'Torr', torr: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  Torr
                </span>
              </div>
            </FieldShell>

            <FieldShell
              label="Pressure in atmospheres"
              htmlFor="torr-atm-atm"
              tip={`Exact: 1 atm = ${TORR_PER_ATMOSPHERE} Torr. Torr = atm × ${TORR_PER_ATMOSPHERE}.`}
              error={errors.atm}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="torr-atm-atm"
                    inputMode="decimal"
                    className={inputClass}
                    value={draft.atm}
                    placeholder="Enter pressure"
                    aria-invalid={Boolean(errors.atm)}
                    onChange={(event) => set({ source: 'atm', atm: event.target.value })}
                  />
                </div>
                <span className={unitBadgeClass} aria-hidden="true">
                  atm
                </span>
              </div>
            </FieldShell>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.moreOpen}
          onClick={() => set({ moreOpen: !draft.moreOpen })}
        >
          <span>Conversion to other units</span>
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
                    key={row.id}
                    className="flex items-center justify-between gap-3 py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">
                      Pressure in {row.label.toLowerCase()}
                    </span>
                    <span className="tabular-nums font-medium text-accent">
                      {formatPressure(row.value)} {row.symbol}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a pressure to see Pa, kPa, MPa, bar, mbar, psi, mmHg, and inHg.
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
