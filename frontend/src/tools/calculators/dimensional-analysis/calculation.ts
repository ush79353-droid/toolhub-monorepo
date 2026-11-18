import { formatAngle } from '../coordinates/calculation';
import { getQuantity, getUnit, type QuantityDef, type UnitDef } from './catalog';
import { formatDimension } from './dimensions';
import { EQUALITY_ABS_TOL, EQUALITY_REL_TOL } from './types';

export function formatValue(value: number): string {
  const raw = formatAngle(value, 12);
  if (!raw || raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function toKelvin(value: number, unitId: string): number {
  switch (unitId) {
    case 'C':
      return value + 273.15;
    case 'F':
      return ((value - 32) * 5) / 9 + 273.15;
    case 'K':
      return value;
    case 'R':
      return value * (5 / 9);
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
    case 'R':
      return kelvin * (9 / 5);
    default:
      throw new Error(`Unknown temperature unit: ${unitId}`);
  }
}

export type ConvertOk = { ok: true; value: number; si: number };
export type ConvertErr = { ok: false; error: string };
export type ConvertResult = ConvertOk | ConvertErr;

export function convertWithinQuantity(
  quantity: QuantityDef,
  value: number,
  fromId: string,
  toId: string,
): ConvertResult {
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }
  const from = getUnit(quantity.id, fromId);
  const to = getUnit(quantity.id, toId);
  if (!from || !to) {
    return { ok: false, error: 'Select valid units for this quantity.' };
  }

  if (quantity.conversionKind === 'temperature') {
    const kelvin = toKelvin(value, fromId);
    if (kelvin < 0) {
      return { ok: false, error: 'Absolute temperature cannot be below 0 K.' };
    }
    return { ok: true, value: fromKelvin(kelvin, toId), si: kelvin };
  }

  const si = value * from.toSI;
  if (!Number.isFinite(si)) {
    return { ok: false, error: 'Result is outside the finite numeric range.' };
  }
  const out = si / to.toSI;
  if (!Number.isFinite(out)) {
    return { ok: false, error: 'Result is outside the finite numeric range.' };
  }
  return { ok: true, value: out, si };
}

export function valuesApproximatelyEqual(a: number, b: number): boolean {
  const diff = Math.abs(a - b);
  if (diff <= EQUALITY_ABS_TOL) return true;
  return diff <= EQUALITY_REL_TOL * Math.max(1, Math.abs(a), Math.abs(b));
}

export type CompareResult =
  | {
      ok: true;
      quantity: QuantityDef;
      unit1: UnitDef;
      unit2: UnitDef;
      value1: number;
      value2: number;
      value1InUnit2: number;
      value2InUnit1: number;
      si1: number;
      si2: number;
      differenceSi: number;
      equal: boolean;
      greater: 'first' | 'second' | 'equal';
      dimensionLabel: string;
    }
  | { ok: false; error: string };

export function compareValues(
  quantityId: string,
  value1: number,
  unit1Id: string,
  value2: number,
  unit2Id: string,
): CompareResult {
  const quantity = getQuantity(quantityId);
  if (!quantity) return { ok: false, error: 'Select a physical quantity.' };

  const c1 = convertWithinQuantity(quantity, value1, unit1Id, unit1Id);
  if (!c1.ok) return { ok: false, error: c1.error };
  const c2 = convertWithinQuantity(quantity, value2, unit2Id, unit2Id);
  if (!c2.ok) return { ok: false, error: c2.error };

  const to2 = convertWithinQuantity(quantity, value1, unit1Id, unit2Id);
  if (!to2.ok) return { ok: false, error: to2.error };
  const to1 = convertWithinQuantity(quantity, value2, unit2Id, unit1Id);
  if (!to1.ok) return { ok: false, error: to1.error };

  const unit1 = getUnit(quantityId, unit1Id)!;
  const unit2 = getUnit(quantityId, unit2Id)!;
  const equal = valuesApproximatelyEqual(c1.si, c2.si);
  const greater = equal ? 'equal' : c1.si > c2.si ? 'first' : 'second';

  return {
    ok: true,
    quantity,
    unit1,
    unit2,
    value1,
    value2,
    value1InUnit2: to2.value,
    value2InUnit1: to1.value,
    si1: c1.si,
    si2: c2.si,
    differenceSi: Math.abs(c1.si - c2.si),
    equal,
    greater,
    dimensionLabel: formatDimension(quantity.dimension),
  };
}

export function shareCompareText(r: Extract<CompareResult, { ok: true }>): string {
  const cmp =
    r.greater === 'equal'
      ? 'The two measurements are equal.'
      : r.greater === 'first'
        ? `${formatValue(r.value1)} ${r.unit1.symbol} is greater than ${formatValue(r.value2)} ${r.unit2.symbol}.`
        : `${formatValue(r.value2)} ${r.unit2.symbol} is greater than ${formatValue(r.value1)} ${r.unit1.symbol}.`;
  return [
    'Dimensional Analysis Calculator — Omega Calculators',
    '',
    'Mode: Compare two values',
    `Physical quantity: ${r.quantity.label}`,
    `Dimension: [${r.dimensionLabel}]`,
    '',
    `Value 1: ${formatValue(r.value1)} ${r.unit1.symbol}`,
    `Value 2: ${formatValue(r.value2)} ${r.unit2.symbol}`,
    '',
    `${formatValue(r.value1)} ${r.unit1.symbol} = ${formatValue(r.value1InUnit2)} ${r.unit2.symbol}`,
    `${formatValue(r.value2)} ${r.unit2.symbol} = ${formatValue(r.value2InUnit1)} ${r.unit1.symbol}`,
    `Difference: ${formatValue(r.differenceSi)} ${r.quantity.siSymbol}`,
    '',
    cmp,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}

export function shareConvertText(input: {
  quantity: QuantityDef;
  value: number;
  from: UnitDef;
  to: UnitDef;
  result: number;
}): string {
  return [
    'Dimensional Analysis Calculator — Omega Calculators',
    '',
    'Mode: Convert units',
    `Physical quantity: ${input.quantity.label}`,
    `Dimension: [${formatDimension(input.quantity.dimension)}]`,
    '',
    `Original: ${formatValue(input.value)} ${input.from.symbol}`,
    `Converted: ${formatValue(input.result)} ${input.to.symbol}`,
    '',
    'Calculated with Omega Calculators',
  ].join('\n');
}
