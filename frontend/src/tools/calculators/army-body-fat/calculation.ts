/**
 * Army Body Fat Calculator — pure engine (ADR-018).
 *
 * Active-duty one-site (authorized since 9 June 2023; ALARACT 032/2025 /
 * Army Directive 2023-11 implementing guidance; measurements in inches & lb):
 *   Male:   %BF = −26.97 − (0.12 × weight_lb) + (1.99 × abdomen_in)
 *   Female: %BF = −9.15 − (0.015 × weight_lb) + (1.27 × abdomen_in)
 * Official samples round to the nearest whole percent.
 *
 * Legacy multi-site (DoDI 1308.3 / AR 600-9 Table B–5; inches; log10):
 *   Male:   %BF = 86.010·log10(abdomen−neck) − 70.041·log10(height) + 36.76
 *   Female: %BF = 163.205·log10(waist+hip−neck) − 97.684·log10(height) − 78.387
 * Educational only — not the current Army-authorized tape method.
 *
 * Max allowable body-fat standards: AR 600-9 / ALARACT Table B–2 (age bands).
 */

import {
  CM_PER_INCH,
  LB_PER_KG,
  type ArmyBodyFatInput,
  type ArmyBodyFatMaxStandard,
  type ArmyBodyFatResult,
  type ArmyLengthUnit,
  type ArmyMassUnit,
  type ArmySex,
} from './types';

const DISCLAIMER_ONE_SITE =
  'Informational estimate using the Army one-site abdomen circumference equations (effective 9 June 2023). Not an official DA Form 5500/5501 result, medical diagnosis, or eligibility determination.';

const DISCLAIMER_LEGACY =
  'Legacy multi-site circumference estimate (DoDI 1308.3 / AR 600-9 equations). Not the current Army-authorized method and not an official eligibility determination.';

export function toInches(value: number, unit: ArmyLengthUnit): number {
  if (!Number.isFinite(value)) return NaN;
  return unit === 'in' ? value : value / CM_PER_INCH;
}

export function toPounds(value: number, unit: ArmyMassUnit): number {
  if (!Number.isFinite(value)) return NaN;
  return unit === 'lb' ? value : value * LB_PER_KG;
}

/** Nearest whole percent (official worksheet rounding). */
export function roundBodyFatPercent(raw: number): number {
  if (!Number.isFinite(raw)) return NaN;
  return Math.round(raw);
}

/**
 * Table B–2 maximum allowable percent body fat (AR 600-9 / ALARACT 032/2025).
 */
export function maxAllowableBodyFat(
  sex: ArmySex,
  ageYears: number,
): ArmyBodyFatMaxStandard | null {
  if (!Number.isFinite(ageYears) || ageYears < 17) return null;
  let ageGroupLabel: string;
  let maxPercent: number;
  if (ageYears <= 20) {
    ageGroupLabel = '17–20';
    maxPercent = sex === 'male' ? 20 : 30;
  } else if (ageYears <= 27) {
    ageGroupLabel = '21–27';
    maxPercent = sex === 'male' ? 22 : 32;
  } else if (ageYears <= 39) {
    ageGroupLabel = '28–39';
    maxPercent = sex === 'male' ? 24 : 34;
  } else {
    ageGroupLabel = '40 and older';
    maxPercent = sex === 'male' ? 26 : 36;
  }
  return { ageGroupLabel, maxPercent };
}

/** One-site male equation (weight lb, abdomen inches). */
export function oneSiteMalePercent(
  weightLb: number,
  abdomenIn: number,
): number {
  return -26.97 - 0.12 * weightLb + 1.99 * abdomenIn;
}

/** One-site female equation (weight lb, abdomen inches). */
export function oneSiteFemalePercent(
  weightLb: number,
  abdomenIn: number,
): number {
  return -9.15 - 0.015 * weightLb + 1.27 * abdomenIn;
}

/**
 * AR 600-9 / DoDI worksheet style: round log10 and products to 2 decimals
 * before combining (matches published sample arithmetic).
 */
function legacyTerm(coeff: number, valueInches: number): number {
  const log2 = Math.round(Math.log10(valueInches) * 100) / 100;
  return Math.round(coeff * log2 * 100) / 100;
}

/** Legacy multi-site male (DoDI 1308.3); all inches. */
export function legacyMalePercent(
  abdomenIn: number,
  neckIn: number,
  heightIn: number,
): number | null {
  const circ = abdomenIn - neckIn;
  if (!(circ > 0) || !(heightIn > 0)) return null;
  return legacyTerm(86.01, circ) - legacyTerm(70.041, heightIn) + 36.76;
}

/** Legacy multi-site female (DoDI 1308.3); all inches. */
export function legacyFemalePercent(
  waistIn: number,
  hipIn: number,
  neckIn: number,
  heightIn: number,
): number | null {
  const circ = waistIn + hipIn - neckIn;
  if (!(circ > 0) || !(heightIn > 0)) return null;
  return (
    legacyTerm(163.205, circ) - legacyTerm(97.684, heightIn) - 78.387
  );
}

export function formatBodyFatPercent(wholePercent: number): string {
  if (!Number.isFinite(wholePercent)) return '—';
  return String(wholePercent);
}

function parseOptionalAge(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export interface ArmyBodyFatComputeArgs {
  activeDuty: boolean;
  sex: ArmySex;
  ageYears: number | null;
  weightLb: number;
  abdomenIn: number;
  heightIn: number;
  neckIn: number;
  waistIn: number;
  hipIn: number;
}

export function computeArmyBodyFat(
  args: ArmyBodyFatComputeArgs,
): ArmyBodyFatResult | null {
  const { activeDuty, sex, ageYears } = args;
  let raw: number | null;

  if (activeDuty) {
    if (!(args.weightLb > 0) || !(args.abdomenIn > 0)) return null;
    raw =
      sex === 'male'
        ? oneSiteMalePercent(args.weightLb, args.abdomenIn)
        : oneSiteFemalePercent(args.weightLb, args.abdomenIn);
  } else if (sex === 'male') {
    raw = legacyMalePercent(args.waistIn, args.neckIn, args.heightIn);
  } else {
    raw = legacyFemalePercent(
      args.waistIn,
      args.hipIn,
      args.neckIn,
      args.heightIn,
    );
  }

  if (raw == null || !Number.isFinite(raw)) return null;

  const bodyFatPercent = roundBodyFatPercent(raw);
  if (!Number.isFinite(bodyFatPercent)) return null;

  const maxStandard =
    ageYears != null ? maxAllowableBodyFat(sex, ageYears) : null;
  const withinStandard =
    maxStandard != null ? bodyFatPercent <= maxStandard.maxPercent : null;

  return {
    model: activeDuty ? 'one_site' : 'legacy_multi_site',
    sex,
    bodyFatPercentRaw: raw,
    bodyFatPercent,
    formattedBodyFatPercent: formatBodyFatPercent(bodyFatPercent),
    ageYears,
    maxStandard,
    withinStandard,
    disclaimer: activeDuty ? DISCLAIMER_ONE_SITE : DISCLAIMER_LEGACY,
  };
}

/** Convenience wrapper when callers already hold string input + parsed numbers. */
export function calculateArmyBodyFatFromParsed(
  input: Pick<ArmyBodyFatInput, 'activeDuty' | 'sex' | 'ageYears'>,
  parsed: {
    weightLb: number;
    abdomenIn: number;
    heightIn: number;
    neckIn: number;
    waistIn: number;
    hipIn: number;
  },
): ArmyBodyFatResult | null {
  return computeArmyBodyFat({
    activeDuty: input.activeDuty,
    sex: input.sex,
    ageYears: parseOptionalAge(input.ageYears),
    ...parsed,
  });
}
