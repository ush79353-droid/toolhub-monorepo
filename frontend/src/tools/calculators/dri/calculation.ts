/**
 * DRI Calculator — pure engine (ADR-018).
 *
 * Energy: original Harris–Benedict BMR × activity PAL, using a representative
 * chronological age for each life-stage band (19–50 → 25 y; verified against
 * reference UI fixture male 180 cm / 80 kg / sedentary → 2,280 kcal/day).
 *
 * Macros: AMDR % of kcal → grams (protein & carb ÷4, fat ÷9).
 * Fiber: 14 g per 1,000 kcal. Water: 1 mL per kcal.
 * Micronutrients: NIH ODS RDA/AI tables in dri-data.ts; smoker +35 mg vitamin C only.
 */

import {
  BAND_REPRESENTATIVE_AGE,
  DRI_NUTRIENTS,
  VITAMIN_C_SMOKER_EXTRA_MG,
} from './dri-data';
import {
  ACTIVITY_OPTIONS,
  type DriAgeBand,
  type DriInput,
  type DriMacroRange,
  type DriNutrientRow,
  type DriResult,
  type DriSex,
} from './types';

export const SOURCE_NOTE =
  'Harris–Benedict (1919) × activity PAL for energy; AMDR macros; NIH ODS Dietary Reference Intakes (RDA/AI) for micronutrients; smokers +35 mg vitamin C (ODS). Educational estimate only.';

export const DISCLAIMER =
  'Educational nutrition reference only — not a clinical diet prescription, diagnosis, or substitute for a registered dietitian or physician.';

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: 'cm' | 'in'): number {
  return unit === 'cm' ? value : value * IN_TO_CM;
}

export function weightToKg(value: number, unit: 'kg' | 'lb'): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

export function bmiKgM2(weightKg: number, heightCm: number): number {
  const hM = heightCm / 100;
  if (!(hM > 0)) throw new Error('Height must be positive.');
  return weightKg / (hM * hM);
}

/** Original Harris–Benedict resting energy (kcal/day). */
export function harrisBenedictBmrKcal(
  sex: DriSex,
  weightKg: number,
  heightCm: number,
  ageYears: number,
): number {
  if (sex === 'male') {
    return 66.473 + 13.7516 * weightKg + 5.0033 * heightCm - 6.755 * ageYears;
  }
  return 655.0955 + 9.5634 * weightKg + 1.8496 * heightCm - 4.6756 * ageYears;
}

export function activityPal(activityId: DriInput['activityId']): number {
  const row = ACTIVITY_OPTIONS.find((o) => o.id === activityId);
  if (!row) throw new Error('Unknown activity factor.');
  return row.pal;
}

/**
 * Round resting energy to the nearest 10 kcal before applying PAL.
 * Matches reference UI fixtures (male 180 cm / 80 kg / age-band 25 → BMR 1,900;
 * ×1.2 = 2,280; ×1.75 = 3,325).
 */
export function roundBmrToTens(bmr: number): number {
  return Math.round(bmr / 10) * 10;
}

export function totalDailyCaloriesKcal(
  sex: DriSex,
  weightKg: number,
  heightCm: number,
  ageBand: DriAgeBand,
  activityId: DriInput['activityId'],
): number {
  const age = BAND_REPRESENTATIVE_AGE[ageBand];
  const bmr = roundBmrToTens(harrisBenedictBmrKcal(sex, weightKg, heightCm, age));
  return bmr * activityPal(activityId);
}

function proteinAmdrPercent(ageBand: DriAgeBand): { low: number; high: number } {
  if (ageBand === 'birth_6mo' || ageBand === 'mo7_12' || ageBand === 'y1_3') {
    return { low: 5, high: 20 };
  }
  return { low: 10, high: 30 };
}

function fatAmdrPercent(ageBand: DriAgeBand): { low: number; high: number } {
  if (ageBand === 'birth_6mo' || ageBand === 'mo7_12' || ageBand === 'y1_3') {
    return { low: 30, high: 40 };
  }
  if (ageBand === 'y4_8' || ageBand === 'y9_13' || ageBand === 'y14_18') {
    return { low: 25, high: 35 };
  }
  return { low: 20, high: 35 };
}

export function macroRangeFromKcal(
  kcal: number,
  lowPct: number,
  highPct: number,
  kcalPerGram: number,
): DriMacroRange {
  return {
    lowGrams: Math.round((kcal * lowPct) / 100 / kcalPerGram),
    highGrams: Math.round((kcal * highPct) / 100 / kcalPerGram),
  };
}

function formatAmount(value: number, unit: string): string {
  if (unit === 'grams' && value >= 1) {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 1,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    });
  }
  if (value >= 100) {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }
  if (value >= 10) {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 1,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    });
  }
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : undefined,
  });
}

export function buildNutrientRows(
  sex: DriSex,
  ageBand: DriAgeBand,
  smoker: boolean,
): DriNutrientRow[] {
  return DRI_NUTRIENTS.map((spec) => {
    let amount = spec.values[sex][ageBand];
    if (spec.id === 'vit_c' && smoker) {
      amount += VITAMIN_C_SMOKER_EXTRA_MG;
    }
    return {
      id: spec.id,
      label: spec.label,
      display: formatAmount(amount, spec.unit),
      unit: spec.unit,
      kind: spec.kind,
    };
  });
}

export function formatBmi(bmi: number | null): string {
  if (bmi == null || !Number.isFinite(bmi)) return '';
  return bmi.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function formatCalories(kcal: number | null): string {
  if (kcal == null || !Number.isFinite(kcal)) return '';
  return Math.round(kcal).toLocaleString('en-US');
}

function emptyResult(partial?: Partial<DriResult>): DriResult {
  return {
    bmi: null,
    bmiDisplay: '',
    caloriesKcal: null,
    caloriesDisplay: '',
    carbs: null,
    protein: null,
    fat: null,
    fiberGrams: null,
    waterLiters: null,
    nutrientRows: [],
    statusHeadline: 'Enter height and weight',
    statusDetail:
      'Provide height and weight to estimate calories, BMI, AMDR macro ranges, and NIH DRI micronutrient rows for the selected sex and age band.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateDri(input: DriInput): DriResult {
  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);

  // Micronutrient table can still show when demographics are set even without anthropometrics? Reference UI only expands after height+weight fill calories. Keep nutrients gated on valid anthropometrics.
  if (hRaw === null || wRaw === null) {
    return emptyResult();
  }

  if (!(hRaw > 0) || !(wRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Invalid measurements',
      statusDetail: 'Height and weight must be positive numbers.',
    });
  }

  const heightCm = heightToCm(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);
  if (!(heightCm > 0) || !(weightKg > 0)) {
    return emptyResult({
      statusHeadline: 'Invalid measurements',
      statusDetail: 'Height and weight must convert to positive metric values.',
    });
  }

  const bmi = bmiKgM2(weightKg, heightCm);
  const calories = totalDailyCaloriesKcal(
    input.sex,
    weightKg,
    heightCm,
    input.ageBand,
    input.activityId,
  );
  const proteinPct = proteinAmdrPercent(input.ageBand);
  const fatPct = fatAmdrPercent(input.ageBand);
  const carbs = macroRangeFromKcal(calories, 45, 65, 4);
  const protein = macroRangeFromKcal(calories, proteinPct.low, proteinPct.high, 4);
  const fat = macroRangeFromKcal(calories, fatPct.low, fatPct.high, 9);
  const fiberGrams = Math.round((calories / 1000) * 14);
  const waterLiters = Math.round((calories / 1000) * 10) / 10;
  const nutrientRows = buildNutrientRows(input.sex, input.ageBand, input.smoker);

  return {
    bmi,
    bmiDisplay: formatBmi(bmi),
    caloriesKcal: calories,
    caloriesDisplay: formatCalories(calories),
    carbs,
    protein,
    fat,
    fiberGrams,
    waterLiters,
    nutrientRows,
    statusHeadline: 'DRI estimates',
    statusDetail: `Representative age ${BAND_REPRESENTATIVE_AGE[input.ageBand]} y inside the selected band · PAL ${activityPal(input.activityId)}.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
