export type TaxBracketYear = 2024 | 2025 | 2026;

export type TaxBracketFilingStatus =
  | 'single'
  | 'married-joint'
  | 'married-separate'
  | 'head-of-household'
  | 'qualifying-surviving-spouse';

export interface TaxBracketCalculatorInput {
  taxYear: TaxBracketYear;
  filingStatus: TaxBracketFilingStatus;
  /** Income figure before the Deductions field is applied (see guide). */
  totalTaxableIncome: string;
  deductions: string;
}

export interface BracketSlice {
  rate: number;
  from: number;
  upTo: number;
  taxableInBracket: number;
  taxInBracket: number;
}

export interface TaxBracketCalculatorResult {
  taxYear: TaxBracketYear;
  filingStatus: TaxBracketFilingStatus;
  incomeEntered: number;
  deductions: number;
  /** max(0, income − deductions) used for brackets. */
  taxableIncome: number;
  estimatedTax: number;
  marginalRate: number;
  effectiveRate: number | null;
  slices: BracketSlice[];
  formattedIncomeEntered: string;
  formattedDeductions: string;
  formattedTaxableIncome: string;
  formattedEstimatedTax: string;
  formattedMarginalRate: string;
  formattedEffectiveRate: string;
  sourceNote: string;
}

export type TaxBracketFieldErrors = {
  totalTaxableIncome?: string;
  deductions?: string;
  form?: string;
};

export function createDefaultInput(): TaxBracketCalculatorInput {
  return {
    taxYear: 2024,
    filingStatus: 'single',
    totalTaxableIncome: '',
    deductions: '0',
  };
}
