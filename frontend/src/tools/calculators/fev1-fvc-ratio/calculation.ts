import { DISCLAIMER, SOURCE_LABEL } from './content';
import type {
  Ethnicity,
  Fev1FvcInput,
  Fev1FvcResult,
  Sex,
  VolumeUnit,
} from './types';

export { DISCLAIMER, SOURCE_LABEL };

export function toLiters(value: number, unit: VolumeUnit): number {
  return unit === 'L' ? value : value / 1000;
}

/** Hankinson 1999 Table 6: FEV1/FVC% = intercept + slope × age. */
const HANKINSON_FEV1_FVC: Record<
  Sex,
  Record<Ethnicity, { intercept: number; ageSlope: number }>
> = {
  male: {
    caucasian: { intercept: 88.066, ageSlope: -0.2066 },
    africanAmerican: { intercept: 89.239, ageSlope: -0.1828 },
    mexicanAmerican: { intercept: 90.024, ageSlope: -0.2186 },
  },
  female: {
    caucasian: { intercept: 90.809, ageSlope: -0.2125 },
    africanAmerican: { intercept: 91.655, ageSlope: -0.2039 },
    mexicanAmerican: { intercept: 92.36, ageSlope: -0.2248 },
  },
};

/**
 * Falaschetti 2004 Table 2 mean: predicted FEV1/FVC (fraction) =
 * exp(b0 + b1·A + b2·A² + b3·ln(H)).
 */
const FALASCHETTI_LN_RATIO: Record<
  Sex,
  { b0: number; b1: number; b2: number; b3: number }
> = {
  male: { b0: 1.03981, b1: -0.00394, b2: 0.00002, b3: -0.21653 },
  female: { b0: 1.15822, b1: -0.00415, b2: 0.00002, b3: -0.23815 },
};

export function formatRatioPercent(pct: number): string {
  const rounded = Math.round(pct * 100) / 100;
  return `${rounded}%`;
}

export function calculateRealRatio(
  fev1: number,
  fvc: number,
  unit: VolumeUnit,
): number {
  const fev1L = toLiters(fev1, unit);
  const fvcL = toLiters(fvc, unit);
  return (100 * fev1L) / fvcL;
}

export function calculateHankinsonPredictedPercent(
  sex: Sex,
  ethnicity: Ethnicity,
  ageYears: number,
): number {
  const { intercept, ageSlope } = HANKINSON_FEV1_FVC[sex][ethnicity];
  return intercept + ageSlope * ageYears;
}

export function calculateFalaschettiPredictedPercent(
  sex: Sex,
  ageYears: number,
  heightCm: number,
): number {
  const { b0, b1, b2, b3 } = FALASCHETTI_LN_RATIO[sex];
  const lnRatio =
    b0 + b1 * ageYears + b2 * ageYears * ageYears + b3 * Math.log(heightCm);
  return 100 * Math.exp(lnRatio);
}

export function calculateFev1Fvc(input: Fev1FvcInput): Fev1FvcResult {
  if (input.mode === 'real') {
    const ratioPercent = calculateRealRatio(
      input.fev1 as number,
      input.fvc as number,
      input.volumeUnit,
    );
    return {
      ratioPercent,
      formattedRatio: formatRatioPercent(ratioPercent),
      explanation: `Measured Tiffeneau index = 100 × FEV1 / FVC = ${formatRatioPercent(ratioPercent)}. Fixed 0.70 cut-offs are population teaching points only — not this tool’s diagnosis.`,
      disclaimer: DISCLAIMER,
      sourceLabel: SOURCE_LABEL,
    };
  }

  if (input.study === 'american1999') {
    const ratioPercent = calculateHankinsonPredictedPercent(
      input.sex,
      input.ethnicity,
      input.ageYears as number,
    );
    return {
      ratioPercent,
      formattedRatio: formatRatioPercent(ratioPercent),
      explanation: `Predicted FEV1/FVC% (Hankinson NHANES III, ${input.ethnicity}, ${input.sex}, age ${input.ageYears}) = ${formatRatioPercent(ratioPercent)}. This is the predicted ratio, not percent-of-predicted of a measured ratio.`,
      disclaimer: DISCLAIMER,
      sourceLabel: SOURCE_LABEL,
    };
  }

  const ratioPercent = calculateFalaschettiPredictedPercent(
    input.sex,
    input.ageYears as number,
    input.heightCm as number,
  );
  return {
    ratioPercent,
    formattedRatio: formatRatioPercent(ratioPercent),
    explanation: `Predicted FEV1/FVC% (Falaschetti HSE 2004, White English adults, ${input.sex}, age ${input.ageYears}, height ${input.heightCm} cm) = ${formatRatioPercent(ratioPercent)}. This is the predicted ratio, not percent-of-predicted.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
