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
  densityToKgPerM3,
  formatMeasure,
  fromKg,
  fromM3,
  kgPerM3ToDensity,
  toKg,
  toM3,
} from './calculation';
import {
  CATEGORY_OPTIONS,
  DENSITY_UNIT_OPTIONS,
  MASS_UNIT_OPTIONS,
  VOLUME_UNIT_OPTIONS,
  WATER_DENSITY_KG_PER_M3,
  type DensityUnit,
  type GalTonsSource,
  type GalToTonsFieldErrors,
  type GalToTonsInput,
  type MassUnit,
  type SubstanceCategory,
  type VolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface GalToTonsDraft {
  source: GalTonsSource;
  category: SubstanceCategory;
  materialId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  volume: string;
  volumeUnit: VolumeUnit;
  mass: string;
  massUnit: MassUnit;
  densityOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitSelectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function draftToInput(draft: GalToTonsDraft): GalToTonsInput {
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

export function emptyMeasureDraft(draft: GalToTonsDraft): GalToTonsDraft {
  return { ...draft, source: 'volume', volume: '', mass: '' };
}

export function initialDraft(): GalToTonsDraft {
  return {
    source: 'volume',
    category: 'liquids',
    materialId: 'fresh-water-4c',
    densityValue: formatMeasure(WATER_DENSITY_KG_PER_M3),
    densityUnit: 'kgPerM3',
    volume: '',
    volumeUnit: 'usGal',
    mass: '',
    massUnit: 'usTon',
    densityOpen: true,
  };
}

interface GalToTonsFormProps {
  draft: GalToTonsDraft;
  errors: GalToTonsFieldErrors;
  onDraftChange: (draft: GalToTonsDraft) => void;
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

export function GalToTonsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: GalToTonsFormProps) {
  const set = (patch: Partial<GalToTonsDraft>) => onDraftChange({ ...draft, ...patch });
  const materials = materialsForCategory(draft.category);
  const selected = findMaterial(draft.materialId);

  const applyMaterial = (materialId: string) => {
    if (materialHasPresetDensity(materialId)) {
      const item = findMaterial(materialId)!;
      set({
        materialId,
        densityUnit: 'kgPerM3',
        densityValue: formatMeasure(item.densityKgPerM3!),
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
        densityUnit: 'kgPerM3',
        densityValue: formatMeasure(item.densityKgPerM3!),
      });
      return;
    }
    set({
      category,
      materialId: nextId,
      densityValue: category === 'custom' ? '' : formatMeasure(WATER_DENSITY_KG_PER_M3),
      densityOpen: true,
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
      category: 'custom',
    });
  };

  const changeVolumeUnit = (nextUnit: VolumeUnit) => {
    const parsed = parseOptionalNumber(draft.volume);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ volumeUnit: nextUnit });
      return;
    }
    const m3 = toM3(parsed, draft.volumeUnit);
    set({ volumeUnit: nextUnit, volume: formatMeasure(fromM3(m3, nextUnit)), source: 'volume' });
  };

  const changeMassUnit = (nextUnit: MassUnit) => {
    const parsed = parseOptionalNumber(draft.mass);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ massUnit: nextUnit });
      return;
    }
    const kg = toKg(parsed, draft.massUnit);
    set({ massUnit: nextUnit, mass: formatMeasure(fromKg(kg, nextUnit)), source: 'mass' });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Gallons measure volume; tons measure mass. Density is required; there is no universal
        gallons-to-tons factor. US short tons, UK long tons, and metric tonnes are different.
        Presets are approximate.
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-accent"
          onClick={() => set({ densityOpen: !draft.densityOpen })}
          aria-expanded={draft.densityOpen}
        >
          Lookup density or input your own
          {draft.densityOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {draft.densityOpen ? (
          <div className="space-y-3 pt-1">
            <FieldShell
              label="Category"
              htmlFor="gal-ton-category"
              tip="Choose a material group. Substances update for the selected category."
            >
              <select
                id="gal-ton-category"
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

            <FieldShell
              label="Material"
              htmlFor="gal-ton-material"
              tip="Selecting a material loads an approximate density. Choose Custom density to type your own."
            >
              <select
                id="gal-ton-material"
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
              htmlFor="gal-ton-density"
              tip="Edit freely for a custom value. Changing the unit preserves physical density."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="gal-ton-density"
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
            ) : draft.materialId === CUSTOM_MATERIAL_ID ? (
              <p className="text-xs text-muted-foreground">
                Enter any positive density for your substance and conditions.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className={sectionClass}>
        <p className="text-sm font-semibold text-accent">Input one and get the other</p>

        <FieldShell
          label="Volume"
          htmlFor="gal-ton-volume"
          tip="Enter volume. Mass updates using the current density. Unit changes preserve physical volume."
          error={errors.volume}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="gal-ton-volume"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.volume}
                placeholder="Enter volume"
                aria-invalid={Boolean(errors.volume)}
                onChange={(event) => set({ source: 'volume', volume: event.target.value })}
              />
            </div>
            <select
              className={unitSelectClass}
              value={draft.volumeUnit}
              aria-label="Volume unit"
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
          label="Weight / mass"
          htmlFor="gal-ton-mass"
          tip="Enter mass. Volume updates using the current density. US ton, UK ton, and metric tonne differ."
          error={errors.mass}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="gal-ton-mass"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.mass}
                placeholder="Enter mass"
                aria-invalid={Boolean(errors.mass)}
                onChange={(event) => set({ source: 'mass', mass: event.target.value })}
              />
            </div>
            <select
              className={unitSelectClass}
              value={draft.massUnit}
              aria-label="Mass unit"
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
