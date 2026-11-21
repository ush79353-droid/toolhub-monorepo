'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  densityToGPerMl,
  formatMeasure,
  fromMl,
  gPerMlToDensity,
  toMl,
} from './calculation';
import {
  CUSTOM_CATEGORY_ID,
  CUSTOM_TYPE_ID,
  DEFAULT_CATEGORY_ID,
  DEFAULT_TYPE_ID,
  GRANULATED_SUGAR_KG_PER_M3,
  INGREDIENT_CATEGORIES,
  defaultTypeIdForCategory,
  findCategory,
  findType,
} from './ingredients';
import {
  DENSITY_UNIT_OPTIONS,
  US_TEASPOON_ML,
  VOLUME_UNIT_OPTIONS,
  type DensityUnit,
  type TspGramsSource,
  type TspToGramsFieldErrors,
  type TspToGramsInput,
  type VolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface TspToGramsDraft {
  source: TspGramsSource;
  categoryId: string;
  typeId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  teaspoons: string;
  volumeUnit: VolumeUnit;
  grams: string;
  densityOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitSelectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[6.5rem]';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function draftToInput(draft: TspToGramsDraft): TspToGramsInput {
  return {
    source: draft.source,
    categoryId: draft.categoryId,
    typeId: draft.typeId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    teaspoons: parseOptionalNumber(draft.teaspoons),
    volumeUnit: draft.volumeUnit,
    grams: parseOptionalNumber(draft.grams),
  };
}

export function initialDraft(): TspToGramsDraft {
  return {
    source: 'volume',
    categoryId: DEFAULT_CATEGORY_ID,
    typeId: DEFAULT_TYPE_ID,
    densityValue: formatMeasure(GRANULATED_SUGAR_KG_PER_M3),
    densityUnit: 'kgPerM3',
    teaspoons: '',
    volumeUnit: 'usTsp',
    grams: '',
    densityOpen: true,
  };
}

interface TspToGramsFormProps {
  draft: TspToGramsDraft;
  errors: TspToGramsFieldErrors;
  onDraftChange: (draft: TspToGramsDraft) => void;
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

export function TspToGramsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: TspToGramsFormProps) {
  const set = (patch: Partial<TspToGramsDraft>) => onDraftChange({ ...draft, ...patch });
  const category = findCategory(draft.categoryId);
  const selected = findType(draft.categoryId, draft.typeId);
  const types =
    draft.categoryId === CUSTOM_CATEGORY_ID
      ? []
      : (category?.types ?? []);

  const applyCategory = (categoryId: string) => {
    if (categoryId === CUSTOM_CATEGORY_ID) {
      set({
        categoryId,
        typeId: CUSTOM_TYPE_ID,
        densityValue: '',
        densityOpen: true,
      });
      return;
    }
    const typeId = defaultTypeIdForCategory(categoryId);
    const item = findType(categoryId, typeId);
    if (!item) {
      set({ categoryId, typeId });
      return;
    }
    set({
      categoryId,
      typeId,
      densityUnit: 'kgPerM3',
      densityValue: formatMeasure(gPerMlToDensity(item.densityGPerMl, 'kgPerM3')),
    });
  };

  const applyType = (typeId: string) => {
    if (typeId === CUSTOM_TYPE_ID) {
      set({ typeId, categoryId: CUSTOM_CATEGORY_ID, densityValue: '', densityOpen: true });
      return;
    }
    const item = findType(draft.categoryId, typeId);
    if (!item) {
      set({ typeId });
      return;
    }
    set({
      typeId,
      densityUnit: 'kgPerM3',
      densityValue: formatMeasure(gPerMlToDensity(item.densityGPerMl, 'kgPerM3')),
    });
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
      categoryId: CUSTOM_CATEGORY_ID,
      typeId: CUSTOM_TYPE_ID,
    });
  };

  const changeVolumeUnit = (nextUnit: VolumeUnit) => {
    const parsed = parseOptionalNumber(draft.teaspoons);
    if (parsed === null || !Number.isFinite(parsed) || parsed < 0) {
      set({ volumeUnit: nextUnit });
      return;
    }
    const ml = toMl(parsed, draft.volumeUnit);
    set({
      volumeUnit: nextUnit,
      teaspoons: formatMeasure(fromMl(ml, nextUnit)),
      source: 'volume',
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Teaspoons measure volume; grams measure mass. Density is required; there is no universal
        tsp↔g factor. Defaults to granulated sugar at 845 kg/m³ (0.845 g/mL). US tsp ={' '}
        {US_TEASPOON_ML} mL. Ingredient weights are approximate and depend on density, packing, and
        measurement technique.
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-accent"
          aria-expanded={draft.densityOpen}
          onClick={() => set({ densityOpen: !draft.densityOpen })}
        >
          Lookup density or input your own
          {draft.densityOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
          )}
        </button>

        {draft.densityOpen ? (
          <>
            <FieldShell
              label="Ingredient"
              htmlFor="tsp-g-category"
              tip="Selecting an ingredient loads its subtype list and an approximate reference density."
            >
              <select
                id="tsp-g-category"
                className={selectClass}
                value={draft.categoryId}
                onChange={(event) => applyCategory(event.target.value)}
              >
                {INGREDIENT_CATEGORIES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
                <option value={CUSTOM_CATEGORY_ID}>Custom ingredient</option>
              </select>
            </FieldShell>

            {draft.categoryId !== CUSTOM_CATEGORY_ID ? (
              <FieldShell
                label="Type"
                htmlFor="tsp-g-type"
                tip="Subtype densities are approximate kitchen bulk values, not certified specifications."
              >
                <select
                  id="tsp-g-type"
                  className={selectClass}
                  value={draft.typeId}
                  onChange={(event) => applyType(event.target.value)}
                >
                  {types.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </FieldShell>
            ) : null}

            <FieldShell
              label={
                draft.categoryId === CUSTOM_CATEGORY_ID ? 'Custom density' : 'Density'
              }
              htmlFor="tsp-g-density"
              tip="Edit freely for a custom value. 845 kg/m³ = 0.845 g/mL = 0.845 g/cm³. Changing the unit preserves physical density."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="tsp-g-density"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.densityValue}
                    placeholder="Enter density"
                    aria-invalid={Boolean(errors.densityValue)}
                    onChange={(event) =>
                      set({
                        densityValue: event.target.value,
                        categoryId: CUSTOM_CATEGORY_ID,
                        typeId: CUSTOM_TYPE_ID,
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
              {selected ? (
                <p className="text-xs text-muted-foreground">{selected.notes}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Enter any positive density for your ingredient and conditions.
                </p>
              )}
            </FieldShell>
          </>
        ) : null}
      </div>

      <div className={sectionClass}>
        <p className="text-sm font-semibold text-accent">Input one and get the other:</p>

        <FieldShell
          label="Teaspoons"
          htmlFor="tsp-g-volume"
          tip="Enter a nonnegative volume. Switch between US and metric teaspoons as needed."
          error={errors.teaspoons}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="tsp-g-volume"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.teaspoons}
                placeholder="Enter value"
                aria-invalid={Boolean(errors.teaspoons)}
                onChange={(event) => set({ source: 'volume', teaspoons: event.target.value })}
              />
            </div>
            <select
              className={unitSelectClass}
              value={draft.volumeUnit}
              aria-label="Teaspoon standard"
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
          label="Grams"
          htmlFor="tsp-g-mass"
          tip="Enter a nonnegative mass in grams to convert back to teaspoons."
          error={errors.grams}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="tsp-g-mass"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.grams}
                placeholder="Calculated result"
                aria-invalid={Boolean(errors.grams)}
                onChange={(event) => set({ source: 'mass', grams: event.target.value })}
              />
            </div>
            <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-accent">
              g
            </span>
          </div>
        </FieldShell>
      </div>

      <p className="text-xs text-muted-foreground">
        g = tsp × {US_TEASPOON_ML} × ρ(g/mL) · For precise baking, weigh ingredients on a kitchen
        scale.
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
