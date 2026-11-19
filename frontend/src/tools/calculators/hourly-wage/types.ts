import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Screenshot-first Hourly Wage Calculator inputs.
 * Hourly wage and every period output have independent FX selectors.
 * Hours per week is never FX-converted. Assumptions: 5 working days/week, 52 paid weeks/year.
 */
export interface HourlyWageInput {
  hourlyWage: string;
  hourlyWageCurrency: SupportedCurrency;
  /** Default 40. Never FX-converted. */
  hoursPerWeek: string;
  perSecondCurrency: SupportedCurrency;
  perMinuteCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  biweeklyCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  annualCurrency: SupportedCurrency;
}

export interface HourlyWageResult {
  perSecondCanonical: number;
  perMinuteCanonical: number;
  dailyCanonical: number;
  weeklyCanonical: number;
  biweeklyCanonical: number;
  monthlyCanonical: number;
  annualCanonical: number;
  hourlyWageCurrency: SupportedCurrency;
  perSecond: number;
  perMinute: number;
  daily: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  annual: number;
  perSecondCurrency: SupportedCurrency;
  perMinuteCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  biweeklyCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  annualCurrency: SupportedCurrency;
  formattedPerSecond: string;
  formattedPerMinute: string;
  formattedDaily: string;
  formattedWeekly: string;
  formattedBiweekly: string;
  formattedMonthly: string;
  formattedAnnual: string;
}

export type HourlyWageFieldErrors = {
  hourlyWage?: string;
  hoursPerWeek?: string;
  form?: string;
};

export function createDefaultInput(): HourlyWageInput {
  return {
    hourlyWage: '',
    hourlyWageCurrency: 'PKR',
    hoursPerWeek: '40',
    perSecondCurrency: 'PKR',
    perMinuteCurrency: 'PKR',
    dailyCurrency: 'PKR',
    weeklyCurrency: 'PKR',
    biweeklyCurrency: 'PKR',
    monthlyCurrency: 'PKR',
    annualCurrency: 'PKR',
  };
}
