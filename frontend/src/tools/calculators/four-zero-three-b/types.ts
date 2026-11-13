import type { SupportedCurrency } from '@/tools/shared/currency';

/** Forward balance, the employee deferral a target needs, or one salary/employer unknown. */
export type FourZeroThreeBMode = 'balance' | 'employee-contribution' | 'scenario';

/** Mode C solves exactly one of these. The other inputs stay fixed. */
export type ScenarioSolve = 'salary' | 'employer';

export type ContributionKind = 'percent' | 'fixed';

/**
 * `none` — the employer deposits nothing.
 * `percent-of-contribution` — matchRate of deferrals up to matchUpToPercent of salary.
 *   Dollar-for-dollar is matchRate 1. A 50% match on the first 6% is matchRate 0.5 and matchUpToPercent 0.06.
 * `fixed-percent` — a share of salary that does not depend on what the employee defers.
 */
export type MatchKind = 'none' | 'percent-of-contribution' | 'fixed-percent';

export type ContributionFrequency = 'monthly' | 'biweekly' | 'yearly';

export type ContributionTiming = 'beginning' | 'end';

/**
 * `nominal` — period rate = annual rate / periods. This is the default.
 * `effective` — period rate = (1 + annual rate) ^ (1 / periods) − 1.
 * One run uses one convention for both the return and the fee.
 */
export type RateConvention = 'nominal' | 'effective';

/** Informational only. The projection does not estimate taxes. */
export type AccountType = 'traditional' | 'roth';

export type FourZeroThreeBField =
  | 'currentAge'
  | 'retirementAge'
  | 'balance'
  | 'annualSalary'
  | 'salaryGrowthPercent'
  | 'employeePercent'
  | 'employeeFixedAnnual'
  | 'matchRatePercent'
  | 'matchUpToPercent'
  | 'fixedEmployerPercent'
  | 'annualReturnPercent'
  | 'annualFeePercent'
  | 'contributionIncrease'
  | 'targetBalance'
  | 'inflationPercent'
  | 'vestingPercent'
  | 'electiveDeferralLimit'
  | 'catchUpAge'
  | 'catchUpAmount'
  | 'annualAdditionsLimit'
  | 'scenario';

export type FourZeroThreeBFieldErrors = Partial<Record<FourZeroThreeBField, string>>;

export interface FourZeroThreeBInput {
  mode: FourZeroThreeBMode;
  scenarioSolve: ScenarioSolve;
  currentAge: number;
  retirementAge: number;
  balance: number;
  annualSalary: number;
  /** Decimal. 0.02 is 2% a year. Applied at each anniversary. Year 0 uses annualSalary. */
  salaryGrowthRate: number;
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
  /** Decimal. 0.5 means the employer adds 50% of the eligible deferral. */
  matchRate: number;
  /** Decimal cap on the deferral that is eligible for the match, as a share of salary. */
  matchUpToPercent: number;
  /** Decimal employer deposit as a share of salary, independent of the employee. */
  fixedEmployerPercent: number;
  /** Decimal nominal or effective annual return, depending on rateConvention. */
  annualReturn: number;
  /** Decimal annual fee, using the same convention as the return. */
  annualFeeRate: number;
  frequency: ContributionFrequency;
  /** Required for the contribution and scenario modes. Ignored for a forward balance. */
  targetBalance: number | null;
  accountType: AccountType;
  /** Decimal. Used only to deflate the displayed balance. */
  inflationRate: number;
  /** Share of each employer deposit that counts in the balance. 1 means fully vested. */
  vestingPercent: number;
  timing: ContributionTiming;
  rateConvention: RateConvention;
  /**
   * When true, electiveDeferralLimit is required. Catch-up and the annual-additions
   * cap are optional dollar assumptions for the year the user has in mind. No IRS
   * schedule is built in.
   */
  applyLimits: boolean;
  electiveDeferralLimit: number | null;
  catchUpAge: number | null;
  catchUpAmount: number | null;
  annualAdditionsLimit: number | null;
  currency: SupportedCurrency;
}

export interface ProjectionYear {
  /** 1-based year of the projection. */
  year: number;
  age: number;
  salary: number;
  employeeContribution: number;
  /** Employer deposit before vesting. */
  employerContribution: number;
  vestedEmployerContribution: number;
  investmentGrowth: number;
  fees: number;
  endBalance: number;
  /** endBalance in today's purchasing power, after `year` years of inflation. */
  inflationAdjustedBalance: number;
}

export interface FourZeroThreeBResult {
  mode: FourZeroThreeBMode;
  /** True when the highest allowed unknown still misses the target. */
  impossible: boolean;
  finalBalance: number;
  inflationAdjustedBalance: number;
  employeeContributions: number;
  employerContributions: number;
  vestedEmployerContributions: number;
  investmentGrowth: number;
  fees: number;
  startingBalance: number;
  years: number;
  firstYearSalary: number;
  firstYearEmployeeContribution: number;
  firstYearEmployerContribution: number;
  firstYearEmployeePercent: number;
  solvedEmployeePercent: number | null;
  solvedEmployeeFixedAnnual: number | null;
  solvedSalary: number | null;
  /** Solved match rate, or solved fixed employer percent, as a decimal. */
  solvedEmployerRate: number | null;
  limitsReducedAContribution: boolean;
  accountType: AccountType;
  rateConvention: RateConvention;
  frequency: ContributionFrequency;
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
export const PERCENT_STEP = 0.0001;
export const MONEY_STEP = 0.01;
