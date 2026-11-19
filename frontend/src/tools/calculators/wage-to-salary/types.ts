import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited of hourly / daily / weekly — authoritative for conversions. */
export type WageSourceField = 'hourly' | 'daily' | 'weekly';

export interface WageToSalaryInput {
  sourceField: WageSourceField;
  hourlyWage: string;
  hourlyWageCurrency: SupportedCurrency;
  dailyWage: string;
  dailyWageCurrency: SupportedCurrency;
  weeklyWage: string;
  weeklyWageCurrency: SupportedCurrency;
  /** Hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  /** Days per week (default 5). Never FX-converted. */
  daysPerWeek: string;
  monthlyCurrency: SupportedCurrency;
  yearlyCurrency: SupportedCurrency;
  wageInfoOpen: boolean;
  workingDaysOpen: boolean;
  resultsOpen: boolean;
}

export interface WageToSalaryResult {
  weeklyCanonical: number;
  monthlyCanonical: number;
  yearlyCanonical: number;
  hourlyCanonical: number;
  dailyCanonical: number;
  monthly: number;
  yearly: number;
  hourly: number;
  daily: number;
  weekly: number;
  sourceField: WageSourceField;
  sourceCurrency: SupportedCurrency;
  hourlyWageCurrency: SupportedCurrency;
  dailyWageCurrency: SupportedCurrency;
  weeklyWageCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  yearlyCurrency: SupportedCurrency;
  formattedHourly: string;
  formattedDaily: string;
  formattedWeekly: string;
  formattedMonthly: string;
  formattedYearly: string;
}

export type WageToSalaryFieldErrors = {
  hourlyWage?: string;
  dailyWage?: string;
  weeklyWage?: string;
  hoursPerWeek?: string;
  daysPerWeek?: string;
  form?: string;
};

export function createDefaultInput(): WageToSalaryInput {
  return {
    sourceField: 'hourly',
    hourlyWage: '',
    hourlyWageCurrency: 'PKR',
    dailyWage: '',
    dailyWageCurrency: 'PKR',
    weeklyWage: '',
    weeklyWageCurrency: 'PKR',
    hoursPerWeek: '40',
    daysPerWeek: '5',
    monthlyCurrency: 'PKR',
    yearlyCurrency: 'PKR',
    wageInfoOpen: true,
    workingDaysOpen: true,
    resultsOpen: true,
  };
}
