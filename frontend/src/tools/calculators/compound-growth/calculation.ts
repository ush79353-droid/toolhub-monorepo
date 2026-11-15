import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  CompoundFrequency,
  CompoundGrowthResult,
  ContributionFrequency,
  ContributionTiming,
  YearSnapshot,
} from './types';

export function compoundsPerYear(f: CompoundFrequency): number {
  switch (f) {
    case 'annually':
      return 1;
    case 'semi-annually':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
    case 'bi-weekly':
      return 26;
    case 'weekly':
      return 52;
    case 'daily':
      return 365;
    default:
      return 12;
  }
}

export function contributionsPerYear(f: ContributionFrequency): number {
  switch (f) {
    case 'annually':
      return 1;
    case 'semi-annually':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
    case 'bi-weekly':
      return 26;
    case 'weekly':
      return 52;
    default:
      return 12;
  }
}

function money(value: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Compound growth with optional recurring contributions.
 *
 * Without contributions: FV = P × (1 + r/n)^(n×t)
 * With contributions: period-by-period balance, deposits at beginning/end of period.
 *
 * Annual vs periodic contribution growth: periodic growth applies after each
 * contribution; annual growth applies once per completed year (not double-counted
 * as an extra periodic bump).
 */
export function calculateCompoundGrowth(input: {
  initialDeposit: number;
  interestRatePercent: number;
  termYears: number;
  termMonths: number;
  compoundFrequency: CompoundFrequency;
  contributionFrequency: ContributionFrequency;
  contributionAmount: number;
  contributionTiming: ContributionTiming;
  annualContributionGrowthPercent: number;
  periodicContributionGrowthPercent: number;
  currency: SupportedCurrency;
}): CompoundGrowthResult | null {
  const {
    initialDeposit,
    interestRatePercent,
    termYears,
    termMonths,
    compoundFrequency,
    contributionFrequency,
    contributionAmount,
    contributionTiming,
    annualContributionGrowthPercent,
    periodicContributionGrowthPercent,
    currency,
  } = input;

  if (
    ![
      initialDeposit,
      interestRatePercent,
      termYears,
      termMonths,
      contributionAmount,
      annualContributionGrowthPercent,
      periodicContributionGrowthPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (initialDeposit < 0 || contributionAmount < 0) return null;
  if (termYears < 0 || termMonths < 0 || termMonths >= 12) return null;
  if (interestRatePercent < -100) return null;

  const n = compoundsPerYear(compoundFrequency);
  const c = contributionsPerYear(contributionFrequency);
  if (n <= 0 || c <= 0) return null;

  const totalYears = termYears + termMonths / 12;
  if (totalYears < 0) return null;
  if (totalYears === 0) {
    const zero: CompoundGrowthResult = {
      finalBalance: roundMoney(initialDeposit),
      totalCompoundedGrowth: 0,
      totalDeposits: roundMoney(initialDeposit),
      initialDeposit: roundMoney(initialDeposit),
      additionalPrincipal: 0,
      growthOnInitial: 0,
      growthOnAdditional: 0,
      finalInitialBalance: roundMoney(initialDeposit),
      finalAdditionalBalance: 0,
      years: [],
      formattedFinalBalance: money(initialDeposit, currency),
      formattedTotalCompoundedGrowth: money(0, currency),
      formattedInitialPrincipal: money(initialDeposit, currency),
      formattedAdditionalPrincipal: money(0, currency),
      formattedGrowthOnInitial: money(0, currency),
      formattedGrowthOnAdditional: money(0, currency),
      formattedFinalInitial: money(initialDeposit, currency),
      formattedFinalAdditional: money(0, currency),
    };
    return zero;
  }

  const totalPeriods = Math.round(totalYears * n);
  if (totalPeriods <= 0 || totalPeriods > 100_000) return null;

  const r = interestRatePercent / 100;
  const periodRate = r / n;
  if (!Number.isFinite(periodRate)) return null;

  const periodsPerContribution = n / c;
  // Require contribution schedule to align with compound periods.
  if (!Number.isFinite(periodsPerContribution) || periodsPerContribution < 1) return null;
  if (Math.abs(periodsPerContribution - Math.round(periodsPerContribution)) > 1e-9) {
    // Misaligned frequencies — still allow by using time-bucket index.
  }
  const contribEvery = Math.max(1, Math.round(periodsPerContribution));

  const annualGrowth = annualContributionGrowthPercent / 100;
  const periodicGrowth = periodicContributionGrowthPercent / 100;

  let balance = initialDeposit;
  let initialBalance = initialDeposit;
  let additionalPrincipal = 0;
  let nextContribution = contributionAmount;
  const years: YearSnapshot[] = [];

  const snapshotYear = (year: number) => {
    const finalInitial = initialBalance;
    const growthOnInitial = finalInitial - initialDeposit;
    const finalAdditional = balance - finalInitial;
    const growthOnAdditional = finalAdditional - additionalPrincipal;
    years.push({
      year,
      initialPrincipal: roundMoney(initialDeposit),
      additionalPrincipal: roundMoney(additionalPrincipal),
      growthOnInitial: roundMoney(growthOnInitial),
      growthOnAdditional: roundMoney(growthOnAdditional),
      balance: roundMoney(balance),
    });
  };

  for (let i = 0; i < totalPeriods; i += 1) {
    const isContributionPeriod = i % contribEvery === 0 && nextContribution !== 0;

    if (contributionTiming === 'beginning' && isContributionPeriod) {
      balance += nextContribution;
      additionalPrincipal += nextContribution;
      if (periodicGrowth !== 0) nextContribution *= 1 + periodicGrowth;
    }

    balance *= 1 + periodRate;
    initialBalance *= 1 + periodRate;
    if (!Number.isFinite(balance) || !Number.isFinite(initialBalance)) return null;

    if (contributionTiming === 'end' && isContributionPeriod) {
      balance += nextContribution;
      additionalPrincipal += nextContribution;
      if (periodicGrowth !== 0) nextContribution *= 1 + periodicGrowth;
    }

    // Annual contribution growth once per completed year of compound periods.
    if ((i + 1) % n === 0 && annualGrowth !== 0) {
      nextContribution *= 1 + annualGrowth;
    }

    if ((i + 1) % n === 0) {
      snapshotYear((i + 1) / n);
    }
  }

  // Partial final year (if term months leave leftover periods not on year boundary)
  if (totalPeriods % n !== 0) {
    snapshotYear(Math.ceil(totalPeriods / n));
  }

  const finalBalance = roundMoney(balance);
  const finalInitialBalance = roundMoney(initialBalance);
  const finalAdditionalBalance = roundMoney(finalBalance - finalInitialBalance);
  const growthOnInitial = roundMoney(finalInitialBalance - initialDeposit);
  const growthOnAdditional = roundMoney(finalAdditionalBalance - additionalPrincipal);
  const totalDeposits = roundMoney(initialDeposit + additionalPrincipal);
  const totalCompoundedGrowth = roundMoney(finalBalance - totalDeposits);

  if (![finalBalance, totalCompoundedGrowth, totalDeposits].every(Number.isFinite)) return null;

  return {
    finalBalance,
    totalCompoundedGrowth,
    totalDeposits,
    initialDeposit: roundMoney(initialDeposit),
    additionalPrincipal: roundMoney(additionalPrincipal),
    growthOnInitial,
    growthOnAdditional,
    finalInitialBalance,
    finalAdditionalBalance,
    years,
    formattedFinalBalance: money(finalBalance, currency),
    formattedTotalCompoundedGrowth: money(totalCompoundedGrowth, currency),
    formattedInitialPrincipal: money(initialDeposit, currency),
    formattedAdditionalPrincipal: money(additionalPrincipal, currency),
    formattedGrowthOnInitial: money(growthOnInitial, currency),
    formattedGrowthOnAdditional: money(growthOnAdditional, currency),
    formattedFinalInitial: money(finalInitialBalance, currency),
    formattedFinalAdditional: money(finalAdditionalBalance, currency),
  };
}
