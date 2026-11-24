/**
 * Gastric sleeve (sleeve gastrectomy) educational weight-loss estimate (ADR-018).
 *
 * Primary metric: percent excess weight loss (%EWL), not percent total weight loss (%TWL).
 *
 *   referenceWeightKg = REFERENCE_BMI × height_m²   (BMI 25 kg/m²)
 *   excessWeightKg    = baselineWeightKg − referenceWeightKg
 *   estimatedLossKg   = excessWeightKg × (POPULATION_EWL_FRACTION)
 *   predictedWeightKg = baselineWeightKg − estimatedLossKg
 *
 * Population %EWL: Chang et al., JAMA Surgery 2014 observational sleeve
 * gastrectomy year-1 mean 51.49% (95% CI 44.41–58.56). Horizon: ~1 year.
 * Educational population estimate — not an individualized forecast.
 */

import type {
  GastricSleeveWeightLossInput,
  GastricSleeveWeightLossResult,
  HeightUnit,
  WeightUnit,
} from './types';

/** Upper end of WHO normal BMI used as excess-weight reference. */
export const REFERENCE_BMI_KG_M2 = 25;

/**
 * Chang et al. JAMA Surg 2014 — OBS sleeve gastrectomy year-1 %EWL mean.
 * Source table reports 51.49%; stored at full precision from the paper.
 */
export const SLEEVE_YEAR1_OBS_EWL_PERCENT = 51.49;

export const FOLLOW_UP_HORIZON_LABEL = '≈1 year';

export const SOURCE_NOTE =
  'Chang SH et al., JAMA Surgery 2014 (PMC3962512): observational sleeve gastrectomy year-1 mean %EWL 51.49% (95% CI 44.41–58.56). Excess weight uses BMI 25 kg/m² reference. Educational population estimate.';

export const DISCLAIMER =
  'Not a personalized surgical forecast. Individual %EWL varies widely. Educational use only — not a substitute for bariatric surgical counseling.';

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

export function bmiKgM2(weightKg: number, heightCm: number): number {
  const hM = heightCm / 100;
  if (!(hM > 0)) throw new Error('Height must be positive.');
  return weightKg / (hM * hM);
}

export function referenceWeightKgAtBmi25(heightCm: number): number {
  const hM = heightCm / 100;
  if (!(hM > 0)) throw new Error('Height must be positive.');
  return REFERENCE_BMI_KG_M2 * hM * hM;
}

export function formatBmi(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function emptyResult(
  partial: Partial<GastricSleeveWeightLossResult> = {},
): GastricSleeveWeightLossResult {
  return {
    bmiKgM2: null,
    formattedBmi: '',
    heightCm: null,
    weightKg: null,
    referenceWeightKg: null,
    excessWeightKg: null,
    percentEwlApplied: null,
    estimatedLossKg: null,
    predictedWeightKg: null,
    percentTwlImplied: null,
    followUpHorizonLabel: FOLLOW_UP_HORIZON_LABEL,
    metricLabel: '%EWL',
    statusHeadline: 'Enter height and weight',
    statusDetail:
      'Provide preoperative height and weight for the gastric sleeve population %EWL estimate at about one year.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ready: false,
    ...partial,
  };
}

export function calculateGastricSleeveWeightLoss(
  input: GastricSleeveWeightLossInput,
): GastricSleeveWeightLossResult {
  if (input.surgeryType !== 'gastric_sleeve') {
    return emptyResult({
      statusHeadline: 'Unsupported procedure',
      statusDetail:
        'Only gastric sleeve (sleeve gastrectomy) is supported. Other bariatric procedures are out of scope for this tool.',
    });
  }

  const hRaw = parseNumber(input.heightText);
  const wRaw = parseNumber(input.weightText);

  if (hRaw === null && wRaw === null) {
    return emptyResult();
  }

  if (hRaw === null) {
    return emptyResult({
      statusHeadline: 'Height required',
      statusDetail:
        'Height is required to compute BMI and excess weight above the BMI 25 reference.',
    });
  }

  if (wRaw === null) {
    return emptyResult({
      statusHeadline: 'Weight required',
      statusDetail: 'Enter preoperative weight with height to estimate excess weight loss.',
    });
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
      statusDetail: 'Converted height and weight must be positive.',
    });
  }

  const bmi = bmiKgM2(weightKg, heightCm);
  const referenceKg = referenceWeightKgAtBmi25(heightCm);
  const excessKg = weightKg - referenceKg;

  if (!(excessKg > 0)) {
    return emptyResult({
      bmiKgM2: bmi,
      formattedBmi: formatBmi(bmi),
      heightCm,
      weightKg,
      referenceWeightKg: referenceKg,
      excessWeightKg: excessKg,
      statusHeadline: 'Nonpositive excess weight',
      statusDetail:
        'Weight is at or below the BMI 25 reference for this height, so excess weight is not positive and %EWL cannot be applied.',
    });
  }

  const ewlFraction = SLEEVE_YEAR1_OBS_EWL_PERCENT / 100;
  const estimatedLossKg = excessKg * ewlFraction;
  const predictedWeightKg = weightKg - estimatedLossKg;
  const percentTwlImplied = (estimatedLossKg / weightKg) * 100;

  return {
    bmiKgM2: bmi,
    formattedBmi: formatBmi(bmi),
    heightCm,
    weightKg,
    referenceWeightKg: referenceKg,
    excessWeightKg: excessKg,
    percentEwlApplied: SLEEVE_YEAR1_OBS_EWL_PERCENT,
    estimatedLossKg,
    predictedWeightKg,
    percentTwlImplied,
    followUpHorizonLabel: FOLLOW_UP_HORIZON_LABEL,
    metricLabel: '%EWL',
    statusHeadline: 'Sleeve gastrectomy population estimate',
    statusDetail: `Applying published observational year-1 mean %EWL (${SLEEVE_YEAR1_OBS_EWL_PERCENT.toFixed(1)}%) to excess weight above BMI ${REFERENCE_BMI_KG_M2}. This is a cohort average at ${FOLLOW_UP_HORIZON_LABEL}, not a precise individual forecast.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ready: true,
  };
}
