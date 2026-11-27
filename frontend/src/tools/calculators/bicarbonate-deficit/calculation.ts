/**
 * Bicarbonate deficit estimate — educational (ADR-018).
 *
 * deficit (mmol) = 0.5 L/kg × weight_kg × (desired − actual) mmol/L
 *
 * The concentration gap is in mmol/L; the estimated replacement *amount*
 * is in mmol (≡ mEq). Some reference UIs mislabel the amount as mmol/L —
 * this module labels mmol after clinical unit review (prompt).
 *
 * Does not derive infusion rates, ampoule counts, or treatment plans.
 */

import type {
  BicarbonateDeficitInput,
  BicarbonateDeficitResult,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Bicarbonate deficit (mmol) = 0.5 × weight_kg × (desired HCO₃ − actual HCO₃). Factor 0.5 L/kg is a classic teaching approximation of bicarbonate space; result is an amount in mmol, not a concentration in mmol/L.';

export const DISCLAIMER =
  'Not a diagnosis, lab report, or treatment plan — do not use this estimate alone to dose sodium bicarbonate; reassess labs and clinical status with your clinician.';

/** Classic bicarbonate-space factor (L/kg). */
export const BICARB_SPACE_L_PER_KG = 0.5;

/** lb → kg. */
export const LB_TO_KG = 0.45359237;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * LB_TO_KG : value;
}

export function weightFromKg(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / LB_TO_KG : kg;
}

/**
 * Estimated bicarbonate deficit amount in mmol.
 */
export function bicarbonateDeficitMmol(
  weightKg: number,
  actualMmolL: number,
  desiredMmolL: number,
): number {
  return (
    BICARB_SPACE_L_PER_KG * weightKg * (desiredMmolL - actualMmolL)
  );
}

export function formatWeight(value: number | null, unit: WeightUnit): string {
  if (value == null || !Number.isFinite(value)) return '';
  const digits = unit === 'lb' ? 1 : 2;
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatMmol(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function calculateBicarbonateDeficit(
  input: BicarbonateDeficitInput,
): BicarbonateDeficitResult {
  const empty = {
    weightKg: null,
    actualMmolL: null,
    desiredMmolL: null,
    concentrationGapMmolL: null,
    deficitMmol: null,
    formattedDeficit: '',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const weightRaw = parseNumber(input.weightText);
  const actualRaw = parseNumber(input.actualBicarbText);
  const desiredRaw = parseNumber(input.desiredBicarbText);

  if (weightRaw === null || actualRaw === null || desiredRaw === null) {
    return {
      ...empty,
      statusHeadline: 'Enter weight and bicarbonate levels',
      statusDetail:
        'Enter patient weight, actual HCO₃, and desired HCO₃ to estimate the bicarbonate deficit amount.',
    };
  }

  if (!(weightRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid weight',
      statusDetail: 'Weight must be greater than zero.',
    };
  }

  if (!(actualRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid actual bicarbonate',
      statusDetail: 'Actual bicarbonate must be greater than zero.',
    };
  }

  if (!(desiredRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid desired bicarbonate',
      statusDetail: 'Desired bicarbonate must be greater than zero.',
    };
  }

  const weightKg = weightToKg(weightRaw, input.weightUnit);
  const concentrationGapMmolL = desiredRaw - actualRaw;
  const deficitMmol = bicarbonateDeficitMmol(
    weightKg,
    actualRaw,
    desiredRaw,
  );
  const rounded =
    Math.round(deficitMmol * 10) / 10;

  const gapRounded = Math.round(concentrationGapMmolL * 10) / 10;

  return {
    weightKg,
    actualMmolL: actualRaw,
    desiredMmolL: desiredRaw,
    concentrationGapMmolL: gapRounded,
    deficitMmol: rounded,
    formattedDeficit: formatMmol(rounded),
    statusHeadline:
      rounded === 0
        ? 'No estimated deficit'
        : rounded > 0
          ? 'Estimated bicarbonate deficit'
          : 'Estimated bicarbonate surplus (negative deficit)',
    statusDetail: `Concentration gap ${formatMmol(gapRounded)} mmol/L × ${formatWeight(weightKg, 'kg')} kg × 0.5 L/kg ≈ ${formatMmol(rounded)} mmol (amount). Not an infusion order.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
