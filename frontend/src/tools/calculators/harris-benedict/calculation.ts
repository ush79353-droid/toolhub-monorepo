/**
 * Harris–Benedict Calculator — basal metabolic rate (ADR-018).
 *
 * Equation: revised Harris–Benedict resting energy (Roza & Shizgal, 1984),
 * sharing `revisedHarrisBenedictBeeKcalPerDay` with the BEE calculator.
 *
 * Men:   88.362 + 13.397×kg + 4.799×cm − 5.677×age
 * Women: 447.593 + 9.247×kg + 3.098×cm − 4.330×age
 *
 * Primary sources:
 * - Harris JA, Benedict FG. A Biometric Study of Human Basal Metabolism.
 *   Proc Natl Acad Sci USA. 1918;4(12):370-373 (original coefficients).
 * - Roza AM, Shizgal HM. The Harris Benedict equation reevaluated: resting
 *   energy requirements and the body cell mass. Am J Clin Nutr. 1984;40(1):168-182.
 *
 * Scope: basal kcal/day only — no activity / stress / temperature multipliers.
 */

import { revisedHarrisBenedictBeeKcalPerDay } from '../bee-calculator/calculation';
import type {
  HarrisBenedictInput,
  HarrisBenedictResult,
  HeightUnit,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Revised Harris–Benedict BMR (Roza & Shizgal, Am J Clin Nutr 1984) in kcal/day; shares BEE basal helper. Educational estimate only.';

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

/** Round BMR for display only — engine keeps full precision in bmrKcalPerDay. */
export function formatBmrKcal(kcalPerDay: number | null): string {
  if (kcalPerDay == null || !Number.isFinite(kcalPerDay)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    useGrouping: true,
  }).format(Math.round(kcalPerDay));
}

export function calculateHarrisBenedict(
  input: HarrisBenedictInput,
): HarrisBenedictResult {
  const empty: HarrisBenedictResult = {
    bmrKcalPerDay: null,
    bmrDisplay: '',
    statusHeadline: 'Enter age, height, and weight',
    statusDetail:
      'Complete anthropometrics to estimate basal metabolic rate (kcal/day).',
    equationLabel: EQUATION_LABEL,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  const age = parseNumber(input.ageYearsText);
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);

  if (age === null || hRaw === null || wRaw === null) {
    return empty;
  }

  if (!(age >= 15 && age <= 100)) {
    return {
      ...empty,
      statusHeadline: 'Invalid age',
      statusDetail: 'Age must be between 15 and 100 years for this equation.',
    };
  }

  if (!(hRaw > 0) || !(wRaw > 0)) {
    return {
      ...empty,
      statusHeadline: 'Invalid height or weight',
      statusDetail: 'Height and weight must be positive numbers.',
    };
  }

  const heightCm = heightToCm(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);

  let bmr: number;
  try {
    bmr = revisedHarrisBenedictBeeKcalPerDay(
      input.sex,
      age,
      heightCm,
      weightKg,
    );
  } catch {
    return {
      ...empty,
      statusHeadline: 'Unable to calculate',
      statusDetail: 'Check age, height, and weight are within equation limits.',
    };
  }

  if (!Number.isFinite(bmr) || bmr <= 0) {
    return {
      ...empty,
      statusHeadline: 'Unable to calculate',
      statusDetail: 'Resulting BMR was not a positive finite value.',
    };
  }

  const display = formatBmrKcal(bmr);

  return {
    bmrKcalPerDay: bmr,
    bmrDisplay: display,
    statusHeadline: 'Basal metabolic rate estimate',
    statusDetail: `BMR ≈ ${display} kcal/day (revised Harris–Benedict; resting only).`,
    equationLabel: EQUATION_LABEL,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
