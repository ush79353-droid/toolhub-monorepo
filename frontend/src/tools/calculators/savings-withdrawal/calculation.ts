import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Soft ceiling so a pathological case cannot loop forever. */
export const MAX_WITHDRAWAL_PERIODS = 1200 * 12; // 1,200 years of monthly steps

export function formatSavingsWithdrawalMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** YYYY-MM-DD → civil date or null. */
export function parseIsoDate(
  raw: string
): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (![y, m, d].every(Number.isFinite)) return null;
  if (y < 1 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Add whole months, clamping the day into the target month. */
export function addCalendarMonths(
  date: { y: number; m: number; d: number },
  delta: number
): { y: number; m: number; d: number } {
  const idx = date.y * 12 + (date.m - 1) + delta;
  const y = Math.floor(idx / 12);
  const m = (idx % 12) + 1;
  const d = Math.min(date.d, daysInMonth(y, m));
  return { y, m, d };
}

export function formatWithdrawalDate(date: {
  y: number;
  m: number;
  d: number;
}): string {
  const utc = new Date(Date.UTC(date.y, date.m - 1, date.d));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(utc);
}

export interface SavingsWithdrawalCanonicalInput {
  balance: number;
  withdrawalAmount: number;
  annualInterestRatePercent: number;
  firstWithdrawalDate: { y: number; m: number; d: number };
}

export interface SavingsWithdrawalCanonicalResult {
  years: number;
  months: number;
  withdrawalCount: number;
  monthlyWithdrawal: number;
  totalWithdrawal: number;
  interestEarned: number;
  balanceAtFirstWithdrawal: number;
  balanceAfterLastWithdrawal: number;
  lastWithdrawalDate: { y: number; m: number; d: number };
  neverDepletes: boolean;
  timelineSummary: string;
}

/**
 * Monthly interest-first withdrawal simulation (verified vs screenshot defaults).
 *
 * Each period:
 *   1. Accrue interest: balance *= (1 + annual/100/12)
 *   2. Withdraw min(scheduled, balance)
 *
 * Duration months = withdrawal count. Last date = first + (n − 1) months.
 * Full precision — round only for display.
 */
export function calculateSavingsWithdrawal(
  input: SavingsWithdrawalCanonicalInput
): SavingsWithdrawalCanonicalResult | null {
  const {
    balance,
    withdrawalAmount,
    annualInterestRatePercent,
    firstWithdrawalDate,
  } = input;

  if (
    ![balance, withdrawalAmount, annualInterestRatePercent].every(Number.isFinite) ||
    !(balance > 0) ||
    !(withdrawalAmount > 0) ||
    annualInterestRatePercent < 0
  ) {
    return null;
  }

  const monthlyRate = annualInterestRatePercent / 100 / 12;
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) return null;

  // Non-depleting: opening monthly interest already covers the withdrawal.
  if (monthlyRate > 0 && balance * monthlyRate >= withdrawalAmount) {
    return {
      years: 0,
      months: 0,
      withdrawalCount: 0,
      monthlyWithdrawal: withdrawalAmount,
      totalWithdrawal: 0,
      interestEarned: 0,
      balanceAtFirstWithdrawal: balance,
      balanceAfterLastWithdrawal: balance,
      lastWithdrawalDate: firstWithdrawalDate,
      neverDepletes: true,
      timelineSummary:
        'Your savings are not projected to run out; monthly interest covers the withdrawal.',
    };
  }

  let remaining = balance;
  let interestEarned = 0;
  let totalWithdrawal = 0;
  let withdrawalCount = 0;
  const balanceAtFirstWithdrawal = balance;

  while (remaining > 0 && withdrawalCount < MAX_WITHDRAWAL_PERIODS) {
    if (monthlyRate > 0) {
      const interest = remaining * monthlyRate;
      if (!Number.isFinite(interest)) return null;
      remaining += interest;
      interestEarned += interest;
    }

    const take = Math.min(withdrawalAmount, remaining);
    if (!(take > 0) || !Number.isFinite(take)) return null;
    remaining -= take;
    totalWithdrawal += take;
    withdrawalCount += 1;

    if (remaining < 1e-10) {
      remaining = 0;
      break;
    }
  }

  if (withdrawalCount <= 0) return null;

  if (withdrawalCount >= MAX_WITHDRAWAL_PERIODS && remaining > 0) {
    return {
      years: 0,
      months: 0,
      withdrawalCount: 0,
      monthlyWithdrawal: withdrawalAmount,
      totalWithdrawal: 0,
      interestEarned: 0,
      balanceAtFirstWithdrawal: balance,
      balanceAfterLastWithdrawal: balance,
      lastWithdrawalDate: firstWithdrawalDate,
      neverDepletes: true,
      timelineSummary:
        'Your savings are not projected to run out within the calculator horizon.',
    };
  }

  if (
    ![totalWithdrawal, interestEarned, remaining].every(Number.isFinite) ||
    !Number.isFinite(withdrawalCount)
  ) {
    return null;
  }

  const years = Math.floor(withdrawalCount / 12);
  const months = withdrawalCount % 12;
  const lastWithdrawalDate = addCalendarMonths(
    firstWithdrawalDate,
    withdrawalCount - 1
  );

  return {
    years,
    months,
    withdrawalCount,
    monthlyWithdrawal: withdrawalAmount,
    totalWithdrawal,
    interestEarned,
    balanceAtFirstWithdrawal,
    balanceAfterLastWithdrawal: remaining,
    lastWithdrawalDate,
    neverDepletes: false,
    timelineSummary: `Your savings will last for ${years} year(s) and ${months} month(s) from the first day of withdrawal.`,
  };
}
