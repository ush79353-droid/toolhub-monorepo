import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Indian Payment of Gratuity Act, 1972 style daily divisor (working days/month). */
export const GRATUITY_DAYS_DIVISOR = 26;

/** Fifteen days' wages per eligible year (Act s.4(2) explanation). */
export const GRATUITY_DAYS_PER_YEAR = 15;

/** Minimum continuous service for ordinary entitlement (Act s.4(1)). */
export const GRATUITY_MIN_SERVICE_MONTHS = 60;

export interface GratuityCalculationInput {
  /** Final month's salary + D.A. (≥ 0). Already in one currency. */
  salary: number;
  /** Whole years of service (≥ 0). */
  years: number;
  /** Additional months (0–11 preferred; any nonnegative whole months accepted). */
  months: number;
}

export interface GratuityCalculationResult {
  eligibleYears: number;
  totalServiceMonths: number;
  qualifies: boolean;
  gratuity: number;
}

/**
 * Eligible service years for the statutory 15/26 formula:
 * every completed year, plus one more year when leftover months exceed six
 * (Payment of Gratuity Act, 1972, s.4(2) — "part thereof in excess of six months").
 * Exactly six months does not round up.
 */
export function eligibleServiceYears(years: number, months: number): number {
  if (!(Number.isFinite(years) && Number.isFinite(months))) return NaN;
  if (!(years >= 0) || !(months >= 0)) return NaN;
  if (!Number.isInteger(years) || !Number.isInteger(months)) return NaN;
  return years + (months > 6 ? 1 : 0);
}

/**
 * Formula-based gratuity estimate using the Indian Act 15/26 convention:
 * Gratuity = (Salary + D.A.) × 15 / 26 × EligibleYears
 *
 * Eligibility gate: continuous service ≥ 5 years (60 months). Below that,
 * gratuity is 0 (death/disablement exceptions are not modeled).
 *
 * Does not apply the Indian Act monetary ceiling (₹10 lakh) — amounts may be
 * in any currency; treat as an educational estimate, not a legal entitlement.
 * Years/months are never FX-converted.
 */
export function calculateGratuity(
  input: GratuityCalculationInput
): GratuityCalculationResult | null {
  const { salary, years, months } = input;

  if (![salary, years, months].every(Number.isFinite)) return null;
  if (!(salary >= 0)) return null;
  if (!(years >= 0) || !(months >= 0)) return null;
  if (!Number.isInteger(years) || !Number.isInteger(months)) return null;

  const totalServiceMonths = years * 12 + months;
  if (!Number.isFinite(totalServiceMonths) || totalServiceMonths < 0) {
    return null;
  }

  const eligibleYears = eligibleServiceYears(years, months);
  if (!Number.isFinite(eligibleYears) || eligibleYears < 0) return null;

  const qualifies = totalServiceMonths >= GRATUITY_MIN_SERVICE_MONTHS;
  if (!qualifies) {
    return {
      eligibleYears,
      totalServiceMonths,
      qualifies: false,
      gratuity: 0,
    };
  }

  const gratuity =
    (salary * GRATUITY_DAYS_PER_YEAR * eligibleYears) / GRATUITY_DAYS_DIVISOR;

  if (!Number.isFinite(gratuity) || gratuity < 0) return null;

  return {
    eligibleYears,
    totalServiceMonths,
    qualifies: true,
    gratuity,
  };
}

/** Display rounding only — never used inside formulas. */
export function formatGratuityMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
