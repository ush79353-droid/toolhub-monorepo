import type { SupportedCurrency } from '@/tools/shared/currency';

/** Statutory educational defaults (EPFO-style); rates/ceilings can change. */
export const DEFAULT_EPS_RATE_PERCENT = 8.33;
export const DEFAULT_EPS_WAGE_CEILING = 15000;
export const DEFAULT_EMPLOYEE_RATE = 12;
export const DEFAULT_EMPLOYER_RATE = 12;
export const DEFAULT_RETIREMENT_AGE = 58;
/** Illustrative assumption only — not an official EPFO announcement. */
export const ILLUSTRATIVE_INTEREST_RATE = 8.25;

export interface EpfInput {
  currency: SupportedCurrency;
  currentAge: string;
  retirementAge: string;
  monthlyBasicSalary: string;
  dearnessAllowance: string;
  annualSalaryGrowthRate: string;
  employeeContributionRate: string;
  employerContributionRate: string;
  annualInterestRate: string;
  existingEPFBalance: string;
  eligibleForEPS: boolean;
  epsWageCeiling: string;
  enableVPF: boolean;
  additionalVPFRate: string;
  enableComparison: boolean;
  compareGrowthRate: string;
  compareInterestRate: string;
  compareRetirementAge: string;
}

export interface EpfYearlyProjection {
  year: number;
  age: number;
  openingBalance: number;
  employeeContributions: number;
  employerEPFContributions: number;
  vpfContributions: number;
  epsContributions: number;
  interestEarned: number;
  closingBalance: number;
  cumulativeEmployee: number;
  cumulativeEmployerEPF: number;
  cumulativeInterest: number;
}

export interface EpfMonthlySplit {
  epfSalary: number;
  employeeContribution: number;
  employerTotalContribution: number;
  epsContribution: number;
  employerEPFContribution: number;
  vpfContribution: number;
  totalMonthlyEPFDeposit: number;
}

export interface EpfScenarioSnapshot {
  label: string;
  maturityValue: number;
  totalInterestEarned: number;
  totalEmployeeContributions: number;
  totalEmployerEPFContributions: number;
  yearsToRetirement: number;
}

export interface EpfResult {
  currency: SupportedCurrency;
  currentAge: number;
  retirementAge: number;
  yearsToRetirement: number;
  monthlyBasicSalary: number;
  dearnessAllowance: number;
  epfSalary: number;
  annualSalaryGrowthRate: number;
  employeeContributionRate: number;
  employerContributionRate: number;
  annualInterestRate: number;
  existingEPFBalance: number;
  eligibleForEPS: boolean;
  epsWageCeiling: number;
  additionalVPFRate: number;
  firstMonth: EpfMonthlySplit;
  totalEmployeeContributions: number;
  totalEmployerEPFContributions: number;
  totalVPFContributions: number;
  totalEPSContributions: number;
  totalProjectedEPFDeposits: number;
  totalInterestEarned: number;
  maturityValue: number;
  yearlySchedule: EpfYearlyProjection[];
  comparison: {
    base: EpfScenarioSnapshot;
    alt: EpfScenarioSnapshot;
    maturityDiff: number;
    interestDiff: number;
  } | null;
  formattedMaturity: string;
  formattedInterest: string;
  formattedMonthlyEPF: string;
  steps: string[];
  formulaBreakdown: string;
  interpretation: string;
  explanation: string;
}

export type EpfFieldErrors = {
  form?: string;
  currentAge?: string;
  retirementAge?: string;
  monthlyBasicSalary?: string;
  dearnessAllowance?: string;
  annualSalaryGrowthRate?: string;
  employeeContributionRate?: string;
  employerContributionRate?: string;
  annualInterestRate?: string;
  existingEPFBalance?: string;
  epsWageCeiling?: string;
  additionalVPFRate?: string;
  compareGrowthRate?: string;
  compareInterestRate?: string;
  compareRetirementAge?: string;
};

export function createDefaultInput(): EpfInput {
  return {
    currency: 'INR',
    currentAge: '',
    retirementAge: String(DEFAULT_RETIREMENT_AGE),
    monthlyBasicSalary: '',
    dearnessAllowance: '0',
    annualSalaryGrowthRate: '5',
    employeeContributionRate: String(DEFAULT_EMPLOYEE_RATE),
    employerContributionRate: String(DEFAULT_EMPLOYER_RATE),
    annualInterestRate: String(ILLUSTRATIVE_INTEREST_RATE),
    existingEPFBalance: '0',
    eligibleForEPS: true,
    epsWageCeiling: String(DEFAULT_EPS_WAGE_CEILING),
    enableVPF: false,
    additionalVPFRate: '',
    enableComparison: false,
    compareGrowthRate: '',
    compareInterestRate: '',
    compareRetirementAge: '',
  };
}

export function createEmptyInput(): EpfInput {
  return {
    currency: 'INR',
    currentAge: '',
    retirementAge: '',
    monthlyBasicSalary: '',
    dearnessAllowance: '',
    annualSalaryGrowthRate: '',
    employeeContributionRate: '',
    employerContributionRate: '',
    annualInterestRate: '',
    existingEPFBalance: '',
    eligibleForEPS: true,
    epsWageCeiling: String(DEFAULT_EPS_WAGE_CEILING),
    enableVPF: false,
    additionalVPFRate: '',
    enableComparison: false,
    compareGrowthRate: '',
    compareInterestRate: '',
    compareRetirementAge: '',
  };
}

/** Reference: age 25 · ₹15,000 basic · 12%/12% · 5% growth · 58 · illustrative 8.25% */
export function createExampleInput(): EpfInput {
  return {
    currency: 'INR',
    currentAge: '25',
    retirementAge: String(DEFAULT_RETIREMENT_AGE),
    monthlyBasicSalary: '15000',
    dearnessAllowance: '0',
    annualSalaryGrowthRate: '5',
    employeeContributionRate: String(DEFAULT_EMPLOYEE_RATE),
    employerContributionRate: String(DEFAULT_EMPLOYER_RATE),
    annualInterestRate: String(ILLUSTRATIVE_INTEREST_RATE),
    existingEPFBalance: '0',
    eligibleForEPS: true,
    epsWageCeiling: String(DEFAULT_EPS_WAGE_CEILING),
    enableVPF: false,
    additionalVPFRate: '',
    enableComparison: false,
    compareGrowthRate: '',
    compareInterestRate: '',
    compareRetirementAge: '',
  };
}
