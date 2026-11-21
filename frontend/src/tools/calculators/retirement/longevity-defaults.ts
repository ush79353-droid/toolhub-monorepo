/**
 * Suggested life-expectancy and government-pension defaults.
 * Users can override every value. Sex/country only seed defaults.
 *
 * Life expectancy: UNDESA World Population Prospects 2024 (e0 at birth,
 * rounded one decimal). Not conditional remaining LE at current age.
 *
 * Government pension: only United States has a sourced monthly default.
 * Other jurisdictions default to 0 until a dated official figure is added.
 */
import type { RetirementCountryCode, Sex } from './types';

export const LONGEVITY_SOURCE =
  'UN DESA World Population Prospects 2024, life expectancy at birth (e0), both sexes / female / male where published; rounded to 1 decimal for UI defaults.';

export const US_PENSION_SOURCE =
  'SSA Monthly Statistical Snapshot, December 2024: average monthly retired-worker benefit ≈ $1,922 (rounded). Effective for illustrative US default only; not an entitlement estimate.';

/** Average US Social Security retired-worker benefit (monthly, USD). */
export const US_AVG_RETIRED_WORKER_BENEFIT_MONTHLY = 1922;

const LIFE_EXPECTANCY: Record<
  Exclude<RetirementCountryCode, 'OTHER'>,
  { female: number; male: number }
> = {
  // WPP 2024 e0 approximations (female / male).
  US: { female: 81.4, male: 76.4 },
  GB: { female: 83.0, male: 79.0 },
  CA: { female: 84.0, male: 79.8 },
  AU: { female: 85.3, male: 81.3 },
  PL: { female: 81.5, male: 74.5 },
  DE: { female: 83.5, male: 78.7 },
  IN: { female: 72.0, male: 69.0 },
};

/** Fallback when country is OTHER or unknown. */
const FALLBACK_LE = { female: 80.0, male: 74.0 };

export function suggestedLifeExpectancy(
  country: RetirementCountryCode,
  sex: Sex
): number {
  const row =
    country === 'OTHER' ? FALLBACK_LE : (LIFE_EXPECTANCY[country] ?? FALLBACK_LE);
  return sex === 'female' ? row.female : row.male;
}

/**
 * Suggested government pension in the selected currency denomination.
 * Only US has a sourced monthly USD figure; returns 0 for other countries.
 * Callers format as monthly unless the user changes period.
 */
export function suggestedGovernmentPensionMonthly(
  country: RetirementCountryCode
): number {
  if (country === 'US') return US_AVG_RETIRED_WORKER_BENEFIT_MONTHLY;
  return 0;
}

export function formatLifeExpectancyDefault(value: number): string {
  return (Math.round(value * 10) / 10).toFixed(1);
}
