import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { HoursPaySourceField } from './types';

export const DEFAULT_HOURS_PER_DAY = 8;
export const DEFAULT_DAYS_PER_WEEK = 5;
export const DEFAULT_WEEKS_PER_YEAR = 52;

/**
 * Convert daily / weekly / monthly / annual pay into the other periods and
 * hourly wage using working hours.
 *
 * WeeklyHours = H × D
 * AnnualHours = H × D × W
 *
 * From daily: weekly = daily×D; annual = daily×D×W; monthly = annual/12;
 *   hourly = daily/H
 * From weekly: daily = weekly/D; annual = weekly×W; monthly = annual/12;
 *   hourly = weekly/(H×D)
 * From monthly: annual = monthly×12; weekly = annual/W; daily = annual/(W×D);
 *   hourly = annual/(H×D×W)
 * From annual: monthly = annual/12; weekly = annual/W; daily = annual/(W×D);
 *   hourly = annual/(H×D×W)
 *
 * Full precision; no display rounding inside the formulas.
 */
export function calculateHoursPay(input: {
  sourceField: HoursPaySourceField;
  sourceAmount: number;
  hoursPerDay: number;
  daysPerWeek: number;
  weeksPerYear: number;
}): {
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
  hourly: number;
} | null {
  const {
    sourceField,
    sourceAmount,
    hoursPerDay: H,
    daysPerWeek: D,
    weeksPerYear: W,
  } = input;

  if (![sourceAmount, H, D, W].every(Number.isFinite)) return null;
  if (sourceAmount < 0) return null;
  if (!(H > 0) || !(D > 0) || !(W > 0)) return null;

  let daily: number;
  let weekly: number;
  let monthly: number;
  let annual: number;
  let hourly: number;

  if (sourceField === 'daily') {
    daily = sourceAmount;
    weekly = daily * D;
    annual = daily * D * W;
    monthly = annual / 12;
    hourly = daily / H;
  } else if (sourceField === 'weekly') {
    weekly = sourceAmount;
    daily = weekly / D;
    annual = weekly * W;
    monthly = annual / 12;
    hourly = weekly / (H * D);
  } else if (sourceField === 'monthly') {
    monthly = sourceAmount;
    annual = monthly * 12;
    weekly = annual / W;
    daily = annual / (W * D);
    hourly = annual / (H * D * W);
  } else {
    annual = sourceAmount;
    monthly = annual / 12;
    weekly = annual / W;
    daily = annual / (W * D);
    hourly = annual / (H * D * W);
  }

  if (![daily, weekly, monthly, annual, hourly].every(Number.isFinite)) {
    return null;
  }
  if ([daily, weekly, monthly, annual, hourly].some((v) => v < 0)) {
    return null;
  }

  return { daily, weekly, monthly, annual, hourly };
}

/** Display rounding only — never used inside the formulas. */
export function formatHoursPayMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
