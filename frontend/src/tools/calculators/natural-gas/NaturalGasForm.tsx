'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_ENERGY_UNIT,
  DEFAULT_HEATING_BTU_PER_FT3,
  DEFAULT_HEATING_UNIT,
  DEFAULT_VOLUME,
  DEFAULT_VOLUME_UNIT,
  ENERGY_UNIT_DEFS,
  ENERGY_UNITS,
  HEATING_UNIT_DEFS,
  HEATING_UNITS,
  VOLUME_UNIT_DEFS,
  VOLUME_UNITS,
  type EnergyUnit,
  type HeatingUnit,
  type NaturalGasField,
  type NaturalGasFieldErrors,
  type VolumeUnit,
} from './types';
import { formatAmount, fromBtuPerFt3, volumeToEnergy } from './calculation';

export interface NaturalGasDraft {
  volumeUnit: VolumeUnit;
  energyUnit: EnergyUnit;
  heatingUnit: HeatingUnit;
  volume: string;
  energy: string;
  heating: string;
  advancedOpen: boolean;
  activeField: NaturalGasField | null;
  primaryField: 'volume' | 'energy';
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring';

export function defaultDraft(): NaturalGasDraft {
  const heating = DEFAULT_HEATING_BTU_PER_FT3;
  const energy = volumeToEnergy(
    DEFAULT_VOLUME,
    DEFAULT_VOLUME_UNIT,
    DEFAULT_ENERGY_UNIT,
    heating,
  );
  return {
    volumeUnit: DEFAULT_VOLUME_UNIT,
    energyUnit: DEFAULT_ENERGY_UNIT,
    heatingUnit: DEFAULT_HEATING_UNIT,
    volume: String(DEFAULT_VOLUME),
    energy: formatAmount(energy),
    heating: formatAmount(fromBtuPerFt3(heating, DEFAULT_HEATING_UNIT)),
    advancedOpen: false,
    activeField: null,
    primaryField: 'volume',
  };
}

export function emptyDraft(): NaturalGasDraft {
  return {
    volumeUnit: DEFAULT_VOLUME_UNIT,
    energyUnit: DEFAULT_ENERGY_UNIT,
    heatingUnit: DEFAULT_HEATING_UNIT,
    volume: '',
    energy: '',
    heating: formatAmount(fromBtuPerFt3(DEFAULT_HEATING_BTU_PER_FT3, DEFAULT_HEATING_UNIT)),
    advancedOpen: false,
    activeField: null,
    primaryField: 'volume',
  };
}

interface NaturalGasFormProps {
  draft: NaturalGasDraft;
  errors: NaturalGasFieldErrors;
  onDraftChange: (draft: NaturalGasDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

export function NaturalGasForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: NaturalGasFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        Natural gas volume-to-energy conversion depends on the gas heating value. The default 1038
        BTU/ft³ is an illustrative assumption — not a universal utility billing rate.
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ng-volume-unit" className={labelClass}>
          Volume units
        </label>
        <select
          id="ng-volume-unit"
          className={selectClass}
          value={draft.volumeUnit}
          onChange={(event) =>
            onDraftChange({
              ...draft,
              volumeUnit: event.target.value as VolumeUnit,
              activeField: draft.primaryField,
            })
          }
        >
          {VOLUME_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {VOLUME_UNIT_DEFS[unit].label} ({VOLUME_UNIT_DEFS[unit].symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ng-energy-unit" className={labelClass}>
          Energy units
        </label>
        <select
          id="ng-energy-unit"
          className={selectClass}
          value={draft.energyUnit}
          onChange={(event) =>
            onDraftChange({
              ...draft,
              energyUnit: event.target.value as EnergyUnit,
              activeField: draft.primaryField,
            })
          }
        >
          {ENERGY_UNITS.map((unit) => (
            <option key={unit} value={unit}>
              {ENERGY_UNIT_DEFS[unit].label} ({ENERGY_UNIT_DEFS[unit].symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ng-volume" className={labelClass}>
          Enter value ({VOLUME_UNIT_DEFS[draft.volumeUnit].symbol})
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="ng-volume"
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={draft.volume}
            placeholder="Enter volume"
            aria-invalid={Boolean(errors.volume)}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                volume: event.target.value,
                activeField: 'volume',
                primaryField: 'volume',
              })
            }
          />
        </div>
        {errors.volume ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.volume}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="ng-energy" className={labelClass}>
          Converted value ({ENERGY_UNIT_DEFS[draft.energyUnit].symbol})
        </label>
        <div className="rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id="ng-energy"
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={draft.energy}
            placeholder="Enter energy"
            aria-invalid={Boolean(errors.energy)}
            onChange={(event) =>
              onDraftChange({
                ...draft,
                energy: event.target.value,
                activeField: 'energy',
                primaryField: 'energy',
              })
            }
          />
        </div>
        {errors.energy ? (
          <p className="text-xs text-red-600" role="alert">
            {errors.energy}
          </p>
        ) : null}
      </div>

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.advancedOpen}
          onClick={() => onDraftChange({ ...draft, advancedOpen: !draft.advancedOpen })}
        >
          <span>Advanced Conversion Settings</span>
          {draft.advancedOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.advancedOpen ? (
          <div className="space-y-3 border-t border-border px-3.5 py-3.5">
            <div className="space-y-1.5">
              <label htmlFor="ng-heating-unit" className={labelClass}>
                Heating value unit
              </label>
              <select
                id="ng-heating-unit"
                className={selectClass}
                value={draft.heatingUnit}
                onChange={(event) =>
                  onDraftChange({
                    ...draft,
                    heatingUnit: event.target.value as HeatingUnit,
                    activeField: 'heating',
                  })
                }
              >
                {HEATING_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {HEATING_UNIT_DEFS[unit].label} ({HEATING_UNIT_DEFS[unit].symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="ng-heating" className={labelClass}>
                Heating value
              </label>
              <div className="flex gap-2">
                <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
                  <input
                    id="ng-heating"
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    className={inputClass}
                    value={draft.heating}
                    placeholder="Enter heating value"
                    aria-invalid={Boolean(errors.heating)}
                    onChange={(event) =>
                      onDraftChange({
                        ...draft,
                        heating: event.target.value,
                        activeField: 'heating',
                      })
                    }
                  />
                </div>
                <span className="flex h-11 shrink-0 items-center rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-accent">
                  {HEATING_UNIT_DEFS[draft.heatingUnit].symbol}
                </span>
              </div>
              {errors.heating ? (
                <p className="text-xs text-red-600" role="alert">
                  {errors.heating}
                </p>
              ) : null}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Volume-based gas measurements may depend on temperature and pressure reference
              conditions. This calculator does not apply separate pressure or temperature
              corrections.
            </p>
          </div>
        ) : null}
      </div>

      {children}

      <div className="flex flex-wrap gap-2 pt-1">
        <Button type="submit" className="h-11 min-w-[120px]">
          Convert
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReload}>
          <RotateCcw className="mr-1.5 h-4 w-4" />
          Reload calculator
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onReset}>
          Clear all changes
        </Button>
      </div>
    </form>
  );
}
