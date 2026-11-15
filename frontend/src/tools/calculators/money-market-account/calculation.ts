import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  CONTRIBUTION_FREQUENCY_OPTIONS,
  type ContributionFrequency,
  type InvestmentMode,
  type MoneyMarketAccountResult,
} from './types';

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function periodsPerYear(frequency: ContributionFrequency): number {
  return (
    CONTRIBUTION_FREQUENCY_OPTIONS.find((opt) => opt.value === frequency)?.periodsPerYear ??
    12
  );
}

/** Normalize years/months so months stay in 0–11. */
export function normalizeTerm(
  years: number,
  months: number
): { years: number; months: number; totalMonths: number } | null {
  if (!Number.isFinite(years) || !Number.isFinite(months)) return null;
  if (years < 0 || months < 0) return null;
  if (!Number.isInteger(years) || !Number.isInteger(months)) return null;

  const totalMonths = years * 12 + months;
  if (totalMonths < 0) return null;

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    totalMonths,
  };
}

/**
 * Period count for compounding / contributions.
 * One-time and monthly SIP use exact month counts (monthly compounding).
 * Other SIP frequencies convert total years × periods-per-year (rounded).
 */
export function resolvePeriodCount(
  mode: InvestmentMode,
  totalMonths: number,
  frequency: ContributionFrequency
): number | null {
  if (!Number.isFinite(totalMonths) || totalMonths < 0) return null;

  if (mode === 'one-time' || frequency === 'monthly') {
    return totalMonths;
  }

  const ppy = periodsPerYear(frequency);
  if (!Number.isFinite(ppy) || ppy <= 0) return null;
  const n = Math.round((totalMonths / 12) * ppy);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/**
 * Money-market future value with end-of-period contributions.
 *
 * Monthly default: i = r/12, N = years×12 + months
 * One-time: FV = P × (1+i)^N
 * SIP: FV = P × (1+i)^N + C × [((1+i)^N − 1) / i]
 * Zero rate: FV = P + C×N
 */
export function calculateMoneyMarketAccount(input: {
  mode: InvestmentMode;
  startingBalance: number;
  recurringInvestment: number;
  contributionFrequency: ContributionFrequency;
  annualReturnPercent: number;
  years: number;
  months: number;
  currency: SupportedCurrency;
}): MoneyMarketAccountResult | null {
  const {
    mode,
    startingBalance,
    recurringInvestment,
    contributionFrequency,
    annualReturnPercent,
    years,
    months,
    currency,
  } = input;

  if (
    ![startingBalance, recurringInvestment, annualReturnPercent, years, months].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (startingBalance < 0 || recurringInvestment < 0) return null;
  if (annualReturnPercent < 0) return null;

  const term = normalizeTerm(years, months);
  if (!term) return null;
  if (term.totalMonths <= 0) return null;

  const contribution =
    mode === 'one-time' ? 0 : recurringInvestment;
  const frequency = mode === 'one-time' ? 'monthly' : contributionFrequency;

  const n = resolvePeriodCount(mode, term.totalMonths, frequency);
  if (n === null || n <= 0) return null;

  const ppy = periodsPerYear(frequency);
  const r = annualReturnPercent / 100;
  const i = r / ppy;
  if (!Number.isFinite(i) || i < 0) return null;

  let futureValue: number;
  if (i === 0) {
    futureValue = startingBalance + contribution * n;
  } else {
    const growth = (1 + i) ** n;
    if (!Number.isFinite(growth)) return null;
    const principalFv = startingBalance * growth;
    const annuityFv =
      contribution === 0 ? 0 : (contribution * (growth - 1)) / i;
    futureValue = principalFv + annuityFv;
  }

  if (!Number.isFinite(futureValue)) return null;

  const totalDeposit = startingBalance + contribution * n;
  const totalInterest = futureValue - totalDeposit;
  if (!Number.isFinite(totalDeposit) || !Number.isFinite(totalInterest)) return null;

  const roundedFv = roundMoney(futureValue);
  const roundedDeposit = roundMoney(totalDeposit);
  const roundedInterest = roundMoney(roundedFv - roundedDeposit);

  return {
    totalDeposit: roundedDeposit,
    totalInterest: roundedInterest,
    futureValue: roundedFv,
    periods: n,
    periodRate: i,
    currency,
    formattedTotalDeposit: formatMoney(roundedDeposit, currency),
    formattedTotalInterest: formatMoney(roundedInterest, currency),
    formattedFutureValue: formatMoney(roundedFv, currency),
  };
}
