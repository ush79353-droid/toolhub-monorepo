import {
  LATEST_POVERTY_YEAR,
  type UsStateCode,
} from './poverty-guidelines';
import type { MaritalStatus } from './repayment-standards';

export type CalculationPurpose = 'studentLoan' | 'budgeting';

export interface DiscretionaryIncomeInput {
  purpose: CalculationPurpose;
  // Student loan
  maritalStatus: MaritalStatus;
  state: UsStateCode;
  annualAgi: string;
  spouseAgi: string;
  dependents: string;
  repaymentStandardId: string;
  povertyYear: string;
  // Budgeting
  monthlyTakeHome: string;
  housing: string;
  utilities: string;
  groceries: string;
  transportation: string;
  insurance: string;
  minDebt: string;
  healthcare: string;
  childcare: string;
  otherNecessary: string;
}

export interface DiscretionaryIncomeResult {
  purpose: CalculationPurpose;
  // Student loan fields (null in budgeting)
  applicableAgi: number | null;
  povertyGuideline: number | null;
  protectionMultiplier: number | null;
  protectedIncome: number | null;
  familySize: number | null;
  povertyRegion: string | null;
  guidelineYear: number | null;
  guidelineSourceLabel: string | null;
  guidelineSourceUrl: string | null;
  planName: string | null;
  planAvailability: string | null;
  planNotes: string | null;
  includesSpouseIncome: boolean | null;
  assessmentRate: number | null;
  annualDiscretionaryIncome: number | null;
  monthlyDiscretionaryIncome: number | null;
  estimatedMonthlyPayment: number | null;
  // Budgeting
  totalNecessaryExpenses: number | null;
  budgetingDiscretionaryIncome: number | null;
  // Formatted
  formattedApplicableAgi: string | null;
  formattedPovertyGuideline: string | null;
  formattedProtectedIncome: string | null;
  formattedAnnualDi: string | null;
  formattedMonthlyDi: string | null;
  formattedEstimatedPayment: string | null;
  formattedTakeHome: string | null;
  formattedNecessary: string | null;
  formattedBudgetingDi: string | null;
  formulaBreakdown: string;
  explanation: string;
  disclaimer: string;
}

export type DiscretionaryIncomeFieldErrors = {
  form?: string;
  annualAgi?: string;
  spouseAgi?: string;
  dependents?: string;
  state?: string;
  repaymentStandardId?: string;
  povertyYear?: string;
  monthlyTakeHome?: string;
  housing?: string;
  utilities?: string;
  groceries?: string;
  transportation?: string;
  insurance?: string;
  minDebt?: string;
  healthcare?: string;
  childcare?: string;
  otherNecessary?: string;
};

export function createDefaultInput(): DiscretionaryIncomeInput {
  return {
    purpose: 'studentLoan',
    maritalStatus: 'single',
    state: 'CA',
    annualAgi: '60000',
    spouseAgi: '',
    dependents: '0',
    repaymentStandardId: 'ibr-new-10',
    povertyYear: String(LATEST_POVERTY_YEAR),
    monthlyTakeHome: '5000',
    housing: '1800',
    utilities: '250',
    groceries: '500',
    transportation: '300',
    insurance: '200',
    minDebt: '250',
    healthcare: '100',
    childcare: '0',
    otherNecessary: '200',
  };
}

export function createEmptyInput(): DiscretionaryIncomeInput {
  return {
    purpose: 'studentLoan',
    maritalStatus: 'single',
    state: 'CA',
    annualAgi: '',
    spouseAgi: '',
    dependents: '0',
    repaymentStandardId: 'ibr-new-10',
    povertyYear: String(LATEST_POVERTY_YEAR),
    monthlyTakeHome: '',
    housing: '',
    utilities: '',
    groceries: '',
    transportation: '',
    insurance: '',
    minDebt: '',
    healthcare: '',
    childcare: '',
    otherNecessary: '',
  };
}
