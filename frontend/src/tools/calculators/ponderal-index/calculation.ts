/**
 * Ponderal Index (Rohrer's index) — educational (ADR-018).
 *
 * Adult: PI = weight_kg / height_m³  (kg/m³)
 * Neonate/infant: PI = 100 × weight_g / height_cm³  (= 0.1 × adult PI for same body)
 *
 * Rohrer 1921; Omni documents adult kg/m³ and neonatal 100×g/cm³ convention.
 */

import type {
  HeightUnit,
  PersonMode,
  PonderalInput,
  PonderalResult,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Adult PI = weight (kg) ÷ height (m)³. Neonate/infant PI = 100 × weight (g) ÷ height (cm)³ (Rohrer / Omni convention). Educational only.';

export const DISCLAIMER =
  'Always double-check the calculations. The Ponderal Index has limitations, and the results should be interpreted by a health care provider.';

const M_PER_INCH = 0.0254;
const M_PER_FOOT = 0.3048;
const KG_PER_LB = 0.45359237;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToMeters(value: number, unit: HeightUnit): number {
  switch (unit) {
    case 'm':
      return value;
    case 'cm':
      return value / 100;
    case 'in':
      return value * M_PER_INCH;
    case 'ft':
      return value * M_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function metersToHeight(meters: number, unit: HeightUnit): number {
  switch (unit) {
    case 'm':
      return meters;
    case 'cm':
      return meters * 100;
    case 'in':
      return meters / M_PER_INCH;
    case 'ft':
      return meters / M_PER_FOOT;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function weightToKg(value: number, unit: WeightUnit): number {
  switch (unit) {
    case 'kg':
      return value;
    case 'g':
      return value / 1000;
    case 'lb':
      return value * KG_PER_LB;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  switch (unit) {
    case 'kg':
      return kg;
    case 'g':
      return kg * 1000;
    case 'lb':
      return kg / KG_PER_LB;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

/** Adult PI (kg/m³). */
export function adultPonderalIndex(weightKg: number, heightM: number): number {
  if (!(heightM > 0) || !Number.isFinite(heightM)) {
    throw new RangeError('Height must be positive.');
  }
  if (!(weightKg > 0) || !Number.isFinite(weightKg)) {
    throw new RangeError('Weight must be positive.');
  }
  return weightKg / Math.pow(heightM, 3);
}

/**
 * Neonate PI = 100 × g / cm³.
 * Equivalent to 0.1 × (kg / m³) for the same body.
 */
export function neonatePonderalIndex(weightKg: number, heightM: number): number {
  return 0.1 * adultPonderalIndex(weightKg, heightM);
}

export function formatIndex(value: number): string {
  return String(Number(value.toFixed(2)));
}

export function unitLabelFor(mode: PersonMode): string {
  return mode === 'adult' ? 'kg/m³' : '100×g/cm³';
}

function emptyResult(
  mode: PersonMode,
  partial?: Partial<PonderalResult>,
): PonderalResult {
  return {
    heightMeters: null,
    weightKg: null,
    index: null,
    formattedIndex: '',
    unitLabel: unitLabelFor(mode),
    statusHeadline: 'Enter height and weight.',
    statusDetail: 'Ponderal index updates when both values are positive.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculatePonderal(input: PonderalInput): PonderalResult {
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);
  if (hRaw === null || wRaw === null) {
    return emptyResult(input.mode);
  }
  if (!(hRaw > 0) || !(wRaw > 0)) {
    return emptyResult(input.mode, {
      statusHeadline: 'Height and weight must be greater than zero.',
      statusDetail: 'Ponderal index is undefined for zero or negative inputs.',
    });
  }

  const heightMeters = heightToMeters(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);

  try {
    const index =
      input.mode === 'adult'
        ? adultPonderalIndex(weightKg, heightMeters)
        : neonatePonderalIndex(weightKg, heightMeters);
    if (!Number.isFinite(index)) {
      return emptyResult(input.mode, {
        statusHeadline: 'Unable to compute ponderal index.',
        statusDetail: 'Result was non-finite.',
      });
    }
    return {
      heightMeters,
      weightKg,
      index,
      formattedIndex: formatIndex(index),
      unitLabel: unitLabelFor(input.mode),
      statusHeadline: 'Ponderal index computed.',
      statusDetail:
        input.mode === 'adult'
          ? 'Adult Rohrer index in kg per cubic meter.'
          : 'Neonate/infant index as 100 × g/cm³ (0.1 × adult scale).',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  } catch {
    return emptyResult(input.mode, {
      statusHeadline: 'Unable to compute ponderal index.',
      statusDetail: 'Check that height and weight are positive finite numbers.',
    });
  }
}
