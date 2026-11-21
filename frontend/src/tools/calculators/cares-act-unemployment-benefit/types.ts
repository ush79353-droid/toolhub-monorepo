/** Canonical public slug for the unemployment-rate calculator sibling. */
export const UNEMPLOYMENT_CALCULATOR_SLUG =
  'unemployment-calculator-unemployment-rate' as const;

export const UNEMPLOYMENT_CALCULATOR_HREF =
  `/tools/${UNEMPLOYMENT_CALCULATOR_SLUG}` as const;

/** No editable inputs — historical notice only (ADR-023 screenshot). */
export interface CaresActUnemploymentBenefitInput {
  /** Increments on reload/clear so share/feedback UI can reset. */
  noticeVersion: number;
}

export interface CaresActUnemploymentBenefitResult {
  /** Shareable plain-text summary of the historical notice. */
  summaryText: string;
  unemploymentCalculatorHref: typeof UNEMPLOYMENT_CALCULATOR_HREF;
}

export type CaresActUnemploymentBenefitFieldErrors = {
  form?: string;
};

export function createDefaultInput(): CaresActUnemploymentBenefitInput {
  return { noticeVersion: 0 };
}
