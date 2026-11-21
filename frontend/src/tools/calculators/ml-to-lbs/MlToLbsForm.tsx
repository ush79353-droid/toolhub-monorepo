'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  densityToKgPerM3,
  formatMeasure,
  kgPerM3ToDensity,
  kgToMass,
  massToKg,
  mlToVolume,
  volumeToMl,
} from './calculation';
import { CUSTOM_SUBSTANCE_ID, findSubstance, SUBSTANCES } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  MASS_UNIT_OPTIONS,
  VOLUME_UNIT_OPTIONS,
  WATER_DENSITY_KG_PER_M3,
  type DensityUnit,
  type MassUnit,
  type MlKgSource,
  type MlToLbsFieldErrors,
  type MlToLbsInput,
  type VolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MlToLbsDraft {
  source: MlKgSource;
  substanceId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  volumeValue: string;
  volumeUnit: VolumeUnit;
  massValue: string;
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

export function draftToInput(draft: MlToLbsDraft): MlToLbsInput {
  return {
    source: draft.source,
    substanceId: draft.substanceId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    volumeValue: parseOptionalNumber(draft.volumeValue),
    volumeUnit: draft.volumeUnit,
    massValue: parseOptionalNumber(draft.massValue),
    massUnit: draft.massUnit,
  };
}

export function initialDraft(): MlToLbsDraft {
  return {
    source: 'volume',
    substanceId: 'water',
    densityValue: formatMeasure(WATER_DENSITY_KG_PER_M3),
    densityUnit: 'kgPerM3',
    volumeValue: '',
    volumeUnit: 'ml',
    massValue: '',
    massUnit: 'lb',
    densityOpen: true,
  };
}

export function clearedDraft(draft: MlToLbsDraft): MlToLbsDraft {
  return {
    ...draft,
    source: 'volume',
    volumeValue: '',
    massValue: '',
  };
}

interface MlToLbsFormProps {
  draft: MlToLbsDraft;
  errors: MlToLbsFieldErrors;
  onDraftChange: (draft: MlToLbsDraft) => void;
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

export function MlToLbsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MlToLbsFormProps) {
  const set = (patch: Partial<MlToLbsDraft>) => onDraftChange({ ...draft, ...patch });
  const selected = findSubstance(draft.substanceId);

  const applySubstance = (substanceId: string) => {
    if (substanceId === CUSTOM_SUBSTANCE_ID) {
      set({ substanceId, densityValue: '' });
      return;
    }
    const item = findSubstance(substanceId);
    if (!item) return;
    set({
      substanceId,
      densityUnit: 'kgPerM3',
      densityValue: formatMeasure(item.densityKgPerM3),
    });
  };

  const changeDensityUnit = (nextUnit: DensityUnit) => {
    const parsed = parseOptionalNumber(draft.densityValue);
    if (parsed == null || !Number.isFinite(parsed)) {
      set({ densityUnit: nextUnit, substanceId: CUSTOM_SUBSTANCE_ID });
      return;
    }
    const canonical = densityToKgPerM3(parsed, draft.densityUnit);
    set({
      densityUnit: nextUnit,
      densityValue: formatMeasure(kgPerM3ToDensity(canonical, nextUnit)),
      substanceId: CUSTOM_SUBSTANCE_ID,
    });
  };

  const changeVolumeUnit = (nextUnit: VolumeUnit) => {
    const parsed = parseOptionalNumber(draft.volumeValue);
    if (parsed == null || !Number.isFinite(parsed)) {
      set({ volumeUnit: nextUnit, source: 'volume' });
      return;
    }
    const ml = volumeToMl(parsed, draft.volumeUnit);
    set({
      volumeUnit: nextUnit,
      volumeValue: formatMeasure(mlToVolume(ml, nextUnit)),
      source: 'volume',
    });
  };

  const changeMassUnit = (nextUnit: MassUnit) => {
    const parsed = parseOptionalNumber(draft.massValue);
    if (parsed == null || !Number.isFinite(parsed)) {
      set({ massUnit: nextUnit, source: 'mass' });
      return;
    }
    const kg = massToKg(parsed, draft.massUnit);
    set({
      massUnit: nextUnit,
      massValue: formatMeasure(kgToMass(kg, nextUnit)),
      source: 'mass',
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Milliliters measure volume; pounds measure mass. Conversion always uses density; there is no
        universal mL↔lb factor. Water defaults to ≈ 1000 kg/m³ (approximate reference). Exact
        definition: 1 lb = 0.45359237 kg.
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
              htmlFor="ml-lbs-substance"
              tip="Selecting an ingredient loads an approximate reference density. Choose Custom for your own value."
            >
              <select
                id="ml-lbs-substance"
                className={selectClass}
                value={draft.substanceId}
                onChange={(event) => applySubstance(event.target.value)}
              >
                {SUBSTANCES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
                <option value={CUSTOM_SUBSTANCE_ID}>Custom substance</option>
              </select>
            </FieldShell>

            <FieldShell
              label={draft.substanceId === CUSTOM_SUBSTANCE_ID ? 'Custom density' : 'Density'}
              htmlFor="ml-lbs-density"
              tip="Edit freely for a custom value. Changing the unit preserves physical density. 1 kg/L = 1 g/mL = 1 g/cm³ = 1000 kg/m³."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="ml-lbs-density"
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
                <p className="text-xs text-muted-foreground">{selected.conditions}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Enter any positive density for your substance and conditions.
                </p>
              )}
            </FieldShell>
          </>
        ) : null}
      </div>

      <div className={sectionClass}>
        <p className="text-sm font-semibold text-accent">Input one and get the other:</p>

        <FieldShell
          label="Milliliters"
          htmlFor="ml-lbs-volume"
          tip="Enter a nonnegative volume. Changing units preserves the physical volume."
          error={errors.volumeValue}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="ml-lbs-volume"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.volumeValue}
                placeholder="Enter volume"
                aria-invalid={Boolean(errors.volumeValue)}
                onChange={(event) => set({ source: 'volume', volumeValue: event.target.value })}
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
          label="Pounds"
          htmlFor="ml-lbs-mass"
          tip="Enter a nonnegative mass. Fluid ounces are volume; not the same as mass ounces."
          error={errors.massValue}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="ml-lbs-mass"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.massValue}
                placeholder="Enter mass"
                aria-invalid={Boolean(errors.massValue)}
                onChange={(event) => set({ source: 'mass', massValue: event.target.value })}
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

      <p className="text-xs text-muted-foreground">
        lb = (mL × density kg/m³) ÷ 453592.37 · mL = (lb × 453592.37) ÷ density kg/m³
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
