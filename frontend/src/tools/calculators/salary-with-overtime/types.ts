import type { SupportedCurrency } from '@/tools/shared/currency';

/** Pay rate period (money per this unit of time). */
export type RatePeriod = 'hour' | 'day' | 'week' | 'month' | 'year';

/** Duration unit for work / overtime hours fields. */
export type DurationUnit = 'hours' | 'days' | 'weeks' | 'months';

/** Recurrence for work schedule and pay totals. */
export type PayFrequency = 'week' | 'month' | 'year';

export const RATE_PERIOD_OPTIONS: readonly { value: RatePeriod; label: string }[] = [
  { value: 'hour', label: 'hour' },
  { value: 'day', label: 'day' },
  { value: 'week', label: 'week' },
  { value: 'month', label: 'month' },
  { value: 'year', label: 'year' },
] as const;

export const DURATION_UNIT_OPTIONS: readonly {
  value: DurationUnit;
  label: string;
}[] = [
  { value: 'hours', label: 'hours' },
  { value: 'days', label: 'days' },
  { value: 'weeks', label: 'weeks' },
  { value: 'months', label: 'months' },
] as const;

export const PAY_FREQUENCY_OPTIONS: readonly {
  value: PayFrequency;
  label: string;
}[] = [
  { value: 'week', label: 'week' },
  { value: 'month', label: 'month' },
  { value: 'year', label: 'year' },
] as const;

export interface SalaryWithOvertimeInput {
  regularSectionOpen: boolean;
  overtimeSectionOpen: boolean;
  regularPay: string;
  regularPayCurrency: SupportedCurrency;
  regularPayPeriod: RatePeriod;
  regularWorkTime: string;
  regularWorkDurationUnit: DurationUnit;
  regularWorkFrequency: PayFrequency;
  totalRegularPayCurrency: SupportedCurrency;
  totalRegularPayFrequency: PayFrequency;
  overtimeMultiplier: string;
  overtimePayCurrency: SupportedCurrency;
  overtimePayPeriod: RatePeriod;
  overtimeHours: string;
  overtimeHoursDurationUnit: DurationUnit;
  overtimeHoursFrequency: PayFrequency;
  totalOvertimePayCurrency: SupportedCurrency;
  totalOvertimePayFrequency: PayFrequency;
  totalPayCurrency: SupportedCurrency;
  totalPayFrequency: PayFrequency;
}

export interface SalaryWithOvertimeResult {
  hourlyRegularRate: number;
  hourlyOvertimeRate: number;
  weeklyRegularHours: number;
  monthlyOvertimeHours: number;
  monthlyRegularPay: number;
  monthlyOvertimePay: number;
  monthlyTotalPay: number;
  calcCurrency: SupportedCurrency;
  formattedHourlyOvertimeRate: string;
  formattedTotalRegularPay: string;
  formattedTotalOvertimePay: string;
  formattedTotalPay: string;
  displayOvertimeRate: number;
  displayTotalRegularPay: number;
  displayTotalOvertimePay: number;
  displayTotalPay: number;
}

export type SalaryWithOvertimeFieldErrors = {
  regularPay?: string;
  regularWorkTime?: string;
  overtimeMultiplier?: string;
  overtimeHours?: string;
  form?: string;
};

export function createDefaultInput(): SalaryWithOvertimeInput {
  return {
    regularSectionOpen: true,
    overtimeSectionOpen: true,
    regularPay: '',
    regularPayCurrency: 'PKR',
    regularPayPeriod: 'hour',
    regularWorkTime: '',
    regularWorkDurationUnit: 'hours',
    regularWorkFrequency: 'month',
    totalRegularPayCurrency: 'PKR',
    totalRegularPayFrequency: 'month',
    overtimeMultiplier: '1.5',
    overtimePayCurrency: 'PKR',
    overtimePayPeriod: 'hour',
    overtimeHours: '',
    overtimeHoursDurationUnit: 'hours',
    overtimeHoursFrequency: 'month',
    totalOvertimePayCurrency: 'PKR',
    totalOvertimePayFrequency: 'month',
    totalPayCurrency: 'PKR',
    totalPayFrequency: 'month',
  };
}
