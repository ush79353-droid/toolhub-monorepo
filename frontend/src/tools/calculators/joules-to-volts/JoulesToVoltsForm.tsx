'use client';

import type { FormEvent, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CHARGE_UNITS,
  CHARGE_UNIT_SYMBOLS,
  ENERGY_UNITS,
  ENERGY_UNIT_SYMBOLS,
  SOLVE_FOR,
  SOLVE_FOR_LABELS,
  VOLTAGE_UNITS,
  VOLTAGE_UNIT_SYMBOLS,
  type ChargeUnit,
  type EnergyUnit,
  type JoulesToVoltsFieldErrors,
  type SolveFor,
  type VoltageUnit,
} from './types';

export interface JoulesToVoltsDraft {
  solveFor: SolveFor;
  energy: string;
  energyUnit: EnergyUnit;
  charge: string;
  chargeUnit: ChargeUnit;
  voltage: string;
  voltageUnit: VoltageUnit;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';
const selectClass =
  'h-11 shrink-0 rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent outline-none focus:ring-2 focus:ring-ring';

export function emptyDraft(): JoulesToVoltsDraft {
  return {
    solveFor: 'voltage',
    energy: '',
    energyUnit: 'joule',
    charge: '',
    chargeUnit: 'coulomb',
    voltage: '',
    voltageUnit: 'volt',
  };
}

interface JoulesToVoltsFormProps {
  draft: JoulesToVoltsDraft;
  errors: JoulesToVoltsFieldErrors;
  onDraftChange: (draft: JoulesToVoltsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
}

function QuantityField({
  id,
  label,
  value,
  unit,
  unitOptions,
  symbols,
  disabled,
  error,
  onValueChange,
  onUnitChange,
}: {
  id: string;
  label: string;
  value: string;
  unit: string;
  unitOptions: readonly string[];
  symbols: Record<string, string>;
  disabled?: boolean;
  error?: string;
  onValueChange: (value: string) => void;
  onUnitChange: (unit: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
        {disabled ? (
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">(calculated)</span>
        ) : null}
      </label>
      <div className="flex gap-2">
        <div
          className={`min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring ${
            disabled ? 'bg-muted/30' : ''
          }`}
        >
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={value}
            placeholder="0"
            disabled={disabled}
            readOnly={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => onValueChange(event.target.value)}
          />
        </div>
        <select
          className={selectClass}
          value={unit}
          aria-label={`${label} unit`}
          onChange={(event) => onUnitChange(event.target.value)}
        >
          {unitOptions.map((u) => (
            <option key={u} value={u}>
              {symbols[u]}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function JoulesToVoltsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
}: JoulesToVoltsFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
 Joules alone cannot determine volts; electric charge is also required. Use V = E / Q (or the
        equivalent rearrangements). Signs follow your chosen reference direction.
      </div>

      <fieldset className="space-y-2">
        <legend className={labelClass}>I want to calculate…</legend>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Calculation direction">
          {SOLVE_FOR.map((target) => (
            <label
              key={target}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-accent has-[:checked]:border-primary has-[:checked]:bg-brand-softTeal/30"
            >
              <input
                type="radio"
                name="j2v-solve"
                value={target}
                checked={draft.solveFor === target}
                className="h-4 w-4 accent-primary"
                onChange={() =>
                  onDraftChange({
                    ...draft,
                    solveFor: target,
                    ...(target === 'voltage'
                      ? { voltage: '' }
                      : target === 'energy'
                        ? { energy: '' }
                        : { charge: '' }),
                  })
                }
              />
              <span>{SOLVE_FOR_LABELS[target]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <QuantityField
        id="j2v-energy"
        label="Energy"
        value={draft.energy}
        unit={draft.energyUnit}
        unitOptions={ENERGY_UNITS}
        symbols={ENERGY_UNIT_SYMBOLS}
        disabled={draft.solveFor === 'energy'}
        error={errors.energy}
        onValueChange={(energy) => onDraftChange({ ...draft, energy })}
        onUnitChange={(energyUnit) =>
          onDraftChange({ ...draft, energyUnit: energyUnit as EnergyUnit })
        }
      />

      <QuantityField
        id="j2v-charge"
        label="Electric charge"
        value={draft.charge}
        unit={draft.chargeUnit}
        unitOptions={CHARGE_UNITS}
        symbols={CHARGE_UNIT_SYMBOLS}
        disabled={draft.solveFor === 'charge'}
        error={errors.charge}
        onValueChange={(charge) => onDraftChange({ ...draft, charge })}
        onUnitChange={(chargeUnit) =>
          onDraftChange({ ...draft, chargeUnit: chargeUnit as ChargeUnit })
        }
      />

      <QuantityField
        id="j2v-voltage"
        label="Voltage"
        value={draft.voltage}
        unit={draft.voltageUnit}
        unitOptions={VOLTAGE_UNITS}
        symbols={VOLTAGE_UNIT_SYMBOLS}
        disabled={draft.solveFor === 'voltage'}
        error={errors.voltage}
        onValueChange={(voltage) => onDraftChange({ ...draft, voltage })}
        onUnitChange={(voltageUnit) =>
          onDraftChange({ ...draft, voltageUnit: voltageUnit as VoltageUnit })
        }
      />

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
          Calculate
        </button>
      </div>
    </form>
  );
}
