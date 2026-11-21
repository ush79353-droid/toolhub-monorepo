'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  CUSTOM_MATERIAL_ID,
  defaultMaterialIdForCategory,
  findMaterial,
  materialHasPresetDensity,
  materialsForCategory,
} from '../cubic-meter-to-ton/materials';
import {
  densityToKgPerL,
  formatMeasure,
  fromKg,
  kgPerLToDensity,
  toKg,
} from './calculation';
import {
  CATEGORY_OPTIONS,
  DENSITY_UNIT_OPTIONS,
  GALLON_UNIT_OPTIONS,
  LITERS_PER_GALLON,
  OTHER_MASS_UNIT_OPTIONS,
  WATER_DENSITY_KG_PER_L,
  type DensityUnit,
  type GallonUnit,
  type GalKgSource,
  type GalToKgFieldErrors,
  type GalToKgInput,
  type OtherMassUnit,
  type SubstanceCategory,
} from './types';
import { parseOptionalNumber } from './validation';

export interface GalToKgDraft {
  source: GalKgSource;
  category: SubstanceCategory;
  materialId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  gallons: string;
  gallonUnit: GallonUnit;
  kg: string;
  otherMass: string;
  otherMassUnit: OtherMassUnit;
  densityOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitSelectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function draftToInput(draft: GalToKgDraft): GalToKgInput {
  return {
    source: draft.source,
    category: draft.category,
    materialId: draft.materialId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    gallons: parseOptionalNumber(draft.gallons),
    gallonUnit: draft.gallonUnit,
    kg: parseOptionalNumber(draft.kg),
    otherMass: parseOptionalNumber(draft.otherMass),
    otherMassUnit: draft.otherMassUnit,
  };
}

export function emptyMeasureDraft(draft: GalToKgDraft): GalToKgDraft {
  return { ...draft, source: 'gallons', gallons: '', kg: '', otherMass: '' };
}

export function initialDraft(): GalToKgDraft {
  return {
    source: 'gallons',
    category: 'liquids',
    materialId: 'fresh-water-4c',
    densityValue: formatMeasure(WATER_DENSITY_KG_PER_L),
    densityUnit: 'kgPerL',
    gallons: '',
    gallonUnit: 'usGal',
    kg: '',
    otherMass: '',
    otherMassUnit: 'metricTon',
    densityOpen: false,
  };
}

interface GalToKgFormProps {
  draft: GalToKgDraft;
  errors: GalToKgFieldErrors;
  onDraftChange: (draft: GalToKgDraft) => void;
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

export function GalToKgForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: GalToKgFormProps) {
  const set = (patch: Partial<GalToKgDraft>) => onDraftChange({ ...draft, ...patch });
  const materials = materialsForCategory(draft.category);
  const selected = findMaterial(draft.materialId);

  const applyMaterial = (materialId: string) => {
    if (materialHasPresetDensity(materialId)) {
      const item = findMaterial(materialId)!;
      const kgPerL = item.densityKgPerM3! / 1000;
      set({
        materialId,
        densityUnit: 'kgPerL',
        densityValue: formatMeasure(kgPerL),
      });
      return;
    }
    set({ materialId, densityValue: '', densityOpen: true });
  };

  const changeCategory = (category: SubstanceCategory) => {
    const nextId = defaultMaterialIdForCategory(category);
    if (materialHasPresetDensity(nextId)) {
      const item = findMaterial(nextId)!;
      set({
        category,
        materialId: nextId,
        densityUnit: 'kgPerL',
        densityValue: formatMeasure(item.densityKgPerM3! / 1000),
      });
      return;
    }
    set({
      category,
      materialId: nextId,
      densityValue: category === 'custom' ? '' : formatMeasure(WATER_DENSITY_KG_PER_L),
      densityOpen: true,
    });
  };

  const changeDensityUnit = (nextUnit: DensityUnit) => {
    const parsed = parseOptionalNumber(draft.densityValue);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
      set({ densityUnit: nextUnit });
      return;
    }
    const canonical = densityToKgPerL(parsed, draft.densityUnit);
    set({
      densityUnit: nextUnit,
      densityValue: formatMeasure(kgPerLToDensity(canonical, nextUnit)),
      materialId: CUSTOM_MATERIAL_ID,
      category: 'custom',
    });
  };

  const changeGallonUnit = (nextUnit: GallonUnit) => {
    const parsed = parseOptionalNumber(draft.gallons);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ gallonUnit: nextUnit });
      return;
    }
    const liters = parsed * LITERS_PER_GALLON[draft.gallonUnit];
    set({
      gallonUnit: nextUnit,
      gallons: formatMeasure(liters / LITERS_PER_GALLON[nextUnit]),
      source: 'gallons',
    });
  };

  const changeOtherMassUnit = (nextUnit: OtherMassUnit) => {
    const parsed = parseOptionalNumber(draft.otherMass);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ otherMassUnit: nextUnit });
      return;
    }
    const kg = toKg(parsed, draft.otherMassUnit);
    set({
      otherMassUnit: nextUnit,
      otherMass: formatMeasure(fromKg(kg, nextUnit)),
      source: 'otherMass',
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className={sectionClass}>
        <p className="text-sm font-semibold text-accent">Enter one value to get the other</p>

        <FieldShell
          label="Gallons"
          htmlFor="gal-kg-gallons"
          tip="US liquid or UK imperial gallons. Density is required to convert to mass."
          error={errors.gallons}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="gal-kg-gallons"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.gallons}
                placeholder="Enter volume"
                aria-invalid={Boolean(errors.gallons)}
                onChange={(event) => set({ source: 'gallons', gallons: event.target.value })}
              />
            </div>
            <select
              className={unitSelectClass}
              value={draft.gallonUnit}
              aria-label="Gallon unit"
              onChange={(event) => changeGallonUnit(event.target.value as GallonUnit)}
            >
              {GALLON_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </FieldShell>

        <FieldShell
          label="Weight (mass) in kilograms"
          htmlFor="gal-kg-kg"
          tip="Editing kilograms recalculates gallons using the current density."
          error={errors.kg}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="gal-kg-kg"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.kg}
                placeholder="Enter kilograms"
                aria-invalid={Boolean(errors.kg)}
                onChange={(event) => set({ source: 'kg', kg: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              kg
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label="Other weight (mass) units"
          htmlFor="gal-kg-other"
          tip="Synced mass in another unit. Changing the unit preserves physical mass."
          error={errors.otherMass}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="gal-kg-other"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.otherMass}
                placeholder="Enter mass"
                aria-invalid={Boolean(errors.otherMass)}
                onChange={(event) => set({ source: 'otherMass', otherMass: event.target.value })}
              />
            </div>
            <select
              className={unitSelectClass}
              value={draft.otherMassUnit}
              aria-label="Other mass unit"
              onChange={(event) => changeOtherMassUnit(event.target.value as OtherMassUnit)}
            >
              {OTHER_MASS_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </FieldShell>
      </div>

      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90">
        We assume the substance is water, but you can change the density below to work with a
 different substance. Gallons measure volume; kilograms measure mass; density is required.
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.densityOpen}
          onClick={() => set({ densityOpen: !draft.densityOpen })}
        >
          <span>Change the density</span>
          {draft.densityOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.densityOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 pb-3.5 pt-2">
            <FieldShell label="Category" htmlFor="gal-kg-category">
              <select
                id="gal-kg-category"
                className={selectClass}
                value={draft.category}
                onChange={(event) => changeCategory(event.target.value as SubstanceCategory)}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell label="Substance" htmlFor="gal-kg-material">
              <select
                id="gal-kg-material"
                className={selectClass}
                value={draft.materialId}
                onChange={(event) => applyMaterial(event.target.value)}
              >
                {materials.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell
              label="Density"
              htmlFor="gal-kg-density"
              tip="Changing the unit preserves physical density."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="gal-kg-density"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.densityValue}
                    placeholder="Enter density"
                    aria-invalid={Boolean(errors.densityValue)}
                    onChange={(event) =>
                      set({
                        densityValue: event.target.value,
                        materialId: CUSTOM_MATERIAL_ID,
                        category: 'custom',
                      })
                    }
                  />
                </div>
                <select
                  className={unitSelectClass}
                  value={draft.densityUnit}
                  aria-label="Density unit"
                  onChange={(event) => changeDensityUnit(event.target.value as DensityUnit)}
                >
                  {DENSITY_UNIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </FieldShell>

            {selected?.conditions ? (
              <p className="text-xs text-muted-foreground">{selected.conditions}</p>
            ) : null}
          </div>
        ) : null}
      </div>

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
