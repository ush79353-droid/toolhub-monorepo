'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  concentrationToMcgPerMl,
  densityToGPerMl,
  formatMeasure,
  fromMcg,
  fromMl,
  gPerMlToDensity,
  mcgPerMlToConcentration,
  toMcg,
  toMl,
} from './calculation';
import {
  CONCENTRATION_UNIT_OPTIONS,
  DENSITY_UNIT_OPTIONS,
  MASS_UNIT_OPTIONS,
  VITAMIN_B12_EXAMPLE_MCG_PER_ML,
  VOLUME_UNIT_OPTIONS,
  WATER_DENSITY_G_PER_ML,
  type CalcMode,
  type ConcentrationUnit,
  type DensityUnit,
  type DosageSource,
  type MassUnit,
  type McgToMlFieldErrors,
  type McgToMlInput,
  type MedicationPreset,
  type VolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface McgToMlDraft {
  mode: CalcMode;
  source: DosageSource;
  massDisplay: string;
  volumeDisplay: string;
  massUnit: MassUnit;
  volumeUnit: VolumeUnit;
  medicationPreset: MedicationPreset;
  concentrationValue: string;
  concentrationUnit: ConcentrationUnit;
  densityValue: string;
  densityUnit: DensityUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring sm:min-w-[5rem]';
const selectFullClass = `${selectClass} w-full`;

export function draftToInput(draft: McgToMlDraft): McgToMlInput {
  const massRaw = parseOptionalNumber(draft.massDisplay);
  const volumeRaw = parseOptionalNumber(draft.volumeDisplay);
  return {
    mode: draft.mode,
    source: draft.source,
    massMcg: massRaw === null || !Number.isFinite(massRaw) ? massRaw : toMcg(massRaw, draft.massUnit),
    volumeMl:
      volumeRaw === null || !Number.isFinite(volumeRaw)
        ? volumeRaw
        : toMl(volumeRaw, draft.volumeUnit),
    massUnit: draft.massUnit,
    volumeUnit: draft.volumeUnit,
    medicationPreset: draft.medicationPreset,
    concentrationValue:
      draft.medicationPreset === 'vitaminB12Example'
        ? VITAMIN_B12_EXAMPLE_MCG_PER_ML
        : parseOptionalNumber(draft.concentrationValue),
    concentrationUnit:
      draft.medicationPreset === 'vitaminB12Example' ? 'mcgPerMl' : draft.concentrationUnit,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
  };
}

export function emptyDraft(): McgToMlDraft {
  return {
    mode: 'medication',
    source: 'mass',
    massDisplay: '',
    volumeDisplay: '',
    massUnit: 'mcg',
    volumeUnit: 'mL',
    medicationPreset: 'vitaminB12Example',
    concentrationValue: formatMeasure(VITAMIN_B12_EXAMPLE_MCG_PER_ML),
    concentrationUnit: 'mcgPerMl',
    densityValue: formatMeasure(WATER_DENSITY_G_PER_ML),
    densityUnit: 'gPerMl',
  };
}

interface McgToMlFormProps {
  draft: McgToMlDraft;
  errors: McgToMlFieldErrors;
  onDraftChange: (draft: McgToMlDraft) => void;
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

export function McgToMlForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: McgToMlFormProps) {
  const set = (patch: Partial<McgToMlDraft>) => onDraftChange({ ...draft, ...patch });

  const changeMassUnit = (next: MassUnit) => {
    const parsed = parseOptionalNumber(draft.massDisplay);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ massUnit: next });
      return;
    }
    const mcg = toMcg(parsed, draft.massUnit);
    set({ massUnit: next, massDisplay: formatMeasure(fromMcg(mcg, next)), source: draft.source });
  };

  const changeVolumeUnit = (next: VolumeUnit) => {
    const parsed = parseOptionalNumber(draft.volumeDisplay);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ volumeUnit: next });
      return;
    }
    const ml = toMl(parsed, draft.volumeUnit);
    set({ volumeUnit: next, volumeDisplay: formatMeasure(fromMl(ml, next)), source: draft.source });
  };

  const changeConcUnit = (next: ConcentrationUnit) => {
    const parsed = parseOptionalNumber(draft.concentrationValue);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
      set({ concentrationUnit: next });
      return;
    }
    const mcgPerMl = concentrationToMcgPerMl(parsed, draft.concentrationUnit);
    set({
      concentrationUnit: next,
      concentrationValue: formatMeasure(mcgPerMlToConcentration(mcgPerMl, next)),
    });
  };

  const changeDensityUnit = (next: DensityUnit) => {
    const parsed = parseOptionalNumber(draft.densityValue);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
      set({ densityUnit: next });
      return;
    }
    const gPerMl = densityToGPerMl(parsed, draft.densityUnit);
    set({
      densityUnit: next,
      densityValue: formatMeasure(gPerMlToDensity(gPerMl, next)),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div
        className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90"
        role="note"
      >
        <strong>Important:</strong> This tool converts mass and volume using the concentration you
        provide. It does not determine an appropriate medication dose. Verify the product label and
        prescribed instructions with a qualified healthcare professional.
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Select your substance:</h3>
        <div className="mt-3 space-y-3">
          <FieldShell
            label="Conversion for"
            htmlFor="mcg-ml-mode"
            tip="Medication mode uses labeled concentration (mcg/mL). Other substance mode uses density."
          >
            <select
              id="mcg-ml-mode"
              className={selectFullClass}
              value={draft.mode}
              onChange={(event) =>
                set({ mode: event.target.value as CalcMode, source: draft.source })
              }
            >
              <option value="medication">Medication</option>
              <option value="density">Other substance</option>
            </select>
          </FieldShell>

          {draft.mode === 'medication' ? (
            <>
              <FieldShell
                label="Medication"
                htmlFor="mcg-ml-med"
                tip="Presets are examples only. Confirm the concentration on your product label."
              >
                <select
                  id="mcg-ml-med"
                  className={selectFullClass}
                  value={draft.medicationPreset}
                  onChange={(event) => {
                    const preset = event.target.value as MedicationPreset;
                    if (preset === 'vitaminB12Example') {
                      set({
                        medicationPreset: preset,
                        concentrationValue: formatMeasure(VITAMIN_B12_EXAMPLE_MCG_PER_ML),
                        concentrationUnit: 'mcgPerMl',
                      });
                    } else {
                      set({ medicationPreset: preset });
                    }
                  }}
                >
                  <option value="vitaminB12Example">
                    Vitamin B12 — Example concentration (1,000 mcg/mL)
                  </option>
                  <option value="custom">Custom concentration</option>
                </select>
              </FieldShell>

              {draft.medicationPreset === 'custom' ? (
                <FieldShell
                  label="Custom concentration"
                  htmlFor="mcg-ml-conc"
                  tip="Enter the labeled strength and unit. 1 mg/mL = 1,000 mcg/mL."
                  error={errors.concentrationValue}
                >
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="mcg-ml-conc"
                        inputMode="decimal"
                        autoComplete="off"
                        className={inputClass}
                        value={draft.concentrationValue}
                        placeholder="Enter concentration"
                        aria-invalid={Boolean(errors.concentrationValue)}
                        onChange={(event) => set({ concentrationValue: event.target.value })}
                      />
                    </div>
                    <select
                      aria-label="Concentration unit"
                      className={selectClass}
                      value={draft.concentrationUnit}
                      onChange={(event) =>
                        changeConcUnit(event.target.value as ConcentrationUnit)
                      }
                    >
                      {CONCENTRATION_UNIT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </FieldShell>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Using example strength 1,000 mcg/mL. Not all Vitamin B12 products use this
                  concentration — check your label.
                </p>
              )}
            </>
          ) : (
            <FieldShell
              label="Substance density"
              htmlFor="mcg-ml-density"
              tip="Density = mass / volume. Water ≈ 1 g/mL is approximate and temperature-dependent."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="mcg-ml-density"
                    inputMode="decimal"
                    autoComplete="off"
                    className={inputClass}
                    value={draft.densityValue}
                    placeholder="Enter density"
                    aria-invalid={Boolean(errors.densityValue)}
                    onChange={(event) => set({ densityValue: event.target.value })}
                  />
                </div>
                <select
                  aria-label="Density unit"
                  className={selectClass}
                  value={draft.densityUnit}
                  onChange={(event) => changeDensityUnit(event.target.value as DensityUnit)}
                >
                  {DENSITY_UNIT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </FieldShell>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">Input one and get the other:</h3>
        <div className="mt-3 space-y-3">
          <FieldShell
            label="Medication dosage"
            htmlFor="mcg-ml-mass"
            tip="Mass of active ingredient (or substance mass in density mode)."
            error={errors.massMcg}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="mcg-ml-mass"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.massDisplay}
                  placeholder="Enter dosage"
                  aria-invalid={Boolean(errors.massMcg)}
                  onChange={(event) =>
                    set({ source: 'mass', massDisplay: event.target.value })
                  }
                />
              </div>
              <select
                aria-label="Mass unit"
                className={selectClass}
                value={draft.massUnit}
                onChange={(event) => changeMassUnit(event.target.value as MassUnit)}
              >
                {MASS_UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </FieldShell>

          <FieldShell
            label="Liquid dosage"
            htmlFor="mcg-ml-volume"
            tip="Liquid volume corresponding to the mass at the stated concentration or density."
            error={errors.volumeMl}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="mcg-ml-volume"
                  inputMode="decimal"
                  autoComplete="off"
                  className={inputClass}
                  value={draft.volumeDisplay}
                  placeholder="Enter volume"
                  aria-invalid={Boolean(errors.volumeMl)}
                  onChange={(event) =>
                    set({ source: 'volume', volumeDisplay: event.target.value })
                  }
                />
              </div>
              <select
                aria-label="Volume unit"
                className={selectClass}
                value={draft.volumeUnit}
                onChange={(event) => changeVolumeUnit(event.target.value as VolumeUnit)}
              >
                {VOLUME_UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </FieldShell>
        </div>
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
