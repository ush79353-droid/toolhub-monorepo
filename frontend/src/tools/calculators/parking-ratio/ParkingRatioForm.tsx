'use client';

import { Button } from '@/components/ui/button';
import { InfoTooltip } from '../auto-loan/InfoTooltip';
import type {
  ParkingAreaUnit,
  ParkingRatioFieldErrors,
  ParkingRatioInput,
  ParkingRatioResult,
} from './types';
import { AREA_UNIT_OPTIONS } from './types';

interface ParkingRatioFormProps {
  input: ParkingRatioInput;
  errors: ParkingRatioFieldErrors;
  result: ParkingRatioResult | null;
  onInputChange: (field: 'rentableArea' | 'parkingSpots', value: string) => void;
  onUnitChange: (unit: ParkingAreaUnit) => void;
  onReset: () => void;
}

const inputClass =
  'h-11 w-full rounded-lg border border-border bg-white px-3 text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-ring';

function FieldLabel({
  htmlFor,
  label,
  tip,
}: {
  htmlFor: string;
  label: string;
  tip: string;
}) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-accent">
        {label}
      </label>
      <InfoTooltip label={label} text={tip} align="left" />
    </div>
  );
}

export function ParkingRatioForm({
  input,
  errors,
  result,
  onInputChange,
  onUnitChange,
  onReset,
}: ParkingRatioFormProps) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="space-y-4"
      noValidate
      autoComplete="off"
    >
      <div>
        <FieldLabel
          htmlFor="parking-rentable-area"
          label="Rentable area"
          tip="Floor or site area used for the ratio. Must be greater than zero. Changing the unit converts the entered area."
        />
        <div className="flex gap-2">
          <input
            id="parking-rentable-area"
            type="text"
            inputMode="decimal"
            className={inputClass}
            value={input.rentableArea}
            aria-invalid={Boolean(errors.rentableArea)}
            onChange={(e) => onInputChange('rentableArea', e.target.value)}
          />
          <select
            id="parking-area-unit"
            className="h-11 w-[88px] shrink-0 rounded-lg border border-border bg-white px-2 text-sm text-accent focus:outline-none focus:ring-2 focus:ring-ring"
            value={input.areaUnit}
            aria-label="Rentable area unit"
            onChange={(e) => onUnitChange(e.target.value as ParkingAreaUnit)}
          >
            {AREA_UNIT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {errors.rentableArea ? (
          <p className="mt-1 text-xs text-rose-600">{errors.rentableArea}</p>
        ) : null}
      </div>

      <div>
        <FieldLabel
          htmlFor="parking-spots"
          label="Parking spots"
          tip="Whole number of parking spaces serving the rentable area."
        />
        <input
          id="parking-spots"
          type="text"
          inputMode="numeric"
          className={inputClass}
          value={input.parkingSpots}
          aria-invalid={Boolean(errors.parkingSpots)}
          onChange={(e) => onInputChange('parkingSpots', e.target.value)}
        />
        {errors.parkingSpots ? (
          <p className="mt-1 text-xs text-rose-600">{errors.parkingSpots}</p>
        ) : null}
      </div>

      {errors.general ? <p className="text-xs text-rose-600">{errors.general}</p> : null}

      <div>
        <FieldLabel
          htmlFor="parking-ratio"
          label="Parking ratio"
          tip="(Parking spots ÷ rentable area) × 1000; spaces per 1,000 area units."
        />
        <div className="relative">
          <input
            id="parking-ratio"
            type="text"
            readOnly
            className={`${inputClass} bg-muted/10 pr-16 font-semibold text-accent`}
            value={result ? result.formattedRatio : ''}
            aria-live="polite"
          />
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-mono text-sm font-medium text-muted-foreground">
            : 1000
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        <Button type="button" variant="outline" className="h-11 font-medium" onClick={onReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
