/**
 * UI stub — verified 2022/2023 AMT formulas land in the engine commit.
 * Keeps the form shell compiling until calculation wiring is complete.
 */
import type { AmtInput, AmtResult } from './types';

export function suggestAmtiFromParts(agi: number, nonDeductibleTaxes: number): number {
  return agi + nonDeductibleTaxes;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateAmt(_input: {
  taxYear: AmtInput['taxYear'];
  filingStatus: AmtInput['filingStatus'];
  amti: number;
  taxCredits: number;
}): AmtResult | null {
  return null;
}

export function shareResultText(_result: AmtResult): string {
  return '';
}
