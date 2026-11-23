/**
 * INTERGROWTH-21st symphysis-fundal height (Papageorghiou et al. BMJ 2016;355:i5662).
 *
 * Median SFH (cm) = 5.133374 + 0.1058353119·GA² − 0.0231295·GA²·ln(GA)
 * SD (cm) = 0.9922667 + 0.0258087·GA
 * GA in exact decimal weeks (weeks + days/7). Standards intended ~16–40(+1) weeks.
 *
 * Dating: GA = 6.585838 − 2.7072585·√SFH + 1.295291·SFH (SFH 12–38 cm).
 *
 * Fetal weight (Johnson educational): (SFH − station − weightFlag) × 155 g
 * with station 11/12 and weightFlag 0/1 for maternal ≤/> 91 kg.
 */

import type {
  FundalChartPoint,
  FundalHeightInput,
  FundalHeightResult,
  LengthUnit,
  VertexStation,
} from './types';

export const SOURCE_NOTE =
  'INTERGROWTH-21st SFH standards: Papageorghiou AT et al. BMJ 2016;355:i5662. Dating reverse regression from the same paper. Johnson fetal-weight estimate is a separate teaching formula (vertex pregnancies), not an INTERGROWTH equation.';

export const DISCLAIMER =
  'Educational SFH arithmetic — not a diagnosis of fetal growth restriction or macrosomia, and not a substitute for clinical examination or ultrasound.';

/** Recommended INTERGROWTH SFH chart window (exact weeks). */
export const GA_MIN_WEEKS = 16;
export const GA_MAX_WEEKS = 40;
export const SFH_DATING_MIN_CM = 12;
export const SFH_DATING_MAX_CM = 38;

const CM_PER_IN = 2.54;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function lengthToCm(value: number, unit: LengthUnit): number {
  return unit === 'in' ? value * CM_PER_IN : value;
}

export function cmToLength(cm: number, unit: LengthUnit): number {
  return unit === 'in' ? cm / CM_PER_IN : cm;
}

export function exactGestationalWeeks(
  weeks: number,
  days: number,
): number {
  return weeks + days / 7;
}

/** INTERGROWTH median SFH (cm) for exact GA weeks. */
export function intergrowthMedianSfhCm(exactWeeks: number): number {
  if (!(exactWeeks > 0)) {
    throw new Error('GA must be positive.');
  }
  const ga2 = exactWeeks * exactWeeks;
  return (
    5.133374 +
    0.1058353119 * ga2 -
    0.0231295 * ga2 * Math.log(exactWeeks)
  );
}

/** INTERGROWTH SFH SD (cm). */
export function intergrowthSdSfhCm(exactWeeks: number): number {
  if (!(exactWeeks > 0)) {
    throw new Error('GA must be positive.');
  }
  return 0.9922667 + 0.0258087 * exactWeeks;
}

/** Dating: GA (exact weeks) from SFH cm. */
export function gestationalAgeFromSfhCm(sfhCm: number): number {
  if (!(sfhCm >= SFH_DATING_MIN_CM) || !(sfhCm <= SFH_DATING_MAX_CM)) {
    throw new Error('SFH dating supports 12–38 cm.');
  }
  return 6.585838 - 2.7072585 * Math.sqrt(sfhCm) + 1.295291 * sfhCm;
}

/** Johnson teaching fetal weight (g). */
export function johnsonFetalWeightG(
  sfhCm: number,
  motherOver91kg: boolean,
  vertex: VertexStation,
): number {
  const weightFlag = motherOver91kg ? 1 : 0;
  const station = vertex === 'below' ? 11 : 12;
  return (sfhCm - station - weightFlag) * 155;
}

/** Standard normal CDF via erf. */
export function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function erf(x: number): number {
  // Abramowitz & Stegun 7.1.26
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

export function percentileFromZ(z: number): number {
  return 100 * normalCdf(z);
}

export function sfhAtZ(exactWeeks: number, z: number): number {
  return intergrowthMedianSfhCm(exactWeeks) + z * intergrowthSdSfhCm(exactWeeks);
}

const Z_P3 = -1.880793608;
const Z_P5 = -1.644853627;
const Z_P10 = -1.281551566;
const Z_P90 = 1.281551566;
const Z_P95 = 1.644853627;
const Z_P97 = 1.880793608;

export function buildCentileChart(
  fromWeek = GA_MIN_WEEKS,
  toWeek = GA_MAX_WEEKS,
): FundalChartPoint[] {
  const points: FundalChartPoint[] = [];
  for (let w = fromWeek; w <= toWeek; w += 1) {
    points.push({
      week: w,
      p3: sfhAtZ(w, Z_P3),
      p5: sfhAtZ(w, Z_P5),
      p10: sfhAtZ(w, Z_P10),
      p50: intergrowthMedianSfhCm(w),
      p90: sfhAtZ(w, Z_P90),
      p95: sfhAtZ(w, Z_P95),
      p97: sfhAtZ(w, Z_P97),
    });
  }
  return points;
}

export function calculateFundalHeight(
  input: FundalHeightInput,
): FundalHeightResult {
  const chart = buildCentileChart();
  const base = {
    chart,
    userPoint: null as { week: number; sfhCm: number } | null,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };

  if (input.mode === 'percentile') {
    const weeks = parseNumber(input.gaWeeksText);
    const days = parseNumber(input.gaDaysText);
    if (weeks === null || days === null) {
      return {
        ...base,
        mode: 'percentile',
        exactWeeks: null,
        measuredSfhCm: null,
        expectedSfhCm: null,
        sdCm: null,
        zScore: null,
        percentile: null,
        datedExactWeeks: null,
        fetalWeightG: null,
        statusHeadline: 'Enter gestational age',
        statusDetail: 'Default screenshot GA is 16 weeks + 0 days.',
      };
    }
    if (!(weeks >= 0) || !(days >= 0) || days > 6) {
      return {
        ...base,
        mode: 'percentile',
        exactWeeks: null,
        measuredSfhCm: null,
        expectedSfhCm: null,
        sdCm: null,
        zScore: null,
        percentile: null,
        datedExactWeeks: null,
        fetalWeightG: null,
        statusHeadline: 'Invalid gestational age',
        statusDetail: 'Days must be 0–6 and weeks non-negative.',
      };
    }
    const exact = exactGestationalWeeks(weeks, days);
    if (exact < GA_MIN_WEEKS || exact > GA_MAX_WEEKS + 1) {
      return {
        ...base,
        mode: 'percentile',
        exactWeeks: exact,
        measuredSfhCm: null,
        expectedSfhCm: null,
        sdCm: null,
        zScore: null,
        percentile: null,
        datedExactWeeks: null,
        fetalWeightG: null,
        statusHeadline: 'Gestation outside INTERGROWTH SFH window',
        statusDetail: `Standards are recommended for about ${GA_MIN_WEEKS}–${GA_MAX_WEEKS} weeks (extrapolation to 41 only if clinically justified).`,
      };
    }
    const expected = intergrowthMedianSfhCm(exact);
    const sd = intergrowthSdSfhCm(exact);
    const measuredRaw = parseNumber(input.measuredSfhText);
    if (measuredRaw === null) {
      return {
        ...base,
        mode: 'percentile',
        exactWeeks: exact,
        measuredSfhCm: null,
        expectedSfhCm: expected,
        sdCm: sd,
        zScore: null,
        percentile: null,
        datedExactWeeks: null,
        fetalWeightG: null,
        statusHeadline: 'Expected SFH ready',
        statusDetail:
          'Enter measured SFH to compute z-score and percentile; chart shows reference centiles.',
      };
    }
    if (!(measuredRaw > 0)) {
      return {
        ...base,
        mode: 'percentile',
        exactWeeks: exact,
        measuredSfhCm: null,
        expectedSfhCm: expected,
        sdCm: sd,
        zScore: null,
        percentile: null,
        datedExactWeeks: null,
        fetalWeightG: null,
        statusHeadline: 'Invalid measured SFH',
        statusDetail: 'Measured SFH must be positive.',
      };
    }
    const measuredCm = lengthToCm(measuredRaw, input.sfhUnit);
    const z = (measuredCm - expected) / sd;
    const pct = percentileFromZ(z);
    return {
      ...base,
      mode: 'percentile',
      exactWeeks: exact,
      measuredSfhCm: measuredCm,
      expectedSfhCm: expected,
      sdCm: sd,
      zScore: z,
      percentile: pct,
      datedExactWeeks: null,
      fetalWeightG: null,
      userPoint: { week: exact, sfhCm: measuredCm },
      statusHeadline: 'SFH percentile',
      statusDetail: `z = (SFH − median) / SD; percentile = 100·Φ(z).`,
    };
  }

  if (input.mode === 'dating') {
    const measuredRaw = parseNumber(input.measuredSfhText);
    if (measuredRaw === null) {
      return {
        ...base,
        mode: 'dating',
        exactWeeks: null,
        measuredSfhCm: null,
        expectedSfhCm: null,
        sdCm: null,
        zScore: null,
        percentile: null,
        datedExactWeeks: null,
        fetalWeightG: null,
        statusHeadline: 'Enter measured SFH',
        statusDetail: 'Dating uses the INTERGROWTH reverse regression (SFH 12–38 cm).',
      };
    }
    if (!(measuredRaw > 0)) {
      return {
        ...base,
        mode: 'dating',
        exactWeeks: null,
        measuredSfhCm: null,
        expectedSfhCm: null,
        sdCm: null,
        zScore: null,
        percentile: null,
        datedExactWeeks: null,
        fetalWeightG: null,
        statusHeadline: 'Invalid measured SFH',
        statusDetail: 'Measured SFH must be positive.',
      };
    }
    const measuredCm = lengthToCm(measuredRaw, input.sfhUnit);
    if (measuredCm < SFH_DATING_MIN_CM || measuredCm > SFH_DATING_MAX_CM) {
      return {
        ...base,
        mode: 'dating',
        exactWeeks: null,
        measuredSfhCm: measuredCm,
        expectedSfhCm: null,
        sdCm: null,
        zScore: null,
        percentile: null,
        datedExactWeeks: null,
        fetalWeightG: null,
        statusHeadline: 'SFH outside dating range',
        statusDetail: 'INTERGROWTH dating equation is for SFH 12–38 cm.',
      };
    }
    const ga = gestationalAgeFromSfhCm(measuredCm);
    return {
      ...base,
      mode: 'dating',
      exactWeeks: null,
      measuredSfhCm: measuredCm,
      expectedSfhCm: null,
      sdCm: null,
      zScore: null,
      percentile: null,
      datedExactWeeks: ga,
      fetalWeightG: null,
      userPoint: { week: ga, sfhCm: measuredCm },
      statusHeadline: 'Gestational age from SFH',
      statusDetail: `GA = 6.585838 − 2.7072585√SFH + 1.295291·SFH (exact weeks).`,
    };
  }

  // fetalWeight — Johnson teaching formula
  const measuredRaw = parseNumber(input.measuredSfhText);
  if (measuredRaw === null) {
    return {
      ...base,
      mode: 'fetalWeight',
      exactWeeks: null,
      measuredSfhCm: null,
      expectedSfhCm: null,
      sdCm: null,
      zScore: null,
      percentile: null,
      datedExactWeeks: null,
      fetalWeightG: null,
      statusHeadline: 'Enter measured SFH',
      statusDetail:
        'Johnson teaching estimate needs SFH, maternal weight band (>91 kg), and vertex station.',
    };
  }
  if (!(measuredRaw > 0)) {
    return {
      ...base,
      mode: 'fetalWeight',
      exactWeeks: null,
      measuredSfhCm: null,
      expectedSfhCm: null,
      sdCm: null,
      zScore: null,
      percentile: null,
      datedExactWeeks: null,
      fetalWeightG: null,
      statusHeadline: 'Invalid measured SFH',
      statusDetail: 'Measured SFH must be positive.',
    };
  }
  const measuredCm = lengthToCm(measuredRaw, input.sfhUnit);
  const wt = johnsonFetalWeightG(
    measuredCm,
    input.motherOver91kg,
    input.vertexStation,
  );
  return {
    ...base,
    mode: 'fetalWeight',
    exactWeeks: null,
    measuredSfhCm: measuredCm,
    expectedSfhCm: null,
    sdCm: null,
    zScore: null,
    percentile: null,
    datedExactWeeks: null,
    fetalWeightG: wt,
    statusHeadline: 'Johnson fetal-weight estimate',
    statusDetail:
      'Educational only; typically discussed for vertex presentations in late pregnancy. Not INTERGROWTH.',
  };
}
