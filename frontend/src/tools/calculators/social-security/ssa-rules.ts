/**
 * Versioned U.S. Social Security retirement claiming rules (worker RIB).
 *
 * Sources (educational estimates — not an official SSA benefit award):
 * - FRA by year of birth: SSA Benefits Planner / OACT Table 2.A17.1
 * - Early reduction: 5/9 of 1% per month for first 36 months before FRA;
 *   5/12 of 1% per month thereafter (SSA Handbook §724; OACT early/late)
 * - Delayed retirement credits (born 1943+): 2/3 of 1% per month after FRA
 *   through the month before age 70 (SSA Delayed Retirement Credits planner)
 *
 * Effective labeling: rules current as published for cohorts through birth year
 * 1960+ (FRA 67). DRC rate table covers pre-1943 cohorts for completeness.
 */

export const SSA_RULES_SOURCE =
  'SSA Benefits Planner / OACT early-late retirement factors and FRA by year of birth (worker retirement insurance benefits). Educational model only.';

export const SSA_RULES_EFFECTIVE = '2026-11 (FRA table through 1960+; DRC 1943+ = 8%/yr)';

/** Full retirement age expressed as whole years plus extra months (0–11). */
export interface FullRetirementAge {
  years: number;
  months: number;
}

/** Total FRA age in months from birth. */
export function fraTotalMonths(fra: FullRetirementAge): number {
  return fra.years * 12 + fra.months;
}

/**
 * SSA full retirement age for a worker by year of birth.
 * Assumes the birthday falls in the given year (birth month unknown → FRA months
 * still match the cohort table; claiming ages are modeled on whole birthdays).
 */
export function fullRetirementAgeForBirthYear(
  birthYear: number
): FullRetirementAge | null {
  if (!Number.isInteger(birthYear) || birthYear < 1900 || birthYear > 2100) {
    return null;
  }
  if (birthYear <= 1937) return { years: 65, months: 0 };
  if (birthYear === 1938) return { years: 65, months: 2 };
  if (birthYear === 1939) return { years: 65, months: 4 };
  if (birthYear === 1940) return { years: 65, months: 6 };
  if (birthYear === 1941) return { years: 65, months: 8 };
  if (birthYear === 1942) return { years: 65, months: 10 };
  if (birthYear >= 1943 && birthYear <= 1954) return { years: 66, months: 0 };
  if (birthYear === 1955) return { years: 66, months: 2 };
  if (birthYear === 1956) return { years: 66, months: 4 };
  if (birthYear === 1957) return { years: 66, months: 6 };
  if (birthYear === 1958) return { years: 66, months: 8 };
  if (birthYear === 1959) return { years: 66, months: 10 };
  // 1960 and later
  return { years: 67, months: 0 };
}

/** Monthly DRC fraction of 1% (e.g. 2/3 for 1943+). */
export function delayedRetirementCreditMonthlyFraction(
  birthYear: number
): number {
  if (birthYear >= 1943) return 2 / 3;
  if (birthYear >= 1941) return 5 / 8;
  if (birthYear >= 1939) return 7 / 12;
  if (birthYear >= 1937) return 13 / 24;
  if (birthYear >= 1935) return 1 / 2;
  if (birthYear >= 1933) return 11 / 24;
  if (birthYear >= 1931) return 5 / 12;
  if (birthYear >= 1929) return 3 / 8;
  if (birthYear >= 1927) return 7 / 24;
  if (birthYear >= 1925) return 1 / 4;
  if (birthYear >= 1923) return 5 / 24;
  if (birthYear >= 1921) return 1 / 6;
  if (birthYear >= 1919) return 1 / 8;
  if (birthYear >= 1917) return 1 / 12;
  return 0;
}

/**
 * Multiplier applied to PIA (benefit at FRA) for claiming at a whole age
 * (birthday month). Ages outside 62–70 are clamped for the factor only by
 * callers; this function returns null when claim age is out of domain.
 */
export function piaMultiplierForClaimAge(
  birthYear: number,
  claimAgeYears: number
): number | null {
  if (
    !Number.isInteger(claimAgeYears) ||
    claimAgeYears < 62 ||
    claimAgeYears > 70
  ) {
    return null;
  }
  const fra = fullRetirementAgeForBirthYear(birthYear);
  if (!fra) return null;

  const claimMonths = claimAgeYears * 12;
  const fraMonths = fraTotalMonths(fra);
  const delta = claimMonths - fraMonths;

  if (delta === 0) return 1;

  if (delta < 0) {
    const early = -delta;
    const first = Math.min(early, 36);
    const rest = Math.max(early - 36, 0);
    const reduction =
      first * (5 / 9) * 0.01 + rest * (5 / 12) * 0.01;
    return Math.max(0, 1 - reduction);
  }

  // Delayed: credits only through the month before age 70.
  const maxCreditMonths = Math.max(0, 70 * 12 - fraMonths);
  const creditMonths = Math.min(delta, maxCreditMonths);
  const monthlyFrac = delayedRetirementCreditMonthlyFraction(birthYear);
  const increase = creditMonths * monthlyFrac * 0.01;
  return 1 + increase;
}

export function formatFraLabel(fra: FullRetirementAge): string {
  if (fra.months === 0) return `${fra.years}`;
  return `${fra.years} years ${fra.months} months`;
}
