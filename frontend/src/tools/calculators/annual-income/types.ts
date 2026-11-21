import type { SupportedCurrency } from '@/tools/shared/currency';

export interface AnnualIncomeInput {
  /** Working hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  /** Working weeks per year (default 52, max 52). Never FX-converted. */
  weeksPerYear: string;
  /** Gross hourly wage. */
  hourlyWage: string;
  hourlyWageCurrency: SupportedCurrency;
  /** Independent display currency for annual income. */
  annualIncomeCurrency: SupportedCurrency;
  /** Flat tax percent (default 12). Never FX-converted. */
  taxPercent: string;
  /** Independent display currency for net hourly wage. */
  netHourlyCurrency: SupportedCurrency;
  /** Independent display currency for net annual income. */
  netAnnualCurrency: SupportedCurrency;
  /** Collapsible Net salary section (open by default to match screenshot). */
  netOpen: boolean;
}

export interface AnnualIncomeResult {
  annualIncomeCanonical: number;
  netHourlyCanonical: number;
  netAnnualCanonical: number;
  annualIncome: number;
  netHourly: number;
  netAnnual: number;
  hourlyWageCurrency: SupportedCurrency;
  annualIncomeCurrency: SupportedCurrency;
  netHourlyCurrency: SupportedCurrency;
  netAnnualCurrency: SupportedCurrency;
  formattedAnnualIncome: string;
  formattedNetHourly: string;
  formattedNetAnnual: string;
  taxPercent: number;
}

export type AnnualIncomeFieldErrors = {
  hoursPerWeek?: string;
  weeksPerYear?: string;
  hourlyWage?: string;
  taxPercent?: string;
  form?: string;
};

export function createDefaultInput(): AnnualIncomeInput {
  return {
    hoursPerWeek: '40',
    weeksPerYear: '52',
    hourlyWage: '',
    hourlyWageCurrency: 'PKR',
    annualIncomeCurrency: 'PKR',
    taxPercent: '12',
    netHourlyCurrency: 'PKR',
    netAnnualCurrency: 'PKR',
    netOpen: true,
  };
}
