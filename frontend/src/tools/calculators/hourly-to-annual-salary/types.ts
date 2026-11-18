import type { SupportedCurrency } from '@/tools/shared/currency';

export interface HourlyToAnnualSalaryInput {
  /** Hourly wage. FX-converted when currency changes. */
  hourlyWage: string;
  hourlyWageCurrency: SupportedCurrency;
  /** Hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  /** Days per week (default 5). Never FX-converted. */
  daysPerWeek: string;
  /** Independent display currencies for derived salaries. */
  annualCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  dataOpen: boolean;
  resultsOpen: boolean;
}

export interface HourlyToAnnualSalaryResult {
  hourlyCanonical: number;
  weeklyCanonical: number;
  annualCanonical: number;
  monthlyCanonical: number;
  dailyCanonical: number;
  weekly: number;
  annual: number;
  monthly: number;
  daily: number;
  hourlyWageCurrency: SupportedCurrency;
  annualCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  formattedAnnual: string;
  formattedMonthly: string;
  formattedWeekly: string;
  formattedDaily: string;
}

export type HourlyToAnnualSalaryFieldErrors = {
  hourlyWage?: string;
  hoursPerWeek?: string;
  daysPerWeek?: string;
  form?: string;
};

export function createDefaultInput(): HourlyToAnnualSalaryInput {
  return {
    hourlyWage: '',
    hourlyWageCurrency: 'PKR',
    hoursPerWeek: '40',
    daysPerWeek: '5',
    annualCurrency: 'PKR',
    monthlyCurrency: 'PKR',
    weeklyCurrency: 'PKR',
    dailyCurrency: 'PKR',
    dataOpen: true,
    resultsOpen: true,
  };
}
