/**
 * Harris–Benedict Calculator — UI stub (engine commit fills revised BMR math).
 */

import type {
  HarrisBenedictInput,
  HarrisBenedictResult,
  HeightUnit,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Revised Harris–Benedict BMR (Roza & Shizgal, 1984) in kcal/day. Educational estimate only.';

export const DISCLAIMER =
  'Educational resting-energy estimate — not individualized medical nutrition therapy.';

export const EQUATION_LABEL = 'Revised Harris–Benedict (Roza & Shizgal, 1984)';

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

export function calculateHarrisBenedict(
  _input: HarrisBenedictInput,
): HarrisBenedictResult {
  return {
    bmrKcalPerDay: null,
    bmrDisplay: '',
    statusHeadline: 'Enter age, height, and weight',
    statusDetail:
      'Complete anthropometrics to estimate basal metabolic rate (kcal/day).',
    equationLabel: EQUATION_LABEL,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
