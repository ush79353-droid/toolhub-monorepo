'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatPressure } from './calculation';
import {
  MMHG_PER_ATM,
  type MmhgAtmSource,
  type MmhgToAtmFieldErrors,
  type MmhgToAtmInput,
  type OtherUnitRow,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MmhgToAtmDraft {
  source: MmhgAtmSource;
  mmHg: string;
  atm: string;
  otherOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: MmhgToAtmDraft): MmhgToAtmInput {
  return {
    source: draft.source,
    mmHg: parseOptionalNumber(draft.mmHg),
    atm: parseOptionalNumber(draft.atm),
  };
}

export function emptyDraft(): MmhgToAtmDraft {
  return { source: 'mmHg', mmHg: '', atm: '', otherOpen: false };
}

interface MmhgToAtmFormProps {
  draft: MmhgToAtmDraft;
  errors: MmhgToAtmFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: MmhgToAtmDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
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

export function MmhgToAtmForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MmhgToAtmFormProps) {
  const set = (patch: Partial<MmhgToAtmDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Conventional: 1 atm = {MMHG_PER_ATM} mmHg (same 760 factor as Torr). CIPM conventional mmHg
        is a mercury-column definition and is not treated as identical. Signed values are allowed as
        gauge or differential pressure.
      </div>

      <FieldShell
        label="Pressure in millimeters of mercury (mmHg)"
        htmlFor="mmhg-atm-mmhg"
        tip={`Conventional: atm = mmHg ÷ ${MMHG_PER_ATM}.`}
        error={errors.mmHg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mmhg-atm-mmhg"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.mmHg}
              placeholder="Enter pressure"
              aria-invalid={Boolean(errors.mmHg)}
              onChange={(event) => set({ source: 'mmHg', mmHg: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            mmHg
          </span>
        </div>
      </FieldShell>

      <FieldShell
        label="Pressure in atmospheres"
        htmlFor="mmhg-atm-atm"
        tip={`Conventional: mmHg = atm × ${MMHG_PER_ATM}.`}
        error={errors.atm}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mmhg-atm-atm"
              inputMode="decimal"
              autoComplete="off"
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

      <div className="rounded-xl border border-border bg-muted/15">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-semibold text-accent"
          aria-expanded={draft.otherOpen}
          onClick={() => set({ otherOpen: !draft.otherOpen })}
        >
          Other pressure units
          {draft.otherOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
          )}
        </button>
        {draft.otherOpen ? (
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
                    <span className="font-medium tabular-nums text-accent">
                      {formatPressure(row.value)} {row.symbol}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a pressure to see Pa, kPa, MPa, bar, mbar, psi, Torr, mmHg (CIPM), and inHg.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        atm = mmHg ÷ {MMHG_PER_ATM} · mmHg = atm × {MMHG_PER_ATM}
      </p>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
        <button type="submit" className="sr-only">
          Convert
        </button>
      </div>
    </form>
  );
}
