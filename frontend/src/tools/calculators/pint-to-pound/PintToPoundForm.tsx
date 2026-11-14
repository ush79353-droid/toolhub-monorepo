'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  densityToGPerMl,
  formatMeasure,
  gPerMlToDensity,
  gramsToMass,
  massToGrams,
  mlToVolume,
  volumeToMl,
} from './calculation';
import {
  CUSTOM_INGREDIENT_ID,
  findIngredient,
  INGREDIENTS,
  ingredientHasPresetDensity,
} from './ingredients';
import {
  DENSITY_UNIT_OPTIONS,
  MASS_UNIT_OPTIONS,
  PINT_STANDARD_FOR_VOLUME_UNIT,
  PINT_STANDARD_OPTIONS,
  VOLUME_UNIT_FOR_PINT_STANDARD,
  VOLUME_UNIT_OPTIONS,
  WATER_DENSITY_G_PER_ML,
  type CalcSource,
  type DensityUnit,
  type MassUnit,
  type OtherUnitRow,
  type PintStandard,
  type PintToPoundFieldErrors,
  type PintToPoundInput,
  type VolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface PintToPoundDraft {
  source: CalcSource;
  ingredientId: string;
  pintStandard: PintStandard;
  densityValue: string;
  densityUnit: DensityUnit;
  volume: string;
  volumeUnit: VolumeUnit;
  mass: string;
  massUnit: MassUnit;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function inputToDraft(input: PintToPoundInput, moreOpen = false): PintToPoundDraft {
  return {
    source: input.source,
    ingredientId: input.ingredientId,
    pintStandard: input.pintStandard,
    densityValue: input.densityValue === null ? '' : formatMeasure(input.densityValue),
    densityUnit: input.densityUnit,
    volume: input.volume === null ? '' : formatMeasure(input.volume),
    volumeUnit: input.volumeUnit,
    mass: input.mass === null ? '' : formatMeasure(input.mass),
    massUnit: input.massUnit,
    moreOpen,
  };
}

export function draftToInput(draft: PintToPoundDraft): PintToPoundInput {
  return {
    source: draft.source,
    ingredientId: draft.ingredientId,
    pintStandard: draft.pintStandard,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    volume: parseOptionalNumber(draft.volume),
    volumeUnit: draft.volumeUnit,
    mass: parseOptionalNumber(draft.mass),
    massUnit: draft.massUnit,
  };
}

interface PintToPoundFormProps {
  draft: PintToPoundDraft;
  errors: PintToPoundFieldErrors;
  otherVolumeUnits: readonly OtherUnitRow[] | null;
  otherMassUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: PintToPoundDraft) => void;
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

export function PintToPoundForm({
  draft,
  errors,
  otherVolumeUnits,
  otherMassUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: PintToPoundFormProps) {
  const set = (patch: Partial<PintToPoundDraft>) => onDraftChange({ ...draft, ...patch });
  const selected = findIngredient(draft.ingredientId);

  const applyIngredient = (ingredientId: string) => {
    if (ingredientHasPresetDensity(ingredientId)) {
      const item = findIngredient(ingredientId)!;
      set({
        ingredientId,
        densityUnit: 'gPerMl',
        densityValue: formatMeasure(item.densityGPerMl!),
      });
      return;
    }
    if (ingredientId === 'water') {
      set({
        ingredientId,
        densityUnit: 'gPerMl',
        densityValue: formatMeasure(WATER_DENSITY_G_PER_ML),
      });
      return;
    }
    set({ ingredientId, densityValue: '' });
  };

  const changePintStandard = (next: PintStandard) => {
    const nextUnit = VOLUME_UNIT_FOR_PINT_STANDARD[next];
    const onPintUnit = PINT_STANDARD_FOR_VOLUME_UNIT[draft.volumeUnit] !== undefined;
    if (onPintUnit) {
      // Keep the typed pint count; only the definition changes.
      set({ pintStandard: next, volumeUnit: nextUnit });
      return;
    }
    set({ pintStandard: next });
  };

  const changeDensityUnit = (nextUnit: DensityUnit) => {
    const parsed = parseOptionalNumber(draft.densityValue);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
      set({ densityUnit: nextUnit });
      return;
    }
    const canonical = densityToGPerMl(parsed, draft.densityUnit);
    set({
      densityUnit: nextUnit,
      densityValue: formatMeasure(gPerMlToDensity(canonical, nextUnit)),
      ingredientId: CUSTOM_INGREDIENT_ID,
    });
  };

  const changeVolumeUnit = (nextUnit: VolumeUnit) => {
    const pintFromUnit = PINT_STANDARD_FOR_VOLUME_UNIT[nextUnit];
    const parsed = parseOptionalNumber(draft.volume);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({
        volumeUnit: nextUnit,
        ...(pintFromUnit ? { pintStandard: pintFromUnit } : {}),
      });
      return;
    }
    const ml = volumeToMl(parsed, draft.volumeUnit);
    set({
      volumeUnit: nextUnit,
      volume: formatMeasure(mlToVolume(ml, nextUnit)),
      source: 'volume',
      ...(pintFromUnit ? { pintStandard: pintFromUnit } : {}),
    });
  };

  const changeMassUnit = (nextUnit: MassUnit) => {
    const parsed = parseOptionalNumber(draft.mass);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ massUnit: nextUnit });
      return;
    }
    const g = massToGrams(parsed, draft.massUnit);
    set({
      massUnit: nextUnit,
      mass: formatMeasure(gramsToMass(g, nextUnit)),
      source: 'mass',
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="What do you want to convert?"
        htmlFor="pt-lb-ingredient"
        tip="Only water loads a conventional density preset. Other ingredients require your own density so this tool never invents cooking bulk densities."
      >
        <select
          id="pt-lb-ingredient"
          className={`${selectClass} w-full`}
          value={draft.ingredientId}
          onChange={(event) => applyIngredient(event.target.value)}
        >
          {INGREDIENTS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
              {item.densityGPerMl !== undefined ? ' (approx.)' : ' — enter density'}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell
        label="Pint standard"
        htmlFor="pt-lb-standard"
        tip="US liquid, imperial liquid, and US dry pints are different volumes. Changing the standard keeps your typed pint count when the volume unit is a pint."
      >
        <select
          id="pt-lb-standard"
          className={`${selectClass} w-full`}
          value={draft.pintStandard}
          onChange={(event) => changePintStandard(event.target.value as PintStandard)}
        >
          {PINT_STANDARD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldShell>

      <FieldShell
        label="Density"
        htmlFor="pt-lb-density"
        tip="Canonical unit is g/mL. Changing the density unit preserves physical density. Pints cannot convert to pounds without density."
        error={errors.densityValue}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="pt-lb-density"
              inputMode="decimal"
              className={inputClass}
              value={draft.densityValue}
              placeholder="Enter density"
              aria-invalid={Boolean(errors.densityValue)}
              onChange={(event) =>
                set({
                  densityValue: event.target.value,
                  ingredientId: CUSTOM_INGREDIENT_ID,
                })
              }
            />
          </div>
          <select
            className={selectClass}
            aria-label="Density unit"
            value={draft.densityUnit}
            onChange={(event) => changeDensityUnit(event.target.value as DensityUnit)}
          >
            {DENSITY_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {selected?.conditions ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {selected.conditions}
            {selected.densityType === 'bulk' ? ' · Bulk density' : ''}
          </p>
        ) : null}
      </FieldShell>

      <FieldShell
        label="Pints / volume"
        htmlFor="pt-lb-volume"
        tip="Editing volume recalculates mass using the current density."
        error={errors.volume}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="pt-lb-volume"
              inputMode="decimal"
              className={inputClass}
              value={draft.volume}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.volume)}
              onChange={(event) =>
                set({ source: 'volume', volume: event.target.value })
              }
            />
          </div>
          <select
            className={selectClass}
            aria-label="Volume unit"
            value={draft.volumeUnit}
            onChange={(event) => changeVolumeUnit(event.target.value as VolumeUnit)}
          >
            {VOLUME_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <FieldShell
        label="Pounds / mass"
        htmlFor="pt-lb-mass"
        tip="Mass ounces (oz) are not fluid ounces. Editing mass recalculates volume."
        error={errors.mass}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="pt-lb-mass"
              inputMode="decimal"
              className={inputClass}
              value={draft.mass}
              placeholder="Enter mass"
              aria-invalid={Boolean(errors.mass)}
              onChange={(event) => set({ source: 'mass', mass: event.target.value })}
            />
          </div>
          <select
            className={selectClass}
            aria-label="Mass unit"
            value={draft.massUnit}
            onChange={(event) => changeMassUnit(event.target.value as MassUnit)}
          >
            {MASS_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </FieldShell>

      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90">
        Pints measure volume; pounds measure mass. There is no universal pint-to-pound
        factor. Results depend on the density you supply and the pint standard you select.
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
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-2">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Volume
              </p>
              {otherVolumeUnits && otherVolumeUnits.length > 0 ? (
                <ul className="divide-y divide-border">
                  {otherVolumeUnits.map((row) => (
                    <li
                      key={row.unit}
                      className="flex items-center justify-between gap-3 py-2 text-sm"
                    >
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="tabular-nums font-medium text-accent">
                        {formatMeasure(row.value)} {row.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-2 text-sm text-muted-foreground">
                  Enter a valid conversion to see related volume units.
                </p>
              )}
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Mass
              </p>
              {otherMassUnits && otherMassUnits.length > 0 ? (
                <ul className="divide-y divide-border">
                  {otherMassUnits.map((row) => (
                    <li
                      key={row.unit}
                      className="flex items-center justify-between gap-3 py-2 text-sm"
                    >
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="tabular-nums font-medium text-accent">
                        {formatMeasure(row.value)} {row.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-2 text-sm text-muted-foreground">
                  Enter a valid conversion to see related mass units.
                </p>
              )}
            </div>
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
