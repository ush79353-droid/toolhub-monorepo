'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { densityToKgPerM3, formatMeasure, kgPerM3ToDensity } from './calculation';
import { CUSTOM_SUBSTANCE_ID, findSubstance, SUBSTANCES } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  type DensityUnit,
  type GalGramsSource,
  type GalToGramsFieldErrors,
  type GalToGramsInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface GalToGramsDraft {
  source: GalGramsSource;
  substanceId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  gallons: string;
  grams: string;
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
  'flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground';
const sectionClass = 'space-y-3 rounded-xl border border-border bg-muted/15 p-3.5 sm:p-4';

export function draftToInput(draft: GalToGramsDraft): GalToGramsInput {
  return {
    source: draft.source,
    substanceId: draft.substanceId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    gallons: parseOptionalNumber(draft.gallons),
    grams: parseOptionalNumber(draft.grams),
  };
}

export function emptyMeasureDraft(draft: GalToGramsDraft): GalToGramsDraft {
  return { ...draft, source: 'volume', gallons: '', grams: '' };
}

interface GalToGramsFormProps {
  draft: GalToGramsDraft;
  errors: GalToGramsFieldErrors;
  onDraftChange: (draft: GalToGramsDraft) => void;
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

export function GalToGramsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: GalToGramsFormProps) {
  const set = (patch: Partial<GalToGramsDraft>) => onDraftChange({ ...draft, ...patch });
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
      densityValue: formatMeasure(kgPerM3ToDensity(item.densityKgPerM3, 'kgPerM3')),
    });
  };

  const changeDensityUnit = (nextUnit: DensityUnit) => {
    const parsed = parseOptionalNumber(draft.densityValue);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
      set({ densityUnit: nextUnit });
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
 Gallons measure volume; grams measure mass. Density is required; there is no universal
        gallons-to-grams factor. Water defaults to ≈ 1000 kg/m³ near 4 °C. Presets are approximate.
        This calculator uses US liquid gallons.
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
              label="Substance"
              htmlFor="gal-g-substance"
              tip="Selecting a substance loads an approximate density. Choose Custom density to type your own."
            >
              <select
                id="gal-g-substance"
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
              htmlFor="gal-g-density"
              tip="Edit freely for a custom value. Changing the unit preserves physical density."
              error={errors.densityValue}
            >
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="gal-g-density"
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
          htmlFor="gal-g-gallons"
          tip="Enter volume in US liquid gallons. Grams update using the current density."
          error={errors.gallons}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="gal-g-gallons"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.gallons}
                placeholder="Enter gallons"
                aria-invalid={Boolean(errors.gallons)}
                onChange={(event) => set({ source: 'volume', gallons: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              US gal
            </span>
          </div>
        </FieldShell>

        <FieldShell
          label="Weight / Mass"
          htmlFor="gal-g-grams"
          tip="Enter mass in grams. Gallons update using the current density. Grams of mass are not fluid ounces."
          error={errors.grams}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="gal-g-grams"
                inputMode="decimal"
                autoComplete="off"
                className={inputClass}
                value={draft.grams}
                placeholder="Enter grams"
                aria-invalid={Boolean(errors.grams)}
                onChange={(event) => set({ source: 'mass', grams: event.target.value })}
              />
            </div>
            <span className={unitBadgeClass} aria-hidden="true">
              g
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
