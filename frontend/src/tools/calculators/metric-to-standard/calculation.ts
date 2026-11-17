import type { ConversionCategory } from './types';
import { allUnits, getCategory, getUnit } from './units';

export function formatMetricNumber(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  const abs = Math.abs(value);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-6)) {
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

  return String(Number(value.toFixed(digits)));
}

export function toKelvin(value: number, unitId: string): number {
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

export function fromKelvin(kelvin: number, unitId: string): number {
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

export function convertTemperature(
  value: number,
  from: 'C' | 'F' | 'K',
  to: 'C' | 'F' | 'K',
): number {
  if (from === to) return value;
  return fromKelvin(toKelvin(value, from), to);
}

export function toBase(value: number, category: ConversionCategory, unitId: string): number {
  const cat = getCategory(category);
  if (cat.kind === 'temperature') return toKelvin(value, unitId);
  const unit = getUnit(category, unitId);
  if (!unit?.factorToBase) throw new Error(`Missing factor for ${unitId}`);
  return value * unit.factorToBase;
}

export function fromBase(base: number, category: ConversionCategory, unitId: string): number {
  const cat = getCategory(category);
  if (cat.kind === 'temperature') return fromKelvin(base, unitId);
  const unit = getUnit(category, unitId);
  if (!unit?.factorToBase) throw new Error(`Missing factor for ${unitId}`);
  return base / unit.factorToBase;
}

export function convertLinear(
  value: number,
  category: ConversionCategory,
  fromId: string,
  toId: string,
): number {
  if (fromId === toId) return value;
  return fromBase(toBase(value, category, fromId), category, toId);
}

export function allFromBase(
  category: ConversionCategory,
  base: number,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const unit of allUnits(category)) {
    out[unit.id] = fromBase(base, category, unit.id);
  }
  return out;
}

export function shareResultText(
  category: ConversionCategory,
  base: number,
  sourceUnitId: string,
): string {
  const cat = getCategory(category);
  const values = allFromBase(category, base);
  const source = getUnit(category, sourceUnitId);
  const lines = cat.summaryUnitIds.map((id) => {
    const unit = getUnit(category, id)!;
    return `${formatMetricNumber(values[id])} ${unit.symbol}`;
  });

  return [
    'Metric to Standard Converter — Omega Calculators',
    '',
    `Conversion type: ${cat.label}`,
    '',
    source
      ? `${formatMetricNumber(values[sourceUnitId])} ${source.symbol} equals:`
      : 'Converted values:',
    ...lines.map((line) => `  ${line}`),
    '',
    '/tools/metric-to-standard-converter',
  ].join('\n');
}
