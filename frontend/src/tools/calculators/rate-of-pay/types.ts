import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited wage field — authoritative for period conversions. */
export type RateOfPaySourceField =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'annual';

export interface RateOfPayInput {
  /** Hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  sourceField: RateOfPaySourceField;
  hourly: string;
  hourlyCurrency: SupportedCurrency;
  daily: string;
  dailyCurrency: SupportedCurrency;
  weekly: string;
  weeklyCurrency: SupportedCurrency;
  biweekly: string;
  biweeklyCurrency: SupportedCurrency;
  monthly: string;
  monthlyCurrency: SupportedCurrency;
  annual: string;
  annualCurrency: SupportedCurrency;
}

export interface RateOfPayResult {
  hourlyCanonical: number;
  dailyCanonical: number;
  weeklyCanonical: number;
  biweeklyCanonical: number;
  monthlyCanonical: number;
  annualCanonical: number;
  annualHours: number;
  hourly: number;
  daily: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  annual: number;
  hourlyCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  biweeklyCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  annualCurrency: SupportedCurrency;
  sourceCurrency: SupportedCurrency;
  formattedHourly: string;
  formattedDaily: string;
  formattedWeekly: string;
  formattedBiweekly: string;
  formattedMonthly: string;
  formattedAnnual: string;
  sourceField: RateOfPaySourceField;
}

export type RateOfPayFieldErrors = {
  hoursPerWeek?: string;
  hourly?: string;
  daily?: string;
  weekly?: string;
  biweekly?: string;
  monthly?: string;
  annual?: string;
  form?: string;
};

export function createDefaultInput(): RateOfPayInput {
  return {
    hoursPerWeek: '40',
    sourceField: 'hourly',
    hourly: '',
    hourlyCurrency: 'PKR',
    daily: '',
    dailyCurrency: 'PKR',
    weekly: '',
    weeklyCurrency: 'PKR',
    biweekly: '',
    biweeklyCurrency: 'PKR',
    monthly: '',
    monthlyCurrency: 'PKR',
    annual: '',
    annualCurrency: 'PKR',
  };
}
