'use client';

import type { FormEvent, ReactNode } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ADVANCED_MODES,
  ADVANCED_MODE_LABELS,
  type AdvancedMode,
  type RmsToWattsFieldErrors,
  type WaveformField,
} from './types';

export interface RmsToWattsDraft {
  rms: string;
  peak: string;
  activeField: WaveformField | null;
  advancedOpen: boolean;
  advancedMode: AdvancedMode;
  voltage: string;
  current: string;
  resistance: string;
  powerFactor: string;
  peakVoltage: string;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full bg-transparent px-3 font-mono text-sm tabular-nums text-accent outline-none placeholder:text-muted-foreground';

export function emptyDraft(): RmsToWattsDraft {
  return {
    rms: '',
    peak: '',
    activeField: null,
    advancedOpen: false,
    advancedMode: 'voltageCurrent',
    voltage: '',
    current: '',
    resistance: '',
    powerFactor: '1',
    peakVoltage: '',
  };
}

interface RmsToWattsFormProps {
  draft: RmsToWattsDraft;
  errors: RmsToWattsFieldErrors;
  onDraftChange: (draft: RmsToWattsDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
  onReload: () => void;
  children?: ReactNode;
  advancedChildren?: ReactNode;
}

function NumberField({
  id,
  label,
  unit,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-border bg-white focus-within:ring-2 focus-within:ring-ring">
          <input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            className={inputClass}
            value={value}
            placeholder="0"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        <span className="flex h-11 min-w-[3rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-2 text-sm font-medium text-accent">
          {unit}
        </span>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function RmsToWattsForm({
  draft,
  errors,
  onDraftChange,
  onSubmit,
  onReset,
  onReload,
  children,
  advancedChildren,
}: RmsToWattsFormProps) {
  const mode = draft.advancedMode;

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3.5 py-3 text-xs leading-relaxed text-sky-950/90">
        These fields describe the RMS and peak values of a sinusoidal power waveform. They do not
        represent a universal conversion between amplifier RMS power ratings and peak power ratings.
      </div>

      <NumberField
        id="rms-watts"
        label="RMS watts"
        unit="W"
        value={draft.rms}
        error={errors.rms}
        onChange={(rms) => onDraftChange({ ...draft, rms, activeField: 'rms' })}
      />
      <NumberField
        id="peak-watts"
        label="Watts (in peak)"
        unit="W"
        value={draft.peak}
        error={errors.peak}
        onChange={(peak) => onDraftChange({ ...draft, peak, activeField: 'peak' })}
      />

      {children}

      <div className="rounded-xl border border-border">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left text-sm font-medium text-accent"
          aria-expanded={draft.advancedOpen}
          onClick={() => onDraftChange({ ...draft, advancedOpen: !draft.advancedOpen })}
        >
          <span>Electrical power calculator</span>
          {draft.advancedOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {draft.advancedOpen ? (
          <div className="space-y-3.5 border-t border-border px-3.5 pb-3.5 pt-3">
            <p className="text-xs text-muted-foreground">
              Separate from the waveform RMS↔peak converter. Use RMS voltage, current, resistance, or
              power factor to estimate electrical power.
            </p>
            <div className="space-y-1.5">
              <label htmlFor="adv-mode" className={labelClass}>
                Calculation mode
              </label>
              <select
                id="adv-mode"
                className="h-11 w-full rounded-lg border border-border bg-white px-3 text-sm text-accent outline-none focus:ring-2 focus:ring-ring"
                value={draft.advancedMode}
                onChange={(event) =>
                  onDraftChange({
                    ...draft,
                    advancedMode: event.target.value as AdvancedMode,
                    voltage: '',
                    current: '',
                    resistance: '',
                    powerFactor: '1',
                    peakVoltage: '',
                    activeField: null,
                  })
                }
              >
                {ADVANCED_MODES.map((m) => (
                  <option key={m} value={m}>
                    {ADVANCED_MODE_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>

            {mode === 'voltageCurrent' ? (
              <>
                <NumberField
                  id="adv-v"
                  label="RMS voltage"
                  unit="V"
                  value={draft.voltage}
                  error={errors.voltage}
                  onChange={(voltage) =>
                    onDraftChange({ ...draft, voltage, activeField: null })
                  }
                />
                <NumberField
                  id="adv-i"
                  label="RMS current"
                  unit="A"
                  value={draft.current}
                  error={errors.current}
                  onChange={(current) =>
                    onDraftChange({ ...draft, current, activeField: null })
                  }
                />
                <NumberField
                  id="adv-pf"
                  label="Power factor"
                  unit="PF"
                  value={draft.powerFactor}
                  error={errors.powerFactor}
                  onChange={(powerFactor) =>
                    onDraftChange({ ...draft, powerFactor, activeField: null })
                  }
                />
              </>
            ) : null}

            {mode === 'voltageResistance' ? (
              <>
                <NumberField
                  id="adv-vr-v"
                  label="RMS voltage"
                  unit="V"
                  value={draft.voltage}
                  error={errors.voltage}
                  onChange={(voltage) =>
                    onDraftChange({ ...draft, voltage, activeField: null })
                  }
                />
                <NumberField
                  id="adv-vr-r"
                  label="Resistance"
                  unit="Ω"
                  value={draft.resistance}
                  error={errors.resistance}
                  onChange={(resistance) =>
                    onDraftChange({ ...draft, resistance, activeField: null })
                  }
                />
              </>
            ) : null}

            {mode === 'currentResistance' ? (
              <>
                <NumberField
                  id="adv-ir-i"
                  label="RMS current"
                  unit="A"
                  value={draft.current}
                  error={errors.current}
                  onChange={(current) =>
                    onDraftChange({ ...draft, current, activeField: null })
                  }
                />
                <NumberField
                  id="adv-ir-r"
                  label="Resistance"
                  unit="Ω"
                  value={draft.resistance}
                  error={errors.resistance}
                  onChange={(resistance) =>
                    onDraftChange({ ...draft, resistance, activeField: null })
                  }
                />
              </>
            ) : null}

            {mode === 'peakVoltageResistance' ? (
              <>
                <NumberField
                  id="adv-pv"
                  label="Peak voltage"
                  unit="V"
                  value={draft.peakVoltage}
                  error={errors.peakVoltage}
                  onChange={(peakVoltage) =>
                    onDraftChange({ ...draft, peakVoltage, activeField: null })
                  }
                />
                <NumberField
                  id="adv-pv-r"
                  label="Resistance"
                  unit="Ω"
                  value={draft.resistance}
                  error={errors.resistance}
                  onChange={(resistance) =>
                    onDraftChange({ ...draft, resistance, activeField: null })
                  }
                />
              </>
            ) : null}

            {advancedChildren}
          </div>
        ) : null}
      </div>

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
