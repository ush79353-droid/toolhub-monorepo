import { fromSquareMeters, toSquareMeters, formatArea } from '../area-converter/calculation';
import type { AreaUnitId } from '../area-converter/types';
import { fromMeters, toMeters, formatLength } from '../length-converter/calculation';
import type { LengthUnitId } from '../length-converter/types';
import { convertTemperature, formatTemp, temperatureScales } from '../temperature/calculation';
import type { TemperatureUnit } from '../temperature/types';
import { fromLiters, toLiters, formatVolume } from '../volume-conversion/calculation';
import type { VolumeUnitId } from '../volume-conversion/types';
import { fromKilograms, toKilograms, formatMass } from '../weight-converter/calculation';
import type { MassUnitId } from '../weight-converter/types';
import {
  fieldsForCategory,
  type ImperialCategory,
  type ImperialInput,
  type ImperialResult,
} from './types';

export function formatImperial(value: number, category: ImperialCategory): string {
  if (category === 'length') return formatLength(value);
  if (category === 'area') return formatArea(value);
  if (category === 'volume') return formatVolume(value);
  if (category === 'mass') return formatMass(value);
  return formatTemp(value);
}

function toCanonical(category: ImperialCategory, key: string, value: number): number {
  if (category === 'length') return toMeters(value, key as LengthUnitId);
  if (category === 'area') return toSquareMeters(value, key as AreaUnitId);
  if (category === 'volume') return toLiters(value, key as VolumeUnitId);
  if (category === 'mass') return toKilograms(value, key as MassUnitId);
  return temperatureScales[key as TemperatureUnit].toKelvin(value);
}

function fromCanonical(category: ImperialCategory, key: string, canonical: number): number {
  if (category === 'length') return fromMeters(canonical, key as LengthUnitId);
  if (category === 'area') return fromSquareMeters(canonical, key as AreaUnitId);
  if (category === 'volume') return fromLiters(canonical, key as VolumeUnitId);
  if (category === 'mass') return fromKilograms(canonical, key as MassUnitId);
  return temperatureScales[key as TemperatureUnit].fromKelvin(canonical);
}

export function convertImperialField(
  value: number,
  category: ImperialCategory,
  fromKey: string,
  toKey: string,
): number {
  if (fromKey === toKey) return value;
  if (category === 'temperature') {
    return convertTemperature(value, fromKey as TemperatureUnit, toKey as TemperatureUnit);
  }
  return fromCanonical(category, toKey, toCanonical(category, fromKey, value));
}

export function calculateImperial(input: ImperialInput): ImperialResult {
  if (input.value === null || !Number.isFinite(input.value)) {
    throw new RangeError('Value must be a finite number.');
  }
  const fields = fieldsForCategory(input.category);
  const canonical = toCanonical(input.category, input.sourceKey, input.value);
  if (!Number.isFinite(canonical)) {
    throw new RangeError('Conversion produced a non-finite result.');
  }
  if (input.category === 'temperature' && canonical < 0) {
    throw new RangeError('Temperature cannot be below absolute zero.');
  }
  if (input.category !== 'temperature' && input.value < 0) {
    throw new RangeError('Quantity cannot be negative.');
  }

  const values: Record<string, number> = {};
  for (const field of fields) {
    values[field.key] = fromCanonical(input.category, field.key, canonical);
  }

  const source = fields.find((f) => f.key === input.sourceKey);
  const sourceLabel = source?.symbol ?? input.sourceKey;
  const highlights = pickHighlights(input.category, values);
  const explanation = [
    `Category: ${labelForCategory(input.category)}`,
    `${formatImperial(input.value, input.category)} ${sourceLabel}`,
    ...highlights,
  ].join('\n');

  return {
    category: input.category,
    sourceKey: input.sourceKey,
    canonical,
    values,
    explanation,
  };
}

function labelForCategory(category: ImperialCategory): string {
  if (category === 'length') return 'Length';
  if (category === 'area') return 'Area';
  if (category === 'volume') return 'Volume';
  if (category === 'mass') return 'Mass / Weight';
  return 'Temperature';
}

function pickHighlights(
  category: ImperialCategory,
  values: Record<string, number>,
): string[] {
  const fmt = (key: string, symbol: string) =>
    `${formatImperial(values[key]!, category)} ${symbol}`;

  if (category === 'length') {
    return [fmt('ft', 'ft'), fmt('cm', 'cm'), fmt('m', 'm')];
  }
  if (category === 'area') {
    return [fmt('ft2', 'ft²'), fmt('m2', 'm²'), fmt('ac', 'ac')];
  }
  if (category === 'volume') {
    return [fmt('usLiquidGal', 'US gal'), fmt('L', 'L'), fmt('imperialGal', 'Imp. gal')];
  }
  if (category === 'mass') {
    return [fmt('lb', 'lb'), fmt('kg', 'kg'), fmt('oz', 'oz')];
  }
  return [fmt('fahrenheit', '°F'), fmt('celsius', '°C'), fmt('kelvin', 'K')];
}

export function shareResultText(
  result: ImperialResult,
  brand = 'Imperial Calculator',
): string {
  const fields = fieldsForCategory(result.category);
  const lines = fields
    .filter((f) => f.section !== 'other')
    .slice(0, 8)
    .map(
      (f) =>
        `${formatImperial(result.values[f.key]!, result.category)} ${f.symbol}`,
    );

  return [
    `${brand} | Omega Calculators`,
    '',
    `Measurement: ${labelForCategory(result.category)}`,
    '',
    ...lines,
    '',
    'Calculated using Omega Calculators',
  ].join('\n');
}

/** Exact helpers used by tests / tables. */
export function inchesToFeet(inches: number): number {
  return convertImperialField(inches, 'length', 'in', 'ft');
}

export function feetToMeters(feet: number): number {
  return convertImperialField(feet, 'length', 'ft', 'm');
}

export function usGallonsToLiters(gallons: number): number {
  return convertImperialField(gallons, 'volume', 'usLiquidGal', 'L');
}

export function imperialGallonsToLiters(gallons: number): number {
  return convertImperialField(gallons, 'volume', 'imperialGal', 'L');
}

export function poundsToKilograms(pounds: number): number {
  return convertImperialField(pounds, 'mass', 'lb', 'kg');
}

export function celsiusToFahrenheit(celsius: number): number {
  return convertImperialField(celsius, 'temperature', 'celsius', 'fahrenheit');
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return convertImperialField(fahrenheit, 'temperature', 'fahrenheit', 'celsius');
}
