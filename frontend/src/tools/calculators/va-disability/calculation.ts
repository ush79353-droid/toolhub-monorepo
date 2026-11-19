import { formatCurrencyValue } from '@/tools/shared/currency';
import {
  VA_COMPENSATION_EFFECTIVE,
  VA_COMPENSATION_YEAR,
  monthlyCompensation,
} from './rates';
import type {
  DisabilityCondition,
  LimbSide,
  VaDisabilityResult,
  VaDependents,
} from './types';

/** 38 CFR 4.25 whole-person combine. Order does not change the result; VA lists highest first. */
export function combineTwo(a: number, b: number): number {
  const high = Math.max(a, b);
  const low = Math.min(a, b);
  return high + (low * (100 - high)) / 100;
}

export function combineRatings(ratings: readonly number[]): number {
  const sorted = ratings.filter((rating) => rating > 0).sort((a, b) => b - a);
  if (sorted.length === 0) return 0;
  return sorted.slice(1).reduce((current, rating) => combineTwo(current, rating), sorted[0]!);
}

/** Nearest 10. 5 rounds up. Cap at 100. 38 CFR 4.25. */
export function roundCombinedRating(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  const capped = Math.min(100, value);
  return Math.min(100, Math.round(capped / 10) * 10);
}

const ARMS = new Set<LimbSide>(['left-arm', 'right-arm']);
const LEGS = new Set<LimbSide>(['left-leg', 'right-leg']);

/** 38 CFR 4.26: both arms, both legs, or an arm together with a leg. */
export function bilateralGroupQualifies(conditions: readonly DisabilityCondition[]): boolean {
  const limbs = new Set(
    conditions.filter((condition) => condition.rating > 0 && condition.limb !== 'none').map((c) => c.limb),
  );
  const armCount = [...limbs].filter((limb) => ARMS.has(limb)).length;
  const legCount = [...limbs].filter((limb) => LEGS.has(limb)).length;
  return armCount === 2 || legCount === 2 || (armCount >= 1 && legCount >= 1);
}

export function calculateVaDisability(input: {
  conditions: readonly DisabilityCondition[];
  dependents: VaDependents;
}): VaDisabilityResult | null {
  const { dependents } = input;
  if (
    dependents.childrenUnder18 < 0 ||
    dependents.childrenUnder18 > 20 ||
    dependents.childrenOver18InSchool < 0 ||
    dependents.childrenOver18InSchool > 20 ||
    (dependents.dependentParents !== 0 &&
      dependents.dependentParents !== 1 &&
      dependents.dependentParents !== 2)
  ) {
    return null;
  }

  const positive = input.conditions.filter((condition) => condition.rating > 0);
  const useBilateral = bilateralGroupQualifies(positive);
  const bilateral = useBilateral
    ? positive.filter((condition) => condition.limb !== 'none')
    : [];
  const others = useBilateral
    ? positive.filter((condition) => condition.limb === 'none')
    : positive;

  let bilateralCombined: number | null = null;
  const toCombine: number[] = others.map((condition) => condition.rating);
  if (useBilateral) {
    const combined = combineRatings(bilateral.map((condition) => condition.rating));
    const withFactor = Math.min(100, combined + combined * 0.1);
    bilateralCombined = withFactor;
    toCombine.push(withFactor);
  }

  const before = Math.min(100, combineRatings(toCombine));
  const rounded = roundCombinedRating(before);
  const monthly = monthlyCompensation({
    combinedRating: rounded,
    married: dependents.maritalStatus === 'married',
    childrenUnder18: dependents.childrenUnder18,
    childrenOver18InSchool: dependents.childrenOver18InSchool,
    dependentParents: dependents.dependentParents,
  });
  if (monthly === null) return null;

  const money = formatCurrencyValue(monthly, 'USD');
  const explanation = `Your combined disability rating is ${rounded}%. Based on your selected dependent information and the ${VA_COMPENSATION_YEAR} VA compensation rates (effective ${VA_COMPENSATION_EFFECTIVE}), the estimated monthly compensation is ${money}. This is an estimate. VA decides eligibility and the amount actually paid.`;

  return {
    ratingsUsed: positive.map((condition) => condition.rating).sort((a, b) => b - a),
    bilateralApplied: useBilateral,
    bilateralCombined,
    combinedBeforeRounding: Math.round(before * 100) / 100,
    combinedRating: rounded,
    monthlyCompensation: monthly,
    compensationYear: VA_COMPENSATION_YEAR,
    effectiveDate: VA_COMPENSATION_EFFECTIVE,
    explanation,
  };
}

export function shareVaDisabilityText(result: VaDisabilityResult, dependents: VaDependents): string {
  return [
    'VA Disability Calculator',
    `Ratings: ${result.ratingsUsed.join(', ') || 'none'}`,
    `Combined before rounding: ${result.combinedBeforeRounding}%`,
    `Combined rating: ${result.combinedRating}%`,
    `Bilateral factor: ${result.bilateralApplied ? 'applied' : 'not applied'}`,
    `Marital status: ${dependents.maritalStatus}`,
    `Children under 18: ${dependents.childrenUnder18}`,
    `Children over 18 in school: ${dependents.childrenOver18InSchool}`,
    `Dependent parents: ${dependents.dependentParents}`,
    `Estimated monthly compensation: ${formatCurrencyValue(result.monthlyCompensation, 'USD')}`,
    `Compensation year: ${result.compensationYear} (effective ${result.effectiveDate})`,
  ].join('\n');
}
