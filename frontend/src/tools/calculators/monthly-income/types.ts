import type { SupportedCurrency } from '@/tools/shared/currency';

export type MonthlyIncomeSourceField =
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'yearly';

export interface MonthlyIncomeInput {
  sourceField: MonthlyIncomeSourceField;
  hourly: string;
  hourlyCurrency: SupportedCurrency;
  daily: string;
  dailyCurrency: SupportedCurrency;
  weekly: string;
  weeklyCurrency: SupportedCurrency;
  yearly: string;
  yearlyCurrency: SupportedCurrency;
  adjustSchedule: boolean;
  hoursPerDay: string;
  daysPerWeek: string;
  weeksPerYear: string;
  monthlyCurrency: SupportedCurrency;
  earnOpen: boolean;
}

export interface MonthlyIncomeResult {
  hourlyCanonical: number;
  dailyCanonical: number;
  weeklyCanonical: number;
  yearlyCanonical: number;
  monthlyCanonical: number;
  hourly: number;
  daily: number;
  weekly: number;
  yearly: number;
  monthly: number;
  sourceField: MonthlyIncomeSourceField;
  sourceCurrency: SupportedCurrency;
  hourlyCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  yearlyCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  formattedHourly: string;
  formattedDaily: string;
  formattedWeekly: string;
  formattedYearly: string;
  formattedMonthly: string;
}

export type MonthlyIncomeFieldErrors = {
  hourly?: string;
  daily?: string;
  weekly?: string;
  yearly?: string;
  hoursPerDay?: string;
  daysPerWeek?: string;
  weeksPerYear?: string;
  form?: string;
};

export function createDefaultInput(): MonthlyIncomeInput {
  return {
    sourceField: 'hourly',
    hourly: '',
    hourlyCurrency: 'PKR',
    daily: '',
    dailyCurrency: 'PKR',
    weekly: '',
    weeklyCurrency: 'PKR',
    yearly: '',
    yearlyCurrency: 'PKR',
    adjustSchedule: false,
    hoursPerDay: '8',
    daysPerWeek: '5',
    weeksPerYear: '52',
    monthlyCurrency: 'PKR',
    earnOpen: true,
  };
}
