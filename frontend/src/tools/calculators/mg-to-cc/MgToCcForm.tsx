'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { densityToMgPerMl, formatMeasure, mgPerMlToDensity } from './calculation';
import {
  CONCENTRATION_UNIT_OPTIONS,
  DENSITY_UNIT_OPTIONS,
  EMPTY_MG_TO_CC_INPUT,
  SUBSTANCE_OPTIONS,
  WATER_DENSITY_MG_PER_ML,
  type ConcentrationUnit,
  type ConversionMode,
  type DensityUnit,
  type MgToCcFieldErrors,
  type MgToCcInput,
  type SubstanceId,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MgToCcDraft {
  mode: ConversionMode;
  source: 'mass' | 'volume';
  massMg: string;
  volumeCc: string;
  substance: SubstanceId;
  densityValue: string;
  densityUnit: DensityUnit;
  concentrationValue: string;
  concentrationUnit: ConcentrationUnit;
  substanceOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function emptyDraft(): MgToCcDraft {
  return {
    mode: EMPTY_MG_TO_CC_INPUT.mode,
    source: 'mass',
    massMg: '',
    volumeCc: '',
    substance: 'custom',
    densityValue: '',
    densityUnit: 'gPerMl',
    concentrationValue: '',
    concentrationUnit: 'mgPerMl',
    substanceOpen: true,
  };
}

export function draftToInput(draft: MgToCcDraft): MgToCcInput {
  return {
    mode: draft.mode,
    source: draft.source,
    massMg: parseOptionalNumber(draft.massMg),
    volumeCc: parseOptionalNumber(draft.volumeCc),
    substance: draft.substance,
    densityValue:
      draft.substance === 'water'
        ? WATER_DENSITY_MG_PER_ML
        : parseOptionalNumber(draft.densityValue),
    densityUnit: draft.substance === 'water' ? 'mgPerMl' : draft.densityUnit,
    concentrationValue: parseOptionalNumber(draft.concentrationValue),
    concentrationUnit: draft.concentrationUnit,
  };
}

interface MgToCcFormProps {
  draft: MgToCcDraft;
  errors: MgToCcFieldErrors;
  onDraftChange: (draft: MgToCcDraft) => void;
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

export function MgToCcForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MgToCcFormProps) {
  const set = (patch: Partial<MgToCcDraft>) => onDraftChange({ ...draft, ...patch });

  const changeDensityUnit = (nextUnit: DensityUnit) => {
    const parsed = parseOptionalNumber(draft.densityValue);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
      set({ densityUnit: nextUnit });
      return;
    }
    const canonical = densityToMgPerMl(parsed, draft.densityUnit);
    set({
      densityUnit: nextUnit,
      densityValue: formatMeasure(mgPerMlToDensity(canonical, nextUnit)),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-border bg-muted/20 p-3.5 sm:p-4">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 text-left text-sm font-semibold text-accent"
          aria-expanded={draft.substanceOpen}
          onClick={() => set({ substanceOpen: !draft.substanceOpen })}
        >
          <span>Select your substance</span>
          <span className="text-xs font-normal text-muted-foreground">
            {draft.substanceOpen ? '▲' : '▼'}
          </span>
        </button>

        {draft.substanceOpen ? (
          <div className="mt-3 space-y-3">
            <FieldShell
              label="Conversion mode"
              htmlFor="mg-cc-mode"
              tip="Medication uses labeled concentration. Substance uses density. Never mix the two factors."
            >
              <select
                id="mg-cc-mode"
                className={`${selectClass} w-full`}
                value={draft.mode}
                onChange={(event) =>
                  set({
                    mode: event.target.value as ConversionMode,
                    source: 'mass',
                    massMg: '',
                    volumeCc: '',
                    concentrationValue: '',
                    densityValue: '',
                    substance: 'custom',
                  })
                }
              >
                <option value="medication">Medication</option>
                <option value="substance">Substance</option>
              </select>
            </FieldShell>

            {draft.mode === 'medication' ? (
              <>
                <FieldShell
                  label="Medication"
                  htmlFor="mg-cc-med"
                  tip="Only custom concentration is available. Concentrations are never invented from a drug name."
                >
                  <select
                    id="mg-cc-med"
                    className={`${selectClass} w-full`}
                    value="custom"
                    disabled
                  >
                    <option value="custom">Custom medication</option>
                  </select>
                </FieldShell>

                <FieldShell
                  label="Concentration"
                  htmlFor="mg-cc-conc"
                  tip="Verify the exact product concentration from the label. mg/cc equals mg/mL."
                  error={errors.concentrationValue}
                >
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="mg-cc-conc"
                        inputMode="decimal"
                        className={inputClass}
                        value={draft.concentrationValue}
                        placeholder="Enter concentration"
                        aria-invalid={Boolean(errors.concentrationValue)}
                        onChange={(event) =>
                          set({ concentrationValue: event.target.value })
                        }
                      />
                    </div>
                    <select
                      className={selectClass}
                      aria-label="Concentration unit"
                      value={draft.concentrationUnit}
                      onChange={(event) =>
                        set({
                          concentrationUnit: event.target.value as ConcentrationUnit,
                        })
                      }
                    >
                      {CONCENTRATION_UNIT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </FieldShell>
              </>
            ) : (
              <>
                <FieldShell label="Substance" htmlFor="mg-cc-substance">
                  <select
                    id="mg-cc-substance"
                    className={`${selectClass} w-full`}
                    value={draft.substance}
                    onChange={(event) => {
                      const substance = event.target.value as SubstanceId;
                      set({
                        substance,
                        densityValue:
                          substance === 'water'
                            ? formatMeasure(mgPerMlToDensity(WATER_DENSITY_MG_PER_ML, 'gPerMl'))
                            : '',
                        densityUnit: substance === 'water' ? 'gPerMl' : draft.densityUnit,
                      });
                    }}
                  >
                    {SUBSTANCE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </FieldShell>

                <FieldShell
                  label="Density"
                  htmlFor="mg-cc-density"
                  tip="Canonical factor is mg/cc (= mg/mL). Water uses an approximate 1 g/mL reference."
                  error={errors.densityValue}
                >
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="mg-cc-density"
                        inputMode="decimal"
                        className={inputClass}
                        value={
                          draft.substance === 'water'
                            ? formatMeasure(mgPerMlToDensity(WATER_DENSITY_MG_PER_ML, 'gPerMl'))
                            : draft.densityValue
                        }
                        placeholder="Enter density"
                        disabled={draft.substance === 'water'}
                        aria-invalid={Boolean(errors.densityValue)}
                        onChange={(event) => set({ densityValue: event.target.value })}
                      />
                    </div>
                    <select
                      className={selectClass}
                      aria-label="Density unit"
                      value={draft.substance === 'water' ? 'gPerMl' : draft.densityUnit}
                      disabled={draft.substance === 'water'}
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
              </>
            )}
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-accent">Input one and get the other</h3>
        <FieldShell
          label={draft.mode === 'medication' ? 'Medication dosage' : 'Mass'}
          htmlFor="mg-cc-mass"
          tip="Editing mass recalculates volume using the active concentration or density."
          error={errors.massMg}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="mg-cc-mass"
                inputMode="decimal"
                className={inputClass}
                value={draft.massMg}
                placeholder="Enter milligrams"
                aria-invalid={Boolean(errors.massMg)}
                onChange={(event) => set({ source: 'mass', massMg: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              mg
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label={draft.mode === 'medication' ? 'Liquid dosage' : 'Volume'}
          htmlFor="mg-cc-volume"
          tip="Editing volume recalculates mass. 1 cc = 1 mL exactly."
          error={errors.volumeCc}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="mg-cc-volume"
                inputMode="decimal"
                className={inputClass}
                value={draft.volumeCc}
                placeholder="Enter cubic centimeters"
                aria-invalid={Boolean(errors.volumeCc)}
                onChange={(event) => set({ source: 'volume', volumeCc: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              cc
            </span>
          </div>
        </FieldShell>
      </div>

      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90">
        <strong className="font-semibold">Medication safety:</strong> This calculator converts
        mass and volume using the concentration entered. It does not determine an appropriate
        dose. Always verify the medication, formulation, concentration, and prescribed dose with
        a qualified healthcare professional before using a calculated volume.
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
