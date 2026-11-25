/**
 * Ideal body weight (IBW) estimates — educational (ADR-018).
 *
 * Classic adult inch-over-5-ft formulas (Pai & Paloucek, Ann Pharmacother 2000
 * review of Devine / Robinson / Miller / Hamwi teaching forms):
 *
 *   Devine:    ♂ 50 + 2.3×Δin    ♀ 45.5 + 2.3×Δin
 *   Robinson:  ♂ 52 + 1.9×Δin    ♀ 49 + 1.7×Δin
 *   Miller:    ♂ 56.2 + 1.41×Δin ♀ 53.1 + 1.36×Δin
 *   Hamwi:     ♂ 48 + 2.7×Δin    ♀ 45.5 + 2.2×Δin
 *
 * Δin = height_inches − 60. Current weight does not change IBW values
 * (comparison only). Extrapolation below 5 ft is allowed with a notice.
 */

import type {
  HeightUnit,
  IdealWeightInput,
  IdealWeightResult,
  IbwEstimate,
  IbwFormulaId,
  Sex,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'IBW (kg) from inches over 5 ft (60 in): Devine ♂50+2.3Δ / ♀45.5+2.3Δ; Robinson ♂52+1.9Δ / ♀49+1.7Δ; Miller ♂56.2+1.41Δ / ♀53.1+1.36Δ; Hamwi ♂48+2.7Δ / ♀45.5+2.2Δ. Educational only.';

export const DISCLAIMER =
  'Ideal-weight formulas are population heuristics — not a prescription, diagnosis, or athletic/clinical target for an individual.';

export const FIVE_FEET_INCHES = 60;
export const CM_PER_INCH = 2.54;
export const METERS_PER_INCH = 0.0254;
export const METERS_PER_FOOT = 0.3048;
export const KG_PER_POUND = 0.45359237;
export const KG_PER_STONE = KG_PER_POUND * 14;

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
      return value * METERS_PER_INCH;
    case 'ft':
      return value * METERS_PER_FOOT;
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
      return meters / METERS_PER_INCH;
    case 'ft':
      return meters / METERS_PER_FOOT;
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
    case 'lb':
      return value * KG_PER_POUND;
    case 'st':
      return value * KG_PER_STONE;
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
    case 'lb':
      return kg / KG_PER_POUND;
    case 'st':
      return kg / KG_PER_STONE;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function metersToInches(meters: number): number {
  return meters / METERS_PER_INCH;
}

export function inchesOverFiveFeet(heightInches: number): number {
  return heightInches - FIVE_FEET_INCHES;
}

type FormulaSpec = {
  id: IbwFormulaId;
  label: string;
  maleBase: number;
  malePerInch: number;
  femaleBase: number;
  femalePerInch: number;
};

const FORMULAS: readonly FormulaSpec[] = [
  {
    id: 'devine',
    label: 'Devine',
    maleBase: 50,
    malePerInch: 2.3,
    femaleBase: 45.5,
    femalePerInch: 2.3,
  },
  {
    id: 'robinson',
    label: 'Robinson',
    maleBase: 52,
    malePerInch: 1.9,
    femaleBase: 49,
    femalePerInch: 1.7,
  },
  {
    id: 'miller',
    label: 'Miller',
    maleBase: 56.2,
    malePerInch: 1.41,
    femaleBase: 53.1,
    femalePerInch: 1.36,
  },
  {
    id: 'hamwi',
    label: 'Hamwi',
    maleBase: 48,
    malePerInch: 2.7,
    femaleBase: 45.5,
    femalePerInch: 2.2,
  },
];

export function ibwKg(
  formula: FormulaSpec,
  sex: Sex,
  deltaInches: number,
): number {
  if (sex === 'male') {
    return formula.maleBase + formula.malePerInch * deltaInches;
  }
  return formula.femaleBase + formula.femalePerInch * deltaInches;
}

export function formatKg(kg: number): string {
  return (Math.round(kg * 10) / 10).toFixed(1);
}

function emptyResult(partial?: Partial<IdealWeightResult>): IdealWeightResult {
  return {
    heightCm: null,
    heightInches: null,
    currentWeightKg: null,
    estimates: [],
    inchesOverFiveFeet: null,
    belowFiveFeet: false,
    statusHeadline: 'Enter sex and height to see IBW estimates.',
    statusDetail:
      'Current weight is optional and does not change formula results — it only supports comparison text.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateIdealWeight(
  input: IdealWeightInput,
): IdealWeightResult {
  const heightRaw = parseNumber(input.heightText);
  const weightRaw = parseNumber(input.weightText);

  const currentWeightKg =
    weightRaw !== null && weightRaw > 0
      ? weightToKg(weightRaw, input.weightUnit)
      : null;

  if (heightRaw === null || !(heightRaw > 0)) {
    return emptyResult({
      currentWeightKg:
        currentWeightKg != null && Number.isFinite(currentWeightKg)
          ? currentWeightKg
          : null,
    });
  }

  const meters = heightToMeters(heightRaw, input.heightUnit);
  if (!(meters > 0) || !Number.isFinite(meters)) {
    return emptyResult({
      statusHeadline: 'Unable to interpret height.',
      statusDetail: 'Enter a positive finite height.',
    });
  }

  const heightInches = metersToInches(meters);
  const delta = inchesOverFiveFeet(heightInches);
  const belowFiveFeet = heightInches < FIVE_FEET_INCHES;

  const estimates: IbwEstimate[] = FORMULAS.map((formula) => {
    const kg = ibwKg(formula, input.sex, delta);
    const formattedKg = formatKg(kg);
    let formattedDisplay = `${formattedKg} kg`;
    if (currentWeightKg != null && Number.isFinite(currentWeightKg) && kg > 0) {
      const diff = currentWeightKg - kg;
      const sign = diff > 0 ? '+' : '';
      formattedDisplay = `${formattedKg} kg (${sign}${formatKg(diff)} kg vs current)`;
    }
    return {
      id: formula.id,
      label: formula.label,
      kg,
      formattedKg,
      formattedDisplay,
    };
  }).filter((e) => Number.isFinite(e.kg));

  return {
    heightCm: meters * 100,
    heightInches,
    currentWeightKg,
    estimates,
    inchesOverFiveFeet: delta,
    belowFiveFeet,
    statusHeadline: belowFiveFeet
      ? 'IBW estimates (extrapolated below 5 ft).'
      : 'IBW estimates from classic adult formulas.',
    statusDetail: belowFiveFeet
      ? 'These equations are defined around inches over 5 ft (60 in). Values below that stature are linear extrapolations and are less reliable.'
      : 'Devine, Robinson, Miller, and Hamwi. Current weight never changes the IBW numbers.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
