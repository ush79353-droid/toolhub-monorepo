import type { SupportedCurrency } from '@/tools/shared/currency';

export interface AnnualToMonthlySalaryInput {
  /** Gross annual salary. FX-converted when currency changes. */
  annualSalary: string;
  annualSalaryCurrency: SupportedCurrency;
  /** Hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  /** Independent display currencies for derived wages. */
  monthlyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  hourlyCurrency: SupportedCurrency;
  /** Your salary section open by default. */
  yourSalaryOpen: boolean;
  /** Other wage measures open by default. */
  otherWageOpen: boolean;
  /** More wage measures — empty when no verified extra fields. */
  moreWageOpen: boolean;
}

export interface AnnualToMonthlySalaryResult {
  annualCanonical: number;
  monthlyCanonical: number;
  weeklyCanonical: number;
  dailyCanonical: number;
  hourlyCanonical: number;
  annualHours: number;
  monthly: number;
  weekly: number;
  daily: number;
  hourly: number;
  annualSalaryCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  hourlyCurrency: SupportedCurrency;
  formattedMonthly: string;
  formattedWeekly: string;
  formattedDaily: string;
  formattedHourly: string;
}

export type AnnualToMonthlySalaryFieldErrors = {
  annualSalary?: string;
  hoursPerWeek?: string;
  form?: string;
};

export function createDefaultInput(): AnnualToMonthlySalaryInput {
  return {
    annualSalary: '',
    annualSalaryCurrency: 'PKR',
    hoursPerWeek: '40',
    monthlyCurrency: 'PKR',
    weeklyCurrency: 'PKR',
    dailyCurrency: 'PKR',
    hourlyCurrency: 'PKR',
    yourSalaryOpen: true,
    otherWageOpen: true,
    moreWageOpen: false,
  };
}
