/**
 * Canonical public slug for the live Loan Calculator.
 * Personal Loan Calculator (`personal-loan-calculator`) exists in catalog but is not
 * developed/activated — linking there would 404. Loan Calculator estimates monthly
 * installments and total interest (screenshot intent).
 */
export const LOAN_CALCULATOR_SLUG = 'loan-calculator' as const;

export const LOAN_CALCULATOR_HREF = `/tools/${LOAN_CALCULATOR_SLUG}` as const;

/** No editable inputs — historical notice only (ADR-023 screenshot). */
export interface LwaUnemploymentBenefitInput {
  /** Increments on reload/clear so share/feedback UI can reset. */
  noticeVersion: number;
}

export interface LwaUnemploymentBenefitResult {
  /** Shareable plain-text summary of the historical notice. */
  summaryText: string;
  loanCalculatorHref: typeof LOAN_CALCULATOR_HREF;
}

export type LwaUnemploymentBenefitFieldErrors = {
  form?: string;
};

export function createDefaultInput(): LwaUnemploymentBenefitInput {
  return { noticeVersion: 0 };
}
