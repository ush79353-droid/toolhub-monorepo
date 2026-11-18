import type { ConversionCategory } from './types';
import { getCategory, getUnit } from './units';

export function formatValue(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-6)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e')
      .replace(/e\+?/i, 'e');
  }

  let digits = 12;
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 12;
  else digits = 14;

  const rounded = Number(value.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

function toKelvin(value: number, unitId: string): number {
  switch (unitId) {
    case 'C':
      return value + 273.15;
    case 'F':
      return ((value - 32) * 5) / 9 + 273.15;
    case 'K':
      return value;
    case 'R':
      return (value * 5) / 9;
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
    case 'R':
      return (kelvin * 9) / 5;
    default:
      throw new Error(`Unknown temperature unit: ${unitId}`);
  }
}

export type ConvertOk = { ok: true; value: number };
export type ConvertErr = { ok: false; error: string };
export type ConvertResult = ConvertOk | ConvertErr;

export function convertMeasurement(
  value: number,
  category: ConversionCategory,
  fromUnit: string,
  toUnit: string,
): ConvertResult {
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }

  const cat = getCategory(category);
  const source = getUnit(category, fromUnit);
  const dest = getUnit(category, toUnit);
  if (!source || !dest) {
    return { ok: false, error: 'Select valid units for this category.' };
  }
  if (source.system === dest.system && fromUnit !== toUnit) {
    // Still allow same-system conversion if user somehow selects it — both sides are metric/imperial paired.
  }

  if (cat.kind === 'temperature') {
    const kelvin = toKelvin(value, fromUnit);
    if (!Number.isFinite(kelvin) || kelvin < -1e-9) {
      return { ok: false, error: 'Temperature cannot be below absolute zero.' };
    }
    return { ok: true, value: fromKelvin(kelvin < 0 ? 0 : kelvin, toUnit) };
  }

  if (!cat.allowNegative && value < 0) {
    return { ok: false, error: 'Value cannot be negative for this quantity.' };
  }

  const fromFactor = source.factorToBase;
  const toFactor = dest.factorToBase;
  if (fromFactor == null || toFactor == null || toFactor === 0) {
    return { ok: false, error: 'Unit definition is incomplete.' };
  }

  const converted = (value * fromFactor) / toFactor;
  if (!Number.isFinite(converted)) {
    return { ok: false, error: 'Result is outside the finite numeric range.' };
  }
  return { ok: true, value: converted };
}

export function shareResultText(args: {
  category: ConversionCategory;
  metricValue: number;
  imperialValue: number;
  metricUnitId: string;
  imperialUnitId: string;
}): string {
  const cat = getCategory(args.category);
  const metric = getUnit(args.category, args.metricUnitId);
  const imperial = getUnit(args.category, args.imperialUnitId);
  return [
    'Metric to Imperial Converter — Omega Calculators',
    '',
    `Category: ${cat.label}`,
    '',
    `${formatValue(args.metricValue)} ${metric?.symbol ?? args.metricUnitId} = ${formatValue(args.imperialValue)} ${imperial?.symbol ?? args.imperialUnitId}`,
  ].join('\n');
}
