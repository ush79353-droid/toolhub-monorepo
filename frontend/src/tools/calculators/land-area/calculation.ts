import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import {
  AREA_TO_SQUARE_METERS,
  AREA_UNIT_LABEL,
  LENGTH_TO_METERS,
  RESULT_CAP,
  type AreaUnit,
  type LandAreaInput,
  type LandAreaResult,
  type LengthUnit,
} from './types';

export function lengthToMeters(value: number, unit: LengthUnit): number {
  return value * LENGTH_TO_METERS[unit];
}

export function metersToLength(meters: number, unit: LengthUnit): number {
  return meters / LENGTH_TO_METERS[unit];
}

export function areaToSquareMeters(value: number, unit: AreaUnit): number {
  return value * AREA_TO_SQUARE_METERS[unit];
}

export function squareMetersToArea(squareMeters: number, unit: AreaUnit): number {
  return squareMeters / AREA_TO_SQUARE_METERS[unit];
}

export function areaUnitLabel(unit: AreaUnit): string {
  return AREA_UNIT_LABEL[unit];
}

/** Pure rectangular land area with independent length units → selected area unit. */
export function calculateLandArea(
  width: number,
  widthUnit: LengthUnit,
  length: number,
  lengthUnit: LengthUnit,
  outputUnit: AreaUnit,
): number {
  if (!Number.isFinite(width) || !Number.isFinite(length) || width < 0 || length < 0) {
    throw new Error('Invalid land dimensions');
  }
  const areaSquareMeters =
    lengthToMeters(width, widthUnit) * lengthToMeters(length, lengthUnit);
  if (!Number.isFinite(areaSquareMeters)) {
    throw new Error('Invalid land dimensions');
  }
  return areaSquareMeters / AREA_TO_SQUARE_METERS[outputUnit];
}

export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
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
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  const raw = String(rounded);
  if (raw.includes('e') || raw.includes('E')) return raw;
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, frac] = unsigned.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = frac != null ? `${grouped}.${frac}` : grouped;
  return negative ? `-${body}` : body;
}

export function roundDisplay(value: number): number {
  if (!Number.isFinite(value)) return value;
  const abs = Math.abs(value);
  if (abs === 0) return 0;
  if (abs >= 1_000_000) return Math.round(value * 100) / 100;
  if (abs >= 1) return Math.round(value * 1_000_000) / 1_000_000;
  if (abs >= 1e-6) return Math.round(value * 1e12) / 1e12;
  return value;
}

function totalPriceFromArea(
  areaSquareMeters: number,
  pricePerUnit: number | null,
  priceAreaUnit: AreaUnit,
): number | null {
  if (pricePerUnit === null || !Number.isFinite(pricePerUnit) || pricePerUnit < 0) {
    return null;
  }
  const total = squareMetersToArea(areaSquareMeters, priceAreaUnit) * pricePerUnit;
  if (!Number.isFinite(total) || Math.abs(total) > RESULT_CAP) return null;
  return roundDisplay(total);
}

export function calculateLandAreaResult(input: LandAreaInput): LandAreaResult {
  const width = input.width!;
  const length = input.length!;
  const areaSquareMeters =
    lengthToMeters(width, input.widthUnit) * lengthToMeters(length, input.lengthUnit);

  if (!Number.isFinite(areaSquareMeters) || areaSquareMeters < 0 || areaSquareMeters > RESULT_CAP) {
    throw new Error('Area out of range');
  }

  const area = roundDisplay(squareMetersToArea(areaSquareMeters, input.areaUnit));
  const totalPrice = totalPriceFromArea(
    areaSquareMeters,
    input.pricePerUnit,
    input.priceAreaUnit,
  );

  return {
    currency: input.currency,
    width: roundDisplay(width),
    length: roundDisplay(length),
    area,
    widthUnit: input.widthUnit,
    lengthUnit: input.lengthUnit,
    areaUnit: input.areaUnit,
    areaSquareMeters,
    pricePerUnit: input.pricePerUnit,
    priceAreaUnit: input.priceAreaUnit,
    totalPrice,
    explanation: `${formatMeasure(width)} ${input.widthUnit} × ${formatMeasure(length)} ${input.lengthUnit} = ${formatMeasure(area)} ${areaUnitLabel(input.areaUnit)}`,
  };
}

export function shareResultText(result: LandAreaResult): string {
  const lines = [
    'Land Area Calculator | Omega Calculators',
    '',
    `Width: ${formatMeasure(result.width)} ${result.widthUnit}`,
    `Length: ${formatMeasure(result.length)} ${result.lengthUnit}`,
    `Area: ${formatMeasure(result.area)} ${areaUnitLabel(result.areaUnit)}`,
  ];
  if (result.totalPrice !== null && result.pricePerUnit !== null) {
    lines.push(
      '',
      `Price per ${areaUnitLabel(result.priceAreaUnit)}: ${formatCurrencyValue(result.pricePerUnit, result.currency)}`,
      `Total Price: ${formatCurrencyValue(result.totalPrice, result.currency)}`,
      CURRENCY_DENOMINATION_NOTE,
    );
  }
  lines.push('', '/tools/land-area-calculator');
  return lines.join('\n');
}
