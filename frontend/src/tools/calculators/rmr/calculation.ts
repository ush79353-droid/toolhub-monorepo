/**
 * RMR Calculator — UI stub (engine commit fills Harris–Benedict × TEF math).
 */

import type { HeightUnit, RmrInput, RmrResult, WeightUnit } from './types';

export const SOURCE_NOTE =
  'Original Harris–Benedict (1919) × TEF 1.1 for resting metabolic rate (kcal/day). Educational estimate only.';

export const DISCLAIMER =
  'Educational resting-energy estimate — not individualized medical nutrition therapy.';

export const EQUATION_LABEL = 'Harris–Benedict (1919) × TEF 1.1';

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  return unit === 'cm' ? value : value * IN_TO_CM;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function calculateRmr(_input: RmrInput): RmrResult {
  return {
    rmrKcalPerDay: null,
    rmrDisplay: '',
    statusHeadline: 'Enter age, height, and weight',
    statusDetail:
      'Complete anthropometrics to estimate resting metabolic rate (kcal/day).',
    equationLabel: EQUATION_LABEL,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
