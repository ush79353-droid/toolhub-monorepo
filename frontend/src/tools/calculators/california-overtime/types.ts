import type { SupportedCurrency } from '@/tools/shared/currency';

/** Pay-rate period shown beside Regular pay / Overtime pay. */
export type PayRateUnit = 'hour' | 'day' | 'week' | 'month' | 'year';

/** Second dropdown for duration rows (hours per …). */
export type DurationPeriod = 'day' | 'week' | 'month' | 'year';

export interface CaliforniaOvertimeInput {
  regularPay: string;
  regularPayCurrency: SupportedCurrency;
  regularPayUnit: PayRateUnit;
  regularWorkTime: string;
  regularWorkPeriod: DurationPeriod;
  totalRegularPayCurrency: SupportedCurrency;
  overtimeMultiplier: string;
  overtimePayCurrency: SupportedCurrency;
  overtimePayUnit: PayRateUnit;
  overtimeHours: string;
  overtimeHoursPeriod: DurationPeriod;
  totalOvertimePayCurrency: SupportedCurrency;
  totalPayCurrency: SupportedCurrency;
}

export interface CaliforniaOvertimeResult {
  /** Full-precision values in the regular-pay (calc) currency. */
  hourlyRate: number;
  weeklyHours: number;
  monthlyRegularPay: number;
  overtimeHourlyRate: number;
  overtimeHoursPerMonth: number;
  monthlyOvertimePay: number;
  monthlyTotalPay: number;
  calcCurrency: SupportedCurrency;
  /** Display amounts after FX into each field's currency. */
  totalRegularPayDisplay: number;
  overtimePayDisplay: number;
  totalOvertimePayDisplay: number;
  totalPayDisplay: number;
  formattedTotalRegularPay: string;
  formattedOvertimePay: string;
  formattedTotalOvertimePay: string;
  formattedTotalPay: string;
}

export type CaliforniaOvertimeFieldErrors = {
  regularPay?: string;
  regularWorkTime?: string;
  overtimeMultiplier?: string;
  overtimeHours?: string;
  form?: string;
};

export function createDefaultInput(): CaliforniaOvertimeInput {
  return {
    regularPay: '',
    regularPayCurrency: 'PKR',
    regularPayUnit: 'hour',
    regularWorkTime: '40',
    regularWorkPeriod: 'week',
    totalRegularPayCurrency: 'PKR',
    overtimeMultiplier: '1.5',
    overtimePayCurrency: 'PKR',
    overtimePayUnit: 'hour',
    overtimeHours: '',
    overtimeHoursPeriod: 'month',
    totalOvertimePayCurrency: 'PKR',
    totalPayCurrency: 'PKR',
  };
}
