/**
 * Income Tax Philippines Calculator — screenshot-first (ADR-023).
 * Fixed PHP (₱). No currency selector / no FX.
 * Tax year / contribution schedules: CY 2025 (see calculation.ts sources).
 */
export type EmploymentStatus = 'employed' | 'self-employed';

export interface PhilippinesIncomeTaxInput {
  employmentStatus: EmploymentStatus;
  /** Monthly gross basic pay / declared income in PHP. */
  monthlyIncome: string;
}

export interface PhilippinesIncomeTaxResult {
  employmentStatus: EmploymentStatus;
  monthlyIncome: number;
  annualIncome: number;
  sss: number;
  philHealth: number;
  pagIbig: number;
  totalContributions: number;
  taxableIncome: number;
  withholdingTax: number;
  netPayAfterTax: number;
  totalDeductions: number;
  netPayAfterDeductions: number;
  /** UI label for the tax line (withholding vs estimated). */
  taxLabel: string;
  contributionsSectionTitle: string;
  taxYearLabel: string;
  formattedSss: string;
  formattedPhilHealth: string;
  formattedPagIbig: string;
  formattedTotalContributions: string;
  formattedTaxableIncome: string;
  formattedWithholdingTax: string;
  formattedNetPayAfterTax: string;
  formattedTotalDeductions: string;
  formattedNetPayAfterDeductions: string;
}

export type PhilippinesIncomeTaxFieldErrors = {
  monthlyIncome?: string;
  form?: string;
};

export function createDefaultInput(): PhilippinesIncomeTaxInput {
  return {
    employmentStatus: 'employed',
    monthlyIncome: '',
  };
}

export function inputsEqual(
  a: PhilippinesIncomeTaxInput,
  b: PhilippinesIncomeTaxInput
): boolean {
  return (
    a.employmentStatus === b.employmentStatus &&
    a.monthlyIncome === b.monthlyIncome
  );
}
