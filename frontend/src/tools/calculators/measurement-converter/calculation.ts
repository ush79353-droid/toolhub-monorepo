import type {
  Dimension,
  MeasurementInput,
  MeasurementResult,
  PrecisionMode,
} from './types';
import { getCategory, getUnit } from './units';

export function formatWithPrecision(value: number, precision: PrecisionMode): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';

  if (precision !== 'auto') {
    const sig = Number(precision);
    return value.toPrecision(sig);
  }

  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 12;
  else digits = 14;
  return String(Number(value.toFixed(digits)));
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

export function convertMeasurement(args: {
  value: number;
  category: Dimension;
  fromUnit: string;
  toUnit: string;
}): ConvertResult {
  const { value, category, fromUnit, toUnit } = args;
  if (!Number.isFinite(value)) {
    return { ok: false, error: 'Enter a valid finite number.' };
  }

  const cat = getCategory(category);
  const source = getUnit(category, fromUnit);
  const dest = getUnit(category, toUnit);
  if (!source || !dest) {
    return { ok: false, error: 'Select valid units for this category.' };
  }
  if (source.dimension !== dest.dimension) {
    return { ok: false, error: 'Units must share the same dimension.' };
  }

  if (cat.kind === 'temperature') {
    return { ok: true, value: fromKelvin(toKelvin(value, fromUnit), toUnit) };
  }

  const fromFactor = source.factorToBase;
  const toFactor = dest.factorToBase;
  if (fromFactor == null || toFactor == null || toFactor === 0) {
    return { ok: false, error: 'Unit definition is incomplete.' };
  }
  return { ok: true, value: (value * fromFactor) / toFactor };
}

/** Factor: how many `to` units equal 1 `from` unit. Temperature returns NaN. */
export function conversionFactor(
  dimension: Dimension,
  fromUnit: string,
  toUnit: string,
): number | null {
  const cat = getCategory(dimension);
  if (cat.kind === 'temperature') return null;
  const result = convertMeasurement({ value: 1, category: dimension, fromUnit, toUnit });
  return result.ok ? result.value : null;
}

export function calculateMeasurement(input: MeasurementInput): MeasurementResult | null {
  if (input.value === null || !Number.isFinite(input.value)) return null;

  const fromUnit = input.activeField === 'input' ? input.fromUnit : input.toUnit;
  const toUnit = input.activeField === 'input' ? input.toUnit : input.fromUnit;
  const converted = convertMeasurement({
    value: input.value,
    category: input.dimension,
    fromUnit,
    toUnit,
  });
  if (!converted.ok) return null;

  const inputValue =
    input.activeField === 'input' ? input.value : converted.value;
  const outputValue =
    input.activeField === 'input' ? converted.value : input.value;

  // Normalize so result always reports from→to as labeled units.
  const forward = convertMeasurement({
    value: inputValue,
    category: input.dimension,
    fromUnit: input.fromUnit,
    toUnit: input.toUnit,
  });
  if (!forward.ok) return null;

  const factorFromToOne = conversionFactor(input.dimension, input.fromUnit, input.toUnit);
  const factorToFromOne = conversionFactor(input.dimension, input.toUnit, input.fromUnit);

  const from = getUnit(input.dimension, input.fromUnit);
  const to = getUnit(input.dimension, input.toUnit);
  const cat = getCategory(input.dimension);

  const explanation =
    cat.kind === 'temperature'
      ? `${formatWithPrecision(inputValue, input.precision)} ${from?.symbol ?? ''} → ${formatWithPrecision(forward.value, input.precision)} ${to?.symbol ?? ''} (affine temperature)`
      : `1 ${from?.symbol ?? ''} = ${formatWithPrecision(factorFromToOne ?? 0, input.precision)} ${to?.symbol ?? ''}`;

  return {
    dimension: input.dimension,
    fromUnit: input.fromUnit,
    toUnit: input.toUnit,
    inputValue,
    outputValue: forward.value,
    factorFromToOne: factorFromToOne ?? Number.NaN,
    factorToFromOne: factorToFromOne ?? Number.NaN,
    formattedInput: formatWithPrecision(inputValue, input.precision),
    formattedOutput: formatWithPrecision(forward.value, input.precision),
    explanation,
  };
}

export function shareResultText(result: MeasurementResult): string {
  const cat = getCategory(result.dimension);
  const from = getUnit(result.dimension, result.fromUnit);
  const to = getUnit(result.dimension, result.toUnit);
  const lines = [
    'Measurement Converter — Omega Calculators',
    '',
    `Category: ${cat.label} ${cat.symbol}`,
    '',
    `From: ${result.formattedInput} ${from?.name ?? result.fromUnit}`,
    `To: ${to?.name ?? result.toUnit}`,
    '',
    `Result: ${result.formattedOutput} ${to?.symbol ?? ''}`,
  ];
  if (Number.isFinite(result.factorFromToOne)) {
    lines.push(
      '',
      'Conversion factor:',
      `1 ${from?.symbol ?? ''} = ${formatWithPrecision(result.factorFromToOne, 'auto')} ${to?.symbol ?? ''}`,
    );
  }
  return lines.join('\n');
}
