'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { densityToKgPerL, formatMeasure, kgPerLToDensity } from './calculation';
import {
  CUSTOM_SUBSTANCE_ID,
  defaultSubstanceIdForCategory,
  findSubstance,
  substanceHasPresetDensity,
  substancesForCategory,
} from './substances';
import {
  CATEGORY_OPTIONS,
  DENSITY_UNIT_OPTIONS,
  WATER_DENSITY_KG_PER_L,
  type DensityUnit,
  type LitersPoundsSource,
  type LitersToPoundsFieldErrors,
  type LitersToPoundsInput,
  type SubstanceCategory,
} from './types';
import { parseOptionalNumber } from './validation';

export interface LitersToPoundsDraft {
  source: LitersPoundsSource;
  category: SubstanceCategory;
  substanceId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  liters: string;
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

export function draftToInput(draft: LitersToPoundsDraft): LitersToPoundsInput {
  return {
    source: draft.source,
    category: draft.category,
    substanceId: draft.substanceId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    liters: parseOptionalNumber(draft.liters),
    pounds: parseOptionalNumber(draft.pounds),
  };
}

export function emptyVolumeDraft(draft: LitersToPoundsDraft): LitersToPoundsDraft {
  return { ...draft, source: 'liters', liters: '', pounds: '' };
}

interface LitersToPoundsFormProps {
  draft: LitersToPoundsDraft;
  errors: LitersToPoundsFieldErrors;
  onDraftChange: (draft: LitersToPoundsDraft) => void;
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

export function LitersToPoundsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: LitersToPoundsFormProps) {
  const set = (patch: Partial<LitersToPoundsDraft>) => onDraftChange({ ...draft, ...patch });
  const ingredients = substancesForCategory(draft.category);
  const selected = findSubstance(draft.substanceId);

  const applySubstance = (substanceId: string) => {
    if (substanceHasPresetDensity(substanceId)) {
      const item = findSubstance(substanceId)!;
      const kgPerL = item.densityKgPerL!;
      set({
        substanceId,
        densityUnit: 'kgPerM3',
        densityValue: formatMeasure(kgPerLToDensity(kgPerL, 'kgPerM3')),
      });
      return;
    }
    set({ substanceId, densityValue: '', densityOpen: true });
  };

  const changeCategory = (category: SubstanceCategory) => {
    const nextId = defaultSubstanceIdForCategory(category);
    if (substanceHasPresetDensity(nextId)) {
      const item = findSubstance(nextId)!;
      set({
        category,
        substanceId: nextId,
        densityUnit: 'kgPerM3',
        densityValue: formatMeasure(kgPerLToDensity(item.densityKgPerL!, 'kgPerM3')),
      });
      return;
    }
    set({
      category,
      substanceId: nextId,
      densityValue: category === 'custom' ? '' : formatMeasure(kgPerLToDensity(WATER_DENSITY_KG_PER_L, 'kgPerM3')),
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
      substanceId: CUSTOM_SUBSTANCE_ID,
      category: 'custom',
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Liters measure volume; pounds measure mass. A density is required. Preset densities are
        illustrative and may vary with temperature and composition. Density must be greater than
        zero.
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
              htmlFor="l-lb-category"
              tip="Choose a substance group. Ingredients update for the selected category."
            >
              <select
                id="l-lb-category"
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
              label="Ingredient"
              htmlFor="l-lb-ingredient"
              tip="Selecting an ingredient loads an approximate density when one is available."
            >
              <select
                id="l-lb-ingredient"
                className={selectClass}
                value={draft.substanceId}
                onChange={(event) => applySubstance(event.target.value)}
              >
                {ingredients.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </FieldShell>

            <FieldShell
              label="Density"
              htmlFor="l-lb-density"
              tip="Edit freely for a custom value. Changing the unit preserves physical density."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="l-lb-density"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.densityValue}
                    placeholder="Enter density"
                    aria-invalid={Boolean(errors.densityValue)}
                    onChange={(event) =>
                      set({
                        densityValue: event.target.value,
                        substanceId: CUSTOM_SUBSTANCE_ID,
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

      <div className={sectionClass}>
        <p className="text-sm font-semibold text-accent">Input one and get the other</p>

        <FieldShell
          label="Liters"
          htmlFor="l-lb-liters"
          tip="Enter volume in liters. Pounds update using the current density."
          error={errors.liters}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="l-lb-liters"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.liters}
                placeholder="Enter liters"
                aria-invalid={Boolean(errors.liters)}
                onChange={(event) => set({ source: 'liters', liters: event.target.value })}
              />
            </div>
            <span className={unitSelectClass} aria-hidden="true">
              L
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label="Pounds"
          htmlFor="l-lb-pounds"
          tip="Enter mass in pounds. Liters update using the current density."
          error={errors.pounds}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="l-lb-pounds"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.pounds}
                placeholder="Enter pounds"
                aria-invalid={Boolean(errors.pounds)}
                onChange={(event) => set({ source: 'pounds', pounds: event.target.value })}
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
