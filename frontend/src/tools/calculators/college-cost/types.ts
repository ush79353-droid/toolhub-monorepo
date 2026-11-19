import type { SupportedCurrency } from '@/tools/shared/currency';

export type CollegeTypePreset =
  | 'custom'
  | 'private-4'
  | 'public-in-4'
  | 'public-out-4'
  | 'public-2';

export type CollegeFinancialStatus =
  | 'fully-funded'
  | 'additional-savings-required'
  | 'savings-surplus';

/** College Board 2025–2026 reference averages (tuition, fees, living). */
export const COLLEGE_TYPE_PRESETS: readonly {
  id: CollegeTypePreset;
  label: string;
  annualCost: number;
}[] = [
  { id: 'private-4', label: '4-year private', annualCost: 65_470 },
  { id: 'public-in-4', label: '4-year public (in-state)', annualCost: 30_990 },
  { id: 'public-out-4', label: '4-year public (out-of-state)', annualCost: 50_920 },
  { id: 'public-2', label: '2-year public', annualCost: 21_320 },
];

export interface CollegeCostInput {
  annualCollegeCost: string;
  collegeType: CollegeTypePreset;
  collegeCostIncreaseRate: string;
  attendanceDuration: string;
  percentFromSavings: string;
  currentSavingsBalance: string;
  investmentReturnRate: string;
  taxRate: string;
  yearsUntilCollege: string;
  currency: SupportedCurrency;
}

export interface CollegeYearCost {
  academicYear: number;
  projectedAnnualCost: number;
  savingsFundedAmount: number;
  otherFundingAmount: number;
}

export interface CollegeCostResult {
  firstYearFutureCost: number;
  totalProjectedCollegeCost: number;
  savingsFundedTarget: number;
  otherFundingTarget: number;
  afterTaxInvestmentReturnPercent: number;
  projectedCurrentSavings: number;
  fundingGap: number;
  savingsSurplus: number;
  requiredMonthlySavings: number;
  requiredAnnualSavings: number;
  savingsCoveragePercentage: number;
  annualCostBreakdown: CollegeYearCost[];
  financialStatus: CollegeFinancialStatus;
  explanation: string;
  yearsUntilCollege: number;
  attendanceDuration: number;
  percentFromSavings: number;
  currency: SupportedCurrency;
}

export type CollegeCostFieldErrors = Partial<
  Record<
    | 'annualCollegeCost'
    | 'collegeCostIncreaseRate'
    | 'attendanceDuration'
    | 'percentFromSavings'
    | 'currentSavingsBalance'
    | 'investmentReturnRate'
    | 'taxRate'
    | 'yearsUntilCollege'
    | 'form',
    string
  >
>;

export function createDefaultInput(): CollegeCostInput {
  return {
    annualCollegeCost: '30990',
    collegeType: 'public-in-4',
    collegeCostIncreaseRate: '5',
    attendanceDuration: '4',
    percentFromSavings: '35',
    currentSavingsBalance: '0',
    investmentReturnRate: '5',
    taxRate: '25',
    yearsUntilCollege: '3',
    currency: 'USD',
  };
}

export function createExampleInput(): CollegeCostInput {
  return createDefaultInput();
}
