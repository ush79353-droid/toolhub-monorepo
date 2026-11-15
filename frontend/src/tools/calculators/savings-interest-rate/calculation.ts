import { formatCurrencyValue, type SupportedCurrency } from '@/tools/shared/currency';
import {
  COMPOUNDING_OPTIONS,
  DEPOSIT_FREQUENCY_OPTIONS,
  type AnnualBalancePoint,
  type CompoundFrequency,
  type DepositFrequency,
  type DepositTiming,
  type SavingsInterestRateResult,
} from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function formatRatePercent(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(rounded);
}

export function periodsPerYear(compounding: CompoundFrequency): number {
  return COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.periodsPerYear ?? 12;
}

export function depositPeriodsPerYear(freq: DepositFrequency): number {
  return DEPOSIT_FREQUENCY_OPTIONS.find((o) => o.value === freq)?.periodsPerYear ?? 12;
}

/**
 * Effective rate per deposit period from annual nominal r compounded m times/year:
 * i = (1 + r/m)^(m/f) − 1
 */
export function depositPeriodRate(
  annualNominal: number,
  compoundM: number,
  depositF: number
): number | null {
  if (!(compoundM > 0) || !(depositF > 0)) return null;
  if (!(annualNominal > -compoundM)) return null;
  const base = 1 + annualNominal / compoundM;
  if (!(base > 0) || !Number.isFinite(base)) return null;
  const i = base ** (compoundM / depositF) - 1;
  return Number.isFinite(i) && i > -1 ? i : null;
}

/**
 * Closed-form future value (matches screenshot monthly formulas when m=f=12).
 * FV = P(1+i)^n + PMT × [((1+i)^n − 1)/i] × (beginning ? (1+i) : 1)
 * Zero rate: FV = P + PMT × n
 */
export function futureValueAtRate(params: {
  principal: number;
  annualNominal: number;
  years: number;
  compoundM: number;
  depositAmount: number;
  depositF: number;
  timing: DepositTiming;
}): number | null {
  const {
    principal,
    annualNominal,
    years,
    compoundM,
    depositAmount,
    depositF,
    timing,
  } = params;

  if (
    ![principal, annualNominal, years, compoundM, depositAmount, depositF].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (principal < 0 || years <= 0 || compoundM <= 0 || depositF <= 0) return null;
  if (depositAmount < 0) return null;

  const n = years * depositF;
  if (!Number.isFinite(n) || n <= 0) return null;

  if (depositAmount === 0) {
    const growth = (1 + annualNominal / compoundM) ** (compoundM * years);
    if (!Number.isFinite(growth)) return null;
    return principal * growth;
  }

  const i = depositPeriodRate(annualNominal, compoundM, depositF);
  if (i === null) return null;

  if (Math.abs(i) < 1e-15) {
    return principal + depositAmount * n;
  }

  const growth = (1 + i) ** n;
  if (!Number.isFinite(growth)) return null;
  const annuity = ((growth - 1) / i) * (timing === 'beginning' ? 1 + i : 1);
  if (!Number.isFinite(annuity)) return null;
  const fv = principal * growth + depositAmount * annuity;
  return Number.isFinite(fv) ? fv : null;
}

/**
 * Yearly principal / interest / total series for charting (period simulation).
 */
export function buildAnnualPoints(params: {
  principal: number;
  annualNominal: number;
  years: number;
  compoundM: number;
  depositAmount: number;
  depositF: number;
  timing: DepositTiming;
}): { annualPoints: AnnualBalancePoint[]; totalDeposited: number; finalBalance: number } | null {
  const {
    principal,
    annualNominal,
    years,
    compoundM,
    depositAmount,
    depositF,
    timing,
  } = params;

  const fvCheck = futureValueAtRate(params);
  if (fvCheck === null) return null;

  // Prefer closed-form totals; simulate on deposit-period grid for yearly snapshots.
  const n = Math.round(years * depositF);
  if (!(n > 0)) return null;

  const i = depositPeriodRate(annualNominal, compoundM, depositF);
  if (i === null) return null;

  let balance = principal;
  let deposited = principal;
  const annualPoints: AnnualBalancePoint[] = [
    {
      year: 0,
      principal: roundMoney(principal),
      interest: 0,
      totalBalance: roundMoney(principal),
    },
  ];

  const periodsPerYearSnap = depositF;

  for (let t = 1; t <= n; t += 1) {
    if (timing === 'beginning' && depositAmount > 0) {
      balance += depositAmount;
      deposited += depositAmount;
    }

    if (Math.abs(i) < 1e-15) {
      // no growth
    } else {
      balance *= 1 + i;
    }
    if (!Number.isFinite(balance)) return null;

    if (timing === 'end' && depositAmount > 0) {
      balance += depositAmount;
      deposited += depositAmount;
    }

    if (t % periodsPerYearSnap === 0 || t === n) {
      const year = t === n ? years : t / periodsPerYearSnap;
      const total = roundMoney(balance);
      const prin = roundMoney(deposited);
      const interest = roundMoney(total - prin);
      if (![total, prin, interest].every(Number.isFinite)) return null;
      const point: AnnualBalancePoint = {
        year: Number.isInteger(year) ? year : Number(year.toFixed(4)),
        principal: prin,
        interest,
        totalBalance: total,
      };
      const last = annualPoints[annualPoints.length - 1];
      if (last && Math.abs(last.year - point.year) < 1e-9) {
        annualPoints[annualPoints.length - 1] = point;
      } else {
        annualPoints.push(point);
      }
    }
  }

  return {
    annualPoints,
    totalDeposited: roundMoney(deposited),
    finalBalance: roundMoney(fvCheck),
  };
}

/** Bisection for annual nominal rate where projected FV equals the savings goal. */
export function solveRequiredRate(params: {
  goal: number;
  principal: number;
  years: number;
  compoundM: number;
  depositAmount: number;
  depositF: number;
  timing: DepositTiming;
}): { rateDecimal: number; alreadyReachableAtZero: boolean } | null {
  const { goal, principal, years, compoundM, depositAmount, depositF, timing } = params;

  if (![goal, principal, years, compoundM, depositAmount, depositF].every(Number.isFinite)) {
    return null;
  }
  if (!(goal > 0) || years <= 0 || compoundM <= 0 || depositF <= 0) return null;
  if (principal < 0 || depositAmount < 0) return null;

  const atZero = futureValueAtRate({
    principal,
    annualNominal: 0,
    years,
    compoundM,
    depositAmount,
    depositF,
    timing,
  });
  if (atZero === null) return null;

  if (atZero + 1e-6 >= goal) {
    return { rateDecimal: 0, alreadyReachableAtZero: true };
  }

  if (principal === 0 && depositAmount === 0) return null;

  const f = (rateDecimal: number): number | null => {
    const fv = futureValueAtRate({
      principal,
      annualNominal: rateDecimal,
      years,
      compoundM,
      depositAmount,
      depositF,
      timing,
    });
    if (fv === null) return null;
    return fv - goal;
  };

  let low = 0;
  let high = 0.5;
  let fLow = f(low);
  let fHigh = f(high);
  if (fLow === null || fHigh === null) return null;

  let expand = 0;
  while (fHigh !== null && fHigh < 0 && high < 20 && expand < 24) {
    high *= 2;
    fHigh = f(high);
    expand += 1;
  }
  if (fHigh === null || !Number.isFinite(fHigh) || fHigh < 0) return null;
  if (fLow === null || !Number.isFinite(fLow)) return null;

  for (let iter = 0; iter < 100; iter += 1) {
    const mid = (low + high) / 2;
    const fMid = f(mid);
    if (fMid === null || !Number.isFinite(fMid)) return null;
    if (Math.abs(fMid) < 1e-7 || Math.abs(high - low) < 1e-14) {
      return { rateDecimal: mid, alreadyReachableAtZero: false };
    }
    if (fLow * fMid <= 0) {
      high = mid;
      fHigh = fMid;
    } else {
      low = mid;
      fLow = fMid;
    }
  }

  const rate = (low + high) / 2;
  return Number.isFinite(rate) ? { rateDecimal: rate, alreadyReachableAtZero: false } : null;
}

export function calculateSavingsInterestRate(input: {
  savingsGoal: number;
  initialBalance: number;
  termYears: number;
  compounding: CompoundFrequency;
  depositAmount: number;
  depositFrequency: DepositFrequency;
  depositTiming: DepositTiming;
  currency: SupportedCurrency;
}): SavingsInterestRateResult | null {
  const {
    savingsGoal,
    initialBalance,
    termYears,
    compounding,
    depositAmount,
    depositFrequency,
    depositTiming,
    currency,
  } = input;

  if (![savingsGoal, initialBalance, termYears, depositAmount].every(Number.isFinite)) {
    return null;
  }
  if (!(savingsGoal > 0) || !(termYears > 0)) return null;
  if (initialBalance < 0 || depositAmount < 0) return null;

  const compoundM = periodsPerYear(compounding);
  const depositF = depositPeriodsPerYear(depositFrequency);

  const solved = solveRequiredRate({
    goal: savingsGoal,
    principal: initialBalance,
    years: termYears,
    compoundM,
    depositAmount,
    depositF,
    timing: depositTiming,
  });
  if (!solved) return null;

  const projected = buildAnnualPoints({
    principal: initialBalance,
    annualNominal: solved.rateDecimal,
    years: termYears,
    compoundM,
    depositAmount,
    depositF,
    timing: depositTiming,
  });
  if (!projected) return null;

  const requiredRatePercent = Math.round(solved.rateDecimal * 100 * 1000) / 1000;
  if (!Number.isFinite(requiredRatePercent)) return null;

  return {
    requiredRatePercent,
    totalDeposited: projected.totalDeposited,
    finalBalance: projected.finalBalance,
    years: termYears,
    annualPoints: projected.annualPoints,
    currency,
    alreadyReachableAtZero: solved.alreadyReachableAtZero,
    explanation: solved.alreadyReachableAtZero
      ? 'Your deposits already reach the savings goal with a 0% interest rate.'
      : null,
    formattedRequiredRate: formatRatePercent(requiredRatePercent),
    formattedTotalDeposited: formatCurrencyValue(projected.totalDeposited, currency),
    formattedFinalBalance: formatCurrencyValue(projected.finalBalance, currency),
  };
}
