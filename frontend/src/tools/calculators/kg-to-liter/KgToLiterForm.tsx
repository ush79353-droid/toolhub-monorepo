'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  densityToKgPerL,
  formatMeasure,
  kgPerLToDensity,
} from './calculation';
import { CUSTOM_SUBSTANCE_ID, findSubstance, SUBSTANCES } from './substances';
import {
  DENSITY_UNIT_OPTIONS,
  WATER_DENSITY_KG_PER_L,
  type DensityUnit,
  type KgLiterSource,
  type KgToLiterFieldErrors,
  type KgToLiterInput,
} from './types';
import { parseOptionalNumber } from './validation';

export interface KgToLiterDraft {
  source: KgLiterSource;
  substanceId: string;
  densityValue: string;
  densityUnit: DensityUnit;
  massKg: string;
  volumeL: string;
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

export function draftToInput(draft: KgToLiterDraft): KgToLiterInput {
  return {
    source: draft.source,
    substanceId: draft.substanceId,
    densityValue: parseOptionalNumber(draft.densityValue),
    densityUnit: draft.densityUnit,
    massKg: parseOptionalNumber(draft.massKg),
    volumeL: parseOptionalNumber(draft.volumeL),
  };
}

export function initialDraft(): KgToLiterDraft {
  return {
    source: 'mass',
    substanceId: 'fresh-water',
    densityValue: formatMeasure(WATER_DENSITY_KG_PER_L),
    densityUnit: 'kgPerL',
    massKg: '',
    volumeL: '',
  };
}

export function clearedDraft(draft: KgToLiterDraft): KgToLiterDraft {
  return { ...draft, source: 'mass', massKg: '', volumeL: '' };
}

interface KgToLiterFormProps {
  draft: KgToLiterDraft;
  errors: KgToLiterFieldErrors;
  onDraftChange: (draft: KgToLiterDraft) => void;
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

export function KgToLiterForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: KgToLiterFormProps) {
  const set = (patch: Partial<KgToLiterDraft>) => onDraftChange({ ...draft, ...patch });
  const selected = findSubstance(draft.substanceId);
  const isCustom = draft.substanceId === CUSTOM_SUBSTANCE_ID;

  const applySubstance = (substanceId: string) => {
    if (substanceId === CUSTOM_SUBSTANCE_ID) {
      set({ substanceId, densityValue: '' });
      return;
    }
    const item = findSubstance(substanceId);
    if (!item) {
      set({ substanceId });
      return;
    }
    set({
      substanceId,
      densityUnit: 'kgPerL',
      densityValue: formatMeasure(item.densityKgPerL),
    });
  };

  const changeDensityUnit = (nextUnit: DensityUnit) => {
    const parsed = parseOptionalNumber(draft.densityValue);
    if (parsed === null || !Number.isFinite(parsed) || parsed <= 0) {
      set({ densityUnit: nextUnit, substanceId: CUSTOM_SUBSTANCE_ID });
      return;
    }
    const canonical = densityToKgPerL(parsed, draft.densityUnit);
    set({
      densityUnit: nextUnit,
      densityValue: formatMeasure(kgPerLToDensity(canonical, nextUnit)),
      substanceId: CUSTOM_SUBSTANCE_ID,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Kilograms measure mass; liters measure volume. Density is required; 1 kg is not always 1 L.
        Fresh water defaults to a simplifying ≈ 1 kg/L reference. Presets are approximate and vary
        with temperature and composition.
      </div>

      <FieldShell
        label="Liquid"
        htmlFor="kg-l-liquid"
        tip="Selecting a liquid loads an approximate density. Choose Custom density to type your own."
      >
        <select
          id="kg-l-liquid"
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

      {isCustom ? (
        <FieldShell
          label="Density"
          htmlFor="kg-l-density"
          tip="Positive density required. 1 kg/L = 1 g/mL = 1 g/cm³ = 1000 kg/m³."
          error={errors.densityValue}
        >
          <div className="flex gap-2">
            <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
              <input
                id="kg-l-density"
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
      ) : null}

      {selected?.conditions ? (
        <p className="text-xs text-muted-foreground">
 ≈ {formatMeasure(selected.densityKgPerL)} kg/L; {selected.conditions}
        </p>
      ) : isCustom ? (
        <p className="text-xs text-muted-foreground">
          Enter any positive density for your substance and conditions.
        </p>
      ) : null}

      <FieldShell
        label="Weight"
        htmlFor="kg-l-mass"
        tip="Enter a nonnegative mass in kilograms."
        error={errors.massKg}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kg-l-mass"
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
        htmlFor="kg-l-volume"
        tip="Enter a nonnegative volume in liters."
        error={errors.volumeL}
      >
        <div className="flex gap-2">
          <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
            <input
              id="kg-l-volume"
              inputMode="decimal"
              autoComplete="off"
              className={inputClass}
              value={draft.volumeL}
              placeholder="Enter volume"
              aria-invalid={Boolean(errors.volumeL)}
              onChange={(event) => set({ source: 'volume', volumeL: event.target.value })}
            />
          </div>
          <span className={unitBadgeClass} aria-hidden="true">
            L
          </span>
        </div>
      </FieldShell>

      <p className="text-xs text-muted-foreground">L = kg ÷ density (kg/L) · kg = L × density (kg/L)</p>

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
