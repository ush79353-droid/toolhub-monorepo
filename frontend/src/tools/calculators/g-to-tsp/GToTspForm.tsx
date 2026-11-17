'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  densityToGPerMl,
  formatMeasure,
  fromGrams,
  fromMl,
  gPerMlToDensity,
  toGrams,
  toMl,
} from './calculation';
import { CUSTOM_SUBSTANCE_ID, findSubstance, SUBSTANCES } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  MASS_UNIT_OPTIONS,
  SALT_DENSITY_KG_PER_M3,
  VOLUME_UNIT_OPTIONS,
  type DensityUnit,
  type GToTspFieldErrors,
  type GToTspInput,
  type GTspSource,
  type MassUnit,
  type VolumeUnit,
} from './types';
import { parseOptionalNumber } from './validation';

export interface GToTspDraft {
  source: GTspSource;
  substanceId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  mass: string;
  massUnit: MassUnit;
  volume: string;
  volumeUnit: VolumeUnit;
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

export function draftToInput(draft: GToTspDraft): GToTspInput {
  return {
    source: draft.source,
    substanceId: draft.substanceId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    mass: parseOptionalNumber(draft.mass),
    massUnit: draft.massUnit,
    volume: parseOptionalNumber(draft.volume),
    volumeUnit: draft.volumeUnit,
  };
}

export function initialDraft(): GToTspDraft {
  return {
    source: 'mass',
    substanceId: 'salt',
    densityValue: formatMeasure(SALT_DENSITY_KG_PER_M3),
    densityUnit: 'kgPerM3',
    mass: '',
    massUnit: 'g',
    volume: '',
    volumeUnit: 'usTsp',
    densityOpen: true,
  };
}

interface GToTspFormProps {
  draft: GToTspDraft;
  errors: GToTspFieldErrors;
  onDraftChange: (draft: GToTspDraft) => void;
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

export function GToTspForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: GToTspFormProps) {
  const set = (patch: Partial<GToTspDraft>) => onDraftChange({ ...draft, ...patch });
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
      substanceId: CUSTOM_SUBSTANCE_ID,
    });
  };

  const changeMassUnit = (nextUnit: MassUnit) => {
    const parsed = parseOptionalNumber(draft.mass);
    if (parsed === null || !Number.isFinite(parsed) || parsed < 0) {
      set({ massUnit: nextUnit });
      return;
    }
    const grams = toGrams(parsed, draft.massUnit);
    set({ massUnit: nextUnit, mass: formatMeasure(fromGrams(grams, nextUnit)) });
  };

  const changeVolumeUnit = (nextUnit: VolumeUnit) => {
    const parsed = parseOptionalNumber(draft.volume);
    if (parsed === null || !Number.isFinite(parsed) || parsed < 0) {
      set({ volumeUnit: nextUnit });
      return;
    }
    const ml = toMl(parsed, draft.volumeUnit);
    set({ volumeUnit: nextUnit, volume: formatMeasure(fromMl(ml, nextUnit)) });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Grams (g) measure mass; teaspoons measure volume. Density is required — and US tsp ≠ metric
        tsp (5 mL). Salt defaults to ≈ 1217 kg/m³ (1.217 g/mL). Do not confuse grams with grains
        (gr). Presets are approximate.
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
              htmlFor="g-tsp-ingredient"
              tip="Selecting an ingredient loads an approximate density. Mass and volume entries are kept; results recalculate."
            >
              <select
                id="g-tsp-ingredient"
                className={selectClass}
                value={draft.substanceId}
                onChange={(event) => applySubstance(event.target.value)}
              >
                {SUBSTANCES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
                <option value={CUSTOM_SUBSTANCE_ID}>Custom density</option>
              </select>
            </FieldShell>

            <FieldShell
              label="Density"
              htmlFor="g-tsp-density"
              tip="Edit freely for a custom value. Changing the unit preserves physical density."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="g-tsp-density"
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
          label="Weight/mass"
          htmlFor="g-tsp-mass"
          tip="Enter mass in grams (g), not grains (gr). Volume updates using density."
          error={errors.mass}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="g-tsp-mass"
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

        <FieldShell
          label="Volume"
          htmlFor="g-tsp-volume"
          tip="Default is US customary teaspoon (≈ 4.92892 mL), not the metric 5 mL teaspoon."
          error={errors.volume}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="g-tsp-volume"
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
