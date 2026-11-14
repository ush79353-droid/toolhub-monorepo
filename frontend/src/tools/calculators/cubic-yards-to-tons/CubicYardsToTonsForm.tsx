'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  cubicMetersToVolume,
  densityToKgPerM3,
  formatMeasure,
  kilogramsToMass,
  kgPerM3ToDensity,
  massToKilograms,
  volumeToCubicMeters,
} from './calculation';
import {
  CUSTOM_MATERIAL_ID,
  defaultMaterialIdForCategory,
  findMaterial,
  materialsForCategory,
} from './materials';
import {
  CATEGORY_OPTIONS,
  DENSITY_UNIT_OPTIONS,
  MASS_UNIT_OPTIONS,
  VOLUME_UNIT_OPTIONS,
  WATER_DENSITY_KG_PER_M3,
  type CalcSource,
  type CubicYardsToTonsFieldErrors,
  type CubicYardsToTonsInput,
  type DensityUnit,
  type MassUnit,
  type OtherUnitRow,
  type SubstanceCategory,
  type VolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CubicYardsToTonsDraft {
  source: CalcSource;
  category: SubstanceCategory;
  materialId: string;
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

export function inputToDraft(
  input: CubicYardsToTonsInput,
  moreOpen = false
): CubicYardsToTonsDraft {
  return {
    source: input.source,
    category: input.category,
    materialId: input.materialId,
    densityValue: input.densityValue === null ? '' : formatMeasure(input.densityValue),
    densityUnit: input.densityUnit,
    volume: input.volume === null ? '' : formatMeasure(input.volume),
    volumeUnit: input.volumeUnit,
    mass: input.mass === null ? '' : formatMeasure(input.mass),
    massUnit: input.massUnit,
    moreOpen,
  };
}

export function draftToInput(draft: CubicYardsToTonsDraft): CubicYardsToTonsInput {
  return {
    source: draft.source,
    category: draft.category,
    materialId: draft.materialId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    volume: parseOptionalNumber(draft.volume),
    volumeUnit: draft.volumeUnit,
    mass: parseOptionalNumber(draft.mass),
    massUnit: draft.massUnit,
  };
}

interface CubicYardsToTonsFormProps {
  draft: CubicYardsToTonsDraft;
  errors: CubicYardsToTonsFieldErrors;
  otherVolumeUnits: readonly OtherUnitRow[] | null;
  otherMassUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: CubicYardsToTonsDraft) => void;
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

export function CubicYardsToTonsForm({
  draft,
  errors,
  otherVolumeUnits,
  otherMassUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: CubicYardsToTonsFormProps) {
  const set = (patch: Partial<CubicYardsToTonsDraft>) =>
    onDraftChange({ ...draft, ...patch });

  const materials = materialsForCategory(draft.category);
  const selected = findMaterial(draft.materialId);

  const applyMaterial = (materialId: string) => {
    if (materialId === CUSTOM_MATERIAL_ID) {
      set({ materialId, densityValue: '' });
      return;
    }
    const mat = findMaterial(materialId);
    if (!mat) {
      set({ materialId: CUSTOM_MATERIAL_ID, densityValue: '' });
      return;
    }
    set({
      materialId,
      densityUnit: 'kgPerM3',
      densityValue: formatMeasure(mat.densityKgPerM3),
    });
  };

  const changeCategory = (category: SubstanceCategory) => {
    const nextId = defaultMaterialIdForCategory(category);
    const mat = findMaterial(nextId);
    set({
      category,
      materialId: nextId,
      densityUnit: 'kgPerM3',
      densityValue: mat
        ? formatMeasure(mat.densityKgPerM3)
        : category === 'food' || category === 'liquids'
          ? formatMeasure(WATER_DENSITY_KG_PER_M3)
          : '',
    });
  };

  const changeDensityUnit = (nextUnit: DensityUnit) => {
    const parsed = parseOptionalNumber(draft.densityValue);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
      set({ densityUnit: nextUnit });
      return;
    }
    const canonical = densityToKgPerM3(parsed, draft.densityUnit);
    set({
      densityUnit: nextUnit,
      densityValue: formatMeasure(kgPerM3ToDensity(canonical, nextUnit)),
      materialId: CUSTOM_MATERIAL_ID,
    });
  };

  const changeVolumeUnit = (nextUnit: VolumeUnit) => {
    const parsed = parseOptionalNumber(draft.volume);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ volumeUnit: nextUnit });
      return;
    }
    const m3 = volumeToCubicMeters(parsed, draft.volumeUnit);
    set({
      volumeUnit: nextUnit,
      volume: formatMeasure(cubicMetersToVolume(m3, nextUnit)),
      source: 'volume',
    });
  };

  const changeMassUnit = (nextUnit: MassUnit) => {
    const parsed = parseOptionalNumber(draft.mass);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ massUnit: nextUnit });
      return;
    }
    const kg = massToKilograms(parsed, draft.massUnit);
    set({
      massUnit: nextUnit,
      mass: formatMeasure(kilogramsToMass(kg, nextUnit)),
      source: 'mass',
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset>
        <legend className={labelClass}>Type of substance</legend>
        <div className="mt-1.5 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:grid-cols-3">
          {CATEGORY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm ${
                draft.category === opt.value
                  ? 'border-primary bg-primary/5 text-accent'
                  : 'border-border'
              }`}
            >
              <input
                type="radio"
                name="yd3-tons-category"
                checked={draft.category === opt.value}
                onChange={() => changeCategory(opt.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      <FieldShell
        label="Substance"
        htmlFor="yd3-tons-material"
        tip="Presets load a documented approximate density. Sand, gravel, and soil are custom-only because bulk density varies with moisture and compaction."
      >
        <select
          id="yd3-tons-material"
          className={`${selectClass} w-full`}
          value={
            draft.materialId === CUSTOM_MATERIAL_ID ||
            materials.some((m) => m.id === draft.materialId)
              ? draft.materialId
              : CUSTOM_MATERIAL_ID
          }
          onChange={(event) => applyMaterial(event.target.value)}
        >
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
              {m.approximate ? ' (approx.)' : ''}
            </option>
          ))}
          <option value={CUSTOM_MATERIAL_ID}>Custom material</option>
        </select>
      </FieldShell>

      <FieldShell
        label="Density"
        htmlFor="yd3-tons-density"
        tip="Canonical unit is kg/m³. Changing the unit preserves physical density. Edit density freely; presets are starting points only."
        error={errors.densityValue}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="yd3-tons-density"
              inputMode="decimal"
              className={inputClass}
              value={draft.densityValue}
              placeholder="Enter density"
              aria-invalid={Boolean(errors.densityValue)}
              onChange={(event) =>
                set({
                  densityValue: event.target.value,
                  materialId: CUSTOM_MATERIAL_ID,
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
        {selected ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {selected.conditions ?? selected.source}
            {selected.densityType === 'bulk' ? ' · Bulk density' : ''}
          </p>
        ) : draft.category === 'nonMetals' ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Enter a site-specific bulk density for sand, gravel, soil, or stone. A single
            universal figure is not assumed.
          </p>
        ) : null}
      </FieldShell>

      <FieldShell
        label="Volume"
        htmlFor="yd3-tons-volume"
        tip="Editing volume recalculates mass using the current density."
        error={errors.volume}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="yd3-tons-volume"
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
        label="Mass"
        htmlFor="yd3-tons-mass"
        tip="Metric tonne (t), US short ton, and imperial long ton are different units. Editing mass recalculates volume."
        error={errors.mass}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="yd3-tons-mass"
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
        Cubic yards measure volume; tons measure mass. Results depend on the density you
        supply. Preset densities are approximate. For loading, purchase, or structural
        decisions, use verified material data—not this estimate alone.
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
                  Enter a valid conversion to see ft³, m³, and liters.
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
                  Enter a valid conversion to see kg, lb, and ton definitions.
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
