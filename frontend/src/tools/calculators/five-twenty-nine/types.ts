import type { SupportedCurrency } from '@/tools/shared/currency';

export type ContributionTiming = 'beginning' | 'end';
export type CollegePaymentTiming = 'start' | 'end';

export interface FiveTwentyNineInput {
  currentAge: number;
  collegeStartAge: number;
  collegeYears: number;
  /** Illustrative annual cost in today's chosen currency, not a tuition survey. */
  currentAnnualCost: number;
  educationInflationPercent: number;
  /** Annual scholarship in today's currency. It inflates with education costs. */
  annualScholarship: number;
  currentBalance: number;
  initialLumpSum: number;
  monthlyContribution: number;
  annualReturnPercent: number;
  annualFeePercent: number;
  contributionTiming: ContributionTiming;
  /** Once a year, the monthly contribution is multiplied by 1 + this rate. */
  annualContributionGrowthPercent: number;
  /** Paid at the start of each savings year, including today, separate from the lump sum. */
  additionalAnnualContribution: number;
  /** Share of education cost after scholarships that the plan should cover. */
  targetFundingPercent: number;
  collegePaymentTiming: CollegePaymentTiming;
  /**
   * Optional warning threshold for one year's deposits. Not an IRS limit.
   * Null means no warning.
   */
  annualContributionAlert: number | null;
  currency: SupportedCurrency;
}

export type FiveTwentyNineFieldKey = keyof FiveTwentyNineInput | 'form';
export type FiveTwentyNineFieldErrors = Partial<Record<FiveTwentyNineFieldKey, string>>;

export interface FiveTwentyNineValidationResult {
  isValid: boolean;
  errors: FiveTwentyNineFieldErrors;
}

export interface FiveTwentyNineYearRow {
  year: number;
  phase: 'saving' | 'college';
  endingBalance: number;
  contributions: number;
  growth: number;
  fees: number;
  withdrawal: number;
  educationCost: number;
  scholarship: number;
}

export interface FiveTwentyNineResult {
  currency: SupportedCurrency;
  yearsUntilCollege: number;
  monthsUntilCollege: number;
  monthlyReturnRate: number;
  monthlyFeeRate: number;
  balanceAtCollegeStart: number;
  firstYearCost: number;
  totalEducationCost: number;
  totalScholarships: number;
  netEducationCost: number;
  totalContributions: number;
  investmentGrowth: number;
  investmentFees: number;
  coveredByPlan: number;
  fundingGap: number;
  surplusBalance: number;
  percentFunded: number | null;
  requiredMonthlyContribution: number | null;
  requiredContributionImpossible: boolean;
  contributionExceedsAlert: boolean;
  rows: readonly FiveTwentyNineYearRow[];
}

export const DEFAULT_FIVE_TWENTY_NINE_INPUT: FiveTwentyNineInput = {
  currentAge: 8,
  collegeStartAge: 18,
  collegeYears: 4,
  currentAnnualCost: 20000,
  educationInflationPercent: 5,
  annualScholarship: 0,
  currentBalance: 10000,
  initialLumpSum: 0,
  monthlyContribution: 250,
  annualReturnPercent: 6,
  annualFeePercent: 0.2,
  contributionTiming: 'end',
  annualContributionGrowthPercent: 0,
  additionalAnnualContribution: 0,
  targetFundingPercent: 100,
  collegePaymentTiming: 'start',
  annualContributionAlert: null,
  currency: 'USD',
};

/** Nominal annual rate divided by 12. Not the effective monthly rate (1+r)^(1/12)−1. */
export const MONTHLY_RATE_NOTE =
  'Each monthly rate is the annual percent divided by 12. Fees are tracked separately from gross growth.';
