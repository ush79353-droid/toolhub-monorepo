import { DISCLAIMER, SOURCE_LABEL } from './content';
import type {
  Ethnicity,
  FlowUnit,
  HeightUnit,
  PeakFlowInput,
  PeakFlowResult,
  Sex,
} from './types';

export { DISCLAIMER, SOURCE_LABEL };

/** Hankinson 1999 PEF (L/s) = b0 + b1·A + b2·A² + b3·H² (H in cm). */
type Coeff = readonly [b0: number, b1: number, b2: number, b3: number];

const HANKINSON: Record<
  Exclude<Ethnicity, 'other'>,
  Record<Sex, { young: Coeff; adult: Coeff; adultAge: number }>
> = {
  caucasian: {
    male: {
      young: [-0.5962, -0.12357, 0.013135, 0.00024962],
      adult: [1.0523, 0.08272, -0.001301, 0.00024962],
      adultAge: 20,
    },
    female: {
      young: [-3.6181, 0.60644, -0.016846, 0.00018623],
      adult: [0.9267, 0.06929, -0.001031, 0.00018623],
      adultAge: 18,
    },
  },
  africanAmerican: {
    male: {
      young: [-0.2684, -0.28016, 0.018202, 0.00027333],
      adult: [2.2257, -0.04082, 0, 0.00027333],
      adultAge: 20,
    },
    female: {
      young: [-1.2398, 0.16375, 0, 0.00019746],
      adult: [1.3597, 0.03458, -0.000847, 0.00019746],
      adultAge: 18,
    },
  },
  mexicanAmerican: {
    male: {
      young: [-0.9537, -0.19602, 0.014497, 0.00030243],
      adult: [0.087, 0.0658, -0.001195, 0.00030243],
      adultAge: 20,
    },
    female: {
      young: [-3.2549, 0.47495, -0.013193, 0.00022203],
      adult: [0.2401, 0.06174, -0.001023, 0.00022203],
      adultAge: 18,
    },
  },
};

export function heightToCm(value: number, unit: HeightUnit): number {
  if (unit === 'cm') return value;
  if (unit === 'm') return value * 100;
  return value * 2.54;
}

export function flowToLs(value: number, unit: FlowUnit): number {
  return unit === 'L/s' ? value : value / 60;
}

export function flowFromLs(ls: number, unit: FlowUnit): number {
  return unit === 'L/s' ? ls : ls * 60;
}

export function formatFlow(ls: number, unit: FlowUnit): string {
  const v = flowFromLs(ls, unit);
  if (unit === 'L/s') return `${Math.round(v * 100) / 100} L/s`;
  return `${Math.round(v * 10) / 10} L/min`;
}

function applyHankinson(c: Coeff, age: number, heightCm: number): number {
  const [b0, b1, b2, b3] = c;
  return b0 + b1 * age + b2 * age * age + b3 * heightCm * heightCm;
}

/** Nunn & Gregg 1989 — PEF in L/min; convert to L/s. */
export function predictedNunnGreggLs(
  sex: Sex,
  age: number,
  heightCm: number,
): number {
  const lnPef =
    sex === 'male'
      ? 0.544 * Math.log(age) - 0.0151 * age - 74.7 / heightCm + 5.48
      : 0.376 * Math.log(age) - 0.012 * age - 58.8 / heightCm + 5.63;
  return Math.exp(lnPef) / 60;
}

export function predictedPefLs(
  sex: Sex,
  age: number,
  heightCm: number,
  ethnicity: Ethnicity,
): { ls: number; label: string } {
  if (ethnicity === 'other') {
    return {
      ls: predictedNunnGreggLs(sex, age, heightCm),
      label: 'Nunn & Gregg 1989 (Other)',
    };
  }
  const band = HANKINSON[ethnicity][sex];
  const coeff = age < band.adultAge ? band.young : band.adult;
  return {
    ls: applyHankinson(coeff, age, heightCm),
    label: `Hankinson NHANES III 1999 (${ethnicity})`,
  };
}

export function percentOf(measuredLs: number, referenceLs: number): number {
  return (measuredLs / referenceLs) * 100;
}

/** Amplitude % mean: (max−min)/((max+min)/2)×100. */
export function diurnalVariabilityPercent(
  maxLs: number,
  minLs: number,
): number {
  const mean = (maxLs + minLs) / 2;
  if (mean === 0) return Number.NaN;
  return ((maxLs - minLs) / mean) * 100;
}

export function calculatePeakFlow(input: PeakFlowInput): PeakFlowResult {
  const age = input.ageYears as number;
  const heightCm = heightToCm(input.height as number, input.heightUnit);
  const { ls: estimatedPefLs, label: equationLabel } = predictedPefLs(
    input.sex,
    age,
    heightCm,
    input.ethnicity,
  );

  const measuredLs =
    input.measuredPef != null && Number.isFinite(input.measuredPef)
      ? flowToLs(input.measuredPef, input.measuredUnit)
      : null;
  const bestLs =
    input.personalBest != null && Number.isFinite(input.personalBest)
      ? flowToLs(input.personalBest, input.personalBestUnit)
      : null;
  const maxLs =
    input.pefMax != null && Number.isFinite(input.pefMax)
      ? flowToLs(input.pefMax, input.maxUnit)
      : null;
  const minLs =
    input.pefMin != null && Number.isFinite(input.pefMin)
      ? flowToLs(input.pefMin, input.minUnit)
      : null;

  const percentOfEstimated =
    measuredLs != null && estimatedPefLs !== 0
      ? percentOf(measuredLs, estimatedPefLs)
      : null;
  const percentOfPersonalBest =
    measuredLs != null && bestLs != null && bestLs !== 0
      ? percentOf(measuredLs, bestLs)
      : null;
  const diurnalVariability =
    maxLs != null && minLs != null
      ? diurnalVariabilityPercent(maxLs, minLs)
      : null;

  const fmtPct = (v: number | null) =>
    v == null || !Number.isFinite(v) ? '—' : `${Math.round(v * 10) / 10}%`;

  return {
    estimatedPefLs,
    percentOfEstimated,
    percentOfPersonalBest,
    diurnalVariabilityPercent:
      diurnalVariability != null && Number.isFinite(diurnalVariability)
        ? diurnalVariability
        : null,
    formattedEstimated: formatFlow(estimatedPefLs, input.estimatedUnit),
    formattedPercentEstimated: fmtPct(percentOfEstimated),
    formattedPercentBest: fmtPct(percentOfPersonalBest),
    formattedDiurnal: fmtPct(
      diurnalVariability != null && Number.isFinite(diurnalVariability)
        ? diurnalVariability
        : null,
    ),
    equationLabel,
    explanation: `Predicted PEF ${formatFlow(estimatedPefLs, input.estimatedUnit)} via ${equationLabel}. % estimated and % personal best use measured ÷ reference × 100. Diurnal variability uses amplitude percent mean.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_LABEL,
  };
}
