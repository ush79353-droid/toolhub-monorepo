import type { SupportedCurrency } from '@/tools/shared/currency';

/** One shift is always 12 hours. Overtime is whatever is left after regular hours. */
export const SHIFT_HOURS = 12;
/** Week, month, and year scale one shift by these fixed schedule constants. */
export const WORKDAYS_PER_WEEK = 5;
export const WEEKS_PER_MONTH = 4.4;
export const WEEKS_PER_YEAR = 52;

export const DEFAULT_HOURLY_WAGE = 20;
export const DEFAULT_OVERTIME_HOURLY_WAGE = 30;
export const DEFAULT_REGULAR_HOURS = 8;

export const MAX_WAGE = 1_000_000;
export const MAX_REGULAR_HOURS = SHIFT_HOURS;

export interface TwelveHourShiftPayInput {
  hourlyWage: number;
  overtimeHourlyWage: number;
  /** Hours inside the 12-hour shift paid at the regular wage. */
  regularHours: number;
  currency: SupportedCurrency;
}

export interface TwelveHourShiftPayResult {
  regularHours: number;
  overtimeHours: number;
  hourlyWage: number;
  overtimeHourlyWage: number;
  averageHourlyPay: number;
  payPerDay: number;
  payPerWeek: number;
  payPerMonth: number;
  payPerYear: number;
  currency: SupportedCurrency;
}

export type TwelveHourShiftPayField = 'hourlyWage' | 'overtimeHourlyWage' | 'regularHours';

export type TwelveHourShiftPayFieldErrors = Partial<Record<TwelveHourShiftPayField, string>>;

export const DEFAULT_TWELVE_HOUR_SHIFT_PAY_INPUT: TwelveHourShiftPayInput = {
  hourlyWage: DEFAULT_HOURLY_WAGE,
  overtimeHourlyWage: DEFAULT_OVERTIME_HOURLY_WAGE,
  regularHours: DEFAULT_REGULAR_HOURS,
  currency: 'PKR',
};
