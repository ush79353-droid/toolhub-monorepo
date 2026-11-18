import type { SupportedCurrency } from '@/tools/shared/currency';

export interface AnnualSalaryInput {
  /** Working hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  /** Working weeks per year (default 52). Never FX-converted. */
  weeksPerYear: string;
  /** Gross hourly wage. */
  hourlyWage: string;
  hourlyWageCurrency: SupportedCurrency;
  /** Independent display currency for annual salary. */
  annualSalaryCurrency: SupportedCurrency;
  /** Flat tax percent (default 12). Never FX-converted. */
  taxPercent: string;
  /** Independent display currency for net hourly wage. */
  netHourlyCurrency: SupportedCurrency;
  /** Independent display currency for net annual salary. */
  netAnnualCurrency: SupportedCurrency;
  /** Collapsible Net salary section (open by default to match screenshot). */
  netOpen: boolean;
}

export interface AnnualSalaryResult {
  /** Full-precision annual salary in hourly-wage currency. */
  annualSalaryCanonical: number;
  /** Full-precision net hourly wage in hourly-wage currency. */
  netHourlyCanonical: number;
  /** Full-precision net annual salary in hourly-wage currency. */
  netAnnualCanonical: number;
  /** Annual salary after FX into annualSalaryCurrency. */
  annualSalary: number;
  /** Net hourly after FX into netHourlyCurrency. */
  netHourly: number;
  /** Net annual after FX into netAnnualCurrency. */
  netAnnual: number;
  hourlyWageCurrency: SupportedCurrency;
  annualSalaryCurrency: SupportedCurrency;
  netHourlyCurrency: SupportedCurrency;
  netAnnualCurrency: SupportedCurrency;
  formattedAnnualSalary: string;
  formattedNetHourly: string;
  formattedNetAnnual: string;
  taxPercent: number;
}

export type AnnualSalaryFieldErrors = {
  hoursPerWeek?: string;
  weeksPerYear?: string;
  hourlyWage?: string;
  taxPercent?: string;
  form?: string;
};

export function createDefaultInput(): AnnualSalaryInput {
  return {
    hoursPerWeek: '40',
    weeksPerYear: '52',
    hourlyWage: '',
    hourlyWageCurrency: 'PKR',
    annualSalaryCurrency: 'PKR',
    taxPercent: '12',
    netHourlyCurrency: 'PKR',
    netAnnualCurrency: 'PKR',
    netOpen: true,
  };
}
