'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { densityToLbPerFt3, formatMeasure, lbPerFt3ToDensity } from './calculation';
import {
  CUSTOM_MATERIAL_ID,
  defaultMaterialIdForCategory,
  findMaterial,
  materialHasPresetDensity,
  materialsForCategory,
} from './materials';
import {
  CATEGORY_OPTIONS,
  CONCRETE_DENSITY_LB_PER_FT3,
  DENSITY_UNIT_OPTIONS,
  type CubicFeetPoundsSource,
  type CubicFeetToPoundsFieldErrors,
  type CubicFeetToPoundsInput,
  type DensityUnit,
  type SubstanceCategory,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CuFtToLbDraft {
  source: CubicFeetPoundsSource;
  category: SubstanceCategory;
  materialId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  cubicFeet: string;
  pounds: string;
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

export function draftToInput(draft: CuFtToLbDraft): CubicFeetToPoundsInput {
  return {
    source: draft.source,
    category: draft.category,
    materialId: draft.materialId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    cubicFeet: parseOptionalNumber(draft.cubicFeet),
    pounds: parseOptionalNumber(draft.pounds),
  };
}

export function emptyVolumeDraft(draft: CuFtToLbDraft): CuFtToLbDraft {
  return { ...draft, source: 'cubicFeet', cubicFeet: '', pounds: '' };
}

interface CuFtToLbFormProps {
  draft: CuFtToLbDraft;
  errors: CubicFeetToPoundsFieldErrors;
  onDraftChange: (draft: CuFtToLbDraft) => void;
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

export function CuFtToLbForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CuFtToLbFormProps) {
  const set = (patch: Partial<CuFtToLbDraft>) => onDraftChange({ ...draft, ...patch });
  const materials = materialsForCategory(draft.category);
  const selected = findMaterial(draft.materialId);

  const applyMaterial = (materialId: string) => {
    if (materialHasPresetDensity(materialId)) {
      const item = findMaterial(materialId)!;
      set({
        materialId,
        densityUnit: 'lbPerFt3',
        densityValue: formatMeasure(item.densityLbPerFt3!),
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
        densityUnit: 'lbPerFt3',
        densityValue: formatMeasure(item.densityLbPerFt3!),
      });
      return;
    }
    set({
      category,
      materialId: nextId,
      densityValue:
        category === 'custom' ? '' : formatMeasure(CONCRETE_DENSITY_LB_PER_FT3),
      densityOpen: true,
    });
  };

  const changeDensityUnit = (nextUnit: DensityUnit) => {
    const parsed = parseOptionalNumber(draft.densityValue);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
      set({ densityUnit: nextUnit });
      return;
    }
    const canonical = densityToLbPerFt3(parsed, draft.densityUnit);
    set({
      densityUnit: nextUnit,
      densityValue: formatMeasure(lbPerFt3ToDensity(canonical, nextUnit)),
      materialId: CUSTOM_MATERIAL_ID,
      category: 'custom',
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Cubic feet measure volume; pounds measure mass. A material density is required. Preset
        densities are illustrative and may vary with composition, moisture, and compaction.
        Density must be greater than zero.
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
              htmlFor="cuft-lb-category"
              tip="Choose a material group. Materials update for the selected category."
            >
              <select
                id="cuft-lb-category"
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
              label="Material"
              htmlFor="cuft-lb-material"
              tip="Selecting a material loads an approximate density when one is available."
            >
              <select
                id="cuft-lb-material"
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
              htmlFor="cuft-lb-density"
              tip="Edit freely for a custom value. Changing the unit preserves physical density."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="cuft-lb-density"
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
          label="Cubic feet"
          htmlFor="cuft-lb-cubic-feet"
          tip="Enter volume in cubic feet. Pounds update using the current density."
          error={errors.cubicFeet}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="cuft-lb-cubic-feet"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.cubicFeet}
                placeholder="Enter cubic feet"
                aria-invalid={Boolean(errors.cubicFeet)}
                onChange={(event) =>
                  set({ source: 'cubicFeet', cubicFeet: event.target.value })
                }
              />
            </div>
            <span className={unitSelectClass} aria-hidden="true">
              ft³
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label="Pounds"
          htmlFor="cuft-lb-pounds"
          tip="Enter mass in pounds. Cubic feet update using the current density."
          error={errors.pounds}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="cuft-lb-pounds"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.pounds}
                placeholder="Enter pounds"
                aria-invalid={Boolean(errors.pounds)}
                onChange={(event) =>
                  set({ source: 'pounds', pounds: event.target.value })
                }
              />
            </div>
            <span className={unitSelectClass} aria-hidden="true">
              lb
            </span>
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
