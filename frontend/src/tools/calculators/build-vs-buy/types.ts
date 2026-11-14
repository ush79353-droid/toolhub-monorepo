import type { SupportedCurrency } from '@/tools/shared/currency';

export const BUILD_TIME_UNITS = ['days', 'weeks', 'months', 'years'] as const;
export type BuildTimeUnit = (typeof BUILD_TIME_UNITS)[number];

export const PAYBACK_UNITS = ['years', 'months'] as const;
export type PaybackUnit = (typeof PAYBACK_UNITS)[number];

/** 52 weeks / 12 months — documented assumption for week→month conversion. */
export const WEEKS_PER_MONTH = 52 / 12;
/** Working days per month — documented assumption for day/maintenance math. */
export const WORKING_DAYS_PER_MONTH = 22;

export interface BuildVsBuyInput {
  buyCostAnnual: number;
  employees: number;
  buildTime: number;
  buildTimeUnit: BuildTimeUnit;
  salaryMonthly: number;
  overheadPercent: number;
  maintenanceDaysPerMonth: number;
  paybackUnit: PaybackUnit;
  currency: SupportedCurrency;
}

export interface BuildVsBuyResult {
  currency: SupportedCurrency;
  effectiveMonthlyCost: number;
  costToBuild: number;
  annualMaintenance: number;
  annualSavings: number;
  yearsToProfit: number | null;
  /** False when annual savings ≤ 0 — UI shows "No payback". */
  hasPayback: boolean;
  buildDurationMonths: number;
  paybackUnit: PaybackUnit;
  paybackDisplay: string;
  effectiveMonthlyDisplay: string;
  costToBuildDisplay: string;
  annualMaintenanceDisplay: string;
  annualSavingsDisplay: string;
}

export type BuildVsBuyFieldErrors = Record<string, string>;

export function createDefaultInput(): BuildVsBuyInput {
  return {
    buyCostAnnual: Number.NaN,
    employees: 1,
    buildTime: Number.NaN,
    buildTimeUnit: 'weeks',
    salaryMonthly: Number.NaN,
    overheadPercent: 25,
    maintenanceDaysPerMonth: 1,
    paybackUnit: 'years',
    currency: 'PKR',
  };
}
