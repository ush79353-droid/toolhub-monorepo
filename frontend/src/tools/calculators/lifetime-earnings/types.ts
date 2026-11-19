import type { SupportedCurrency } from '@/tools/shared/currency';

export interface LifetimeEarningsInput {
  currentAge: string;
  retirementAge: string;
  currentSalary: string;
  annualSalaryIncrease: string;
  currency: SupportedCurrency;
}

export interface AnnualSalaryProjection {
  year: number;
  age: number;
  annualSalary: number;
  cumulativeEarnings: number;
}

export interface LifetimeEarningsResult {
  workingYearsLeft: number;
  currentAge: number;
  retirementAge: number;
  currentSalary: number;
  salaryGrowthRatePercent: number;
  finalYearSalary: number;
  lifetimeEarnings: number;
  currency: SupportedCurrency;
  projection: AnnualSalaryProjection[];
  summaryText: string;
}

export type LifetimeEarningsFieldErrors = {
  currentAge?: string;
  retirementAge?: string;
  currentSalary?: string;
  annualSalaryIncrease?: string;
  form?: string;
};

export function createDefaultInput(): LifetimeEarningsInput {
  return {
    currentAge: '25',
    retirementAge: '65',
    currentSalary: '100000',
    annualSalaryIncrease: '5',
    currency: 'USD',
  };
}

export function createBlankInput(
  currency: SupportedCurrency = 'USD',
): LifetimeEarningsInput {
  return {
    currentAge: '',
    retirementAge: '',
    currentSalary: '',
    annualSalaryIncrease: '',
    currency,
  };
}
