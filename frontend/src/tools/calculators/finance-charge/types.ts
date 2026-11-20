import type { SupportedCurrency } from '@/tools/shared/currency';

export const DAYS_PER_YEAR = 365;
export const MAX_BILLING_CYCLE_DAYS = 366;
export const MAX_TERM_DAYS = 365 * 40;
export const DAILY_TABLE_MAX_ROWS = 45;

export type CalculationMethod = 'billing-cycle' | 'given-term';
export type TimeUnit = 'days' | 'weeks' | 'months' | 'years';

export type FinanceChargeStatus =
  | 'valid'
  | 'incomplete'
  | 'invalid'
  | 'empty';

export interface FinanceChargeInput {
  balance: string;
  apr: string;
  method: CalculationMethod;
  billingCycleDays: string;
  termLength: string;
  termUnit: TimeUnit;
  currency: SupportedCurrency;
  showDailyBreakdown: boolean;
}

export interface DailyInterestRow {
  day: number;
  balance: number;
  dailyInterest: number;
  cumulativeInterest: number;
}

export interface FinanceChargeResult {
  annualRateDecimal: number;
  dailyPeriodicRate: number;
  dailyPeriodicRatePercent: number;
  dailyFinanceCharge: number;
  calculationDays: number;
  financeCharge: number;
  periodInterestRate: number;
  totalBalanceWithCharge: number;
  method: CalculationMethod;
  termUnit: TimeUnit | null;
  termLength: number | null;
  dailyRows: DailyInterestRow[] | null;
  dailyRowsTruncated: boolean;
  status: FinanceChargeStatus;
  interpretation: string;
  warningMessage: string | null;
  currency: SupportedCurrency;
  formattedBalance: string;
  formattedDailyCharge: string;
  formattedFinanceCharge: string;
  formattedTotal: string;
  formattedPeriodRate: string;
  formattedDailyRatePercent: string;
}

export type FinanceChargeFieldErrors = {
  form?: string;
  balance?: string;
  apr?: string;
  billingCycleDays?: string;
  termLength?: string;
};

export function createDefaultInput(): FinanceChargeInput {
  return {
    balance: '1000',
    apr: '18',
    method: 'billing-cycle',
    billingCycleDays: '30',
    termLength: '6',
    termUnit: 'months',
    currency: 'PKR',
    showDailyBreakdown: false,
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): FinanceChargeInput {
  return {
    balance: '',
    apr: '',
    method: 'billing-cycle',
    billingCycleDays: '',
    termLength: '',
    termUnit: 'months',
    currency,
    showDailyBreakdown: false,
  };
}
