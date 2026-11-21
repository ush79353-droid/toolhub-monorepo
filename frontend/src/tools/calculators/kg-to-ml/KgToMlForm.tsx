'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  densityToKgPerM3,
  formatMeasure,
  kgPerM3ToDensity,
} from './calculation';
import { CUSTOM_SUBSTANCE_ID, findSubstance, SUBSTANCES } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  WATER_DENSITY_KG_PER_M3,
  type DensityUnit,
  type KgMlSource,
  type KgToMlFieldErrors,
  type KgToMlInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface KgToMlDraft {
  source: KgMlSource;
  substanceId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  massKg: string;
  volumeMl: string;
  densityOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const unitSelectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function draftToInput(draft: KgToMlDraft): KgToMlInput {
  return {
    source: draft.source,
    substanceId: draft.substanceId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    massKg: parseOptionalNumber(draft.massKg),
    volumeMl: parseOptionalNumber(draft.volumeMl),
  };
}

export function initialDraft(): KgToMlDraft {
  return {
    source: 'mass',
    substanceId: 'water',
    densityValue: formatMeasure(WATER_DENSITY_KG_PER_M3),
    densityUnit: 'kgPerM3',
    massKg: '',
    volumeMl: '',
    densityOpen: true,
  };
}

export function clearedDraft(draft: KgToMlDraft): KgToMlDraft {
  return { ...draft, source: 'mass', massKg: '', volumeMl: '' };
}

interface KgToMlFormProps {
  draft: KgToMlDraft;
  errors: KgToMlFieldErrors;
  onDraftChange: (draft: KgToMlDraft) => void;
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

export function KgToMlForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KgToMlFormProps) {
  const set = (patch: Partial<KgToMlDraft>) => onDraftChange({ ...draft, ...patch });
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
      densityValue: formatMeasure(item.densityKgPerM3),
      densityOpen: true,
    });
  };

  const changeDensityUnit = (nextUnit: DensityUnit) => {
    const parsed = parseOptionalNumber(draft.densityValue);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
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

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Kilograms measure mass; milliliters measure volume. Density is required; 1 kg is not always
        1000 mL. Water defaults to ≈ 1000 kg/m³. Presets are approximate and vary with temperature
        and composition.
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
              label="Ingredient"
              htmlFor="kg-ml-ingredient"
              tip="Selecting an ingredient loads an approximate density. Choose Custom density to type your own."
            >
              <select
                id="kg-ml-ingredient"
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
              htmlFor="kg-ml-density"
              tip="Edit freely for a custom value. Changing the unit preserves physical density. 1 kg/L = 1 g/mL = 1 g/cm³ = 1000 kg/m³."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="kg-ml-density"
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
          label="Weight / Mass"
          htmlFor="kg-ml-mass"
          tip="Enter a nonnegative mass in kilograms."
          error={errors.massKg}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="kg-ml-mass"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.massKg}
                placeholder="Enter mass"
                aria-invalid={Boolean(errors.massKg)}
                onChange={(event) => set({ source: 'mass', massKg: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              kg
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label="Volume"
          htmlFor="kg-ml-volume"
          tip="Enter a nonnegative volume in milliliters."
          error={errors.volumeMl}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="kg-ml-volume"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.volumeMl}
                placeholder="Enter volume"
                aria-invalid={Boolean(errors.volumeMl)}
                onChange={(event) => set({ source: 'volume', volumeMl: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              mL
            </span>
          </div>
        </FieldShell>

        <p className="text-xs text-muted-foreground">
          mL = (kg ÷ density kg/m³) × 1,000,000 · kg = (mL × density kg/m³) ÷ 1,000,000
        </p>
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
