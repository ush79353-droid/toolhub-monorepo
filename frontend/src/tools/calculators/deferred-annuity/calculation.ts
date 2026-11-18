import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatDeferredAnnuityMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatDeferredAnnuityDateLabel(iso: string): string {
  const parts = parseIsoDate(iso);
  if (!parts) return iso;
  const dt = new Date(Date.UTC(parts.y, parts.m - 1, parts.d));
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(dt);
}

export function parseIsoDate(
  iso: string
): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (!(y >= 1 && y <= 9999) || !(m >= 1 && m <= 12) || !(d >= 1 && d <= 31)) {
    return null;
  }
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

export function todayIsoDate(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Whole months from start→end using year/month span (Omni-style).
 * Day-of-month does not reduce the count when the end day is earlier in the month;
 * that matches Omni's 15y Nov→Nov = 180 months with end day one day earlier.
 */
export function monthsBetweenDates(startIso: string, endIso: string): number | null {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  if (!start || !end) return null;
  const months = (end.y - start.y) * 12 + (end.m - start.m);
  if (!Number.isFinite(months) || months < 0) return null;
  return months;
}

export function periodToMonths(years: number, months: number): number | null {
  if (![years, months].every(Number.isFinite)) return null;
  if (years < 0 || months < 0) return null;
  const total = Math.round(years * 12 + months);
  if (!(total >= 0)) return null;
  return total;
}

/** Nominal monthly rate from annual percent. */
export function monthlyRateFromAnnual(annualPercent: number): number | null {
  if (!Number.isFinite(annualPercent) || annualPercent < 0) return null;
  return annualPercent / 1200;
}

/**
 * Future value of lump sum + ordinary end-of-month contributions.
 * FV = PV(1+r)^n + PMT × ((1+r)^n − 1) / r; zero rate → PV + PMT×n.
 */
export function accumulateBalance(input: {
  lumpSum: number;
  monthlyContribution: number;
  monthlyRate: number;
  months: number;
}): number | null {
  const { lumpSum, monthlyContribution, monthlyRate, months } = input;
  if (![lumpSum, monthlyContribution, monthlyRate, months].every(Number.isFinite)) {
    return null;
  }
  if (lumpSum < 0 || monthlyContribution < 0 || monthlyRate < 0 || months < 0) {
    return null;
  }
  if (months === 0) return lumpSum;

  if (monthlyRate === 0) {
    return lumpSum + monthlyContribution * months;
  }

  const growth = Math.pow(1 + monthlyRate, months);
  if (!Number.isFinite(growth)) return null;
  const fvLump = lumpSum * growth;
  const fvContrib = (monthlyContribution * (growth - 1)) / monthlyRate;
  const balance = fvLump + fvContrib;
  return Number.isFinite(balance) ? balance : null;
}

/**
 * Ordinary annuity payment that depletes PV over n months.
 * PMT = PV × r / (1 − (1+r)^(-n)); zero rate → PV / n.
 */
export function withdrawalPayment(input: {
  balance: number;
  monthlyRate: number;
  months: number;
}): number | null {
  const { balance, monthlyRate, months } = input;
  if (![balance, monthlyRate, months].every(Number.isFinite)) return null;
  if (!(balance > 0) || !(months > 0) || monthlyRate < 0) return null;
  if (monthlyRate === 0) return balance / months;
  const denom = 1 - Math.pow(1 + monthlyRate, -months);
  if (!(denom > 0)) return null;
  const payment = (balance * monthlyRate) / denom;
  return Number.isFinite(payment) ? payment : null;
}

/**
 * Solve number of ordinary monthly withdrawals for a fixed payment.
 * n = −ln(1 − PV×r/PMT) / ln(1+r); zero rate → PV/PMT.
 */
export function withdrawalDurationMonths(input: {
  balance: number;
  monthlyRate: number;
  payment: number;
}): number | null {
  const { balance, monthlyRate, payment } = input;
  if (![balance, monthlyRate, payment].every(Number.isFinite)) return null;
  if (!(balance > 0) || !(payment > 0) || monthlyRate < 0) return null;

  if (monthlyRate === 0) {
    const n = balance / payment;
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  // Payment must cover interest or duration is infinite.
  if (payment <= balance * monthlyRate) return null;

  const ratio = 1 - (balance * monthlyRate) / payment;
  if (!(ratio > 0) || !(ratio < 1)) return null;
  const n = -Math.log(ratio) / Math.log(1 + monthlyRate);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function addMonthsToIso(iso: string, monthsToAdd: number): string | null {
  const parts = parseIsoDate(iso);
  if (!parts || !Number.isFinite(monthsToAdd) || monthsToAdd < 0) return null;
  const totalMonths = parts.y * 12 + (parts.m - 1) + Math.round(monthsToAdd);
  const y = Math.floor(totalMonths / 12);
  const m = (totalMonths % 12) + 1;
  const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const d = Math.min(parts.d, dim);
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export interface DeferredAnnuityEngineInput {
  knowMode: 'withdraw_amount' | 'duration';
  deferralMonths: number;
  lumpSum: number;
  monthlyContribution: number;
  accumulationRatePercent: number;
  payoutRatePercent: number;
  withdrawalMonths: number;
  fixedWithdrawal: number;
  /** Civil today ISO; first withdrawal is one month after deferral end anchor. */
  startDateIso: string;
  deferralEndIso: string;
}

export interface DeferredAnnuityEngineResult {
  balanceAtFirstWithdrawal: number;
  monthlyWithdrawal: number;
  totalWithdrawal: number;
  totalContribution: number;
  totalReturn: number;
  numberOfWithdrawals: number;
  lastWithdrawalDateIso: string;
  deferralMonths: number;
  summaryText: string;
}

/**
 * Fixed deferred annuity: accumulate with ordinary monthly deposits, then
 * ordinary monthly withdrawals. Total contribution line = monthly deposits only
 * (Omni table). Total return = total withdrawals − lump − monthly deposits.
 */
export function calculateDeferredAnnuity(
  input: DeferredAnnuityEngineInput
): DeferredAnnuityEngineResult | null {
  const {
    knowMode,
    deferralMonths,
    lumpSum,
    monthlyContribution,
    accumulationRatePercent,
    payoutRatePercent,
    withdrawalMonths,
    fixedWithdrawal,
    startDateIso,
    deferralEndIso,
  } = input;

  if (!(deferralMonths >= 0) || !Number.isFinite(deferralMonths)) return null;

  const accRate = monthlyRateFromAnnual(accumulationRatePercent);
  const payRate = monthlyRateFromAnnual(payoutRatePercent);
  if (accRate === null || payRate === null) return null;

  const balance = accumulateBalance({
    lumpSum,
    monthlyContribution,
    monthlyRate: accRate,
    months: deferralMonths,
  });
  if (balance === null || !(balance > 0)) return null;

  const monthlyDepositsTotal = monthlyContribution * deferralMonths;
  // First withdrawal one month after deferral end (Omni: end 11/16 → first ~11/17).
  const firstWithdrawalIso =
    addMonthsToIso(deferralEndIso, 1) ??
    addMonthsToIso(startDateIso, deferralMonths + 1);
  if (!firstWithdrawalIso) return null;

  if (knowMode === 'withdraw_amount') {
    if (!(withdrawalMonths > 0)) return null;
    const payment = withdrawalPayment({
      balance,
      monthlyRate: payRate,
      months: withdrawalMonths,
    });
    if (payment === null || !(payment > 0)) return null;

    const totalWithdrawal = payment * withdrawalMonths;
    const totalReturn = totalWithdrawal - lumpSum - monthlyDepositsTotal;
    const lastIso = addMonthsToIso(firstWithdrawalIso, withdrawalMonths - 1);
    if (!lastIso) return null;

    return {
      balanceAtFirstWithdrawal: balance,
      monthlyWithdrawal: payment,
      totalWithdrawal,
      totalContribution: monthlyDepositsTotal,
      totalReturn,
      numberOfWithdrawals: withdrawalMonths,
      lastWithdrawalDateIso: lastIso,
      deferralMonths,
      summaryText: '',
    };
  }

  // Duration mode: fixed withdrawal → solve months (floor to whole withdrawals).
  if (!(fixedWithdrawal > 0)) return null;
  const nExact = withdrawalDurationMonths({
    balance,
    monthlyRate: payRate,
    payment: fixedWithdrawal,
  });
  if (nExact === null) return null;

  const n = Math.max(1, Math.floor(nExact + 1e-9));
  const totalWithdrawal = fixedWithdrawal * n;
  const totalReturn = totalWithdrawal - lumpSum - monthlyDepositsTotal;
  const lastIso = addMonthsToIso(firstWithdrawalIso, n - 1);
  if (!lastIso) return null;

  return {
    balanceAtFirstWithdrawal: balance,
    monthlyWithdrawal: fixedWithdrawal,
    totalWithdrawal,
    totalContribution: monthlyDepositsTotal,
    totalReturn,
    numberOfWithdrawals: n,
    lastWithdrawalDateIso: lastIso,
    deferralMonths,
    summaryText: '',
  };
}
