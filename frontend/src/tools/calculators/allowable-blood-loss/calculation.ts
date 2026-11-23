/**
 * Maximum allowable blood loss (MABL) — Gross formula (ADR-018).
 *
 *   EBV (mL) = weight (kg) × blood volume (mL/kg) for age/sex category
 *   MABL (mL) = EBV × (initial Hb − lowest Hb) ÷ average Hb
 *   average Hb = (initial Hb + lowest Hb) ÷ 2
 *
 * Lowest acceptable hemoglobin is clinician-supplied (default display 10 g/dL).
 * Rejects lowest Hb above initial Hb. Equal Hb yields zero allowable loss.
 *
 * Blood volume factors (mL/kg): adult female 65, adult male 75, child 80,
 * neonate 85 — standard anesthesia teaching values.
 */

import type { AgeSexCategory, AllowableBloodLossInput, AllowableBloodLossResult } from './types';
import { bloodVolumeMlPerKgForCategory } from './types';

export const DENOMINATOR_NOTE =
  'Average hemoglobin = (initial Hb + lowest acceptable Hb) ÷ 2 is the denominator in this Gross maximum allowable blood loss formula.';

export const SOURCE_NOTE =
  'MABL (mL) = estimated blood volume × (initial hemoglobin − lowest acceptable hemoglobin) ÷ average hemoglobin. Lowest acceptable hemoglobin is a clinician threshold, not a universal constant. Educational arithmetic only.';

export const DISCLAIMER =
  'Educational perioperative calculator — not transfusion guidance or a clinical order.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function estimatedBloodVolumeMl(
  weightKg: number,
  category: AgeSexCategory,
): number {
  if (!(Number.isFinite(weightKg) && weightKg > 0)) {
    throw new Error('Weight must be a positive finite number.');
  }
  const mlPerKg = bloodVolumeMlPerKgForCategory(category);
  return weightKg * mlPerKg;
}

/**
 * Gross maximum allowable blood loss in milliliters.
 * @throws when lowest Hb exceeds initial Hb
 */
export function allowableBloodLossMl(
  ebcMl: number,
  initialHbGPerDl: number,
  lowestHbGPerDl: number,
): number {
  if (!(Number.isFinite(ebcMl) && ebcMl > 0)) {
    throw new Error('Estimated blood volume must be positive.');
  }
  if (!(Number.isFinite(initialHbGPerDl) && initialHbGPerDl > 0)) {
    throw new Error('Initial hemoglobin must be positive.');
  }
  if (!(Number.isFinite(lowestHbGPerDl) && lowestHbGPerDl > 0)) {
    throw new Error('Lowest acceptable hemoglobin must be positive.');
  }
  if (lowestHbGPerDl > initialHbGPerDl) {
    throw new Error(
      'Lowest acceptable hemoglobin cannot exceed initial hemoglobin.',
    );
  }
  if (lowestHbGPerDl === initialHbGPerDl) return 0;
  const averageHb = (initialHbGPerDl + lowestHbGPerDl) / 2;
  return (ebcMl * (initialHbGPerDl - lowestHbGPerDl)) / averageHb;
}

export function calculateAllowableBloodLoss(
  input: AllowableBloodLossInput,
): AllowableBloodLossResult {
  const weight = parseNumber(input.weightKgText);
  const initialHb = parseNumber(input.initialHemoglobinGPerDlText);
  const lowestHb = parseNumber(input.lowestAcceptableHemoglobinGPerDlText);

  const empty = {
    estimatedBloodVolumeMl: null,
    allowableBloodLossMl: null,
    denominatorNote: DENOMINATOR_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (weight === null || initialHb === null || lowestHb === null) {
    return {
      ...empty,
      statusHeadline: 'Enter weight and hemoglobin',
      statusDetail:
        'Enter weight (kg), initial hemoglobin (g/dL), and lowest acceptable hemoglobin (g/dL) to compute allowable blood loss.',
    };
  }

  if (!(weight > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid weight',
      statusDetail: 'Weight must be positive.',
    };
  }

  if (!(initialHb > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid initial hemoglobin',
      statusDetail: 'Initial hemoglobin must be positive.',
    };
  }

  if (!(lowestHb > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid lowest hemoglobin',
      statusDetail: 'Lowest acceptable hemoglobin must be positive.',
    };
  }

  if (lowestHb > initialHb) {
    return {
      ...empty,
      statusHeadline: 'Lowest Hb above initial',
      statusDetail:
        'Lowest acceptable hemoglobin cannot be greater than initial hemoglobin. Allowable blood loss is zero only when they are equal.',
    };
  }

  const ebv = estimatedBloodVolumeMl(weight, input.ageSexCategory);
  const mabl = allowableBloodLossMl(ebv, initialHb, lowestHb);
  const mlPerKg = bloodVolumeMlPerKgForCategory(input.ageSexCategory);

  return {
    estimatedBloodVolumeMl: ebv,
    allowableBloodLossMl: mabl,
    statusHeadline: 'Allowable blood loss',
    statusDetail: `EBV ≈ ${formatMl(ebv)} mL (weight × ${mlPerKg} mL/kg). MABL = ${formatMl(ebv)} × (${initialHb} − ${lowestHb}) ÷ ${formatHb((initialHb + lowestHb) / 2)} = ${formatMl(mabl)} mL.`,
    denominatorNote: DENOMINATOR_NOTE,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function formatMl(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(value));
}

export function formatHb(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}