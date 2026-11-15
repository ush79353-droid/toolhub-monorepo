'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { flOzToMl, formatVolume, mlToCups, mlToFlOz, cupsToMl } from './calculation';
import {
  CUP_FRACTION_PRESETS,
  CUP_STANDARD_OPTIONS,
  FL_OZ_STANDARD_OPTIONS,
  type CalcSource,
  type CupStandard,
  type FluidOunceStandard,
  type OtherUnitRow,
  type OzToCupsFieldErrors,
  type OzToCupsInput,
} from './types';
import { parseVolumeField } from './validation';

export interface OzToCupsDraft {
  source: CalcSource;
  flOz: string;
  cups: string;
  flOzStandard: FluidOunceStandard;
  cupStandard: CupStandard;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function inputToDraft(input: OzToCupsInput, moreOpen = false): OzToCupsDraft {
  return {
    source: input.source,
    flOz: input.flOz === null ? '' : formatVolume(input.flOz),
    cups: input.cups === null ? '' : formatVolume(input.cups),
    flOzStandard: input.flOzStandard,
    cupStandard: input.cupStandard,
    moreOpen,
  };
}

export function draftToInput(draft: OzToCupsDraft): OzToCupsInput {
  const flOzParsed = parseVolumeField(draft.flOz, false);
  const cupsParsed = parseVolumeField(draft.cups, true);
  return {
    source: draft.source,
    flOz: flOzParsed.value,
    cups: cupsParsed.value,
    flOzStandard: draft.flOzStandard,
    cupStandard: draft.cupStandard,
  };
}

interface OzToCupsFormProps {
  draft: OzToCupsDraft;
  errors: OzToCupsFieldErrors;
  otherUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: OzToCupsDraft) => void;
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

export function OzToCupsForm({
  draft,
  errors,
  otherUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: OzToCupsFormProps) {
  const set = (patch: Partial<OzToCupsDraft>) => onDraftChange({ ...draft, ...patch });

  const changeFlOzStandard = (next: FluidOunceStandard) => {
    const parsed = parseVolumeField(draft.flOz, false).value;
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ flOzStandard: next });
      return;
    }
    // Preserve physical volume when switching US ↔ Imperial fl oz.
    const ml = flOzToMl(parsed, draft.flOzStandard);
    set({
      flOzStandard: next,
      flOz: formatVolume(mlToFlOz(ml, next)),
      source: 'flOz',
    });
  };

  const changeCupStandard = (next: CupStandard) => {
    if (draft.source === 'cups') {
      const parsed = parseVolumeField(draft.cups, true).value;
      if (parsed !== null && Number.isFinite(parsed)) {
        const ml = cupsToMl(parsed, draft.cupStandard);
        set({
          cupStandard: next,
          cups: formatVolume(mlToCups(ml, next)),
          source: 'cups',
        });
        return;
      }
    }
    // Source is fl oz (or cups incomplete): keep fl oz number, recalc cups downstream.
    set({ cupStandard: next });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Volume in fluid ounces"
        htmlFor="oz-cups-floz"
        tip="Fluid ounces measure volume, not mass. Mass ounces (oz) are a different unit."
        error={errors.flOz}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="oz-cups-floz"
              inputMode="decimal"
              className={inputClass}
              value={draft.flOz}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.flOz)}
              onChange={(event) =>
                set({ source: 'flOz', flOz: event.target.value })
              }
            />
          </div>
          <select
            className={selectClass}
            aria-label="Fluid ounce standard"
            value={draft.flOzStandard}
            onChange={(event) =>
              changeFlOzStandard(event.target.value as FluidOunceStandard)
            }
          >
            {FL_OZ_STANDARD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.shortLabel}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Volume in cups"
        htmlFor="oz-cups-cups"
        tip="Decimals or cooking fractions such as 1/2 or 1 1/2. Cup size depends on the selected standard."
        error={errors.cups}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="oz-cups-cups"
              inputMode="decimal"
              className={inputClass}
              value={draft.cups}
              placeholder="Enter cups (e.g. 1/2)"
              aria-invalid={Boolean(errors.cups)}
              onChange={(event) =>
                set({ source: 'cups', cups: event.target.value })
              }
            />
          </div>
          <select
            className={selectClass}
            aria-label="Cup standard"
            value={draft.cupStandard}
            onChange={(event) => changeCupStandard(event.target.value as CupStandard)}
          >
            {CUP_STANDARD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.shortLabel}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CUP_FRACTION_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className="rounded-md border border-border bg-muted/40 px-2 py-1 text-xs font-medium text-accent hover:bg-muted"
              onClick={() =>
                set({
                  source: 'cups',
                  cups: formatVolume(preset.value),
                })
              }
            >
              {preset.label}
            </button>
          ))}
        </div>
      </FieldShell>

      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90">
        Fluid ounces (fl oz) measure volume. Avoirdupois ounces measure mass. Eight US
        fluid ounces equal one US customary cup—not every cup standard or mass ounce.
      </div>

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
                      {formatVolume(row.value)} {row.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-2 text-sm text-muted-foreground">
                Enter a valid volume to see milliliters and related units.
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
