import type { SupportedCurrency } from '@/tools/shared/currency';

export interface FutureSalaryInput {
  currentSalary: string;
  currentSalaryCurrency: SupportedCurrency;
  /** Average salary change per year (%). Never FX-converted. */
  salaryGrowthPercent: string;
  /** Number of years (duration). Never FX-converted. */
  years: string;
  /** Display currency for expected (nominal) future salary. */
  futureSalaryCurrency: SupportedCurrency;
  /** Average inflation per year (%). Never FX-converted. */
  inflationPercent: string;
  /** Display currency for real (inflation-adjusted) future salary. */
  realSalaryCurrency: SupportedCurrency;
  futureOpen: boolean;
  realOpen: boolean;
}

export interface FutureSalaryResult {
  /** Full-precision nominal future salary in current-salary currency. */
  futureSalaryCanonical: number;
  /** Full-precision real future salary in current-salary currency. */
  realSalaryCanonical: number;
  futureSalary: number;
  realSalary: number;
  currentSalaryCurrency: SupportedCurrency;
  futureSalaryCurrency: SupportedCurrency;
  realSalaryCurrency: SupportedCurrency;
  formattedFutureSalary: string;
  formattedRealSalary: string;
}

export type FutureSalaryFieldErrors = {
  currentSalary?: string;
  salaryGrowthPercent?: string;
  years?: string;
  inflationPercent?: string;
  form?: string;
};

/** Example 1 — Career growth (compound raises, modest inflation). */
export const EXAMPLE_CAREER_GROWTH: FutureSalaryInput = {
  currentSalary: '100000',
  currentSalaryCurrency: 'PKR',
  salaryGrowthPercent: '5',
  years: '10',
  futureSalaryCurrency: 'PKR',
  inflationPercent: '2',
  realSalaryCurrency: 'PKR',
  futureOpen: true,
  realOpen: true,
};

/** Example 2 — Inflation check (flat pay vs rising prices). */
export const EXAMPLE_INFLATION_CHECK: FutureSalaryInput = {
  currentSalary: '100000',
  currentSalaryCurrency: 'PKR',
  salaryGrowthPercent: '0',
  years: '10',
  futureSalaryCurrency: 'PKR',
  inflationPercent: '5',
  realSalaryCurrency: 'PKR',
  futureOpen: true,
  realOpen: true,
};

export function createDefaultInput(): FutureSalaryInput {
  return {
    currentSalary: '',
    currentSalaryCurrency: 'PKR',
    salaryGrowthPercent: '',
    years: '',
    futureSalaryCurrency: 'PKR',
    inflationPercent: '',
    realSalaryCurrency: 'PKR',
    futureOpen: true,
    realOpen: true,
  };
}
