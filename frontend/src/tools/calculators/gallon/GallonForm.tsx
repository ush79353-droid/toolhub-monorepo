'use client';

import type { FormEvent, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import { formatMeasure } from './calculation';
import {
  APPROX_WATER_DENSITY_KG_PER_L,
  FIELD_LABELS,
  FIELD_UNIT_OPTIONS,
  VOLUME_UNIT_BY_ID,
  WATER_VOLUME_UNIT_OPTIONS,
  type CalcMode,
  type VolumeFieldErrors,
  type VolumeFieldId,
  type VolumeUnitId,
  type WaterFieldErrors,
  type WaterSource,
} from './types';

export interface GallonDraft {
  mode: CalcMode;
  texts: [string, string, string, string, string, string, string, string];
  units: [
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
    VolumeUnitId,
  ];
  activeField: VolumeFieldId | null;
  waterSource: WaterSource;
  waterVolume: string;
  waterVolumeUnit: VolumeUnitId;
  waterDensity: string;
  waterMassKg: string;
  waterMassLb: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/50 px-2 text-sm font-medium text-accent outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-w-[6.5rem]';

interface GallonFormProps {
  draft: GallonDraft;
  volumeErrors: VolumeFieldErrors;
  waterErrors: WaterFieldErrors;
  onDraftChange: (draft: GallonDraft) => void;
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

export function GallonForm({
  draft,
  volumeErrors,
  waterErrors,
  onDraftChange,
  onSubmit,
  onReset,
}: GallonFormProps) {
  const set = (patch: Partial<GallonDraft>) => onDraftChange({ ...draft, ...patch });

  const setText = (field: VolumeFieldId, text: string) => {
    const texts = [...draft.texts] as GallonDraft['texts'];
    texts[field] = text;
    set({ texts, activeField: field });
  };

  const setUnit = (field: VolumeFieldId, unit: VolumeUnitId) => {
    const units = [...draft.units] as GallonDraft['units'];
    units[field] = unit;
    set({ units, activeField: field });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <fieldset>
        <legend className={labelClass}>I want to convert</legend>
        <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
          {(
            [
              { value: 'volume' as const, label: 'Volume converter' },
              {
                value: 'waterWeight' as const,
                label: 'Water gallons to weight converter',
              },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={`flex h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm ${
                draft.mode === opt.value
                  ? 'border-primary bg-primary/5 text-accent'
                  : 'border-border'
              }`}
            >
              <input
                type="radio"
                name="gallon-mode"
                checked={draft.mode === opt.value}
                onChange={() => set({ mode: opt.value })}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </fieldset>

      {draft.mode === 'volume' ? (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Enter a value in any field. All others update from the same physical volume.
            Switching a unit preserves that volume.
          </p>
          {([0, 1, 2, 3, 4, 5, 6, 7] as const).map((field) => {
            const id = `gallon-vol-${field}`;
            const error = volumeErrors[field];
            const options = FIELD_UNIT_OPTIONS[field]!;
            return (
              <div key={field} className="space-y-1.5">
                <label htmlFor={id} className={labelClass}>
                  {FIELD_LABELS[field]}
                  <InfoTooltip
                    label={FIELD_LABELS[field]!}
                    text="US liquid, Imperial, and US dry gallons are different volumes. Cooking cups also differ by standard."
                  />
                </label>
                <div className="flex gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                    <input
                      id={id}
                      inputMode="decimal"
                      className={inputClass}
                      value={draft.texts[field]}
                      placeholder="Enter volume"
                      aria-invalid={Boolean(error)}
                      onChange={(event) => setText(field, event.target.value)}
                    />
                  </div>
                  <select
                    className={selectClass}
                    value={draft.units[field]}
                    aria-label={`${FIELD_LABELS[field]} unit`}
                    onChange={(event) =>
                      setUnit(field, event.target.value as VolumeUnitId)
                    }
                  >
                    {options.map((unitId) => (
                      <option key={unitId} value={unitId}>
                        {VOLUME_UNIT_BY_ID[unitId].symbol}
                      </option>
                    ))}
                  </select>
                </div>
                {error ? (
                  <p className="text-xs text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-xs leading-relaxed text-amber-950/90">
            Gallons measure volume; kilograms and pounds measure mass. Water weight
            requires density. Default density 1 kg/L is an approximate assumption—not
            exact at every temperature.
          </div>

          <FieldShell
            label="Water volume"
            htmlFor="gallon-water-vol"
            tip="Select US liquid, Imperial, or US dry gallons, or liters."
            error={waterErrors.volume}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="gallon-water-vol"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.waterVolume}
                  placeholder="Enter volume"
                  aria-invalid={Boolean(waterErrors.volume)}
                  onChange={(event) =>
                    set({
                      waterSource: 'volume',
                      waterVolume: event.target.value,
                    })
                  }
                />
              </div>
              <select
                className={selectClass}
                aria-label="Water volume unit"
                value={draft.waterVolumeUnit}
                onChange={(event) =>
                  set({
                    waterVolumeUnit: event.target.value as VolumeUnitId,
                    waterSource: 'volume',
                  })
                }
              >
                {WATER_VOLUME_UNIT_OPTIONS.map((unitId) => (
                  <option key={unitId} value={unitId}>
                    {VOLUME_UNIT_BY_ID[unitId].symbol}
                  </option>
                ))}
              </select>
            </div>
          </FieldShell>

          <FieldShell
            label="Water density"
            htmlFor="gallon-water-density"
            tip={`Default ${formatMeasure(APPROX_WATER_DENSITY_KG_PER_L)} kg/L is approximate. Enter a measured density when available.`}
            error={waterErrors.densityKgPerL}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="gallon-water-density"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.waterDensity}
                  placeholder="1"
                  aria-invalid={Boolean(waterErrors.densityKgPerL)}
                  onChange={(event) => set({ waterDensity: event.target.value })}
                />
              </div>
              <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground">
                kg/L
              </span>
            </div>
          </FieldShell>

          <FieldShell
            label="Water mass (kg)"
            htmlFor="gallon-water-kg"
            tip="Editing mass recalculates volume using the current density."
            error={waterErrors.massKg}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="gallon-water-kg"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.waterMassKg}
                  placeholder="Enter mass"
                  aria-invalid={Boolean(waterErrors.massKg)}
                  onChange={(event) =>
                    set({
                      waterSource: 'massKg',
                      waterMassKg: event.target.value,
                    })
                  }
                />
              </div>
              <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground">
                kg
              </span>
            </div>
          </FieldShell>

          <FieldShell
            label="Water mass (lb)"
            htmlFor="gallon-water-lb"
            tip="Exact: 1 lb = 0.45359237 kg."
            error={waterErrors.massLb}
          >
            <div className="flex gap-2">
              <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                <input
                  id="gallon-water-lb"
                  inputMode="decimal"
                  className={inputClass}
                  value={draft.waterMassLb}
                  placeholder="Enter mass"
                  aria-invalid={Boolean(waterErrors.massLb)}
                  onChange={(event) =>
                    set({
                      waterSource: 'massLb',
                      waterMassLb: event.target.value,
                    })
                  }
                />
              </div>
              <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-3 text-sm font-medium text-muted-foreground">
                lb
              </span>
            </div>
          </FieldShell>
        </div>
      )}

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
