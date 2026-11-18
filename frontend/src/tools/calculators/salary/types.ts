import type { SupportedCurrency } from '@/tools/shared/currency';

/**
 * Only "Per hour" is verified from the reference screenshot.
 * Other pay periods stay unsupported until explicitly specified.
 */
export type SalaryPayFrequency = 'hour';

export const SALARY_PAY_FREQUENCY_OPTIONS: readonly {
  value: SalaryPayFrequency;
  label: string;
}[] = [{ value: 'hour', label: 'Per hour' }] as const;

export interface SalaryInput {
  payFrequency: SalaryPayFrequency;
  /** Pay amount for the selected frequency. FX-converted when currency changes. */
  payAmount: string;
  payCurrency: SupportedCurrency;
  /** Hours per day (default 8). Never FX-converted. */
  hoursPerDay: string;
  /** Days per week (default 5). Never FX-converted. */
  daysPerWeek: string;
  /** Holidays per year (default 8). Informational; not deducted. Never FX-converted. */
  holidaysPerYear: string;
  /** Paid vacation days per year (default 15). Informational; not deducted. Never FX-converted. */
  paidVacationPerYear: string;
  /** Independent display currencies for derived salaries. */
  hourlyCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  annualCurrency: SupportedCurrency;
  scheduleOpen: boolean;
  resultsOpen: boolean;
}

export interface SalaryResult {
  hourlyCanonical: number;
  dailyCanonical: number;
  weeklyCanonical: number;
  monthlyCanonical: number;
  annualCanonical: number;
  hoursPerWeek: number;
  annualScheduledDays: number;
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
  payCurrency: SupportedCurrency;
  hourlyCurrency: SupportedCurrency;
  dailyCurrency: SupportedCurrency;
  weeklyCurrency: SupportedCurrency;
  monthlyCurrency: SupportedCurrency;
  annualCurrency: SupportedCurrency;
  formattedHourly: string;
  formattedDaily: string;
  formattedWeekly: string;
  formattedMonthly: string;
  formattedAnnual: string;
}

export type SalaryFieldErrors = {
  payAmount?: string;
  hoursPerDay?: string;
  daysPerWeek?: string;
  holidaysPerYear?: string;
  paidVacationPerYear?: string;
  form?: string;
};

export function createDefaultInput(): SalaryInput {
  return {
    payFrequency: 'hour',
    payAmount: '',
    payCurrency: 'PKR',
    hoursPerDay: '8',
    daysPerWeek: '5',
    holidaysPerYear: '8',
    paidVacationPerYear: '15',
    hourlyCurrency: 'PKR',
    dailyCurrency: 'PKR',
    weeklyCurrency: 'PKR',
    monthlyCurrency: 'PKR',
    annualCurrency: 'PKR',
    scheduleOpen: true,
    resultsOpen: true,
  };
}

export function payAmountLabel(frequency: SalaryPayFrequency): string {
  switch (frequency) {
    case 'hour':
      return 'Pay per hour';
    default: {
      const _exhaustive: never = frequency;
      return _exhaustive;
    }
  }
}
