import { formatAngle } from '../coordinates/calculation';
import { getCategory, getUnit } from './catalog';
import type { CategoryId } from './types';

const MILE = 1609.344;
const US_GALLON_L = 3.785411784;
const IMP_GALLON_L = 4.54609;

export function formatAmount(value: number): string {
  return formatAngle(value, 12);
}

function toKelvin(value: number, unitId: string): number {
  switch (unitId) {
    case 'C':
      return value + 273.15;
    case 'F':
      return ((value - 32) * 5) / 9 + 273.15;
    case 'K':
      return value;
    default:
      throw new Error(`Unknown temperature unit: ${unitId}`);
  }
}

function fromKelvin(kelvin: number, unitId: string): number {
  switch (unitId) {
    case 'C':
      return kelvin - 273.15;
    case 'F':
      return ((kelvin - 273.15) * 9) / 5 + 32;
    case 'K':
      return kelvin;
    default:
      throw new Error(`Unknown temperature unit: ${unitId}`);
  }
}

/** Convert value to km/L base. Returns null if reciprocal division by zero. */
function toKmPerLiter(value: number, unitId: string): number | null {
  switch (unitId) {
    case 'km_L':
      return value;
    case 'L_100km':
      if (value === 0) return null;
      return 100 / value;
    case 'mpg_us':
      return (value * MILE) / (1000 * US_GALLON_L);
    case 'mpg_uk':
      return (value * MILE) / (1000 * IMP_GALLON_L);
    default:
      throw new Error(`Unknown fuel unit: ${unitId}`);
  }
}

function fromKmPerLiter(kmPerL: number, unitId: string): number | null {
  switch (unitId) {
    case 'km_L':
      return kmPerL;
    case 'L_100km':
      if (kmPerL === 0) return null;
      return 100 / kmPerL;
    case 'mpg_us':
      return (kmPerL * 1000 * US_GALLON_L) / MILE;
    case 'mpg_uk':
      return (kmPerL * 1000 * IMP_GALLON_L) / MILE;
    default:
      throw new Error(`Unknown fuel unit: ${unitId}`);
  }
}

export type ConvertResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

export function convertValue(
  categoryId: CategoryId,
  sourceUnitId: string,
  destUnitId: string,
  value: number,
): ConvertResult {
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }

  const category = getCategory(categoryId);
  const source = getUnit(categoryId, sourceUnitId);
  const dest = getUnit(categoryId, destUnitId);
  if (!source || !dest) {
    return { ok: false, error: 'Select valid units for this category.' };
  }

  if (category.kind === 'temperature') {
    const kelvin = toKelvin(value, sourceUnitId);
    return { ok: true, value: fromKelvin(kelvin, destUnitId) };
  }

  if (category.kind === 'fuel') {
    const base = toKmPerLiter(value, sourceUnitId);
    if (base == null) {
      return { ok: false, error: 'Fuel economy cannot use zero for this unit.' };
    }
    const out = fromKmPerLiter(base, destUnitId);
    if (out == null) {
      return { ok: false, error: 'Fuel economy cannot convert to this unit from zero.' };
    }
    return { ok: true, value: out };
  }

  // Linear
  const fromFactor = source.toBase;
  const toFactor = dest.toBase;
  if (fromFactor == null || toFactor == null || toFactor === 0) {
    return { ok: false, error: 'Unit definition is incomplete.' };
  }
  const base = value * fromFactor;
  return { ok: true, value: base / toFactor };
}

export function shareResultText(input: {
  categoryId: CategoryId;
  sourceValue: string;
  destValue: string;
  sourceUnitId: string;
  destUnitId: string;
}): string {
  const category = getCategory(input.categoryId);
  const source = getUnit(input.categoryId, input.sourceUnitId);
  const dest = getUnit(input.categoryId, input.destUnitId);
  return [
    'Conversion Calculator',
    'Omega Calculators',
    '',
    `Category: ${category.label}`,
    '',
    `From: ${input.sourceValue} ${source?.label ?? input.sourceUnitId}`,
    `To: ${input.destValue} ${dest?.label ?? input.destUnitId}`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
