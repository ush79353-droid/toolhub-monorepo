'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { densityToGPerMl, formatMeasure, gPerMlToDensity } from './calculation';
import {
  CUSTOM_SUBSTANCE_ID,
  DEFAULT_SUBSTANCE_ID,
  findSubstance,
  SUBSTANCES,
} from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  SALT_DENSITY_G_PER_ML,
  TEASPOON_STANDARD_OPTIONS,
  type DensityUnit,
  type MgToTeaspoonFieldErrors,
  type MgToTeaspoonInput,
  type MgTspSource,
  type TeaspoonStandard,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MgToTeaspoonDraft {
  source: MgTspSource;
  substanceId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  teaspoonStandard: TeaspoonStandard;
  milligrams: string;
  teaspoons: string;
  densityOpen: boolean;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitSelectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2.5 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring';
const unitBadgeClass =
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-accent';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function draftToInput(draft: MgToTeaspoonDraft): MgToTeaspoonInput {
  return {
    source: draft.source,
    substanceId: draft.substanceId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    teaspoonStandard: draft.teaspoonStandard,
    milligrams: parseOptionalNumber(draft.milligrams),
    teaspoons: parseOptionalNumber(draft.teaspoons),
  };
}

export function initialDraft(): MgToTeaspoonDraft {
  return {
    source: 'milligrams',
    substanceId: DEFAULT_SUBSTANCE_ID,
    densityValue: formatMeasure(gPerMlToDensity(SALT_DENSITY_G_PER_ML, 'kgPerM3')),
    densityUnit: 'kgPerM3',
    teaspoonStandard: 'us',
    milligrams: '',
    teaspoons: '',
    densityOpen: true,
  };
}

/** Clear mass/volume only; keep ingredient, density, and teaspoon standard. */
export function clearMeasureDraft(draft: MgToTeaspoonDraft): MgToTeaspoonDraft {
  return { ...draft, source: 'milligrams', milligrams: '', teaspoons: '' };
}

interface MgToTeaspoonFormProps {
  draft: MgToTeaspoonDraft;
  errors: MgToTeaspoonFieldErrors;
  onDraftChange: (draft: MgToTeaspoonDraft) => void;
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

export function MgToTeaspoonForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MgToTeaspoonFormProps) {
  const set = (patch: Partial<MgToTeaspoonDraft>) => onDraftChange({ ...draft, ...patch });
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
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Milligrams measure mass; teaspoons measure volume. Density is required — there is no
        universal mg-to-tsp factor. Default teaspoon standard is US customary (
        4.92892159375 mL). Metric teaspoons are 5 mL. Ingredient presets are approximate bulk
        densities.
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
              htmlFor="mg-tsp-ingredient"
              tip="Selecting an ingredient loads an approximate density. Choose Custom density to type your own."
            >
              <select
                id="mg-tsp-ingredient"
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
              htmlFor="mg-tsp-density"
              tip="Edit freely for a custom value. Changing the unit preserves physical density."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="mg-tsp-density"
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

            <FieldShell
              label="Teaspoon standard"
              htmlFor="mg-tsp-standard"
              tip="US and metric teaspoons are different volumes. The selected standard is used for every conversion."
            >
              <select
                id="mg-tsp-standard"
                className={selectClass}
                value={draft.teaspoonStandard}
                onChange={(event) =>
                  set({ teaspoonStandard: event.target.value as TeaspoonStandard })
                }
              >
                {TEASPOON_STANDARD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
          htmlFor="mg-tsp-mass"
          tip="Enter milligrams. Teaspoons update using the current density and teaspoon standard."
          error={errors.milligrams}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="mg-tsp-mass"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.milligrams}
                placeholder="Enter mass"
                aria-invalid={Boolean(errors.milligrams)}
                onChange={(event) =>
                  set({ source: 'milligrams', milligrams: event.target.value })
                }
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              mg
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label="Volume"
          htmlFor="mg-tsp-volume"
          tip="Enter teaspoons. Milligrams update using the current density and teaspoon standard."
          error={errors.teaspoons}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="mg-tsp-volume"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.teaspoons}
                placeholder="Calculated volume"
                aria-invalid={Boolean(errors.teaspoons)}
                onChange={(event) =>
                  set({ source: 'teaspoons', teaspoons: event.target.value })
                }
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              tsp
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
