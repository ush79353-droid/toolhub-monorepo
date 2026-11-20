import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited period wage — authoritative for hourly conversion. */
export type MoneyPerHourSourceField =
  | 'annual'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export interface MoneyPerHourInput {
  /** Hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  sourceField: MoneyPerHourSourceField;
  annual: string;
  annualCurrency: SupportedCurrency;
  monthly: string;
  monthlyCurrency: SupportedCurrency;
  biweekly: string;
  biweeklyCurrency: SupportedCurrency;
  weekly: string;
  weeklyCurrency: SupportedCurrency;
  daily: string;
  dailyCurrency: SupportedCurrency;
  /** Independent display currency for the Money per hour answer. */
  hourlyCurrency: SupportedCurrency;
}

export interface MoneyPerHourResult {
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
  sourceField: MoneyPerHourSourceField;
}

export type MoneyPerHourFieldErrors = {
  hoursPerWeek?: string;
  annual?: string;
  monthly?: string;
  biweekly?: string;
  weekly?: string;
  daily?: string;
  form?: string;
};

export function createDefaultInput(): MoneyPerHourInput {
  return {
    hoursPerWeek: '40',
    sourceField: 'annual',
    annual: '',
    annualCurrency: 'PKR',
    monthly: '',
    monthlyCurrency: 'PKR',
    biweekly: '',
    biweeklyCurrency: 'PKR',
    weekly: '',
    weeklyCurrency: 'PKR',
    daily: '',
    dailyCurrency: 'PKR',
    hourlyCurrency: 'PKR',
  };
}
