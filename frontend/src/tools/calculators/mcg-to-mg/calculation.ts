import {
  GRAMS_PER_KILOGRAM,
  MICROGRAMS_PER_MILLIGRAM,
  MILLIGRAMS_PER_CENTIGRAM,
  MILLIGRAMS_PER_DECIGRAM,
  MILLIGRAMS_PER_GRAM,
  NANOGRAMS_PER_MICROGRAM,
  type McgToMgInput,
  type McgToMgResult,
  type OtherUnitRow,
} from './types';

/**
 * Readable mass display without ugly trailing zeros.
 * Keeps enough digits for microgram-scale values (e.g. 0.0001 mg).
 */
export function formatMass(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function mcgToMg(mcg: number): number {
  return mcg / MICROGRAMS_PER_MILLIGRAM;
}

export function mgToMcg(mg: number): number {
  return mg * MICROGRAMS_PER_MILLIGRAM;
}

function otherUnitsFromMcg(mcg: number): readonly OtherUnitRow[] {
  const mg = mcgToMg(mcg);
  const grams = mg / MILLIGRAMS_PER_GRAM;
  return [
    { unit: 'ng', label: 'Nanograms (ng)', value: mcg * NANOGRAMS_PER_MICROGRAM },
    { unit: 'mcg', label: 'Micrograms (mcg / µg)', value: mcg },
    { unit: 'mg', label: 'Milligrams (mg)', value: mg },
    { unit: 'cg', label: 'Centigrams (cg)', value: mg / MILLIGRAMS_PER_CENTIGRAM },
    { unit: 'dg', label: 'Decigrams (dg)', value: mg / MILLIGRAMS_PER_DECIGRAM },
    { unit: 'g', label: 'Grams (g)', value: grams },
    { unit: 'kg', label: 'Kilograms (kg)', value: grams / GRAMS_PER_KILOGRAM },
  ];
}

export function calculateMcgToMg(input: McgToMgInput): McgToMgResult {
  let mcg: number;
  let mg: number;

  if (input.source === 'mcg') {
    mcg = input.mcg!;
    mg = mcgToMg(mcg);
  } else {
    mg = input.mg!;
    mcg = mgToMcg(mg);
  }

  return {
    source: input.source,
    mcg,
    mg,
    otherUnits: otherUnitsFromMcg(mcg),
  };
}
