import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited wage field — authoritative for period conversions. */
export type WageSourceField =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'annual';

export interface AnnualSalaryPerHourInput {
  /** Hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  /** Authoritative wage period. */
  sourceField: WageSourceField;
  hourly: string;
  hourlyCurrency: SupportedCurrency;
  daily: string;
  dailyCurrency: SupportedCurrency;
  weekly: string;
  weeklyCurrency: SupportedCurrency;
  monthly: string;
  monthlyCurrency: SupportedCurrency;
  annual: string;
  annualCurrency: SupportedCurrency;
  /** Collapsible Other periods — empty when no verified extra fields. */
  otherPeriodsOpen: boolean;
}

export interface AnnualSalaryPerHourResult {
  /** Full-precision periods in the source-field currency. */
  hourlyCanonical: number;
  dailyCanonical: number;
  weeklyCanonical: number;
  monthlyCanonical: number;
  annualCanonical: number;
  annualHours: number;
  /** Display amounts after FX into each field currency. */
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
  hourlyCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  annualCurrency: SupportedCurrency;
  sourceCurrency: SupportedCurrency;
  formattedHourly: string;
  formattedDaily: string;
  formattedWeekly: string;
  formattedMonthly: string;
  formattedAnnual: string;
  sourceField: WageSourceField;
}

export type AnnualSalaryPerHourFieldErrors = {
  hoursPerWeek?: string;
  hourly?: string;
  daily?: string;
  weekly?: string;
  monthly?: string;
  annual?: string;
  form?: string;
};

export function createDefaultInput(): AnnualSalaryPerHourInput {
  return {
    hoursPerWeek: '40',
    sourceField: 'hourly',
    hourly: '',
    hourlyCurrency: 'PKR',
    daily: '',
    dailyCurrency: 'PKR',
    weekly: '',
    weeklyCurrency: 'PKR',
    monthly: '',
    monthlyCurrency: 'PKR',
    annual: '',
    annualCurrency: 'PKR',
    otherPeriodsOpen: false,
  };
}
