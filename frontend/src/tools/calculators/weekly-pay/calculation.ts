import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { PaySource, WeeklyPayResult } from './types';

export const MAX_DAYS_PER_WEEK = 7;
export const MAX_WEEKS_PER_YEAR = 52;

export interface WorkSchedule {
  hoursPerDay: number;
  daysPerWeek: number;
  paidWeeksPerYear: number;
}

export interface PayBreakdown {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
  hoursPerWeek: number;
  annualPaidHours: number;
  averageWeeksPerMonth: number;
}

export function roundMoney(amount: number, currency: SupportedCurrency): number {
  const digits = getCurrencyFractionDigits(currency);
  const factor = 10 ** digits;
  return Math.round(amount * factor) / factor;
}

export function formatPayMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Convert any pay source into a full period breakdown via weekly as the hub.
 *
 * Weekly from source:
 *   hourly  → amount × HPW
 *   daily   → amount × DPW
 *   weekly  → amount
 *   monthly → amount × 12 / WPY
 *   annual  → amount / WPY
 *
 * Then:
 *   hourly  = weekly / HPW
 *   daily   = weekly / DPW
 *   monthly = weekly × WPY / 12
 *   annual  = weekly × WPY
 *
 * Full precision; round only for display via formatPayMoney / roundMoney.
 */
export function calculateWeeklyPay(
  source: PaySource,
  amount: number,
  schedule: WorkSchedule,
): PayBreakdown | null {
  const { hoursPerDay, daysPerWeek, paidWeeksPerYear } = schedule;
  if (![amount, hoursPerDay, daysPerWeek, paidWeeksPerYear].every(Number.isFinite)) {
    return null;
  }
  if (amount < 0) return null;
  if (!(hoursPerDay > 0) || !(daysPerWeek > 0) || !(paidWeeksPerYear > 0)) return null;
  if (daysPerWeek > MAX_DAYS_PER_WEEK) return null;
  if (paidWeeksPerYear > MAX_WEEKS_PER_YEAR) return null;

  const hoursPerWeek = hoursPerDay * daysPerWeek;
  if (!(hoursPerWeek > 0) || !Number.isFinite(hoursPerWeek)) return null;

  let weekly: number;
  switch (source) {
    case 'hourly':
      weekly = amount * hoursPerWeek;
      break;
    case 'daily':
      weekly = amount * daysPerWeek;
      break;
    case 'weekly':
      weekly = amount;
      break;
    case 'monthly':
      weekly = (amount * 12) / paidWeeksPerYear;
      break;
    case 'annual':
      weekly = amount / paidWeeksPerYear;
      break;
    default:
      return null;
  }

  if (!Number.isFinite(weekly) || weekly < 0) return null;

  const hourly = weekly / hoursPerWeek;
  const daily = weekly / daysPerWeek;
  const monthly = (weekly * paidWeeksPerYear) / 12;
  const annual = weekly * paidWeeksPerYear;
  const annualPaidHours = hoursPerWeek * paidWeeksPerYear;
  const averageWeeksPerMonth = paidWeeksPerYear / 12;

  if (![hourly, daily, weekly, monthly, annual, annualPaidHours].every(Number.isFinite)) {
    return null;
  }

  return {
    hourly,
    daily,
    weekly,
    monthly,
    annual,
    hoursPerWeek,
    annualPaidHours,
    averageWeeksPerMonth,
  };
}

export function toWeeklyPayResult(
  breakdown: PayBreakdown,
  source: PaySource,
  schedule: WorkSchedule,
  unpaidWeeksOff: number,
  currency: SupportedCurrency,
): WeeklyPayResult {
  const hourly = roundMoney(breakdown.hourly, currency);
  const daily = roundMoney(breakdown.daily, currency);
  const weekly = roundMoney(breakdown.weekly, currency);
  const monthly = roundMoney(breakdown.monthly, currency);
  const annual = roundMoney(breakdown.annual, currency);

  return {
    source,
    hourly,
    daily,
    weekly,
    monthly,
    annual,
    hoursPerDay: schedule.hoursPerDay,
    daysPerWeek: schedule.daysPerWeek,
    hoursPerWeek: breakdown.hoursPerWeek,
    paidWeeksPerYear: schedule.paidWeeksPerYear,
    unpaidWeeksOff,
    averageWeeksPerMonth: breakdown.averageWeeksPerMonth,
    annualPaidHours: breakdown.annualPaidHours,
    currency,
    formattedHourly: formatPayMoney(hourly, currency),
    formattedDaily: formatPayMoney(daily, currency),
    formattedWeekly: formatPayMoney(weekly, currency),
    formattedMonthly: formatPayMoney(monthly, currency),
    formattedAnnual: formatPayMoney(annual, currency),
  };
}

export function shareResultText(
  result: WeeklyPayResult,
  path = '/tools/weekly-pay-calculator',
): string {
  return [
    'Weekly Pay Calculator — Omega Calculators',
    '',
    `Hourly wage: ${result.formattedHourly} ${result.currency}`,
    `Daily pay: ${result.formattedDaily} ${result.currency}`,
    `Weekly pay: ${result.formattedWeekly} ${result.currency}`,
    `Monthly pay: ${result.formattedMonthly} ${result.currency}`,
    `Annual salary: ${result.formattedAnnual} ${result.currency}`,
    '',
    `Hours/day: ${result.hoursPerDay}`,
    `Days/week: ${result.daysPerWeek}`,
    `Hours/week: ${result.hoursPerWeek}`,
    `Paid weeks/year: ${result.paidWeeksPerYear}`,
    '',
    'Gross pay before taxes and deductions. Currency changes formatting only.',
    path,
  ].join('\n');
}
