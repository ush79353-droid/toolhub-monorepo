/**
 * California Sales Tax Calculator — input / result shapes (fixed USD).
 * Functional scope: purchase + street + city + ZIP (PO-approved address fields).
 */

export interface CaliforniaSalesTaxInput {
  /** Purchase amount in USD (string draft). */
  purchaseAmount: string;
  /** Street address for CDTFA GetRateByAddress. */
  streetAddress: string;
  /** City for CDTFA GetRateByAddress. */
  city: string;
  /** Five-digit CA ZIP as a string (leading zeros preserved). */
  zipCode: string;
}

export interface CaliforniaRateMatch {
  rate: number;
  jurisdiction: string;
  city: string;
  county: string;
  tac: string;
}

export interface CaliforniaSalesTaxSuccessResult {
  kind: 'success';
  purchaseAmount: number;
  streetAddress: string;
  city: string;
  zipCode: string;
  taxRate: number;
  taxRatePercent: number;
  salesTax: number;
  totalAmount: number;
  jurisdiction: string;
  county: string;
  tac: string;
  formattedAddress: string | null;
  lookedUpAt: string;
  formattedPurchaseAmount: string;
  formattedTaxRatePercent: string;
  formattedSalesTax: string;
  formattedTotalAmount: string;
  summaryText: string;
}

export interface CaliforniaSalesTaxUnavailableResult {
  kind: 'unavailable';
  purchaseAmount: number;
  streetAddress: string;
  city: string;
  zipCode: string;
  unavailableMessage: string;
  candidates: CaliforniaRateMatch[];
  formattedPurchaseAmount: string;
  summaryText: string;
}

export type CaliforniaSalesTaxResult =
  | CaliforniaSalesTaxSuccessResult
  | CaliforniaSalesTaxUnavailableResult;

export type CaliforniaSalesTaxFieldErrors = {
  purchaseAmount?: string;
  streetAddress?: string;
  city?: string;
  zipCode?: string;
  form?: string;
};

export function createDefaultInput(): CaliforniaSalesTaxInput {
  return {
    purchaseAmount: '',
    streetAddress: '',
    city: '',
    zipCode: '',
  };
}

export function inputsEqual(
  a: CaliforniaSalesTaxInput,
  b: CaliforniaSalesTaxInput
): boolean {
  return (
    a.purchaseAmount === b.purchaseAmount &&
    a.streetAddress === b.streetAddress &&
    a.city === b.city &&
    a.zipCode === b.zipCode
  );
}
