'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { densityToKgPerM3, formatMeasure, kgPerM3ToDensity } from './calculation';
import {
  CUSTOM_MATERIAL_ID,
  defaultMaterialIdForCategory,
  findMaterial,
  materialHasPresetDensity,
  materialsForCategory,
} from './materials';
import {
  CATEGORY_OPTIONS,
  DENSITY_UNIT_OPTIONS,
  TON_UNIT_OPTIONS,
  WATER_DENSITY_KG_PER_M3,
  type CubicMeterTonSource,
  type CubicMeterToTonFieldErrors,
  type CubicMeterToTonInput,
  type DensityUnit,
  type SubstanceCategory,
  type TonUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CuMToTonDraft {
  source: CubicMeterTonSource;
  category: SubstanceCategory;
  materialId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  volumeM3: string;
  massTons: string;
  tonUnit: TonUnit;
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

export function draftToInput(draft: CuMToTonDraft): CubicMeterToTonInput {
  return {
    source: draft.source,
    category: draft.category,
    materialId: draft.materialId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    volumeM3: parseOptionalNumber(draft.volumeM3),
    massTons: parseOptionalNumber(draft.massTons),
    tonUnit: draft.tonUnit,
  };
}

export function emptyVolumeDraft(draft: CuMToTonDraft): CuMToTonDraft {
  return { ...draft, source: 'volume', volumeM3: '', massTons: '' };
}

interface CuMToTonFormProps {
  draft: CuMToTonDraft;
  errors: CubicMeterToTonFieldErrors;
  onDraftChange: (draft: CuMToTonDraft) => void;
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

export function CuMToTonForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CuMToTonFormProps) {
  const set = (patch: Partial<CuMToTonDraft>) => onDraftChange({ ...draft, ...patch });
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

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Cubic meters measure volume; tons measure mass. A material density is required. Metric
        tonnes, US short tons, and UK long tons are different. Preset densities are illustrative
        and may vary with conditions.
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-accent"
          onClick={() => set({ densityOpen: !draft.densityOpen })}
          aria-expanded={draft.densityOpen}
        >
          Lookup density or input your own
          {draft.densityOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {draft.densityOpen ? (
          <div className="space-y-3 pt-1">
            <FieldShell
              label="Category"
              htmlFor="cum-ton-category"
              tip="Choose a material group. Substances update for the selected category."
            >
              <select
                id="cum-ton-category"
                className={selectClass}
                value={draft.category}
                onChange={(event) =>
                  changeCategory(event.target.value as SubstanceCategory)
                }
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell
              label="Material / Substance"
              htmlFor="cum-ton-material"
              tip="Selecting a substance loads an approximate density when available."
            >
              <select
                id="cum-ton-material"
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
              htmlFor="cum-ton-density"
              tip="Edit freely for a custom value. Changing the unit preserves physical density."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="cum-ton-density"
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
                  onChange={(event) =>
                    changeDensityUnit(event.target.value as DensityUnit)
                  }
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
            {draft.materialId === CUSTOM_MATERIAL_ID ? (
              <p className="text-xs font-medium text-accent">Using a custom density value.</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className={sectionClass}>
        <p className="text-sm font-semibold text-accent">Input one and get the other</p>

        <FieldShell
          label="Cubic meters"
          htmlFor="cum-ton-volume"
          tip="Enter volume in cubic meters. Tons update using the current density."
          error={errors.volumeM3}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="cum-ton-volume"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.volumeM3}
                placeholder="Enter cubic meters"
                aria-invalid={Boolean(errors.volumeM3)}
                onChange={(event) =>
                  set({ source: 'volume', volumeM3: event.target.value })
                }
              />
            </div>
            <span className={unitSelectClass} aria-hidden="true">
              m³
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label="Tons"
          htmlFor="cum-ton-mass"
          tip="Choose metric tonne, US short ton, or UK long ton. Switching units preserves physical mass."
          error={errors.massTons}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="cum-ton-mass"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.massTons}
                placeholder="Enter tons"
                aria-invalid={Boolean(errors.massTons)}
                onChange={(event) =>
                  set({ source: 'mass', massTons: event.target.value })
                }
              />
            </div>
            <select
              className={`${unitSelectClass} min-w-[7.5rem]`}
              value={draft.tonUnit}
              aria-label="Ton unit"
              onChange={(event) =>
                set({ tonUnit: event.target.value as TonUnit, source: draft.source })
              }
            >
              {TON_UNIT_OPTIONS.map((opt) => (
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
