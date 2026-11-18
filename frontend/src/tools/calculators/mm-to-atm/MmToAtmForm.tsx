'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { MMHG_PER_ATM, type MmAtmSource, type MmToAtmFieldErrors, type MmToAtmInput } from './types';
import { parseOptionalNumber } from './validation';

export interface MmToAtmDraft {
  source: MmAtmSource;
  mmHg: string;
  atm: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function draftToInput(draft: MmToAtmDraft): MmToAtmInput {
  return {
    source: draft.source,
    mmHg: parseOptionalNumber(draft.mmHg),
    atm: parseOptionalNumber(draft.atm),
  };
}

export function emptyDraft(): MmToAtmDraft {
  return { source: 'mmHg', mmHg: '', atm: '' };
}

interface MmToAtmFormProps {
  draft: MmToAtmDraft;
  errors: MmToAtmFieldErrors;
  onDraftChange: (draft: MmToAtmDraft) => void;
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

export function MmToAtmForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MmToAtmFormProps) {
  const set = (patch: Partial<MmToAtmDraft>) => onDraftChange({ ...draft, ...patch });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Despite the catalog name &quot;mm to ATM,&quot; this tool converts millimeters of mercury
        (mmHg) pressure — not millimeters of length. Conventional: 1 atm = {MMHG_PER_ATM} mmHg.
        Signed values are allowed as gauge or differential magnitude; the tool does not switch
        absolute vs gauge reference.
      </div>

      <FieldShell
        label="Pressure in millimeters of mercury"
        htmlFor="mm-to-atm-mmhg"
        tip={`Conventional: atm = mmHg ÷ ${MMHG_PER_ATM}.`}
        error={errors.mmHg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mm-to-atm-mmhg"
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
        htmlFor="mm-to-atm-atm"
        tip={`Conventional: mmHg = atm × ${MMHG_PER_ATM}.`}
        error={errors.atm}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="mm-to-atm-atm"
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
