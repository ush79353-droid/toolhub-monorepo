/**
 * Overweight Calculator — educational BMI + adult ponderal (ADR-018).
 *
 * Adult: BMI = W/H²; ponderal = W/H³; WHO adult BMI bands.
 * Child (≤19): same anthropometry; category via CDC 2000 BMI-for-age LMS
 * reused from bmi-kids (ages 2–19 inclusive).
 */

import {
  bmiLmsZScore,
  classifyCdcPercentile,
  formatPercentile as formatCdcPercentile,
  interpolateLms,
  normalCdf,
  yearsToAgemos,
} from '../bmi-kids/calculation';
import type {
  HeightUnit,
  OverweightCategory,
  OverweightInput,
  OverweightResult,
  Sex,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'BMI = weight_kg / height_m². Adult ponderal = weight_kg / height_m³. Adults: WHO BMI bands. Ages 2–19 with sex: CDC 2000 BMI-for-age LMS (via bmi-kids tables). Educational only.';

export const DISCLAIMER =
  'The ponderal index and BMI results can differ. Always consult a physician if any health condition bothers you.';

const M_PER_INCH = 0.0254;
const M_PER_FOOT = 0.3048;
const KG_PER_LB = 0.45359237;
const KG_PER_STONE = KG_PER_LB * 14;

export const CHILD_AGE_MIN = 2;
export const CHILD_AGE_MAX = 19;

const WHO_BANDS: readonly {
  id: string;
  label: string;
  min: number;
  maxExclusive: number | null;
  rangeLabel: string;
}[] = [
  {
    id: 'underweight',
    label: 'Underweight',
    min: Number.NEGATIVE_INFINITY,
    maxExclusive: 18.5,
    rangeLabel: '< 18.5 kg/m²',
  },
  {
    id: 'normal',
    label: 'Normal weight',
    min: 18.5,
    maxExclusive: 25,
    rangeLabel: '18.5 – 24.99 kg/m²',
  },
  {
    id: 'overweight',
    label: 'Overweight',
    min: 25,
    maxExclusive: 30,
    rangeLabel: '25.0 – 29.99 kg/m²',
  },
  {
    id: 'obese',
    label: 'Obesity',
    min: 30,
    maxExclusive: null,
    rangeLabel: '≥ 30.0 kg/m²',
  },
];

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
      return value * M_PER_INCH;
    case 'ft':
      return value * M_PER_FOOT;
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
      return value * KG_PER_LB;
    case 'st':
      return value * KG_PER_STONE;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function calculateBmi(weightKg: number, heightM: number): number {
  if (!(heightM > 0) || !(weightKg > 0)) {
    throw new RangeError('Weight and height must be positive.');
  }
  return weightKg / (heightM * heightM);
}

/** Adult Rohrer ponderal index kg/m³. */
export function adultPonderalIndex(weightKg: number, heightM: number): number {
  if (!(heightM > 0) || !(weightKg > 0)) {
    throw new RangeError('Weight and height must be positive.');
  }
  return weightKg / Math.pow(heightM, 3);
}

export function classifyWhoBmi(bmi: number): OverweightCategory {
  for (const band of WHO_BANDS) {
    const under =
      band.maxExclusive === null ? true : bmi < band.maxExclusive;
    if (bmi >= band.min && under) {
      return { id: band.id, label: band.label, rangeLabel: band.rangeLabel };
    }
  }
  return WHO_BANDS[WHO_BANDS.length - 1]!;
}

export function formatBmi(v: number): string {
  return v.toFixed(2);
}

export function formatPonderal(v: number): string {
  return String(Number(v.toFixed(2)));
}

function emptyResult(
  partial?: Partial<OverweightResult>,
): OverweightResult {
  return {
    heightMeters: null,
    weightKg: null,
    bmi: null,
    ponderalIndex: null,
    formattedBmi: '',
    formattedPonderal: '',
    category: null,
    percentile: null,
    formattedPercentile: '',
    statusHeadline: 'Enter weight and height.',
    statusDetail: 'BMI and ponderal index appear when both values are valid.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateOverweight(input: OverweightInput): OverweightResult {
  const wRaw = parseNumber(input.weightText);
  const hRaw = parseNumber(input.heightText);
  if (wRaw === null || hRaw === null) {
    return emptyResult(
      input.childMode
        ? {
            statusHeadline: 'Enter weight, height, and pediatric demographics.',
            statusDetail:
              'Child/adolescent mode needs age (2–19) and sex for CDC classification.',
          }
        : undefined,
    );
  }
  if (!(wRaw > 0) || !(hRaw > 0)) {
    return emptyResult({
      statusHeadline: 'Weight and height must be greater than zero.',
      statusDetail: 'BMI and ponderal index are undefined for non-positive inputs.',
    });
  }

  const heightMeters = heightToMeters(hRaw, input.heightUnit);
  const weightKg = weightToKg(wRaw, input.weightUnit);

  let bmi: number;
  let ponderalIndex: number;
  try {
    bmi = calculateBmi(weightKg, heightMeters);
    ponderalIndex = adultPonderalIndex(weightKg, heightMeters);
  } catch {
    return emptyResult({
      statusHeadline: 'Unable to compute indices.',
      statusDetail: 'Check that weight and height are positive finite numbers.',
    });
  }

  if (!Number.isFinite(bmi) || !Number.isFinite(ponderalIndex)) {
    return emptyResult({
      statusHeadline: 'Unable to compute indices.',
      statusDetail: 'Result was non-finite.',
    });
  }

  if (!input.childMode) {
    const category = classifyWhoBmi(bmi);
    return {
      heightMeters,
      weightKg,
      bmi,
      ponderalIndex,
      formattedBmi: formatBmi(bmi),
      formattedPonderal: formatPonderal(ponderalIndex),
      category,
      percentile: null,
      formattedPercentile: '',
      statusHeadline: 'Adult BMI and ponderal index',
      statusDetail: `WHO category: ${category.label}.`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  // Pediatric path
  const age = parseNumber(input.ageText);
  const sex = input.sex === 'female' || input.sex === 'male' ? input.sex : null;

  if (age === null || sex === null) {
    return {
      heightMeters,
      weightKg,
      bmi,
      ponderalIndex,
      formattedBmi: formatBmi(bmi),
      formattedPonderal: formatPonderal(ponderalIndex),
      category: null,
      percentile: null,
      formattedPercentile: '',
      statusHeadline: 'BMI and ponderal computed.',
      statusDetail:
        'Enter sex and age (2–19 years) for CDC BMI-for-age category.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  if (!(age >= CHILD_AGE_MIN && age <= CHILD_AGE_MAX)) {
    return {
      heightMeters,
      weightKg,
      bmi,
      ponderalIndex,
      formattedBmi: formatBmi(bmi),
      formattedPonderal: formatPonderal(ponderalIndex),
      category: null,
      percentile: null,
      formattedPercentile: '',
      statusHeadline: 'Age out of pediatric range.',
      statusDetail: `Pediatric classification uses ages ${CHILD_AGE_MIN}–${CHILD_AGE_MAX}. Uncheck the child box for adult WHO bands.`,
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const lms = interpolateLms(sex as Sex, yearsToAgemos(age));
  if (!lms) {
    return {
      heightMeters,
      weightKg,
      bmi,
      ponderalIndex,
      formattedBmi: formatBmi(bmi),
      formattedPonderal: formatPonderal(ponderalIndex),
      category: null,
      percentile: null,
      formattedPercentile: '',
      statusHeadline: 'CDC LMS unavailable for this age.',
      statusDetail: 'BMI and ponderal are shown without a percentile category.',
      sourceNote: SOURCE_NOTE,
      disclaimer: DISCLAIMER,
    };
  }

  const z = bmiLmsZScore(bmi, lms.L, lms.M, lms.S);
  const percentile = normalCdf(z) * 100;
  const cdc = classifyCdcPercentile(percentile);

  return {
    heightMeters,
    weightKg,
    bmi,
    ponderalIndex,
    formattedBmi: formatBmi(bmi),
    formattedPonderal: formatPonderal(ponderalIndex),
    category: {
      id: cdc.id,
      label: cdc.label,
      rangeLabel: cdc.rangeLabel,
    },
    percentile,
    formattedPercentile: formatCdcPercentile(percentile),
    statusHeadline: 'Pediatric BMI-for-age',
    statusDetail: `CDC category: ${cdc.label} (${formatCdcPercentile(percentile)} percentile).`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
