/**
 * Verified Mongo catalog slug for GST Calculator (`6af46f0fa27d8d1d4e990060`).
 * Catalog row exists; public calculator module is not yet developed/activated.
 */
export const GST_CALCULATOR_SLUG = 'gst-calculator' as const;

export const GST_CALCULATOR_HREF = `/tools/${GST_CALCULATOR_SLUG}` as const;

/** Canonical slug for this historical notice tool. */
export const AUSTRALIA_TAX_CUTS_SLUG =
  'income-tax-cuts-calculator-australia-federal-budget-202021' as const;

/** No editable inputs — unavailable / historical notice only (ADR-023 screenshot). */
export interface AustraliaTaxCutsInput {
  /** Increments on reload so share/feedback UI can reset. */
  noticeVersion: number;
}

export interface AustraliaTaxCutsResult {
  /** Shareable plain-text summary of the unavailable notice. */
  summaryText: string;
  gstCalculatorHref: typeof GST_CALCULATOR_HREF;
}

export type AustraliaTaxCutsFieldErrors = {
  form?: string;
};

export function createDefaultInput(): AustraliaTaxCutsInput {
  return { noticeVersion: 0 };
}
