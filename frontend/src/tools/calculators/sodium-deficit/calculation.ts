/**
 * Sodium deficit — educational (ADR-018).
 *
 * TBW (L) = weight_kg × demographic fraction
 * Sodium deficit (mmol) = TBW × (desired Na − serum Na)
 *
 * Fractions (Omni): child/adult male 0.6; adult female/elderly male 0.5;
 * elderly female 0.45. mEq/L ≡ mmol/L for sodium.
 *
 * Hyponatremia teaching estimate only — not a saline order or correction rate.
 */

import type {
  AgeSexCategory,
  SodiumDeficitInput,
  SodiumDeficitResult,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'TBW = weight_kg × age/sex fraction; sodium deficit (mmol) = TBW × (desired Na − serum Na). Fractions: child/adult male 0.6; adult female/elderly male 0.5; elderly female 0.45 (Omni). Educational estimate for hyponatremia — not a replacement order.';

export const DISCLAIMER =
  'Not a diagnosis or treatment plan — confirm with a clinician; correction rate and fluid choice are separate decisions.';

export const TBW_FRACTION: Record<AgeSexCategory, number> = {
  child: 0.6,
  adult_male: 0.6,
  adult_female: 0.5,
  elderly_male: 0.5,
  elderly_female: 0.45,
};

export const KG_PER_LB = 0.45359237;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KG_PER_LB : value;
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / KG_PER_LB : kg;
}

export function sodiumDeficitMmol(
  weightKg: number,
  fraction: number,
  serumMeqL: number,
  desiredMeqL: number,
): number {
  return weightKg * fraction * (desiredMeqL - serumMeqL);
}

export function formatMmol(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function calculateSodiumDeficit(
  input: SodiumDeficitInput,
): SodiumDeficitResult {
  const empty = {
    tbwFraction: null,
    weightKg: null,
    tbwL: null,
    sodiumMeqL: null,
    desiredMeqL: null,
    deficitMmol: null,
    formattedDeficit: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const fraction = TBW_FRACTION[input.category];
  const weightRaw = parseNumber(input.weightText);
  const sodiumRaw = parseNumber(input.sodiumText);
  const desiredRaw = parseNumber(input.desiredSodiumText);

  if (weightRaw === null || sodiumRaw === null || desiredRaw === null) {
    return {
      ...empty,
      tbwFraction: fraction,
      statusHeadline: 'Enter weight and sodium',
      statusDetail:
        'Enter body weight, serum sodium, and desired sodium to estimate sodium deficit.',
    };
  }

  if (!(weightRaw > 0)) {
    return {
      ...empty,
      tbwFraction: fraction,
      statusHeadline: 'Invalid weight',
      statusDetail: 'Body weight must be greater than zero.',
    };
  }

  if (!(sodiumRaw > 0)) {
    return {
      ...empty,
      tbwFraction: fraction,
      statusHeadline: 'Invalid sodium',
      statusDetail: 'Serum sodium must be greater than zero.',
    };
  }

  if (!(desiredRaw > 0)) {
    return {
      ...empty,
      tbwFraction: fraction,
      statusHeadline: 'Invalid desired sodium',
      statusDetail: 'Desired sodium must be greater than zero.',
    };
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const tbwL = weightKg * fraction;
  const deficitRaw = sodiumDeficitMmol(
    weightKg,
    fraction,
    sodiumRaw,
    desiredRaw,
  );
  const deficitMmol = Math.round(deficitRaw * 10) / 10;

  let statusHeadline = 'Sodium deficit';
  let statusDetail = `Estimated sodium deficit ≈ ${formatMmol(deficitMmol)} mmol (TBW ≈ ${formatMmol(Math.round(tbwL * 100) / 100)} L).`;

  if (Math.abs(deficitRaw) < 1e-12) {
    statusHeadline = 'No sodium deficit';
    statusDetail =
      'Serum sodium equals desired sodium — estimated sodium deficit is 0 mmol.';
  } else if (sodiumRaw > desiredRaw) {
    statusHeadline = 'Out of scope for hyponatremia deficit';
    statusDetail = `Signed estimate ≈ ${formatMmol(deficitMmol)} mmol. Serum sodium is above desired — this worksheet targets hyponatremia sodium deficit, not hypernatremia free-water planning.`;
  }

  return {
    tbwFraction: fraction,
    weightKg,
    tbwL,
    sodiumMeqL: sodiumRaw,
    desiredMeqL: desiredRaw,
    deficitMmol,
    formattedDeficit: formatMmol(deficitMmol),
    statusHeadline,
    statusDetail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
