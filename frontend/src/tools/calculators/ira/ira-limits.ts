/**
 * IRS IRA contribution limits — rule year configuration.
 * Sources: IRS Notice 2025-67; IRS “Retirement topics — IRA contribution limits”
 * (https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-ira-contribution-limits).
 * Limits are USD statutory amounts. Non-USD inputs are converted to USD for the
 * limit check when rates are available.
 */

export const IRA_RULE_YEAR = 2026 as const;

/** Combined Traditional + Roth elective contribution limit (under age 50). */
export const IRA_BASE_LIMIT_USD = 7500;

/** Additional catch-up when age ≥ catch-up age at year-end. */
export const IRA_CATCH_UP_USD = 1100;

export const IRA_CATCH_UP_AGE = 50;

export function iraAnnualLimitUsd(ageAtYearEnd: number): number {
  if (!Number.isFinite(ageAtYearEnd) || ageAtYearEnd < 0) return IRA_BASE_LIMIT_USD;
  return ageAtYearEnd >= IRA_CATCH_UP_AGE
    ? IRA_BASE_LIMIT_USD + IRA_CATCH_UP_USD
    : IRA_BASE_LIMIT_USD;
}
