import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { WorkingTimeUnit } from './types';

/** Convert entered working time to hours. Seconds / minutes / hours only. */
export function convertWorkingTimeToHours(
  value: number,
  unit: WorkingTimeUnit
): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  switch (unit) {
    case 'seconds':
      return value / 3600;
    case 'minutes':
      return value / 60;
    case 'hours':
      return value;
    default:
      return null;
  }
}

/** RPE = Revenue ÷ Employees. Employees must be > 0. Revenue ≥ 0. */
export function calculateRevenuePerEmployee(
  revenue: number,
  employees: number
): number | null {
  if (
    !Number.isFinite(revenue) ||
    !Number.isFinite(employees) ||
    revenue < 0 ||
    employees <= 0
  ) {
    return null;
  }
  const result = revenue / employees;
  return Number.isFinite(result) ? result : null;
}

/** RPH = Revenue ÷ total working hours. Hours must be > 0. Revenue ≥ 0. */
export function calculateRevenuePerWorkingHour(
  revenue: number,
  workingHours: number
): number | null {
  if (
    !Number.isFinite(revenue) ||
    !Number.isFinite(workingHours) ||
    revenue < 0 ||
    workingHours <= 0
  ) {
    return null;
  }
  const result = revenue / workingHours;
  return Number.isFinite(result) ? result : null;
}

export function formatProductivityMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatProductivityCount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 6,
  }).format(amount);
}

export function interpretProductivity(
  revenuePerEmployee: number | null,
  revenuePerWorkingHour: number | null
): string {
  const parts: string[] = [];
  if (revenuePerEmployee !== null) {
    parts.push(
      `Revenue per employee is ${formatPlain(revenuePerEmployee)} for the reporting period (revenue ÷ headcount/FTE).`
    );
  }
  if (revenuePerWorkingHour !== null) {
    parts.push(
      `Revenue per working hour is ${formatPlain(revenuePerWorkingHour)}/hour (revenue ÷ total labor hours).`
    );
  }
  if (parts.length === 0) {
    return 'Enter revenue plus employees and/or working hours to measure revenue-based labor productivity.';
  }
  parts.push(
    'These are revenue productivity measures — not profit, efficiency scores, or individual performance ratings.'
  );
  return parts.join(' ');
}

function formatPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
