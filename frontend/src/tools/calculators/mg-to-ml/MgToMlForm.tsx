'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  densityToMgPerMl,
  formatMeasure,
  mgPerMlToDensity,
} from './calculation';
import {
  DENSITY_UNIT_OPTIONS,
  SUBSTANCE_OPTIONS,
  WATER_DENSITY_MG_PER_ML,
  type CalcMode,
  type ConcentrationFormat,
  type DensityUnit,
  type MgToMlFieldErrors,
  type MgToMlInput,
  type OtherUnitRow,
  type SubstanceId,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MgToMlDraft {
  mode: CalcMode;
  source: 'mass' | 'volume';
  massMg: string;
  volumeMl: string;
  substance: SubstanceId;
  densityValue: string;
  densityUnit: DensityUnit;
  concentrationFormat: ConcentrationFormat;
  concentrationMgPerMl: string;
  labelMassMg: string;
  labelVolumeMl: string;
  moreOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';

export function inputToDraft(input: MgToMlInput, moreOpen = false): MgToMlDraft {
  return {
    mode: input.mode,
    source: input.source,
    massMg: input.massMg === null ? '' : formatMeasure(input.massMg),
    volumeMl: input.volumeMl === null ? '' : formatMeasure(input.volumeMl),
    substance: input.substance,
    densityValue: input.densityValue === null ? '' : formatMeasure(input.densityValue),
    densityUnit: input.densityUnit,
    concentrationFormat: input.concentrationFormat,
    concentrationMgPerMl:
      input.concentrationMgPerMl === null ? '' : formatMeasure(input.concentrationMgPerMl),
    labelMassMg: input.labelMassMg === null ? '' : formatMeasure(input.labelMassMg),
    labelVolumeMl: input.labelVolumeMl === null ? '' : formatMeasure(input.labelVolumeMl),
    moreOpen,
  };
}

export function draftToInput(draft: MgToMlDraft): MgToMlInput {
  return {
    mode: draft.mode,
    source: draft.source,
    massMg: parseOptionalNumber(draft.massMg),
    volumeMl: parseOptionalNumber(draft.volumeMl),
    substance: draft.substance,
    densityValue:
      draft.substance === 'water'
        ? WATER_DENSITY_MG_PER_ML
        : parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    concentrationFormat: draft.concentrationFormat,
    concentrationMgPerMl: parseOptionalNumber(draft.concentrationMgPerMl),
    labelMassMg: parseOptionalNumber(draft.labelMassMg),
    labelVolumeMl: parseOptionalNumber(draft.labelVolumeMl),
  };
}

interface MgToMlFormProps {
  draft: MgToMlDraft;
  errors: MgToMlFieldErrors;
  otherMassUnits: readonly OtherUnitRow[] | null;
  otherVolumeUnits: readonly OtherUnitRow[] | null;
  onDraftChange: (draft: MgToMlDraft) => void;
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

export function MgToMlForm({
  draft,
  errors,
  otherMassUnits,
  otherVolumeUnits,
  onDraftChange,
  onSubmit,
  onReset,
}: MgToMlFormProps) {
  const set = (patch: Partial<MgToMlDraft>) => onDraftChange({ ...draft, ...patch });

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

  const massLabel =
    draft.mode === 'medication' ? 'Mass of active ingredient' : 'Mass';
  const volumeLabel = draft.mode === 'medication' ? 'Liquid volume' : 'Volume';

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FieldShell
        label="Conversion mode"
        htmlFor="mg-ml-mode"
        tip="Density converts substance mass and volume. Medication concentration converts active ingredient mass using a labeled mg/mL strength—not density."
      >
        <select
          id="mg-ml-mode"
          className={`${selectClass} w-full`}
          value={draft.mode}
          onChange={(event) =>
            set({
              mode: event.target.value as CalcMode,
              // Isolate incompatible factors when switching modes.
              source: 'mass',
            })
          }
        >
          <option value="medication">Medication concentration conversion</option>
          <option value="density">Density-based conversion</option>
        </select>
      </FieldShell>

      <div className="rounded-xl border border-border bg-muted/20 p-3.5 sm:p-4">
        <h3 className="text-sm font-semibold text-accent">
          {draft.mode === 'medication'
            ? 'Select liquid / medication'
            : 'Select substance'}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {draft.mode === 'medication'
            ? 'Enter the labeled concentration. No product strength is assumed from a drug name.'
            : 'Water uses an approximate 1 g/mL reference. Custom substances need a known density.'}
        </p>

        <div className="mt-3 space-y-3">
          {draft.mode === 'density' ? (
            <>
              <FieldShell label="Substance" htmlFor="mg-ml-substance">
                <select
                  id="mg-ml-substance"
                  className={`${selectClass} w-full`}
                  value={draft.substance}
                  onChange={(event) => {
                    const substance = event.target.value as SubstanceId;
                    set({
                      substance,
                      densityValue:
                        substance === 'water'
                          ? formatMeasure(WATER_DENSITY_MG_PER_ML)
                          : '',
                      densityUnit: substance === 'water' ? 'mgPerMl' : draft.densityUnit,
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
                htmlFor="mg-ml-density"
                tip="Canonical factor is mg/mL. Changing the unit preserves physical density."
                error={errors.densityValue}
              >
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id="mg-ml-density"
                      inputMode="decimal"
                      className={inputClass}
                      value={
                        draft.substance === 'water'
                          ? formatMeasure(WATER_DENSITY_MG_PER_ML)
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
                    value={draft.densityUnit}
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
          ) : (
            <>
              <FieldShell
                label="Medication"
                htmlFor="mg-ml-med"
                tip="Only custom concentration is available. Concentrations are never invented from a drug name."
              >
                <select
                  id="mg-ml-med"
                  className={`${selectClass} w-full`}
                  value="custom"
                  disabled
                >
                  <option value="custom">Custom medication / concentration</option>
                </select>
              </FieldShell>

              <FieldShell
                label="Concentration format"
                htmlFor="mg-ml-conc-format"
              >
                <select
                  id="mg-ml-conc-format"
                  className={`${selectClass} w-full`}
                  value={draft.concentrationFormat}
                  onChange={(event) =>
                    set({
                      concentrationFormat: event.target.value as ConcentrationFormat,
                    })
                  }
                >
                  <option value="mgPerMl">mg/mL</option>
                  <option value="mgPerVolume">mg per stated mL (e.g. mg per 5 mL)</option>
                </select>
              </FieldShell>

              {draft.concentrationFormat === 'mgPerMl' ? (
                <FieldShell
                  label="Concentration"
                  htmlFor="mg-ml-conc"
                  tip="Active ingredient milligrams per milliliter of preparation."
                  error={errors.concentrationMgPerMl}
                >
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                      <input
                        id="mg-ml-conc"
                        inputMode="decimal"
                        className={inputClass}
                        value={draft.concentrationMgPerMl}
                        placeholder="Enter concentration"
                        aria-invalid={Boolean(errors.concentrationMgPerMl)}
                        onChange={(event) =>
                          set({ concentrationMgPerMl: event.target.value })
                        }
                      />
                    </div>
                    <span className={unitBadgeClass} aria-hidden="true">
                      mg/mL
                    </span>
                  </div>
                </FieldShell>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <FieldShell
                    label="Labeled ingredient mass"
                    htmlFor="mg-ml-label-mass"
                    error={errors.labelMassMg}
                  >
                    <div className="flex gap-2">
                      <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                        <input
                          id="mg-ml-label-mass"
                          inputMode="decimal"
                          className={inputClass}
                          value={draft.labelMassMg}
                          placeholder="e.g. 100"
                          aria-invalid={Boolean(errors.labelMassMg)}
                          onChange={(event) =>
                            set({ labelMassMg: event.target.value })
                          }
                        />
                      </div>
                      <span className={unitBadgeClass} aria-hidden="true">
                        mg
                      </span>
                    </div>
                  </FieldShell>
                  <FieldShell
                    label="Labeled liquid volume"
                    htmlFor="mg-ml-label-vol"
                    tip="Concentration = labeled mg ÷ labeled mL."
                    error={errors.labelVolumeMl}
                  >
                    <div className="flex gap-2">
                      <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                        <input
                          id="mg-ml-label-vol"
                          inputMode="decimal"
                          className={inputClass}
                          value={draft.labelVolumeMl}
                          placeholder="e.g. 5"
                          aria-invalid={Boolean(errors.labelVolumeMl)}
                          onChange={(event) =>
                            set({ labelVolumeMl: event.target.value })
                          }
                        />
                      </div>
                      <span className={unitBadgeClass} aria-hidden="true">
                        mL
                      </span>
                    </div>
                  </FieldShell>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-accent">Enter one value</h3>
        <FieldShell
          label={massLabel}
          htmlFor="mg-ml-mass"
          tip="Editing mass recalculates volume using the active density or concentration."
          error={errors.massMg}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="mg-ml-mass"
                inputMode="decimal"
                className={inputClass}
                value={draft.massMg}
                placeholder="Enter mass"
                aria-invalid={Boolean(errors.massMg)}
                onChange={(event) =>
                  set({ source: 'mass', massMg: event.target.value })
                }
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              mg
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label={volumeLabel}
          htmlFor="mg-ml-volume"
          tip="Editing volume recalculates mass using the active density or concentration."
          error={errors.volumeMl}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="mg-ml-volume"
                inputMode="decimal"
                className={inputClass}
                value={draft.volumeMl}
                placeholder="Enter volume"
                aria-invalid={Boolean(errors.volumeMl)}
                onChange={(event) =>
                  set({ source: 'volume', volumeMl: event.target.value })
                }
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              mL
            </span>
          </div>
        </FieldShell>
      </div>

      <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90">
        This calculator performs unit conversions only. It does not determine an
        appropriate medication dose. Always verify the product&apos;s labeled
        concentration and instructions with a qualified healthcare professional.
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
                  Enter a valid conversion to see mcg, g, and kg.
                </p>
              )}
            </div>
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
                  Enter a valid conversion to see µL, cL, and L.
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
