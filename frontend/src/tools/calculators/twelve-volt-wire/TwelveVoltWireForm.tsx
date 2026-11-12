'use client';

import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import type { TwelveVoltInput } from './types';

interface TwelveVoltWireFormProps {
  input: TwelveVoltInput;
  errors: Record<string, string>;
  advanced: boolean;
  onAdvanced: (open: boolean) => void;
  onChange: (input: TwelveVoltInput) => void;
  onSubmit: (event: FormEvent) => void;
  onReset: () => void;
}

const labelClass = 'mb-1.5 block text-[13px] font-medium text-accent';
const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

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
  const numberChange = (key: 'voltage' | 'dropPercent' | 'current' | 'distance' | 'temperature', raw: string) => {
    set({ [key]: raw.trim() === '' ? Number.NaN : Number(raw) });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-accent">
        System voltage <span className="font-semibold tabular-nums">{Number.isFinite(input.voltage) ? input.voltage : '—'} V DC</span>
        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
          Two-wire circuit. The one-way length is counted on both the supply and the return.
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3.5 min-[420px]:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="wv-drop">
            Allowable voltage drop (%)
          </label>
          <input
            id="wv-drop"
            className={inputClass}
            inputMode="decimal"
            value={Number.isFinite(input.dropPercent) ? String(input.dropPercent) : ''}
            onChange={(event) => numberChange('dropPercent', event.target.value)}
            aria-invalid={Boolean(errors.dropPercent)}
          />
          <p className="mt-1 text-xs text-muted-foreground">3% is a design target, not a universal code limit.</p>
          {errors.dropPercent ? <p className="mt-1 text-xs text-rose-600">{errors.dropPercent}</p> : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="wv-material">
            Conductor material
          </label>
          <select
            id="wv-material"
            className={inputClass}
            value={input.material}
            onChange={(event) => set({ material: event.target.value === 'aluminum' ? 'aluminum' : 'copper' })}
          >
            <option value="copper">Copper</option>
            <option value="aluminum">Aluminum</option>
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="wv-current">
            Current (A)
          </label>
          <input
            id="wv-current"
            className={inputClass}
            inputMode="decimal"
            value={Number.isFinite(input.current) ? String(input.current) : ''}
            onChange={(event) => numberChange('current', event.target.value)}
            aria-invalid={Boolean(errors.current)}
          />
          {errors.current ? <p className="mt-1 text-xs text-rose-600">{errors.current}</p> : null}
        </div>
        <div>
          <label className={labelClass} htmlFor="wv-distance">
            One-way distance
          </label>
          <div className="flex gap-2">
            <input
              id="wv-distance"
              className={inputClass}
              inputMode="decimal"
              value={Number.isFinite(input.distance) ? String(input.distance) : ''}
              onChange={(event) => numberChange('distance', event.target.value)}
              aria-invalid={Boolean(errors.distance)}
            />
            <select
              aria-label="Distance unit"
              className={`${inputClass} w-[92px] shrink-0`}
              value={input.distanceUnit}
              onChange={(event) => set({ distanceUnit: event.target.value === 'ft' ? 'ft' : 'm' })}
            >
              <option value="m">m</option>
              <option value="ft">ft</option>
            </select>
          </div>
          {errors.distance ? <p className="mt-1 text-xs text-rose-600">{errors.distance}</p> : null}
        </div>
        <div className="min-[420px]:col-span-2">
          <label className={labelClass} htmlFor="wv-temp">
            Conductor temperature
          </label>
          <div className="flex gap-2">
            <input
              id="wv-temp"
              className={inputClass}
              inputMode="decimal"
              value={Number.isFinite(input.temperature) ? String(input.temperature) : ''}
              onChange={(event) => numberChange('temperature', event.target.value)}
              aria-invalid={Boolean(errors.temperature)}
            />
            <select
              aria-label="Temperature unit"
              className={`${inputClass} w-[92px] shrink-0`}
              value={input.temperatureUnit}
              onChange={(event) => set({ temperatureUnit: event.target.value === 'F' ? 'F' : 'C' })}
            >
              <option value="C">°C</option>
              <option value="F">°F</option>
            </select>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Used only to estimate resistance. It is not an insulation or terminal rating.
          </p>
          {errors.temperature ? <p className="mt-1 text-xs text-rose-600">{errors.temperature}</p> : null}
        </div>
      </div>
      <div>
        <button
          type="button"
          className="text-sm font-medium text-primary"
          onClick={() => onAdvanced(!advanced)}
          aria-expanded={advanced}
        >
          {advanced ? 'Hide advanced' : 'Advanced settings'}
        </button>
        {advanced ? (
          <div className="mt-3">
            <label className={labelClass} htmlFor="wv-voltage">
              System voltage (V DC)
            </label>
            <input
              id="wv-voltage"
              className={inputClass}
              inputMode="decimal"
              value={Number.isFinite(input.voltage) ? String(input.voltage) : ''}
              onChange={(event) => numberChange('voltage', event.target.value)}
              aria-invalid={Boolean(errors.voltage)}
            />
            <p className="mt-1 text-xs text-muted-foreground">Default is 12 V. Allowed range is above 0 V through 60 V.</p>
            {errors.voltage ? <p className="mt-1 text-xs text-rose-600">{errors.voltage}</p> : null}
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="submit" className="h-11 flex-1 bg-primary font-medium text-white hover:bg-[hsl(var(--primary-hover))]">
          Calculate
        </Button>
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
