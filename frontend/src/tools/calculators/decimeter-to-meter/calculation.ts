import {
  DECIMETERS_PER_METER,
  METERS_PER_CM,
  METERS_PER_FOOT,
  METERS_PER_INCH,
  METERS_PER_KM,
  METERS_PER_MM,
  METERS_PER_YARD,
  type DecimeterToMeterInput,
  type DecimeterToMeterResult,
  type OtherUnitRow,
} from './types';

/** Readable length display without ugly trailing zeros. */
export function formatLength(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function decimetersToMeters(decimeters: number): number {
  return decimeters / DECIMETERS_PER_METER;
}

export function metersToDecimeters(meters: number): number {
  return meters * DECIMETERS_PER_METER;
}

function otherUnitsFromMeters(meters: number): readonly OtherUnitRow[] {
  return [
    { unit: 'mm', label: 'Millimeters (mm)', value: meters / METERS_PER_MM },
    { unit: 'cm', label: 'Centimeters (cm)', value: meters / METERS_PER_CM },
    { unit: 'km', label: 'Kilometers (km)', value: meters / METERS_PER_KM },
    { unit: 'in', label: 'Inches (in)', value: meters / METERS_PER_INCH },
    { unit: 'ft', label: 'Feet (ft)', value: meters / METERS_PER_FOOT },
    { unit: 'yd', label: 'Yards (yd)', value: meters / METERS_PER_YARD },
  ];
}

export function calculateDecimeterToMeter(input: DecimeterToMeterInput): DecimeterToMeterResult {
  let decimeters: number;
  let meters: number;

  if (input.source === 'decimeters') {
    decimeters = input.decimeters!;
    meters = decimetersToMeters(decimeters);
  } else {
    meters = input.meters!;
    decimeters = metersToDecimeters(meters);
  }

  return {
    source: input.source,
    decimeters,
    meters,
    otherUnits: otherUnitsFromMeters(meters),
  };
}
