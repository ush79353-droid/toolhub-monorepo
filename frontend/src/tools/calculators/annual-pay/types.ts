import type { SupportedCurrency } from '@/tools/shared/currency';

export interface AnnualPayInput {
  /** Working hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  /** Working weeks per year (default 52, max 52). Never FX-converted. */
  weeksPerYear: string;
  /** Gross hourly wage. */
  hourlyWage: string;
  hourlyWageCurrency: SupportedCurrency;
  /** Independent display currency for annual pay. */
  annualPayCurrency: SupportedCurrency;
  /** Flat tax percent (default 12). Never FX-converted. */
  taxPercent: string;
  /** Independent display currency for net hourly wage. */
  netHourlyCurrency: SupportedCurrency;
  /** Independent display currency for net annual pay. */
  netAnnualCurrency: SupportedCurrency;
  /** Collapsible Net salary section (open by default to match screenshot). */
  netOpen: boolean;
}

export interface AnnualPayResult {
  annualPayCanonical: number;
  netHourlyCanonical: number;
  netAnnualCanonical: number;
  annualPay: number;
  netHourly: number;
  netAnnual: number;
  hourlyWageCurrency: SupportedCurrency;
  annualPayCurrency: SupportedCurrency;
  netHourlyCurrency: SupportedCurrency;
  netAnnualCurrency: SupportedCurrency;
  formattedAnnualPay: string;
  formattedNetHourly: string;
  formattedNetAnnual: string;
  taxPercent: number;
}

export type AnnualPayFieldErrors = {
  hoursPerWeek?: string;
  weeksPerYear?: string;
  hourlyWage?: string;
  taxPercent?: string;
  form?: string;
};

export function createDefaultInput(): AnnualPayInput {
  return {
    hoursPerWeek: '40',
    weeksPerYear: '52',
    hourlyWage: '',
    hourlyWageCurrency: 'PKR',
    annualPayCurrency: 'PKR',
    taxPercent: '12',
    netHourlyCurrency: 'PKR',
    netAnnualCurrency: 'PKR',
    netOpen: true,
  };
}
