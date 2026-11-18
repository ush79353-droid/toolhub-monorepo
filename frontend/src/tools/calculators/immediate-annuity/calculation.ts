import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import {
  addPaymentPeriods,
  calculateAnnuity,
  formatAnnuityMoney,
  formatLongDate,
  frequencyLabel,
  lastPaymentDateIso,
  paymentPeriodRate,
  periodsPerYear,
  termToYears,
  yearsToPaymentCount,
} from '../annuity/calculation';
import type { AnnuityType, Frequency, TermUnit } from '../annuity/types';
import type {
  ImmediateMode,
  YearlyScheduleRow,
} from './types';

export {
  formatAnnuityMoney as formatImmediateMoney,
  formatLongDate,
  frequencyLabel,
  termToYears,
  yearsToPaymentCount,
};

export function formatImmediatePercent(percent: number): string {
  if (!Number.isFinite(percent)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(percent);
}

export function timingLabel(type: AnnuityType): string {
  return type === 'due' ? 'beginning' : 'end';
}

export function modeToSolveFor(
  mode: ImmediateMode
):
  | 'annuityAmount'
  | 'initialDeposit'
  | 'timeLength'
  | 'rateOfReturn'
  | 'finalBalance' {
  switch (mode) {
    case 'withdraw':
      return 'annuityAmount';
    case 'invest':
      return 'initialDeposit';
    case 'duration':
      return 'timeLength';
    case 'rate':
      return 'rateOfReturn';
    case 'remain':
      return 'finalBalance';
  }
}

export function periodNoun(frequency: Frequency): string {
  switch (frequency) {
    case 'yearly':
      return 'year';
    case 'semiannually':
      return 'half-year';
    case 'quarterly':
      return 'quarter';
    case 'monthly':
      return 'month';
    case 'biweekly':
      return 'biweek';
    case 'weekly':
      return 'week';
    case 'daily':
      return 'day';
  }
}

export function buildSummaryText(args: {
  mode: ImmediateMode;
  currency: SupportedCurrency;
  periodicWithdrawal: number;
  openingBalance: number;
  finalBalance: number;
  lengthYears: number;
  rateOfReturnPercent: number;
  annuityType: AnnuityType;
  paymentFrequency: Frequency;
}): string {
  const symbol = '';
  const money = (n: number) => formatAnnuityMoney(n, args.currency);
  const when = timingLabel(args.annuityType);
  const period = periodNoun(args.paymentFrequency);
  const freq = frequencyLabel(args.paymentFrequency).toLowerCase();

  const depleted =
    Math.abs(args.finalBalance) < 1e-6
      ? 'to deplete your annuity entirely'
      : `leaving ${args.currency} ${money(args.finalBalance)} remaining`;

  switch (args.mode) {
    case 'withdraw':
      return `You can withdraw ${args.currency} ${money(args.periodicWithdrawal)} at the ${when} of each ${period} ${depleted}.`;
    case 'invest':
      return `You should invest ${args.currency} ${money(args.openingBalance)} to support ${args.currency} ${money(args.periodicWithdrawal)} ${freq} withdrawals.`;
    case 'duration':
      return `Withdrawals of ${args.currency} ${money(args.periodicWithdrawal)} can continue for about ${formatImmediatePercent(args.lengthYears)} years.`;
    case 'rate':
      return `A rate of return of ${formatImmediatePercent(args.rateOfReturnPercent)}% is needed for this withdrawal plan.`;
    case 'remain':
      return `After the planned withdrawals, ${args.currency} ${money(args.finalBalance)} will remain.`;
    default:
      return symbol;
  }
}

/**
 * Build calendar-year schedule from a full-precision withdrawal loop.
 * Year labels follow Omni: period-end calendar year for each payment period.
 */
export function buildYearlySchedule(params: {
  openingBalance: number;
  firstWithdrawal: number;
  paymentCount: number;
  annualRatePercent: number;
  paymentFrequency: Frequency;
  compoundingFrequency: Frequency;
  periodGrowth: number;
  annuityType: AnnuityType;
  startDate: string;
  currency: SupportedCurrency;
}): YearlyScheduleRow[] | null {
  const {
    openingBalance,
    firstWithdrawal,
    paymentCount,
    annualRatePercent,
    paymentFrequency,
    compoundingFrequency,
    periodGrowth,
    annuityType,
    startDate,
    currency,
  } = params;

  const r = paymentPeriodRate(
    annualRatePercent,
    compoundingFrequency,
    paymentFrequency
  );
  if (r === null) return null;
  if (!(paymentCount > 0) || !(firstWithdrawal >= 0)) return null;

  const rows = new Map<
    number,
    { opening: number; withdraw: number; interest: number; closing: number }
  >();

  let bal = openingBalance;
  for (let k = 0; k < paymentCount; k += 1) {
    const pmt = firstWithdrawal * Math.pow(1 + periodGrowth, k);
    if (!Number.isFinite(pmt)) return null;

    const periodEnd = addPaymentPeriods(startDate, k + 1, paymentFrequency);
    if (!periodEnd) return null;
    const year = Number(periodEnd.slice(0, 4));
    if (!Number.isFinite(year)) return null;

    let row = rows.get(year);
    if (!row) {
      row = { opening: bal, withdraw: 0, interest: 0, closing: bal };
      rows.set(year, row);
    }

    if (annuityType === 'due') {
      bal -= pmt;
      const interest = bal * r;
      bal += interest;
      row.withdraw += pmt;
      row.interest += interest;
    } else {
      const interest = bal * r;
      bal += interest;
      bal -= pmt;
      row.withdraw += pmt;
      row.interest += interest;
    }
    if (!Number.isFinite(bal)) return null;
    row.closing = bal;
  }

  const sorted = [...rows.entries()].sort((a, b) => a[0] - b[0]);
  return sorted.map(([year, row]) => {
    const close = Math.abs(row.closing) < 1e-6 ? 0 : row.closing;
    return {
      year,
      openingBalance: row.opening,
      yearlyWithdraw: row.withdraw,
      yearlyReturn: row.interest,
      closingBalance: close,
      formattedOpeningBalance: formatAnnuityMoney(row.opening, currency),
      formattedYearlyWithdraw: formatAnnuityMoney(row.withdraw, currency),
      formattedYearlyReturn: formatAnnuityMoney(row.interest, currency),
      formattedClosingBalance: formatAnnuityMoney(close, currency),
    };
  });
}

export interface ImmediateEngineInput {
  mode: ImmediateMode;
  paymentFrequency: Frequency;
  compoundingFrequency: Frequency;
  annuityType: AnnuityType;
  startDate: string;
  amountToInvest: number;
  withdrawalAmount: number;
  termYears: number;
  annualRatePercent: number;
  periodGrowth: number;
  remainingBalance: number;
}

export function calculateImmediateAnnuity(input: ImmediateEngineInput) {
  const solveFor = modeToSolveFor(input.mode);
  const engine = calculateAnnuity({
    solveFor,
    direction: 'withdrawal',
    paymentFrequency: input.paymentFrequency,
    compoundingFrequency: input.compoundingFrequency,
    annuityType: input.annuityType,
    startDate: input.startDate,
    openingBalance: input.amountToInvest,
    firstPaymentAbs: input.withdrawalAmount,
    termYears: input.termYears,
    annualRatePercent: input.annualRatePercent,
    periodGrowth: input.periodGrowth,
    targetFinalBalance: input.remainingBalance,
  });
  if (!engine) return null;

  const lengthYears =
    input.mode === 'duration'
      ? engine.numberOfPayments / periodsPerYear(input.paymentFrequency)
      : input.termYears;

  const ratePercent =
    input.mode === 'rate' ? engine.solvedValue : input.annualRatePercent;

  return {
    engine,
    lengthYears,
    ratePercent,
  };
}

export function moneyDigits(currency: SupportedCurrency): number {
  return Math.max(2, getCurrencyFractionDigits(currency));
}

export function lastWithdrawalLabel(
  startDate: string,
  paymentCount: number,
  annuityType: AnnuityType,
  paymentFrequency: Frequency
): string | null {
  const iso = lastPaymentDateIso(
    startDate,
    paymentCount,
    annuityType,
    paymentFrequency
  );
  return iso ? formatLongDate(iso) : null;
}
