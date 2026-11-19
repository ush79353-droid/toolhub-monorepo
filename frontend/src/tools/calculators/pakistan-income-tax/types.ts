/**
 * Screenshot-first Income Tax Calculator Pakistan.
 * Fixed PKR (Rs.) — no currency selector / no FX.
 * Tax year config is identified in calculation.ts (Finance Act 2026 / TY 2027).
 */
export interface PakistanIncomeTaxInput {
  /** Monthly gross taxable employment salary in PKR. Default "0". */
  monthlyIncome: string;
}

export interface PakistanIncomeTaxResult {
  monthlyIncome: number;
  yearlyIncome: number;
  yearlyTax: number;
  monthlyTax: number;
  monthlyIncomeAfterTax: number;
  /** Tax year label shown in UI/share (e.g. "2027"). */
  taxYearLabel: string;
  formattedMonthlyTax: string;
  formattedMonthlyIncomeAfterTax: string;
  formattedYearlyIncome: string;
  formattedYearlyTax: string;
}

export type PakistanIncomeTaxFieldErrors = {
  monthlyIncome?: string;
  form?: string;
};

export function createDefaultInput(): PakistanIncomeTaxInput {
  return {
    monthlyIncome: '0',
  };
}

export function inputsEqual(
  a: PakistanIncomeTaxInput,
  b: PakistanIncomeTaxInput
): boolean {
  return a.monthlyIncome === b.monthlyIncome;
}
