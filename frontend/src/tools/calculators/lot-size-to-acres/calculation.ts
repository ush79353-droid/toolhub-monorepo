import { CURRENCY_DENOMINATION_NOTE, formatCurrencyValue } from '@/tools/shared/currency';
import {
  AREA_UNIT_LABEL,
  METERS_PER_LENGTH_UNIT,
  RESULT_CAP,
  SQ_FEET_PER_ACRE,
  SQ_METERS_PER_ACRE,
  SQ_YARDS_PER_ACRE,
  SQUARE_METERS_PER_AREA_UNIT,
  type AreaUnit,
  type LengthUnit,
  type LotSizeToAcresInput,
  type LotSizeToAcresResult,
} from './types';

export function lengthToMeters(value: number, unit: LengthUnit): number {
  return value * METERS_PER_LENGTH_UNIT[unit];
}

export function metersToLength(meters: number, unit: LengthUnit): number {
  return meters / METERS_PER_LENGTH_UNIT[unit];
}

export function areaToSquareMeters(value: number, unit: AreaUnit): number {
  return value * SQUARE_METERS_PER_AREA_UNIT[unit];
}

export function squareMetersToArea(squareMeters: number, unit: AreaUnit): number {
  return squareMeters / SQUARE_METERS_PER_AREA_UNIT[unit];
}

export function calculateLotArea(widthMeters: number, lengthMeters: number): number {
  return widthMeters * lengthMeters;
}

export function squareMetersToAcres(squareMeters: number): number {
  return squareMeters / SQ_METERS_PER_ACRE;
}

export function acresToSquareMeters(acres: number): number {
  return acres * SQ_METERS_PER_ACRE;
}

export function squareFeetToAcres(squareFeet: number): number {
  return squareFeet / SQ_FEET_PER_ACRE;
}

export function acresToSquareFeet(acres: number): number {
  return acres * SQ_FEET_PER_ACRE;
}

export function squareYardsToAcres(squareYards: number): number {
  return squareYards / SQ_YARDS_PER_ACRE;
}

export function acresToSquareYards(acres: number): number {
  return acres * SQ_YARDS_PER_ACRE;
}

/** Readable measure display without ugly trailing zeros. */
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

export function areaUnitLabel(unit: AreaUnit): string {
  return AREA_UNIT_LABEL[unit];
}

function totalPriceFromArea(
  areaSquareMeters: number,
  pricePerUnit: number | null,
  priceAreaUnit: AreaUnit,
): number | null {
  if (pricePerUnit === null || !Number.isFinite(pricePerUnit) || pricePerUnit < 0) {
    return null;
  }
  const areaInPriceUnit = squareMetersToArea(areaSquareMeters, priceAreaUnit);
  const total = areaInPriceUnit * pricePerUnit;
  if (!Number.isFinite(total) || Math.abs(total) > RESULT_CAP) return null;
  return roundDisplay(total);
}

export function calculateLotSizeToAcres(input: LotSizeToAcresInput): LotSizeToAcresResult {
  let width: number;
  let length: number;
  let areaSquareMeters: number;

  if (input.source === 'dimensions') {
    width = input.width!;
    length = input.length!;
    areaSquareMeters = calculateLotArea(
      lengthToMeters(width, input.widthUnit),
      lengthToMeters(length, input.lengthUnit),
    );
  } else if (input.source === 'solveLength') {
    width = input.width!;
    areaSquareMeters = areaToSquareMeters(input.area!, input.areaUnit);
    const widthMeters = lengthToMeters(width, input.widthUnit);
    if (widthMeters === 0) {
      if (areaSquareMeters !== 0) throw new Error('Cannot solve length with zero width');
      length = 0;
    } else {
      length = metersToLength(areaSquareMeters / widthMeters, input.lengthUnit);
    }
  } else {
    length = input.length!;
    areaSquareMeters = areaToSquareMeters(input.area!, input.areaUnit);
    const lengthMeters = lengthToMeters(length, input.lengthUnit);
    if (lengthMeters === 0) {
      if (areaSquareMeters !== 0) throw new Error('Cannot solve width with zero length');
      width = 0;
    } else {
      width = metersToLength(areaSquareMeters / lengthMeters, input.widthUnit);
    }
  }

  if (!Number.isFinite(areaSquareMeters) || areaSquareMeters < 0 || areaSquareMeters > RESULT_CAP) {
    throw new Error('Area out of range');
  }
  if (!Number.isFinite(width) || !Number.isFinite(length)) {
    throw new Error('Dimension out of range');
  }

  const area = roundDisplay(squareMetersToArea(areaSquareMeters, input.areaUnit));
  const acres = squareMetersToAcres(areaSquareMeters);
  const totalPrice = totalPriceFromArea(areaSquareMeters, input.pricePerUnit, input.priceAreaUnit);

  const explanation =
    input.source === 'dimensions'
      ? `${formatMeasure(width)} ${input.widthUnit} × ${formatMeasure(length)} ${input.lengthUnit} = ${formatMeasure(area)} ${areaUnitLabel(input.areaUnit)} (${formatMeasure(roundDisplay(acres))} ac)`
      : input.source === 'solveLength'
        ? `Length = area ÷ width → ${formatMeasure(roundDisplay(length))} ${input.lengthUnit}`
        : `Width = area ÷ length → ${formatMeasure(roundDisplay(width))} ${input.widthUnit}`;

  return {
    source: input.source,
    currency: input.currency,
    width: roundDisplay(width),
    length: roundDisplay(length),
    area,
    widthUnit: input.widthUnit,
    lengthUnit: input.lengthUnit,
    areaUnit: input.areaUnit,
    areaSquareMeters,
    acres: roundDisplay(acres),
    pricePerUnit: input.pricePerUnit,
    priceAreaUnit: input.priceAreaUnit,
    totalPrice,
    explanation,
  };
}

export function shareResultText(result: LotSizeToAcresResult): string {
  const lines = [
    'Lot Size to Acres Calculator | Omega Calculators',
    '',
    `Width: ${formatMeasure(result.width)} ${result.widthUnit}`,
    `Length: ${formatMeasure(result.length)} ${result.lengthUnit}`,
    '',
    `Area: ${formatMeasure(result.area)} ${areaUnitLabel(result.areaUnit)}`,
    `Area in Acres: ${formatMeasure(result.acres)} ac`,
    '',
    'Formula:',
    'Area = Width × Length (after converting to a common length unit)',
  ];
  if (result.totalPrice !== null && result.pricePerUnit !== null) {
    lines.push(
      '',
      `Price: ${formatCurrencyValue(result.pricePerUnit, result.currency)} per ${areaUnitLabel(result.priceAreaUnit)}`,
      `Total: ${formatCurrencyValue(result.totalPrice, result.currency)}`,
      CURRENCY_DENOMINATION_NOTE,
    );
  }
  lines.push('', 'Rectangular lots only. Irregular boundaries need surveying.');
  return lines.join('\n');
}
