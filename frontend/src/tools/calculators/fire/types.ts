import type { SupportedCurrency } from '@/tools/shared/currency';

export type FireMethod =
  | 'traditional-fire'
  | 'custom-withdrawal'
  | 'retirement-duration';

export type ExpenseFrequency = 'annual' | 'monthly';

export type FireStatus =
  | 'financially-independent'
  | 'on-track'
  | 'almost-there'
  | 'below-target'
  | 'not-achievable';

export const FIRE_METHOD_OPTIONS: readonly {
  value: FireMethod;
  label: string;
}[] = [
  { value: 'traditional-fire', label: '4% Rule / Traditional FIRE' },
  { value: 'custom-withdrawal', label: 'Custom safe withdrawal rate' },
  { value: 'retirement-duration', label: 'Retirement duration-based' },
] as const;

export interface FireInput {
  currentAge: string;
  retirementAge: string;
  lifeExpectancy: string;
  annualIncome: string;
  expenses: string;
  expenseFrequency: ExpenseFrequency;
  currentSavings: string;
  investmentReturnPercent: string;
  expenseInflationPercent: string;
  salaryGrowthPercent: string;
  safeWithdrawalRatePercent: string;
  method: FireMethod;
  currency: SupportedCurrency;
}

export interface FireProjectionPoint {
  age: number;
  year: number;
  portfolioValue: number;
  fireTarget: number;
  annualExpenses: number;
  contributions: number;
}

export interface FireScenario {
  name: string;
  annualReturnPercent: number;
  projectedSavings: number;
  fireNumber: number;
  requiredAnnualSavings: number;
  estimatedFiAge: number | null;
  surplusOrShortfall: number;
}

export interface FireResult {
  yearsUntilRetirement: number;
  retirementDuration: number;
  annualExpenses: number;
  annualExpensesAtRetirement: number;
  fireNumber: number;
  futureValueOfCurrentSavings: number;
  requiredAnnualSavings: number;
  requiredMonthlySavings: number;
  requiredSavingsRatePercent: number;
  projectedSavingsAtRetirement: number;
  portfolioSurplusOrShortfall: number;
  estimatedFiAge: number | null;
  isFinanciallyIndependent: boolean;
  alreadyFundedByExistingSavings: boolean;
  status: FireStatus;
  statusLabel: string;
  method: FireMethod;
  safeWithdrawalRatePercent: number;
  currency: SupportedCurrency;
  projection: FireProjectionPoint[];
  scenarios: FireScenario[];
  summaryText: string;
}

export type FireFieldErrors = {
  currentAge?: string;
  retirementAge?: string;
  lifeExpectancy?: string;
  annualIncome?: string;
  expenses?: string;
  currentSavings?: string;
  investmentReturnPercent?: string;
  expenseInflationPercent?: string;
  salaryGrowthPercent?: string;
  safeWithdrawalRatePercent?: string;
  form?: string;
};

export function createDefaultInput(): FireInput {
  return {
    currentAge: '30',
    retirementAge: '45',
    lifeExpectancy: '85',
    annualIncome: '80000',
    expenses: '40000',
    expenseFrequency: 'annual',
    currentSavings: '10000',
    investmentReturnPercent: '5',
    expenseInflationPercent: '2.5',
    salaryGrowthPercent: '2.5',
    safeWithdrawalRatePercent: '4',
    method: 'traditional-fire',
    currency: 'USD',
  };
}

export function createBlankInput(currency: SupportedCurrency = 'USD'): FireInput {
  return {
    currentAge: '',
    retirementAge: '',
    lifeExpectancy: '',
    annualIncome: '',
    expenses: '',
    expenseFrequency: 'annual',
    currentSavings: '',
    investmentReturnPercent: '',
    expenseInflationPercent: '',
    salaryGrowthPercent: '',
    safeWithdrawalRatePercent: '4',
    method: 'traditional-fire',
    currency,
  };
}
