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
  TABLESPOON_STANDARD_OPTIONS,
  type DensityUnit,
  type MgTbspSource,
  type MgToTablespoonFieldErrors,
  type MgToTablespoonInput,
  type TablespoonStandard,
} from './types';
import { parseOptionalNumber } from './validation';

export interface MgToTablespoonDraft {
  source: MgTbspSource;
  substanceId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  tablespoonStandard: TablespoonStandard;
  milligrams: string;
  tablespoons: string;
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

export function draftToInput(draft: MgToTablespoonDraft): MgToTablespoonInput {
  return {
    source: draft.source,
    substanceId: draft.substanceId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    tablespoonStandard: draft.tablespoonStandard,
    milligrams: parseOptionalNumber(draft.milligrams),
    tablespoons: parseOptionalNumber(draft.tablespoons),
  };
}

export function initialDraft(): MgToTablespoonDraft {
  return {
    source: 'milligrams',
    substanceId: DEFAULT_SUBSTANCE_ID,
    densityValue: formatMeasure(gPerMlToDensity(SALT_DENSITY_G_PER_ML, 'kgPerM3')),
    densityUnit: 'kgPerM3',
    tablespoonStandard: 'us',
    milligrams: '',
    tablespoons: '',
    densityOpen: true,
  };
}

/** Clear mass/volume only; keep ingredient, density, and tablespoon standard. */
export function clearMeasureDraft(draft: MgToTablespoonDraft): MgToTablespoonDraft {
  return { ...draft, source: 'milligrams', milligrams: '', tablespoons: '' };
}

interface MgToTablespoonFormProps {
  draft: MgToTablespoonDraft;
  errors: MgToTablespoonFieldErrors;
  onDraftChange: (draft: MgToTablespoonDraft) => void;
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

export function MgToTablespoonForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: MgToTablespoonFormProps) {
  const set = (patch: Partial<MgToTablespoonDraft>) => onDraftChange({ ...draft, ...patch });
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
 Milligrams measure mass; tablespoons measure volume. Density is required; there is no
        universal mg-to-tbsp factor. Default tablespoon standard is US customary (
        14.78676478125 mL). Ingredient presets are approximate bulk densities.
      </div>

      <div className={sectionClass}>
        <button
          type="button"
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-accent"
          onClick={() => set({ densityOpen: !draft.densityOpen })}
          aria-expanded={draft.densityOpen}
        >
          Lookup density or enter your own
          {draft.densityOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {draft.densityOpen ? (
          <div className="space-y-3 pt-1">
            <FieldShell
              label="Ingredient"
              htmlFor="mg-tbsp-ingredient"
              tip="Selecting an ingredient loads an approximate density. Choose Custom density to type your own."
            >
              <select
                id="mg-tbsp-ingredient"
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
              htmlFor="mg-tbsp-density"
              tip="Edit freely for a custom value. Changing the unit preserves physical density."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="mg-tbsp-density"
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
              label="Tablespoon standard"
              htmlFor="mg-tbsp-standard"
              tip="US, metric, and Australian tablespoons are different volumes. The selected standard is used for every conversion."
            >
              <select
                id="mg-tbsp-standard"
                className={selectClass}
                value={draft.tablespoonStandard}
                onChange={(event) =>
                  set({ tablespoonStandard: event.target.value as TablespoonStandard })
                }
              >
                {TABLESPOON_STANDARD_OPTIONS.map((opt) => (
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
          htmlFor="mg-tbsp-mass"
          tip="Enter milligrams. Tablespoons update using the current density and tablespoon standard."
          error={errors.milligrams}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="mg-tbsp-mass"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.milligrams}
                placeholder="Enter milligrams"
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
          htmlFor="mg-tbsp-volume"
          tip="Enter tablespoons. Milligrams update using the current density and tablespoon standard."
          error={errors.tablespoons}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="mg-tbsp-volume"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.tablespoons}
                placeholder="Calculated tablespoons"
                aria-invalid={Boolean(errors.tablespoons)}
                onChange={(event) =>
                  set({ source: 'tablespoons', tablespoons: event.target.value })
                }
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              tbsp
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
