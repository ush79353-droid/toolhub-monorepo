/**
 * Sales Tax Calculator New Jersey — input / result shapes (fixed USD).
 * Functional scope follows the reference screenshot (ADR-023).
 */

export interface NewJerseySalesTaxInput {
  /** Purchase amount in USD (string draft). */
  purchaseAmount: string;
  /** Five-digit NJ ZIP as a string (leading zeros preserved). */
  zipCode: string;
}

export interface NewJerseySalesTaxResult {
  purchaseAmount: number;
  zipCode: string;
  /** Standard NJ state sales tax rate percent (6.625). */
  taxRatePercent: number;
  salesTax: number;
  totalAmount: number;
  formattedPurchaseAmount: string;
  formattedTaxRatePercent: string;
  formattedSalesTax: string;
  formattedTotalAmount: string;
  /** Short rate treatment label shown in results. */
  rateLabel: string;
  summaryText: string;
}

export type NewJerseySalesTaxFieldErrors = {
  purchaseAmount?: string;
  zipCode?: string;
  form?: string;
};

/** Empty defaults — screenshot starts blank. */
export function createDefaultInput(): NewJerseySalesTaxInput {
  return {
    purchaseAmount: '',
    zipCode: '',
  };
}

export function createExampleInput(): NewJerseySalesTaxInput {
  return {
    purchaseAmount: '100',
    zipCode: '07102',
  };
}

export function inputsEqual(
  a: NewJerseySalesTaxInput,
  b: NewJerseySalesTaxInput,
): boolean {
  return a.purchaseAmount === b.purchaseAmount && a.zipCode === b.zipCode;
}
