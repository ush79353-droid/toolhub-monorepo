import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited of Hourly wage or Annual salary — authoritative for conversions. */
export type WageSourceField = 'hourly' | 'annual';

export interface SalaryToHourlyInput {
  /** Hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  /** Authoritative wage period (hourly or annual). */
  sourceField: WageSourceField;
  hourlyWage: string;
  hourlyWageCurrency: SupportedCurrency;
  annualSalary: string;
  annualSalaryCurrency: SupportedCurrency;
  /** Independent display currencies for derived wage outputs. */
  dailyCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  biweeklyCurrency: SupportedCurrency;
  wageAsOpen: boolean;
  /** Collapsible Other time intervals — empty when no verified extra fields. */
  otherIntervalsOpen: boolean;
}

export interface SalaryToHourlyResult {
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
  hourlyWageCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  biweeklyCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  annualSalaryCurrency: SupportedCurrency;
  sourceCurrency: SupportedCurrency;
  formattedHourly: string;
  formattedDaily: string;
  formattedWeekly: string;
  formattedBiweekly: string;
  formattedMonthly: string;
  formattedAnnual: string;
  sourceField: WageSourceField;
}

export type SalaryToHourlyFieldErrors = {
  hoursPerWeek?: string;
  hourlyWage?: string;
  annualSalary?: string;
  form?: string;
};

export function createDefaultInput(): SalaryToHourlyInput {
  return {
    hoursPerWeek: '40',
    sourceField: 'annual',
    hourlyWage: '',
    hourlyWageCurrency: 'PKR',
    annualSalary: '',
    annualSalaryCurrency: 'PKR',
    dailyCurrency: 'PKR',
    monthlyCurrency: 'PKR',
    weeklyCurrency: 'PKR',
    biweeklyCurrency: 'PKR',
    wageAsOpen: true,
    otherIntervalsOpen: false,
  };
}
