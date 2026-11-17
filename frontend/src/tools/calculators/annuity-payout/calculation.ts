import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  frequencyMeta,
  periodsPerYear,
  type AnnuityType,
  type PayoutFrequency,
  type PayoutMode,
} from './types';

export function formatAnnuityPayoutMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Period rate matching Omni Annuity Payout defaults:
 * - Without advanced compounding: effective annual → r = (1+i)^(1/k) − 1
 * - With compounding m times/year: r = (1 + i/m)^(m/k) − 1
 */
export function payoutPeriodRate(
  annualRatePercent: number,
  payoutFrequency: PayoutFrequency,
  compoundingFrequency: PayoutFrequency | null
): number | null {
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) return null;
  const k = periodsPerYear(payoutFrequency);
  if (!(k > 0)) return null;
  if (annualRatePercent === 0) return 0;

  if (compoundingFrequency === null) {
    const r = Math.pow(1 + annualRatePercent / 100, 1 / k) - 1;
    return Number.isFinite(r) && r > -1 ? r : null;
  }

  const m = periodsPerYear(compoundingFrequency);
  if (!(m > 0)) return null;
  const base = 1 + annualRatePercent / (100 * m);
  if (!(base > 0)) return null;
  const r = Math.pow(base, m / k) - 1;
  return Number.isFinite(r) && r > -1 ? r : null;
}

/** Periodic growth from annual growth: g = (1+G)^(1/k) − 1 */
export function periodicGrowthRate(
  annualGrowthPercent: number,
  payoutFrequency: PayoutFrequency
): number | null {
  if (!Number.isFinite(annualGrowthPercent)) return null;
  const k = periodsPerYear(payoutFrequency);
  if (!(k > 0)) return null;
  const base = 1 + annualGrowthPercent / 100;
  if (!(base > 0)) return null;
  const g = Math.pow(base, 1 / k) - 1;
  return Number.isFinite(g) && g > -1 ? g : null;
}

export function paymentCountFromLength(
  years: number,
  months: number,
  payoutFrequency: PayoutFrequency
): number | null {
  if (![years, months].every(Number.isFinite)) return null;
  if (years < 0 || months < 0 || months > 11) return null;
  if (!Number.isInteger(years) || !Number.isInteger(months)) return null;
  const t = years + months / 12;
  if (!(t > 0)) return null;
  const n = Math.round(t * periodsPerYear(payoutFrequency));
  return n > 0 ? n : null;
}

export function durationFromPaymentCount(
  paymentCount: number,
  payoutFrequency: PayoutFrequency
): { years: number; months: number } | null {
  if (!(paymentCount > 0) || !Number.isInteger(paymentCount)) return null;
  const k = periodsPerYear(payoutFrequency);
  if (!(k > 0)) return null;
  const totalMonths = Math.round((paymentCount * 12) / k);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return { years, months };
}

function ordinaryPayment(
  pv: number,
  fv: number,
  r: number,
  g: number,
  n: number
): number | null {
  if (!(n > 0) || !Number.isInteger(n)) return null;
  if (![pv, fv, r, g].every(Number.isFinite)) return null;
  if (r <= -1 || g <= -1) return null;

  const discount = Math.pow(1 + r, -n);
  if (!Number.isFinite(discount)) return null;
  const principal = pv - fv * discount;
  if (!Number.isFinite(principal)) return null;

  if (Math.abs(r) < 1e-15 && Math.abs(g) < 1e-15) {
    const pmt = principal / n;
    return Number.isFinite(pmt) ? pmt : null;
  }

  if (Math.abs(r - g) < 1e-15) {
    // r ≈ g
    if (Math.abs(r) < 1e-15) {
      const pmt = principal / n;
      return Number.isFinite(pmt) ? pmt : null;
    }
    const pmt = (principal * (1 + r)) / n;
    return Number.isFinite(pmt) ? pmt : null;
  }

  if (Math.abs(r) < 1e-15) {
    // r = 0, g ≠ 0: PV − FV = PMT * ((1+g)^n − 1) / g
    const factor = (Math.pow(1 + g, n) - 1) / g;
    if (!(factor > 0) || !Number.isFinite(factor)) return null;
    const pmt = principal / factor;
    return Number.isFinite(pmt) ? pmt : null;
  }

  const x = (1 + g) / (1 + r);
  const factor = (1 - Math.pow(x, n)) / (r - g);
  if (!(Math.abs(factor) > 1e-15) || !Number.isFinite(factor)) return null;
  const pmt = principal / factor;
  return Number.isFinite(pmt) ? pmt : null;
}

export function calculateLevelPayment(input: {
  initialBalance: number;
  finalBalance: number;
  periodRate: number;
  periodGrowth: number;
  paymentCount: number;
  annuityType: AnnuityType;
}): number | null {
  const ordinary = ordinaryPayment(
    input.initialBalance,
    input.finalBalance,
    input.periodRate,
    input.periodGrowth,
    input.paymentCount
  );
  if (ordinary === null) return null;
  if (input.annuityType === 'ordinary') return ordinary;
  // Annuity due: beginning-of-period payments
  if (Math.abs(input.periodRate) < 1e-15) return ordinary;
  const due = ordinary / (1 + input.periodRate);
  return Number.isFinite(due) ? due : null;
}

export interface ScheduleTotals {
  endingBalance: number;
  totalInterest: number;
  totalWithdrawn: number;
}

/** Full-precision cash-flow schedule for interest / withdrawal totals. */
export function runWithdrawalSchedule(input: {
  openingBalance: number;
  firstPayment: number;
  paymentCount: number;
  periodRate: number;
  periodGrowth: number;
  annuityType: AnnuityType;
}): ScheduleTotals | null {
  const {
    openingBalance,
    firstPayment,
    paymentCount,
    periodRate,
    periodGrowth,
    annuityType,
  } = input;
  if (
    ![openingBalance, firstPayment, paymentCount, periodRate, periodGrowth].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(paymentCount > 0) || !Number.isInteger(paymentCount)) return null;
  if (periodRate <= -1 || periodGrowth <= -1) return null;
  if (!(firstPayment >= 0)) return null;

  let bal = openingBalance;
  let totalInterest = 0;
  let totalWithdrawn = 0;

  for (let k = 0; k < paymentCount; k += 1) {
    const pmt = firstPayment * Math.pow(1 + periodGrowth, k);
    if (!Number.isFinite(pmt) || pmt < 0) return null;

    if (annuityType === 'due') {
      if (bal + 1e-9 < pmt && k < paymentCount - 1) {
        // Allow tiny float slack on last payment path only via outer checks
      }
      bal -= pmt;
      totalWithdrawn += pmt;
      if (bal < -1e-6) return null;
      const interest = bal * periodRate;
      if (!Number.isFinite(interest)) return null;
      bal += interest;
      totalInterest += interest;
    } else {
      const interest = bal * periodRate;
      if (!Number.isFinite(interest)) return null;
      bal += interest;
      totalInterest += interest;
      bal -= pmt;
      totalWithdrawn += pmt;
      if (bal < -1e-6) return null;
    }
    if (!Number.isFinite(bal)) return null;
  }

  return {
    endingBalance: bal,
    totalInterest,
    totalWithdrawn,
  };
}

/**
 * Solve payment count for fixed payment so ending balance ≈ target FV.
 * Returns null when the payment cannot sustain (or overshoots immediately).
 */
export function solvePaymentCount(input: {
  openingBalance: number;
  firstPayment: number;
  targetFinalBalance: number;
  periodRate: number;
  periodGrowth: number;
  annuityType: AnnuityType;
  maxPeriods?: number;
}): number | null {
  const {
    openingBalance,
    firstPayment,
    targetFinalBalance,
    periodRate,
    periodGrowth,
    annuityType,
    maxPeriods = 100_000,
  } = input;

  if (!(firstPayment > 0)) return null;
  if (openingBalance < targetFinalBalance) return null;

  const at = (n: number) =>
    runWithdrawalSchedule({
      openingBalance,
      firstPayment,
      paymentCount: n,
      periodRate,
      periodGrowth,
      annuityType,
    });

  const one = at(1);
  if (one === null) return null;
  // If one payment already undershoots target (balance too low), impossible
  if (one.endingBalance < targetFinalBalance - 1e-6) {
    // Still might be exactly one period if we accept ending near/below
    if (Math.abs(one.endingBalance - targetFinalBalance) < 1e-4) return 1;
    return null;
  }

  let lo = 1;
  let hi = 1;
  let cur = one;
  let guard = 0;
  while (
    cur !== null &&
    cur.endingBalance > targetFinalBalance + 1e-6 &&
    hi < maxPeriods &&
    guard < 40
  ) {
    hi *= 2;
    cur = at(hi);
    guard += 1;
  }
  if (cur === null) {
    // Payment too large relative to interest — never reaches FV without going negative
    return null;
  }
  if (cur.endingBalance > targetFinalBalance + 1e-4 && hi >= maxPeriods) {
    return null;
  }

  for (let iter = 0; iter < 60; iter += 1) {
    const mid = Math.floor((lo + hi) / 2);
    const midSched = at(mid);
    if (midSched === null) {
      hi = mid;
      continue;
    }
    if (midSched.endingBalance > targetFinalBalance + 1e-6) lo = mid + 1;
    else hi = mid;
  }

  const n = hi;
  const check = at(n);
  if (check === null || !(n > 0)) return null;
  return n;
}

export function timingPhrase(
  annuityType: AnnuityType,
  frequency: PayoutFrequency
): string {
  const noun = frequencyMeta(frequency).periodNoun;
  return annuityType === 'due'
    ? `beginning of each ${noun}`
    : `end of each ${noun}`;
}

export function formatCurrencyCodeAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  return `${currency}${formatAnnuityPayoutMoney(amount, currency)}`;
}

export function buildPrimarySummary(input: {
  mode: PayoutMode;
  currency: SupportedCurrency;
  periodicPayment: number;
  durationYears: number;
  durationMonths: number;
  finalBalance: number;
  annuityType: AnnuityType;
  payoutFrequency: PayoutFrequency;
}): string {
  const money = formatCurrencyCodeAmount(input.periodicPayment, input.currency);
  const when = timingPhrase(input.annuityType, input.payoutFrequency);
  const deplete =
    Math.abs(input.finalBalance) < 0.005
      ? 'to deplete your initial balance'
      : `leaving a final balance of ${formatCurrencyCodeAmount(input.finalBalance, input.currency)}`;

  if (input.mode === 'fixedLength') {
    return `You can withdraw ${money} at the ${when} ${deplete}.`;
  }

  const parts: string[] = [];
  if (input.durationYears > 0) {
    parts.push(
      `${input.durationYears} year${input.durationYears === 1 ? '' : 's'}`
    );
  }
  if (input.durationMonths > 0) {
    parts.push(
      `${input.durationMonths} month${input.durationMonths === 1 ? '' : 's'}`
    );
  }
  const lengthLabel = parts.length > 0 ? parts.join(' and ') : 'less than one month';
  return `Withdrawing ${money} at the ${when}, your annuity lasts ${lengthLabel}${
    Math.abs(input.finalBalance) < 0.005
      ? ''
      : `, leaving ${formatCurrencyCodeAmount(input.finalBalance, input.currency)}`
  }.`;
}

export function buildInterestSummary(
  totalInterest: number,
  currency: SupportedCurrency
): string {
  return `The total interest earned on the annuity is ${formatCurrencyCodeAmount(totalInterest, currency)}.`;
}

export interface AnnuityPayoutEngineInput {
  mode: PayoutMode;
  initialBalance: number;
  payoutFrequency: PayoutFrequency;
  annuityType: AnnuityType;
  lengthYears: number;
  lengthMonths: number;
  paymentAmount: number;
  annualRatePercent: number;
  useAdvancedCompounding: boolean;
  compoundingFrequency: PayoutFrequency;
  finalBalance: number;
  annualGrowthPercent: number;
  currency: SupportedCurrency;
}

export interface AnnuityPayoutEngineResult {
  mode: PayoutMode;
  currency: SupportedCurrency;
  periodicPayment: number;
  paymentCount: number;
  durationYears: number;
  durationMonths: number;
  totalInterest: number;
  finalBalance: number;
  totalWithdrawn: number;
  payoutFrequency: PayoutFrequency;
  annuityType: AnnuityType;
  formattedPayment: string;
  formattedTotalInterest: string;
  formattedFinalBalance: string;
  summaryPrimary: string;
  summaryInterest: string;
}

export function calculateAnnuityPayout(
  input: AnnuityPayoutEngineInput
): AnnuityPayoutEngineResult | null {
  const {
    mode,
    initialBalance,
    payoutFrequency,
    annuityType,
    lengthYears,
    lengthMonths,
    paymentAmount,
    annualRatePercent,
    useAdvancedCompounding,
    compoundingFrequency,
    finalBalance,
    annualGrowthPercent,
    currency,
  } = input;

  if (!(initialBalance >= 0) || !Number.isFinite(initialBalance)) return null;
  if (!(finalBalance >= 0) || !Number.isFinite(finalBalance)) return null;
  if (finalBalance > initialBalance + 1e-9 && annualRatePercent === 0) {
    // Zero rate cannot grow balance to a higher final without deposits
  }

  const periodRate = payoutPeriodRate(
    annualRatePercent,
    payoutFrequency,
    useAdvancedCompounding ? compoundingFrequency : null
  );
  if (periodRate === null) return null;

  const growth = useAdvancedCompounding
    ? periodicGrowthRate(annualGrowthPercent, payoutFrequency)
    : 0;
  if (growth === null) return null;

  let paymentCount: number;
  let periodicPayment: number;

  if (mode === 'fixedLength') {
    const n = paymentCountFromLength(lengthYears, lengthMonths, payoutFrequency);
    if (n === null) return null;
    const pmt = calculateLevelPayment({
      initialBalance,
      finalBalance,
      periodRate,
      periodGrowth: growth,
      paymentCount: n,
      annuityType,
    });
    if (pmt === null || !(pmt >= 0)) return null;
    paymentCount = n;
    periodicPayment = pmt;
  } else {
    if (!(paymentAmount > 0)) return null;
    const n = solvePaymentCount({
      openingBalance: initialBalance,
      firstPayment: paymentAmount,
      targetFinalBalance: finalBalance,
      periodRate,
      periodGrowth: growth,
      annuityType,
    });
    if (n === null) return null;
    paymentCount = n;
    periodicPayment = paymentAmount;
  }

  const schedule = runWithdrawalSchedule({
    openingBalance: initialBalance,
    firstPayment: periodicPayment,
    paymentCount,
    periodRate,
    periodGrowth: growth,
    annuityType,
  });
  if (schedule === null) return null;

  // Prefer interest from schedule; ending balance should track target for fixed length
  const duration = durationFromPaymentCount(paymentCount, payoutFrequency);
  if (duration === null) return null;

  const ending =
    mode === 'fixedLength' ? finalBalance : Math.max(0, schedule.endingBalance);

  const summaryPrimary = buildPrimarySummary({
    mode,
    currency,
    periodicPayment,
    durationYears: duration.years,
    durationMonths: duration.months,
    finalBalance: ending,
    annuityType,
    payoutFrequency,
  });
  const summaryInterest = buildInterestSummary(schedule.totalInterest, currency);

  return {
    mode,
    currency,
    periodicPayment,
    paymentCount,
    durationYears: duration.years,
    durationMonths: duration.months,
    totalInterest: schedule.totalInterest,
    finalBalance: ending,
    totalWithdrawn: schedule.totalWithdrawn,
    payoutFrequency,
    annuityType,
    formattedPayment: formatAnnuityPayoutMoney(periodicPayment, currency),
    formattedTotalInterest: formatAnnuityPayoutMoney(
      schedule.totalInterest,
      currency
    ),
    formattedFinalBalance: formatAnnuityPayoutMoney(ending, currency),
    summaryPrimary,
    summaryInterest,
  };
}
