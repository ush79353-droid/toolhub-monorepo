import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited wage field — authoritative for period conversions. */
export type WageSourceField =
  | 'hourly'
  | 'perSecond'
  | 'perMinute'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'annual';

export interface WageCalculatorInput {
  /** Hours per week (default 40). Never FX-converted. */
  hoursPerWeek: string;
  sourceField: WageSourceField;
  hourly: string;
  hourlyCurrency: SupportedCurrency;
  perSecond: string;
  perSecondCurrency: SupportedCurrency;
  perMinute: string;
  perMinuteCurrency: SupportedCurrency;
  daily: string;
  dailyCurrency: SupportedCurrency;
  weekly: string;
  weeklyCurrency: SupportedCurrency;
  biweekly: string;
  biweeklyCurrency: SupportedCurrency;
  monthly: string;
  monthlyCurrency: SupportedCurrency;
  annual: string;
  annualCurrency: SupportedCurrency;
}

export interface WageCalculatorResult {
  hourlyCanonical: number;
  perSecondCanonical: number;
  perMinuteCanonical: number;
  dailyCanonical: number;
  weeklyCanonical: number;
  biweeklyCanonical: number;
  monthlyCanonical: number;
  annualCanonical: number;
  annualHours: number;
  hourly: number;
  perSecond: number;
  perMinute: number;
  daily: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  annual: number;
  hourlyCurrency: SupportedCurrency;
  perSecondCurrency: SupportedCurrency;
  perMinuteCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  biweeklyCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  annualCurrency: SupportedCurrency;
  sourceCurrency: SupportedCurrency;
  formattedHourly: string;
  formattedPerSecond: string;
  formattedPerMinute: string;
  formattedDaily: string;
  formattedWeekly: string;
  formattedBiweekly: string;
  formattedMonthly: string;
  formattedAnnual: string;
  sourceField: WageSourceField;
}

export type WageCalculatorFieldErrors = {
  hoursPerWeek?: string;
  hourly?: string;
  perSecond?: string;
  perMinute?: string;
  daily?: string;
  weekly?: string;
  biweekly?: string;
  monthly?: string;
  annual?: string;
  form?: string;
};

export function createDefaultInput(): WageCalculatorInput {
  return {
    hoursPerWeek: '40',
    sourceField: 'hourly',
    hourly: '',
    hourlyCurrency: 'PKR',
    perSecond: '',
    perSecondCurrency: 'PKR',
    perMinute: '',
    perMinuteCurrency: 'PKR',
    daily: '',
    dailyCurrency: 'PKR',
    weekly: '',
    weeklyCurrency: 'PKR',
    biweekly: '',
    biweeklyCurrency: 'PKR',
    monthly: '',
    monthlyCurrency: 'PKR',
    annual: '',
    annualCurrency: 'PKR',
  };
}
