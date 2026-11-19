/**
 * Florida Sales Tax Calculator — input / result shapes (fixed USD).
 * Screenshot-first (ADR-023): purchase amount + ZIP; county select when ZIP is ambiguous.
 */

export interface FloridaSalesTaxInput {
  /** Purchase amount in USD (string draft). */
  purchaseAmount: string;
  /** Five-digit FL ZIP as a string (leading zeros preserved). */
  zipCode: string;
  /**
   * County FIPS when the ZIP intersects multiple counties.
   * Empty when single-county or unresolved.
   */
  selectedCountyFips: string;
}

export type FloridaSalesTaxStatus =
  | 'resolved'
  | 'ambiguous'
  | 'zip_unknown'
  | 'county_required';

export interface FloridaSalesTaxResult {
  status: FloridaSalesTaxStatus;
  purchaseAmount: number;
  zipCode: string;
  countyName: string | null;
  countyFips: string | null;
  /** Candidate counties when status is ambiguous / county_required. */
  candidateCounties: readonly { fips: string; name: string }[];
  stateRatePercent: number;
  surtaxRatePercent: number | null;
  combinedRatePercent: number | null;
  stateTax: number | null;
  countySurtax: number | null;
  totalTax: number | null;
  totalAmount: number | null;
  /** Taxable base used for discretionary surtax (≤ $5,000 when resolved). */
  surtaxTaxableBase: number | null;
  formattedPurchaseAmount: string;
  formattedStateRatePercent: string;
  formattedSurtaxRatePercent: string;
  formattedCombinedRatePercent: string;
  formattedStateTax: string;
  formattedCountySurtax: string;
  formattedTotalTax: string;
  formattedTotalAmount: string;
  rateLabel: string;
  assumptionNote: string;
  summaryText: string;
}

export type FloridaSalesTaxFieldErrors = {
  purchaseAmount?: string;
  zipCode?: string;
  selectedCountyFips?: string;
  form?: string;
};

export function createDefaultInput(): FloridaSalesTaxInput {
  return {
    purchaseAmount: '',
    zipCode: '',
    selectedCountyFips: '',
  };
}

export function inputsEqual(
  a: FloridaSalesTaxInput,
  b: FloridaSalesTaxInput
): boolean {
  return (
    a.purchaseAmount === b.purchaseAmount &&
    a.zipCode === b.zipCode &&
    a.selectedCountyFips === b.selectedCountyFips
  );
}
