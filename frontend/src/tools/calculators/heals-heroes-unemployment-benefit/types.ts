/**
 * Live sibling for yearly/hourly wage conversion.
 * Catalog `annual-income-calculator` exists but is undeveloped — do not link a 404.
 */
export const ANNUAL_SALARY_CALCULATOR_SLUG = 'annual-salary-calculator' as const;

export const ANNUAL_SALARY_CALCULATOR_HREF =
  `/tools/${ANNUAL_SALARY_CALCULATOR_SLUG}` as const;

/** No editable inputs — historical notice only (ADR-023 screenshot). */
export interface HealsHeroesUnemploymentBenefitInput {
  /** Increments on reload so share/feedback UI can reset. */
  noticeVersion: number;
}

export interface HealsHeroesUnemploymentBenefitResult {
  /** Shareable plain-text summary of the historical notice. */
  summaryText: string;
  annualSalaryCalculatorHref: typeof ANNUAL_SALARY_CALCULATOR_HREF;
}

export type HealsHeroesUnemploymentBenefitFieldErrors = {
  form?: string;
};

export function createDefaultInput(): HealsHeroesUnemploymentBenefitInput {
  return { noticeVersion: 0 };
}
