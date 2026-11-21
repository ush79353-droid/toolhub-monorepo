import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  DAILY_TABLE_MAX_ROWS,
  DAYS_PER_YEAR,
  type DailyInterestRow,
  type TimeUnit,
} from './types';

export interface FinanceChargeMathInput {
  balance: number;
  apr: number;
  days: number;
}

export interface FinanceChargeMathResult {
  annualRateDecimal: number;
  dailyPeriodicRate: number;
  dailyPeriodicRatePercent: number;
  dailyFinanceCharge: number;
  calculationDays: number;
  financeCharge: number;
  periodInterestRate: number;
  totalBalanceWithCharge: number;
}

/**
 * Simple constant-balance finance charge on a 365-day year.
 * FC = Balance × (APR/100) × (Days/365)
 */
export function calculateFinanceCharge(
  input: FinanceChargeMathInput
): FinanceChargeMathResult | null {
  const { balance, apr, days } = input;
  if (
    !Number.isFinite(balance) ||
    !Number.isFinite(apr) ||
    !Number.isFinite(days) ||
    balance < 0 ||
    apr < 0 ||
    days <= 0
  ) {
    return null;
  }

  const annualRateDecimal = apr / 100;
  const dailyPeriodicRate = annualRateDecimal / DAYS_PER_YEAR;
  const dailyFinanceCharge = balance * dailyPeriodicRate;
  const financeCharge = dailyFinanceCharge * days;
  const totalBalanceWithCharge = balance + financeCharge;
  const periodInterestRate = apr * (days / DAYS_PER_YEAR);

  if (
    !Number.isFinite(financeCharge) ||
    !Number.isFinite(totalBalanceWithCharge) ||
    !Number.isFinite(periodInterestRate)
  ) {
    return null;
  }

  return {
    annualRateDecimal,
    dailyPeriodicRate,
    dailyPeriodicRatePercent: dailyPeriodicRate * 100,
    dailyFinanceCharge,
    calculationDays: days,
    financeCharge,
    periodInterestRate,
    totalBalanceWithCharge,
  };
}

/** Convert term length to days (1 month = 365/12). */
export function convertTermToDays(value: number, unit: TimeUnit): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Term length must be positive');
  }
  switch (unit) {
    case 'days':
      return value;
    case 'weeks':
      return value * 7;
    case 'months':
      return value * (DAYS_PER_YEAR / 12);
    case 'years':
      return value * DAYS_PER_YEAR;
    default: {
      const _exhaustive: never = unit;
      throw new Error(`Unsupported time unit: ${_exhaustive}`);
    }
  }
}

/**
 * Simple (non-compounding) daily interest rows for a constant balance.
 * Truncates long schedules; cumulative still matches full-period charge.
 */
export function buildDailyInterestRows(
  balance: number,
  dailyFinanceCharge: number,
  days: number,
  financeCharge: number
): { rows: DailyInterestRow[]; truncated: boolean } {
  const wholeDays = Math.floor(days);
  const truncated = wholeDays > DAILY_TABLE_MAX_ROWS;
  const rowCount = truncated ? DAILY_TABLE_MAX_ROWS : wholeDays;
  const rows: DailyInterestRow[] = [];

  for (let day = 1; day <= rowCount; day += 1) {
    rows.push({
      day,
      balance,
      dailyInterest: dailyFinanceCharge,
      cumulativeInterest: dailyFinanceCharge * day,
    });
  }

  if (truncated && rows.length > 0) {
    rows[rows.length - 1] = {
      ...rows[rows.length - 1]!,
      cumulativeInterest: financeCharge,
    };
  } else if (!truncated && wholeDays < days && rows.length > 0) {
    // Fractional day remainder on last row's cumulative
    rows[rows.length - 1] = {
      ...rows[rows.length - 1]!,
      cumulativeInterest: financeCharge,
    };
  }

  return { rows, truncated };
}

export function formatFcMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatFcPercent(value: number, digits = 4): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatFcRateDetail(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  }).format(value);
}

export function interpretFinanceCharge(
  financeCharge: number,
  days: number,
  currency: SupportedCurrency
): string {
  return `Estimated finance charge is ${formatFcMoney(financeCharge, currency)} over ${formatFcPercent(days, days % 1 === 0 ? 0 : 2)} day(s) using simple interest on a constant balance and a ${DAYS_PER_YEAR}-day year. This is not an issuer statement amount.`;
}
