import type { SupportedCurrency } from '@/tools/shared/currency';

export type MonthlyIncomeHourlySourceField = 'monthly' | 'hourly';

export interface MonthlyIncomeHourlyInput {
  hoursPerWeek: string;
  sourceField: MonthlyIncomeHourlySourceField;
  monthly: string;
  monthlyCurrency: SupportedCurrency;
  hourly: string;
  hourlyCurrency: SupportedCurrency;
  otherMeasuresOpen: boolean;
}

export interface MonthlyIncomeHourlyResult {
  monthlyCanonical: number;
  hourlyCanonical: number;
  annualHours: number;
  monthly: number;
  hourly: number;
  monthlyCurrency: SupportedCurrency;
  hourlyCurrency: SupportedCurrency;
  sourceCurrency: SupportedCurrency;
  formattedMonthly: string;
  formattedHourly: string;
  sourceField: MonthlyIncomeHourlySourceField;
}

export type MonthlyIncomeHourlyFieldErrors = {
  hoursPerWeek?: string;
  monthly?: string;
  hourly?: string;
  form?: string;
};

export function createDefaultInput(): MonthlyIncomeHourlyInput {
  return {
    hoursPerWeek: '40',
    sourceField: 'monthly',
    monthly: '',
    monthlyCurrency: 'PKR',
    hourly: '',
    hourlyCurrency: 'PKR',
    otherMeasuresOpen: false,
  };
}
