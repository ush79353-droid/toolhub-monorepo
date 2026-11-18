import { formatLength as formatShared } from '../centimeter/calculation';
import {
  convertLength,
  UNIT_SYMBOLS,
  type LengthUnit,
} from '../centimeter/units';
import {
  CM_PER_KM,
  EXTRA_LENGTH_UNITS,
  type CmToKmInput,
  type CmToKmResult,
  type CmToKmSource,
} from './types';

export { formatShared as formatLength };

const SYNC_UNITS: readonly LengthUnit[] = ['cm', 'km', ...EXTRA_LENGTH_UNITS];

/** Alias matching the brief API name. */
export function centimetersToKilometers(cm: number): number {
  return convertLength(cm, 'cm', 'km');
}

/** Alias matching the brief API name. */
export function kilometersToCentimeters(km: number): number {
  return convertLength(km, 'km', 'cm');
}

function valuesFromCentimeters(centimeters: number): Record<LengthUnit, number> {
  const out = {} as Record<LengthUnit, number>;
  for (const unit of SYNC_UNITS) {
    out[unit] = convertLength(centimeters, 'cm', unit);
  }
  return out;
}

export function calculateCmToKm(input: CmToKmInput): CmToKmResult {
  const source = input.source;
  const raw = input.value!;
  const centimeters = source === 'cm' ? raw : convertLength(raw, source, 'cm');
  const kilometers = centimetersToKilometers(centimeters);
  const values = valuesFromCentimeters(centimeters);

  const explanation =
    source === 'cm'
      ? `${formatShared(centimeters)} cm ÷ ${CM_PER_KM} = ${formatShared(kilometers)} km`
      : source === 'km'
        ? `${formatShared(kilometers)} km × ${CM_PER_KM} = ${formatShared(centimeters)} cm`
        : `${formatShared(raw)} ${UNIT_SYMBOLS[source]} → ${formatShared(centimeters)} cm = ${formatShared(kilometers)} km`;

  return {
    source,
    centimeters,
    kilometers,
    values,
    explanation,
  };
}

export function shareResultText(result: CmToKmResult): string {
  return [
    'CM to KM Conversion — Omega Calculators',
    '',
    `${formatShared(result.centimeters)} cm = ${formatShared(result.kilometers)} km`,
  ].join('\n');
}

export function unitLabel(source: CmToKmSource): string {
  return UNIT_SYMBOLS[source];
}
