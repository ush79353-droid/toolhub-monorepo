import type { SupportedCurrency } from '@/tools/shared/currency';

export interface YearlyWageInput {
  /** Working hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  /** Working weeks per year (default 52, max 52). Never FX-converted. */
  weeksPerYear: string;
  /** Gross hourly wage. */
  hourlyWage: string;
  hourlyWageCurrency: SupportedCurrency;
  /** Independent display currency for yearly wage. */
  yearlyWageCurrency: SupportedCurrency;
  /** Flat tax percent (default 12). Never FX-converted. */
  taxPercent: string;
  /** Independent display currency for net hourly wage. */
  netHourlyCurrency: SupportedCurrency;
  /** Independent display currency for net yearly wage. */
  netYearlyCurrency: SupportedCurrency;
  /** Collapsible Net salary section (open by default to match screenshot). */
  netOpen: boolean;
}

export interface YearlyWageResult {
  yearlyWageCanonical: number;
  netHourlyCanonical: number;
  netYearlyCanonical: number;
  yearlyWage: number;
  netHourly: number;
  netYearly: number;
  hourlyWageCurrency: SupportedCurrency;
  yearlyWageCurrency: SupportedCurrency;
  netHourlyCurrency: SupportedCurrency;
  netYearlyCurrency: SupportedCurrency;
  formattedYearlyWage: string;
  formattedNetHourly: string;
  formattedNetYearly: string;
  taxPercent: number;
}

export type YearlyWageFieldErrors = {
  hoursPerWeek?: string;
  weeksPerYear?: string;
  hourlyWage?: string;
  taxPercent?: string;
  form?: string;
};

export function createDefaultInput(): YearlyWageInput {
  return {
    hoursPerWeek: '40',
    weeksPerYear: '52',
    hourlyWage: '',
    hourlyWageCurrency: 'PKR',
    yearlyWageCurrency: 'PKR',
    taxPercent: '12',
    netHourlyCurrency: 'PKR',
    netYearlyCurrency: 'PKR',
    netOpen: true,
  };
}
