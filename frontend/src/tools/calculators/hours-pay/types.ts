import type { SupportedCurrency } from '@/tools/shared/currency';

/** Last-edited pay period — authoritative for conversions. */
export type HoursPaySourceField = 'daily' | 'weekly' | 'monthly' | 'annual';

export interface HoursPayInput {
  sourceField: HoursPaySourceField;
  dailyPay: string;
  dailyPayCurrency: SupportedCurrency;
  weeklyPay: string;
  weeklyPayCurrency: SupportedCurrency;
  monthlyPay: string;
  monthlyPayCurrency: SupportedCurrency;
  annualPay: string;
  annualPayCurrency: SupportedCurrency;
  /** Working hours per day (default 8). Never FX-converted. */
  hoursPerDay: string;
  /** Working days per week (default 5). Never FX-converted. */
  daysPerWeek: string;
  /** Working weeks per year (default 52). Never FX-converted. */
  weeksPerYear: string;
  hourlyCurrency: SupportedCurrency;
  payInfoOpen: boolean;
  workingHoursOpen: boolean;
}

export interface HoursPayResult {
  dailyCanonical: number;
  weeklyCanonical: number;
  monthlyCanonical: number;
  annualCanonical: number;
  hourlyCanonical: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
  hourly: number;
  sourceField: HoursPaySourceField;
  sourceCurrency: SupportedCurrency;
  dailyPayCurrency: SupportedCurrency;
  weeklyPayCurrency: SupportedCurrency;
  monthlyPayCurrency: SupportedCurrency;
  annualPayCurrency: SupportedCurrency;
  hourlyCurrency: SupportedCurrency;
  formattedDaily: string;
  formattedWeekly: string;
  formattedMonthly: string;
  formattedAnnual: string;
  formattedHourly: string;
}

export type HoursPayFieldErrors = {
  dailyPay?: string;
  weeklyPay?: string;
  monthlyPay?: string;
  annualPay?: string;
  hoursPerDay?: string;
  daysPerWeek?: string;
  weeksPerYear?: string;
  form?: string;
};

export function createDefaultInput(): HoursPayInput {
  return {
    sourceField: 'daily',
    dailyPay: '',
    dailyPayCurrency: 'PKR',
    weeklyPay: '',
    weeklyPayCurrency: 'PKR',
    monthlyPay: '',
    monthlyPayCurrency: 'PKR',
    annualPay: '',
    annualPayCurrency: 'PKR',
    hoursPerDay: '8',
    daysPerWeek: '5',
    weeksPerYear: '52',
    hourlyCurrency: 'PKR',
    payInfoOpen: true,
    workingHoursOpen: false,
  };
}
