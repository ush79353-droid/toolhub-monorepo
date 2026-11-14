import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  FutureValueResult,
  FutureValueScheduleRow,
  PeriodicTiming,
} from './types';

function formatMoney(amount: number, currency: SupportedCurrency): string {
  const digits = getCurrencyFractionDigits(currency);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * FV = PV × (1+r)^n plus each signed periodic contribution compounded by remaining periods.
 * End-of-period contribution in period k compounds for (n−k) periods.
 * Beginning-of-period contribution in period k compounds for (n−k+1) periods.
 * Total Interest = FV − PV − Net Contributions
 */
export function calculateFutureValue(input: {
  presentValue: number;
  periods: number;
  interestRatePercent: number;
  includePeriodic: boolean;
  periodicAmount: number;
  periodicTiming: PeriodicTiming;
  currency: SupportedCurrency;
}): FutureValueResult | null {
  const {
    presentValue,
    periods,
    interestRatePercent,
    includePeriodic,
    periodicAmount,
    periodicTiming,
    currency,
  } = input;

  if (
    ![presentValue, periods, interestRatePercent, periodicAmount].every(Number.isFinite)
  ) {
    return null;
  }
  if (periods < 0 || !Number.isInteger(periods)) return null;
  if (interestRatePercent <= -100) return null;

  const r = interestRatePercent / 100;
  const factor = 1 + r;
  if (!(factor > 0) || !Number.isFinite(factor)) return null;

  const pmt = includePeriodic ? periodicAmount : 0;
  const n = periods;

  let balance = presentValue;
  const schedule: FutureValueScheduleRow[] = [];
  const amountByPeriod: { period: number; amount: number; formattedAmount: string }[] = [];

  for (let k = 1; k <= n; k += 1) {
    const startBalance = balance;
    let contribution = 0;

    if (includePeriodic && periodicTiming === 'beginning') {
      contribution = pmt;
      balance += contribution;
    }

    const interest = balance * r;
    if (!Number.isFinite(interest)) return null;
    balance += interest;

    if (includePeriodic && periodicTiming === 'end') {
      contribution = pmt;
      balance += contribution;
    }

    if (!Number.isFinite(balance)) return null;

    schedule.push({
      period: k,
      startBalance,
      interest,
      contribution,
      endBalance: balance,
      formattedStartBalance: formatMoney(startBalance, currency),
      formattedInterest: formatMoney(interest, currency),
      formattedContribution: formatMoney(contribution, currency),
      formattedEndBalance: formatMoney(balance, currency),
    });

    amountByPeriod.push({
      period: k,
      amount: balance,
      formattedAmount: formatMoney(balance, currency),
    });
  }

  // n = 0: no growth periods
  if (n === 0) {
    balance = presentValue;
  }

  const futureValue = balance;
  const netContributions = pmt * n;
  const totalInterest = futureValue - presentValue - netContributions;
  if (!Number.isFinite(futureValue) || !Number.isFinite(totalInterest)) return null;

  const presentValueGrowth = presentValue * factor ** n;
  let contributionsGrowth = 0;
  if (includePeriodic && n > 0) {
    for (let k = 1; k <= n; k += 1) {
      const remaining =
        periodicTiming === 'beginning' ? n - k + 1 : n - k;
      contributionsGrowth += pmt * factor ** remaining;
    }
  }

  if (!Number.isFinite(presentValueGrowth) || !Number.isFinite(contributionsGrowth)) {
    return null;
  }

  return {
    presentValue,
    periods: n,
    interestRatePercent,
    includePeriodic,
    periodicAmount: pmt,
    periodicTiming,
    netContributions,
    futureValue,
    totalInterest,
    currency,
    schedule,
    formattedPresentValueGrowth: formatMoney(presentValueGrowth, currency),
    formattedContributionsGrowth: formatMoney(contributionsGrowth, currency),
    formattedFutureValue: formatMoney(futureValue, currency),
    formattedTotalInterest: formatMoney(totalInterest, currency),
    formattedNetContributions: formatMoney(netContributions, currency),
    amountByPeriod,
  };
}
