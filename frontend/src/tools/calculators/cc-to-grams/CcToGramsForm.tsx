'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  densityToGPerCm3,
  formatMeasure,
  fromCc,
  fromGrams,
  gPerCm3ToDensity,
  toCc,
  toGrams,
} from './calculation';
import { CUSTOM_SUBSTANCE_ID, findSubstance, SUBSTANCES } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  MASS_UNIT_OPTIONS,
  VOLUME_UNIT_OPTIONS,
  type CcGramsSource,
  type CcToGramsFieldErrors,
  type CcToGramsInput,
  type DensityUnit,
  type MassUnit,
  type VolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface CcToGramsDraft {
  source: CcGramsSource;
  substanceId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  volume: string;
  mass: string;
  volumeUnit: VolumeUnit;
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

export function draftToInput(draft: CcToGramsDraft): CcToGramsInput {
  const volumeDisplay = parseOptionalNumber(draft.volume);
  const massDisplay = parseOptionalNumber(draft.mass);
  return {
    source: draft.source,
    substanceId: draft.substanceId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    volumeCc:
      volumeDisplay === null || !Number.isFinite(volumeDisplay)
        ? volumeDisplay
        : toCc(volumeDisplay, draft.volumeUnit),
    massG:
      massDisplay === null || !Number.isFinite(massDisplay)
        ? massDisplay
        : toGrams(massDisplay, draft.massUnit),
    volumeUnit: draft.volumeUnit,
    massUnit: draft.massUnit,
  };
}

export function emptyMeasureDraft(draft: CcToGramsDraft): CcToGramsDraft {
  return { ...draft, source: 'volume', volume: '', mass: '' };
}

interface CcToGramsFormProps {
  draft: CcToGramsDraft;
  errors: CcToGramsFieldErrors;
  onDraftChange: (draft: CcToGramsDraft) => void;
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

export function CcToGramsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: CcToGramsFormProps) {
  const set = (patch: Partial<CcToGramsDraft>) => onDraftChange({ ...draft, ...patch });
  const selected = findSubstance(draft.substanceId);

  const applySubstance = (substanceId: string) => {
    if (substanceId === CUSTOM_SUBSTANCE_ID) {
      set({ substanceId, densityValue: '', densityOpen: true });
      return;
    }
    const item = findSubstance(substanceId);
    if (!item) {
      set({ substanceId });
      return;
    }
    set({
      substanceId,
      densityUnit: 'gPerCm3',
      densityValue: formatMeasure(gPerCm3ToDensity(item.densityGPerCm3, 'gPerCm3')),
    });
  };

  const changeDensityUnit = (nextUnit: DensityUnit) => {
    const parsed = parseOptionalNumber(draft.densityValue);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
      set({ densityUnit: nextUnit });
      return;
    }
    const canonical = densityToGPerCm3(parsed, draft.densityUnit);
    set({
      densityUnit: nextUnit,
      densityValue: formatMeasure(gPerCm3ToDensity(canonical, nextUnit)),
      substanceId: CUSTOM_SUBSTANCE_ID,
    });
  };

  const changeVolumeUnit = (nextUnit: VolumeUnit) => {
    const parsed = parseOptionalNumber(draft.volume);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ volumeUnit: nextUnit });
      return;
    }
    const cc = toCc(parsed, draft.volumeUnit);
    set({ volumeUnit: nextUnit, volume: formatMeasure(fromCc(cc, nextUnit)) });
  };

  const changeMassUnit = (nextUnit: MassUnit) => {
    const parsed = parseOptionalNumber(draft.mass);
    if (parsed === null || !Number.isFinite(parsed)) {
      set({ massUnit: nextUnit });
      return;
    }
    const g = toGrams(parsed, draft.massUnit);
    set({ massUnit: nextUnit, mass: formatMeasure(fromGrams(g, nextUnit)) });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Cubic centimeters measure volume; grams measure mass. Density is required. Water defaults to
        a convenient ≈ 1 g/cm³ near 4 °C — not exact at every temperature. Presets are illustrative.
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
              label="Ingredient"
              htmlFor="cc-g-ingredient"
              tip="Selecting an ingredient loads an approximate density. Choose Custom Density to type your own."
            >
              <select
                id="cc-g-ingredient"
                className={selectClass}
                value={draft.substanceId}
                onChange={(event) => applySubstance(event.target.value)}
              >
                {SUBSTANCES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
                <option value={CUSTOM_SUBSTANCE_ID}>Custom Density</option>
              </select>
            </FieldShell>

            <FieldShell
              label="Density"
              htmlFor="cc-g-density"
              tip="Edit freely for a custom value. Changing the unit preserves physical density."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="cc-g-density"
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
            </FieldShell>

            {selected?.conditions ? (
              <p className="text-xs text-muted-foreground">{selected.conditions}</p>
            ) : draft.substanceId === CUSTOM_SUBSTANCE_ID ? (
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
          htmlFor="cc-g-volume"
          tip="Enter volume. Mass updates using the current density. Unit changes preserve physical volume."
          error={errors.volumeCc}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="cc-g-volume"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.volume}
                placeholder="Enter volume"
                aria-invalid={Boolean(errors.volumeCc)}
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
          label="Weight / Mass"
          htmlFor="cc-g-mass"
          tip="Enter mass. Volume updates using the current density. Unit changes preserve physical mass."
          error={errors.massG}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="cc-g-mass"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.mass}
                placeholder="Enter mass"
                aria-invalid={Boolean(errors.massG)}
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
