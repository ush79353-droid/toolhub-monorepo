'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ChevronDown, ChevronUp, RotateCcw, Settings2 } from 'lucide-react';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  feetToMeters,
  metersToFeet,
} from '@/tools/electrical/conductor';
import type { DistanceUnit, TemperatureUnit, TwelveVoltInput } from './types';

interface TwelveVoltWireFormProps {
  input: TwelveVoltInput;
  errors: Record<string, string>;
  advanced: boolean;
  onAdvanced: (open: boolean) => void;
  onChange: (input: TwelveVoltInput) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

const fieldClass = 'h-11 rounded-lg border-border bg-white text-sm tabular-nums';

function formatConverted(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return String(rounded);
}

function numberChange(
  input: TwelveVoltInput,
  key: 'voltage' | 'dropPercent' | 'current' | 'distance' | 'temperature',
  raw: string
): TwelveVoltInput {
  return { ...input, [key]: raw.trim() === '' ? Number.NaN : Number(raw) };
}

export function TwelveVoltWireForm({
  input,
  errors,
  advanced,
  onAdvanced,
  onChange,
  onSubmit,
  onReset,
}: TwelveVoltWireFormProps) {
  const set = (patch: Partial<TwelveVoltInput>) => onChange({ ...input, ...patch });

  const maxDrop =
    Number.isFinite(input.voltage) && Number.isFinite(input.dropPercent)
      ? input.voltage * (input.dropPercent / 100)
      : null;

  const switchDistance = (unit: DistanceUnit) => {
    if (unit === input.distanceUnit) return;
    if (!Number.isFinite(input.distance)) {
      set({ distanceUnit: unit });
      return;
    }
    const converted = unit === 'ft' ? metersToFeet(input.distance) : feetToMeters(input.distance);
    set({ distanceUnit: unit, distance: Number(formatConverted(converted)) });
  };

  const switchTemperature = (unit: TemperatureUnit) => {
    if (unit === input.temperatureUnit) return;
    if (!Number.isFinite(input.temperature)) {
      set({ temperatureUnit: unit });
      return;
    }
    const converted =
      unit === 'F' ? celsiusToFahrenheit(input.temperature) : fahrenheitToCelsius(input.temperature);
    set({ temperatureUnit: unit, temperature: Number(formatConverted(converted)) });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-accent">
        System voltage{' '}
        <span className="font-semibold tabular-nums">
          {Number.isFinite(input.voltage) ? input.voltage : '—'} V DC
        </span>
        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
          Two-wire circuit. The one-way length is counted on both the supply and the return.
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="wv-drop" className="text-[13px] font-medium text-accent">
            Allowable voltage drop (%){' '}
            <InfoTooltip
              label="Allowable voltage drop"
              text="Share of the source voltage you are willing to lose in the wiring. 3% is this form’s design target, not a universal code limit."
            />
          </label>
          <Input
            id="wv-drop"
            inputMode="decimal"
            className={fieldClass}
            value={Number.isFinite(input.dropPercent) ? String(input.dropPercent) : ''}
            onChange={(event) => onChange(numberChange(input, 'dropPercent', event.target.value))}
            aria-invalid={Boolean(errors.dropPercent)}
            aria-describedby={errors.dropPercent ? 'wv-drop-error' : 'wv-drop-hint'}
          />
          <p id="wv-drop-hint" className="text-xs text-muted-foreground">
            {maxDrop !== null && input.voltage > 0
              ? `At ${input.voltage} V and ${input.dropPercent}%: maximum voltage drop = ${maxDrop.toLocaleString('en-US', { maximumFractionDigits: 3 })} V.`
              : '3% of 12 V is 0.36 V. That figure is a design target.'}
          </p>
          {errors.dropPercent ? (
            <p id="wv-drop-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.dropPercent}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="wv-material" className="text-[13px] font-medium text-accent">
            Conductor material{' '}
            <InfoTooltip
              label="Conductor material"
              text="Copper and aluminum use IEC 60228 resistivity at 20°C, then a linear temperature correction. No other material is offered without a verified resistivity."
            />
          </label>
          <Select
            id="wv-material"
            className={fieldClass}
            value={input.material}
            onChange={(event) => set({ material: event.target.value === 'aluminum' ? 'aluminum' : 'copper' })}
            aria-invalid={Boolean(errors.material)}
          >
            <option value="copper">Copper</option>
            <option value="aluminum">Aluminum</option>
          </Select>
          {errors.material ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.material}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="wv-current" className="text-[13px] font-medium text-accent">
            Current (A){' '}
            <InfoTooltip
              label="Current"
              text="Steady current in amperes. The area scales directly with current. This is not an ampacity rating."
            />
          </label>
          <Input
            id="wv-current"
            inputMode="decimal"
            className={fieldClass}
            value={Number.isFinite(input.current) ? String(input.current) : ''}
            onChange={(event) => onChange(numberChange(input, 'current', event.target.value))}
            aria-invalid={Boolean(errors.current)}
            aria-describedby={errors.current ? 'wv-current-error' : undefined}
          />
          {errors.current ? (
            <p id="wv-current-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.current}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="wv-distance" className="text-[13px] font-medium text-accent">
              One-way distance{' '}
              <InfoTooltip
                label="One-way distance"
                text="Length of one conductor from source to load. The model adds an equal return conductor. Switching units converts the number so the physical length stays the same."
              />
            </label>
            <div className="inline-flex rounded-md border border-border bg-muted/40 p-0.5 text-xs" role="group" aria-label="Distance unit">
              {(['m', 'ft'] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  aria-pressed={input.distanceUnit === unit}
                  onClick={() => switchDistance(unit)}
                  className={`rounded px-2 py-0.5 font-medium transition-colors ${
                    input.distanceUnit === unit
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-accent'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
          <Input
            id="wv-distance"
            inputMode="decimal"
            className={fieldClass}
            value={Number.isFinite(input.distance) ? String(input.distance) : ''}
            onChange={(event) => onChange(numberChange(input, 'distance', event.target.value))}
            aria-invalid={Boolean(errors.distance)}
            aria-describedby={errors.distance ? 'wv-distance-error' : undefined}
          />
          {errors.distance ? (
            <p id="wv-distance-error" role="alert" className="text-xs font-medium text-destructive">
              {errors.distance}
            </p>
          ) : null}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="wv-temp" className="text-[13px] font-medium text-accent">
              Conductor temperature{' '}
              <InfoTooltip
                label="Conductor temperature"
                text="Assumed metal temperature for the resistance estimate. It is not an insulation rating, a terminal rating, or the ambient temperature by itself."
              />
            </label>
            <div className="inline-flex rounded-md border border-border bg-muted/40 p-0.5 text-xs" role="group" aria-label="Temperature unit">
              {(['C', 'F'] as const).map((unit) => (
                <button
                  key={unit}
                  type="button"
                  aria-pressed={input.temperatureUnit === unit}
                  onClick={() => switchTemperature(unit)}
                  className={`rounded px-2 py-0.5 font-medium transition-colors ${
                    input.temperatureUnit === unit
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-muted-foreground hover:text-accent'
                  }`}
                >
                  °{unit}
                </button>
              ))}
            </div>
          </div>
          <Input
            id="wv-temp"
            inputMode="decimal"
            className={fieldClass}
            value={Number.isFinite(input.temperature) ? String(input.temperature) : ''}
            onChange={(event) => onChange(numberChange(input, 'temperature', event.target.value))}
            aria-invalid={Boolean(errors.temperature)}
            aria-describedby="wv-temp-hint"
          />
          <p id="wv-temp-hint" className="text-xs text-muted-foreground">
            Used only to estimate resistance. It is not an insulation or terminal rating.
          </p>
          {errors.temperature ? (
            <p role="alert" className="text-xs font-medium text-destructive">
              {errors.temperature}
            </p>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-muted/20">
        <button
          type="button"
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-accent"
          onClick={() => onAdvanced(!advanced)}
          aria-expanded={advanced}
        >
          <span className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            Advanced settings
          </span>
          {advanced ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        {advanced ? (
          <div className="space-y-3 border-t border-border bg-white/70 p-4">
            <div className="space-y-1.5">
              <label htmlFor="wv-voltage" className="text-[13px] font-medium text-accent">
                System voltage (V DC){' '}
                <InfoTooltip
                  label="System voltage"
                  text="The calculator is built for 12 V DC. Another voltage up to 60 V only changes the permitted drop. It does not turn this into a mains or code calculator."
                />
              </label>
              <Input
                id="wv-voltage"
                inputMode="decimal"
                className={fieldClass}
                value={Number.isFinite(input.voltage) ? String(input.voltage) : ''}
                onChange={(event) => onChange(numberChange(input, 'voltage', event.target.value))}
                aria-invalid={Boolean(errors.voltage)}
                aria-describedby={errors.voltage ? 'wv-voltage-error' : 'wv-voltage-hint'}
              />
              <p id="wv-voltage-hint" className="text-xs text-muted-foreground">
                Default is 12 V. The return path stays two equal conductors. Chassis resistance is not assumed to be zero, and no chassis option is offered.
              </p>
              {errors.voltage ? (
                <p id="wv-voltage-error" role="alert" className="text-xs font-medium text-destructive">
                  {errors.voltage}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="submit" className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 gap-1.5 font-medium" onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </form>
  );
}
