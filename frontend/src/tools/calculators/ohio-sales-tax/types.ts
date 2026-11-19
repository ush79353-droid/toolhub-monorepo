/**
 * Ohio Sales Tax Calculator — input / result shapes (fixed USD).
 * Functional scope follows the reference screenshot (ADR-023).
 *
 * Combined ZIP→rate data is not available in this project. Valid inputs
 * surface an explicit unavailable-rate result rather than inventing rates.
 */

export interface OhioSalesTaxInput {
  /** Purchase amount in USD (string draft). */
  purchaseAmount: string;
  /** Five-digit OH ZIP as a string (leading zeros preserved). */
  zipCode: string;
}

export interface OhioSalesTaxResult {
  purchaseAmount: number;
  zipCode: string;
  /** True when ZIP is in the Ohio range but no verified rate table exists. */
  rateUnavailable: true;
  unavailableMessage: string;
  formattedPurchaseAmount: string;
  summaryText: string;
}

export type OhioSalesTaxFieldErrors = {
  purchaseAmount?: string;
  zipCode?: string;
  form?: string;
};

export function createDefaultInput(): OhioSalesTaxInput {
  return {
    purchaseAmount: '',
    zipCode: '',
  };
}

export function inputsEqual(
  a: OhioSalesTaxInput,
  b: OhioSalesTaxInput
): boolean {
  return a.purchaseAmount === b.purchaseAmount && a.zipCode === b.zipCode;
}
