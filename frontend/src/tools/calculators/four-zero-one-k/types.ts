import type { SupportedCurrency } from '@/tools/shared/currency';

/** Forward balance, or the employee contribution a target needs. */
export type FourZeroOneKMode = 'balance' | 'required';

export type ContributionKind = 'percent' | 'fixed';

/**
 * `none` — no match. An extra flat employer deposit can still be set.
 * `dollar-for-dollar` — 100% of deferrals up to matchUpToPercent of salary.
 * `partial` — matchRate of deferrals up to matchUpToPercent of salary.
 * `fixed` — fixedEmployerPercent of salary, not tied to the employee deferral.
 */
export type MatchKind = 'none' | 'dollar-for-dollar' | 'partial' | 'fixed';

export type ContributionFrequency = 'monthly' | 'biweekly' | 'yearly';

export type ContributionTiming = 'beginning' | 'end';

/** Informational only. The projection does not estimate taxes. */
export type AccountType = 'traditional' | 'roth';

export type FourZeroOneKField =
  | 'currentAge'
  | 'retirementAge'
  | 'balance'
  | 'annualSalary'
  | 'salaryGrowthPercent'
  | 'salaryCap'
  | 'employeePercent'
  | 'employeeFixedAnnual'
  | 'matchRatePercent'
  | 'matchUpToPercent'
  | 'fixedEmployerPercent'
  | 'extraEmployerAnnual'
  | 'annualReturnPercent'
  | 'annualFeePercent'
  | 'contributionIncrease'
  | 'targetBalance'
  | 'inflationPercent'
  | 'vestingPercent'
  | 'withdrawalPercent'
  | 'electiveDeferralLimit'
  | 'catchUpAge'
  | 'catchUpAmount'
  | 'annualAdditionsLimit'
  | 'currency';

export type FourZeroOneKFieldErrors = Partial<Record<FourZeroOneKField, string>>;

export interface FourZeroOneKInput {
  mode: FourZeroOneKMode;
  currentAge: number;
  retirementAge: number;
  balance: number;
  annualSalary: number;
  /** Decimal. 0.02 is 2% a year. Year 0 uses annualSalary. */
  salaryGrowthRate: number;
  /** Null means no cap. A cap is applied after growth, in the selected currency. */
  salaryCap: number | null;
  contributionKind: ContributionKind;
  /** Decimal share of that year's salary. */
  employeePercent: number;
  /** Annual dollar deferral before it is split across periods. */
  employeeFixedAnnual: number;
  /**
   * Percent mode: percentage points added each year (0.01 = +1 point), capped at 100%.
   * Fixed mode: annual growth rate of the dollar amount.
   */
  contributionIncrease: number;
  matchKind: MatchKind;
  /** Decimal. Used for partial matching. Dollar-for-dollar forces this to 1. */
  matchRate: number;
  /** Decimal cap on the deferral eligible for a match, as a share of salary. */
  matchUpToPercent: number;
  /** Decimal employer deposit as a share of salary. Used when matchKind is `fixed`. */
  fixedEmployerPercent: number;
  /** Flat annual employer dollars, independent of the match. Not grown. */
  extraEmployerAnnual: number;
  /** Decimal effective annual return. Period rate is (1 + rate) ^ (1 / periods) − 1. */
  annualReturn: number;
  /** Decimal effective annual fee, using the same period convention as the return. */
  annualFeeRate: number;
  frequency: ContributionFrequency;
  /**
   * Required in `required` mode. In `balance` mode it is only a progress marker
   * and does not change the projection.
   */
  targetBalance: number | null;
  accountType: AccountType;
  /** Decimal. Used only to deflate the displayed balance. */
  inflationRate: number;
  /** Share of each employer deposit that counts in the balance. 1 means fully vested. */
  vestingPercent: number;
  timing: ContributionTiming;
  /**
   * When true, electiveDeferralLimit is a user-supplied USD cap for one tax year.
   * No IRS table is built in. Limits are not applied when the display currency is not USD.
   */
  applyLimits: boolean;
  electiveDeferralLimit: number | null;
  catchUpAge: number | null;
  catchUpAmount: number | null;
  annualAdditionsLimit: number | null;
  /** Decimal. Null skips the withdrawal illustration. */
  withdrawalRate: number | null;
  currency: SupportedCurrency;
}

export interface ProjectionYear {
  year: number;
  age: number;
  salary: number;
  employeeContribution: number;
  employerContribution: number;
  vestedEmployerContribution: number;
  investmentGrowth: number;
  fees: number;
  endBalance: number;
  /** endBalance in today's purchasing power, after `year` years of inflation. */
  inflationAdjustedBalance: number;
}

export interface FourZeroOneKResult {
  mode: FourZeroOneKMode;
  /** True when the highest allowed contribution still misses the target. */
  impossible: boolean;
  finalBalance: number;
  inflationAdjustedBalance: number;
  employeeContributions: number;
  employerContributions: number;
  vestedEmployerContributions: number;
  investmentGrowth: number;
  fees: number;
  totalContributions: number;
  startingBalance: number;
  years: number;
  firstYearSalary: number;
  firstYearEmployeeContribution: number;
  firstYearEmployerContribution: number;
  firstYearEmployeePercent: number;
  employeePerPeriod: number;
  employerPerPeriod: number;
  /** finalBalance / target, or null when balance mode has no target. */
  fundingProgress: number | null;
  solvedEmployeePercent: number | null;
  solvedEmployeeFixedAnnual: number | null;
  limitsReducedAContribution: boolean;
  /** False when the user asked for limits but the display currency is not USD. */
  limitsApplied: boolean;
  accountType: AccountType;
  frequency: ContributionFrequency;
  estimatedAnnualWithdrawal: number | null;
  estimatedMonthlyWithdrawal: number | null;
  yearly: readonly ProjectionYear[];
}

export const MAX_MONEY = 100_000_000;
export const MIN_AGE = 15;
export const MAX_AGE = 100;
export const MAX_YEARS = 60;
export const MIN_RETURN = -0.99;
export const MAX_RETURN = 0.25;
export const MAX_FEE = 0.05;
export const MAX_SALARY_GROWTH = 0.2;
export const MAX_INFLATION = 0.15;
export const MAX_MATCH_RATE = 2;
export const MAX_WITHDRAWAL = 0.2;
export const PERCENT_STEP = 0.0001;
export const MONEY_STEP = 0.01;
