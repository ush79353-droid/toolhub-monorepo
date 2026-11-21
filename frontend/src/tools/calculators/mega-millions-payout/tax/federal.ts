/**
 * Federal individual income tax configuration for Mega Millions estimates.
 *
 * Tax year: 2025 (IRS Rev. Proc. 2024-40 inflation adjustments).
 * Last updated: 2026-03-26
 * Source: IRS inflation-adjusted brackets / standard deductions for TY 2025.
 *
 * Assumptions for lottery estimates:
 * - Winnings are ordinary taxable income.
 * - Standard deduction only (no other income, credits, or itemized deductions).
 * - Progressive brackets applied to taxable income after the standard deduction.
 */

import type { FilingStatus } from '../types';

export const FEDERAL_TAX_YEAR = 2025;

export interface TaxBracket {
  /** Upper bound of the bracket (exclusive). Use Infinity for the top bracket. */
  upTo: number;
  rate: number;
}

export interface FederalTaxConfig {
  taxYear: number;
  lastUpdated: string;
  source: string;
  standardDeduction: Record<FilingStatus, number>;
  brackets: Record<FilingStatus, readonly TaxBracket[]>;
}

export const FEDERAL_TAX_2025: FederalTaxConfig = {
  taxYear: 2025,
  lastUpdated: '2026-03-26',
  source: 'IRS Rev. Proc. 2024-40 (TY 2025 brackets and standard deductions)',
  standardDeduction: {
    single: 15_000,
    married_jointly: 30_000,
    married_separately: 15_000,
    head_of_household: 22_500,
    qualifying_surviving_spouse: 30_000,
  },
  brackets: {
    single: [
      { upTo: 11_925, rate: 0.1 },
      { upTo: 48_475, rate: 0.12 },
      { upTo: 103_350, rate: 0.22 },
      { upTo: 197_300, rate: 0.24 },
      { upTo: 250_525, rate: 0.32 },
      { upTo: 626_350, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    married_jointly: [
      { upTo: 23_850, rate: 0.1 },
      { upTo: 96_950, rate: 0.12 },
      { upTo: 206_700, rate: 0.22 },
      { upTo: 394_600, rate: 0.24 },
      { upTo: 501_050, rate: 0.32 },
      { upTo: 751_600, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    married_separately: [
      { upTo: 11_925, rate: 0.1 },
      { upTo: 48_475, rate: 0.12 },
      { upTo: 103_350, rate: 0.22 },
      { upTo: 197_300, rate: 0.24 },
      { upTo: 250_525, rate: 0.32 },
      { upTo: 375_800, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    head_of_household: [
      { upTo: 17_000, rate: 0.1 },
      { upTo: 64_850, rate: 0.12 },
      { upTo: 103_350, rate: 0.22 },
      { upTo: 197_300, rate: 0.24 },
      { upTo: 250_500, rate: 0.32 },
      { upTo: 626_350, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
    qualifying_surviving_spouse: [
      { upTo: 23_850, rate: 0.1 },
      { upTo: 96_950, rate: 0.12 },
      { upTo: 206_700, rate: 0.22 },
      { upTo: 394_600, rate: 0.24 },
      { upTo: 501_050, rate: 0.32 },
      { upTo: 751_600, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 },
    ],
  },
};

export function applyProgressiveTax(
  taxableIncome: number,
  brackets: readonly TaxBracket[],
): number {
  if (!(taxableIncome > 0) || !Number.isFinite(taxableIncome)) return 0;
  let tax = 0;
  let previous = 0;
  for (const bracket of brackets) {
    const slice = Math.min(taxableIncome, bracket.upTo) - previous;
    if (slice <= 0) break;
    tax += slice * bracket.rate;
    previous = bracket.upTo;
    if (taxableIncome <= bracket.upTo) break;
  }
  return tax;
}

export function calculateFederalIncomeTax(
  amount: number,
  filingStatus: FilingStatus,
  taxYear: number = FEDERAL_TAX_YEAR,
): { tax: number; taxableIncome: number; available: boolean; note?: string } {
  if (taxYear !== FEDERAL_TAX_2025.taxYear) {
    return {
      tax: 0,
      taxableIncome: 0,
      available: false,
      note: `Federal tax year ${taxYear} is not configured. Estimates use TY ${FEDERAL_TAX_2025.taxYear} only.`,
    };
  }
  if (!Number.isFinite(amount) || amount < 0) {
    return { tax: 0, taxableIncome: 0, available: true };
  }
  const deduction = FEDERAL_TAX_2025.standardDeduction[filingStatus];
  const taxableIncome = Math.max(0, amount - deduction);
  const tax = applyProgressiveTax(
    taxableIncome,
    FEDERAL_TAX_2025.brackets[filingStatus],
  );
  return { tax, taxableIncome, available: true };
}
