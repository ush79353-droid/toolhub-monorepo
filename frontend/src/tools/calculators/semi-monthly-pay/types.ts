import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited wage period — authoritative for semi-monthly conversion. */
export type SemiMonthlyPaySourceField =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly';

export interface SemiMonthlyPayInput {
  sourceField: SemiMonthlyPaySourceField;
  hourlyWage: string;
  hourlyWageCurrency: SupportedCurrency;
  dailyWage: string;
  dailyWageCurrency: SupportedCurrency;
  weeklyWage: string;
  weeklyWageCurrency: SupportedCurrency;
  monthlyWage: string;
  monthlyWageCurrency: SupportedCurrency;
  yearlyWage: string;
  yearlyWageCurrency: SupportedCurrency;
  /** Hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  /** Days per week (default 5). Never FX-converted. */
  daysPerWeek: string;
  semiMonthlyCurrency: SupportedCurrency;
  wagesOpen: boolean;
  resultsOpen: boolean;
}

export interface SemiMonthlyPayResult {
  hourlyCanonical: number;
  dailyCanonical: number;
  weeklyCanonical: number;
  monthlyCanonical: number;
  yearlyCanonical: number;
  semiMonthlyCanonical: number;
  /** Peer wages converted into each field's selected currency. */
  formattedHourly: string;
  formattedDaily: string;
  formattedWeekly: string;
  formattedMonthly: string;
  formattedYearly: string;
  semiMonthly: number;
  formattedSemiMonthly: string;
  sourceField: SemiMonthlyPaySourceField;
  sourceCurrency: SupportedCurrency;
  semiMonthlyCurrency: SupportedCurrency;
}

export type SemiMonthlyPayFieldErrors = {
  hourlyWage?: string;
  dailyWage?: string;
  weeklyWage?: string;
  monthlyWage?: string;
  yearlyWage?: string;
  hoursPerWeek?: string;
  daysPerWeek?: string;
  form?: string;
};

export function createDefaultInput(): SemiMonthlyPayInput {
  return {
    sourceField: 'hourly',
    hourlyWage: '',
    hourlyWageCurrency: 'PKR',
    dailyWage: '',
    dailyWageCurrency: 'PKR',
    weeklyWage: '',
    weeklyWageCurrency: 'PKR',
    monthlyWage: '',
    monthlyWageCurrency: 'PKR',
    yearlyWage: '',
    yearlyWageCurrency: 'PKR',
    hoursPerWeek: '40',
    daysPerWeek: '5',
    semiMonthlyCurrency: 'PKR',
    wagesOpen: true,
    resultsOpen: true,
  };
}

export function createExampleInput(): SemiMonthlyPayInput {
  return {
    ...createDefaultInput(),
    sourceField: 'hourly',
    hourlyWage: '500',
  };
}
