import {
  formatCurrencyValue,
  getCurrencySymbol,
} from '../../shared/currency';
import type {
  AmortizationChartPoint,
  AmortizationInput,
  AmortizationResult,
  AmortizationScheduleRow,
  AmortizationYearlyRow,
  CompoundingFrequency,
  PaymentFrequency,
} from './types';
import {
  getCompoundingPeriodsPerYear,
  getPaymentPeriodsPerYear,
  resolveScheduledPeriods,
  validateAmortizationInput,
} from './validation';

export { formatCurrencyValue, getCurrencySymbol };

export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

/**
 * Computes effective periodic interest rate given annual nominal rate,
 * compounding frequency (m times/yr), and payment frequency (p times/yr):
 *
 * periodicRate = (1 + r/m)^(m/p) - 1
 *
 * For m = p, periodicRate = r/p.
 * Numerically stable for tiny rates using Math.expm1 and Math.log1p.
 */
export function computePeriodicRate(
  annualInterestRatePercent: number,
  compoundingFrequency: CompoundingFrequency,
  paymentFrequency: PaymentFrequency
): number {
  if (annualInterestRatePercent <= 0) return 0;
  const nominalRate = annualInterestRatePercent / 100;
  const m = getCompoundingPeriodsPerYear(compoundingFrequency);
  const p = getPaymentPeriodsPerYear(paymentFrequency);

  if (m === p) {
    return nominalRate / p;
  }

  // (1 + nominalRate / m)^(m / p) - 1
  return Math.expm1((m / p) * Math.log1p(nominalRate / m));
}

/**
 * Computes Effective Annual Rate (EAR / APY):
 * EAR = (1 + r/m)^m - 1
 */
export function computeEffectiveAnnualRate(
  annualInterestRatePercent: number,
  compoundingFrequency: CompoundingFrequency
): number {
  if (annualInterestRatePercent <= 0) return 0;
  const nominalRate = annualInterestRatePercent / 100;
  const m = getCompoundingPeriodsPerYear(compoundingFrequency);
  return Math.expm1(m * Math.log1p(nominalRate / m));
}

/**
 * Computes the regular periodic payment for a fixed-rate, fully amortizing loan:
 * P = L * r / (1 - (1 + r)^(-n))
 *
 * For r = 0, P = L / n.
 * Numerically stable using Math.expm1 and Math.log1p.
 */
export function computeRegularPayment(
  principal: number,
  periodicRate: number,
  numberOfPayments: number
): number {
  if (principal <= 0 || numberOfPayments <= 0) return 0;
  if (periodicRate <= 0) {
    return principal / numberOfPayments;
  }
  const denom = -Math.expm1(-numberOfPayments * Math.log1p(periodicRate));
  return (principal * periodicRate) / denom;
}

export function addDaysToIsoDate(isoDate: string, daysToAdd: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) throw new Error(`Invalid ISO date "${isoDate}"`);
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, monthIndex, day + daysToAdd));
  return `${String(utc.getUTCFullYear()).padStart(4, '0')}-${String(utc.getUTCMonth() + 1).padStart(2, '0')}-${String(utc.getUTCDate()).padStart(2, '0')}`;
}

export function addMonthsToIsoDate(isoDate: string, monthsToAdd: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) throw new Error(`Invalid ISO date "${isoDate}"`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const targetDate = new Date(Date.UTC(year, month - 1 + monthsToAdd, 1));
  const targetYear = targetDate.getUTCFullYear();
  const targetMonth = targetDate.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
  const safeDay = Math.min(day, daysInMonth);

  return `${String(targetYear).padStart(4, '0')}-${String(targetMonth + 1).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;
}

export function getScheduledPaymentDate(
  startDate: string,
  periodNumber: number,
  frequency: PaymentFrequency
): string {
  switch (frequency) {
    case 'weekly':
      return addDaysToIsoDate(startDate, periodNumber * 7);
    case 'biweekly':
      return addDaysToIsoDate(startDate, periodNumber * 14);
    case 'monthly':
      return addMonthsToIsoDate(startDate, periodNumber);
    case 'quarterly':
      return addMonthsToIsoDate(startDate, periodNumber * 3);
    case 'semiannually':
      return addMonthsToIsoDate(startDate, periodNumber * 6);
    case 'annually':
      return addMonthsToIsoDate(startDate, periodNumber * 12);
    default:
      return addMonthsToIsoDate(startDate, periodNumber);
  }
}

export function formatDisplayDate(isoDate: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return isoDate;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, monthIndex, day));
  return utc.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function escapeCsvCell(val: string | number): string {
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildAmortizationCsv(result: AmortizationResult): string {
  const headers = [
    'Payment #',
    'Date',
    'Opening Balance',
    'Scheduled Payment',
    'Principal Paid',
    'Interest Paid',
    'Extra Payment',
    'Total Payment',
    'Closing Balance',
    'Cumulative Principal',
    'Cumulative Interest',
  ];

  const rows = result.schedule.map((row) => [
    row.periodNumber,
    row.paymentDate,
    row.openingBalance.toFixed(2),
    row.scheduledPayment.toFixed(2),
    row.principalPaid.toFixed(2),
    row.interestPaid.toFixed(2),
    row.extraPayment.toFixed(2),
    row.totalPayment.toFixed(2),
    row.closingBalance.toFixed(2),
    row.cumulativePrincipal.toFixed(2),
    row.cumulativeInterest.toFixed(2),
  ]);

  return [
    headers.map(escapeCsvCell).join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ].join('\r\n');
}

interface InternalLedgerRun {
  rows: AmortizationScheduleRow[];
  totalScheduledCents: number;
  totalExtraCents: number;
  totalInterestCents: number;
  totalAmountCents: number;
  endingBalanceByPeriod: number[];
}

function runAmortizationLedger(
  principalCents: number,
  periodicRate: number,
  totalPeriods: number,
  frequency: PaymentFrequency,
  startDate: string,
  extraPaymentCents: number,
  recurringStartPeriod: number,
  recurringEndPeriod: number | null,
  oneTimeExtraCents: number,
  oneTimeExtraPeriod: number
): InternalLedgerRun {
  const rows: AmortizationScheduleRow[] = [];
  const endingBalanceByPeriod: number[] = [];

  let balanceCents = principalCents;
  const exactRegularPaymentDollars = computeRegularPayment(
    fromCents(principalCents),
    periodicRate,
    totalPeriods
  );
  const regularPaymentCents = Math.round(exactRegularPaymentDollars * 100);

  let totalScheduledCents = 0;
  let totalExtraCents = 0;
  let totalInterestCents = 0;
  let totalAmountCents = 0;

  let cumulativePrincipalCents = 0;
  let cumulativeInterestCents = 0;

  for (let period = 1; period <= totalPeriods; period += 1) {
    if (balanceCents <= 0) break;

    const openingBalanceCents = balanceCents;
    const paymentDate = getScheduledPaymentDate(startDate, period, frequency);

    // Exact interest on current opening balance
    const interestCents = Math.round(openingBalanceCents * periodicRate);

    // Final payoff or final scheduled period adjustment
    const isFinalPeriod = period === totalPeriods;
    if (isFinalPeriod || openingBalanceCents + interestCents <= regularPaymentCents) {
      const scheduledPaymentCents = openingBalanceCents + interestCents;
      const principalPaidCents = openingBalanceCents;
      const totalPaymentCents = scheduledPaymentCents;

      balanceCents = 0;
      totalScheduledCents += scheduledPaymentCents;
      totalInterestCents += interestCents;
      totalAmountCents += totalPaymentCents;

      cumulativePrincipalCents += principalPaidCents;
      cumulativeInterestCents += interestCents;

      rows.push({
        periodNumber: period,
        paymentDate,
        openingBalance: fromCents(openingBalanceCents),
        scheduledPayment: fromCents(scheduledPaymentCents),
        principalPaid: fromCents(principalPaidCents),
        interestPaid: fromCents(interestCents),
        extraPayment: 0,
        totalPayment: fromCents(totalPaymentCents),
        closingBalance: 0,
        cumulativePrincipal: fromCents(cumulativePrincipalCents),
        cumulativeInterest: fromCents(cumulativeInterestCents),
      });
      endingBalanceByPeriod.push(0);
      break;
    }

    // Standard payment calculation
    const scheduledPrincipalCents = regularPaymentCents - interestCents;
    const principalPaidCents = Math.min(scheduledPrincipalCents, openingBalanceCents);
    const remainingBalanceAfterPrincipal = openingBalanceCents - principalPaidCents;

    // Extra payments
    let desiredExtraCents = 0;
    if (
      extraPaymentCents > 0 &&
      period >= recurringStartPeriod &&
      (recurringEndPeriod === null || period <= recurringEndPeriod)
    ) {
      desiredExtraCents += extraPaymentCents;
    }
    if (oneTimeExtraCents > 0 && period === oneTimeExtraPeriod) {
      desiredExtraCents += oneTimeExtraCents;
    }

    const extraPaidCents = Math.min(desiredExtraCents, remainingBalanceAfterPrincipal);
    const closingBalanceCents = Math.max(0, remainingBalanceAfterPrincipal - extraPaidCents);
    const totalPaymentCents = regularPaymentCents + extraPaidCents;

    balanceCents = closingBalanceCents;
    totalScheduledCents += regularPaymentCents;
    totalExtraCents += extraPaidCents;
    totalInterestCents += interestCents;
    totalAmountCents += totalPaymentCents;

    cumulativePrincipalCents += principalPaidCents + extraPaidCents;
    cumulativeInterestCents += interestCents;

    rows.push({
      periodNumber: period,
      paymentDate,
      openingBalance: fromCents(openingBalanceCents),
      scheduledPayment: fromCents(regularPaymentCents),
      principalPaid: fromCents(principalPaidCents),
      interestPaid: fromCents(interestCents),
      extraPayment: fromCents(extraPaidCents),
      totalPayment: fromCents(totalPaymentCents),
      closingBalance: fromCents(closingBalanceCents),
      cumulativePrincipal: fromCents(cumulativePrincipalCents),
      cumulativeInterest: fromCents(cumulativeInterestCents),
    });
    endingBalanceByPeriod.push(fromCents(closingBalanceCents));

    if (closingBalanceCents <= 0) break;
  }

  return {
    rows,
    totalScheduledCents,
    totalExtraCents,
    totalInterestCents,
    totalAmountCents,
    endingBalanceByPeriod,
  };
}

export function buildYearlySchedule(
  schedule: AmortizationScheduleRow[],
  frequency: PaymentFrequency
): AmortizationYearlyRow[] {
  if (schedule.length === 0) return [];

  const periodsPerYear = getPaymentPeriodsPerYear(frequency);
  const yearlyRows: AmortizationYearlyRow[] = [];

  let currentYearNumber = 1;
  let yearRows: AmortizationScheduleRow[] = [];

  for (let i = 0; i < schedule.length; i += 1) {
    yearRows.push(schedule[i]);
    const isYearEnd = yearRows.length === periodsPerYear || i === schedule.length - 1;

    if (isYearEnd) {
      const firstRow = yearRows[0];
      const lastRow = yearRows[yearRows.length - 1];

      const scheduledSum = yearRows.reduce((acc, r) => acc + r.scheduledPayment, 0);
      const principalSum = yearRows.reduce((acc, r) => acc + r.principalPaid, 0);
      const interestSum = yearRows.reduce((acc, r) => acc + r.interestPaid, 0);
      const extraSum = yearRows.reduce((acc, r) => acc + r.extraPayment, 0);
      const totalSum = yearRows.reduce((acc, r) => acc + r.totalPayment, 0);

      const calendarYear = Number(lastRow.paymentDate.split('-')[0]) || currentYearNumber;

      yearlyRows.push({
        year: currentYearNumber,
        calendarYear,
        paymentsCount: yearRows.length,
        openingBalance: firstRow.openingBalance,
        scheduledPayment: scheduledSum,
        principalPaid: principalSum,
        interestPaid: interestSum,
        extraPayment: extraSum,
        totalPayment: totalSum,
        closingBalance: lastRow.closingBalance,
        cumulativePrincipal: lastRow.cumulativePrincipal,
        cumulativeInterest: lastRow.cumulativeInterest,
      });

      currentYearNumber += 1;
      yearRows = [];
    }
  }

  return yearlyRows;
}

export function formatTimeSavedDescription(
  periodsSaved: number,
  frequency: PaymentFrequency
): string {
  if (periodsSaved <= 0) return '';
  const p = getPaymentPeriodsPerYear(frequency);
  const yearsSaved = Math.floor(periodsSaved / p);
  const remainderPeriods = periodsSaved % p;

  if (frequency === 'monthly') {
    const parts: string[] = [];
    if (yearsSaved > 0) parts.push(`${yearsSaved} ${yearsSaved === 1 ? 'year' : 'years'}`);
    if (remainderPeriods > 0) {
      parts.push(`${remainderPeriods} ${remainderPeriods === 1 ? 'month' : 'months'}`);
    }
    return parts.length > 0 ? `${parts.join(' ')} saved` : '';
  }

  const parts: string[] = [];
  if (yearsSaved > 0) parts.push(`${yearsSaved} ${yearsSaved === 1 ? 'year' : 'years'}`);
  if (remainderPeriods > 0) {
    parts.push(`${remainderPeriods} ${remainderPeriods === 1 ? 'payment' : 'payments'}`);
  }
  return parts.length > 0 ? `${parts.join(' ')} saved` : '';
}

export function calculateAmortization(input: AmortizationInput): AmortizationResult {
  const validation = validateAmortizationInput(input);
  if (!validation.isValid) {
    throw new Error(
      `Invalid amortization input: ${Object.values(validation.errors).join(', ')}`
    );
  }

  const compoundingPeriodsPerYear = getCompoundingPeriodsPerYear(input.compoundingFrequency);
  const paymentPeriodsPerYear = getPaymentPeriodsPerYear(input.paymentFrequency);
  const periodicRate = computePeriodicRate(
    input.interestRate,
    input.compoundingFrequency,
    input.paymentFrequency
  );
  const effectiveAnnualRate = computeEffectiveAnnualRate(
    input.interestRate,
    input.compoundingFrequency
  );

  const { numberOfPayments: scheduledPaymentsCount } = resolveScheduledPeriods(
    input.termYears,
    input.termMonths,
    input.paymentFrequency
  );

  const loanPrincipalCents = toCents(input.loanAmount);
  const extraPaymentCents = toCents(input.extraPayment);
  const oneTimeExtraCents = toCents(input.oneTimeExtraAmount);

  // 1. Run baseline schedule (no extra payments)
  const baseline = runAmortizationLedger(
    loanPrincipalCents,
    periodicRate,
    scheduledPaymentsCount,
    input.paymentFrequency,
    input.startDate,
    0,
    1,
    null,
    0,
    1
  );

  // 2. Run actual schedule (with extra payments)
  const actual = runAmortizationLedger(
    loanPrincipalCents,
    periodicRate,
    scheduledPaymentsCount,
    input.paymentFrequency,
    input.startDate,
    extraPaymentCents,
    input.recurringExtraStartPeriod,
    input.recurringExtraEndPeriod,
    oneTimeExtraCents,
    input.oneTimeExtraPeriod
  );

  const baselineTotalInterest = fromCents(baseline.totalInterestCents);
  const baselineTotalAmountPaid = fromCents(baseline.totalAmountCents);
  const totalInterestPaid = fromCents(actual.totalInterestCents);
  const totalAmountPaid = fromCents(actual.totalAmountCents);
  const totalScheduledPaymentAmount = fromCents(actual.totalScheduledCents);
  const totalExtraPaymentAmount = fromCents(actual.totalExtraCents);

  const interestSavings = Math.max(0, baselineTotalInterest - totalInterestPaid);
  const actualPaymentsCount = actual.rows.length;
  const paymentsSaved = Math.max(0, scheduledPaymentsCount - actualPaymentsCount);

  const regularPayment = fromCents(
    Math.round(
      computeRegularPayment(input.loanAmount, periodicRate, scheduledPaymentsCount) * 100
    )
  );

  const payoffDate =
    actual.rows.length > 0 ? actual.rows[actual.rows.length - 1].paymentDate : input.startDate;
  const baselinePayoffDate =
    baseline.rows.length > 0
      ? baseline.rows[baseline.rows.length - 1].paymentDate
      : input.startDate;

  const timeSavedDescription = formatTimeSavedDescription(
    paymentsSaved,
    input.paymentFrequency
  );

  const totalCost = input.loanAmount + totalInterestPaid;
  const principalRatioPercent =
    totalCost > 0 ? Number(((input.loanAmount / totalCost) * 100).toFixed(1)) : 100;
  const interestRatioPercent =
    totalCost > 0 ? Number(((totalInterestPaid / totalCost) * 100).toFixed(1)) : 0;

  // Build chart points
  const chartPoints: AmortizationChartPoint[] = [];
  // Initial point at period 0
  chartPoints.push({
    period: 0,
    date: input.startDate,
    balance: input.loanAmount,
    baselineBalance: input.loanAmount,
    cumulativePrincipal: 0,
    cumulativeInterest: 0,
  });

  for (let i = 0; i < actual.rows.length; i += 1) {
    const row = actual.rows[i];
    const baselineBalance =
      i < baseline.endingBalanceByPeriod.length
        ? baseline.endingBalanceByPeriod[i]
        : 0;
    chartPoints.push({
      period: row.periodNumber,
      date: row.paymentDate,
      balance: row.closingBalance,
      baselineBalance,
      cumulativePrincipal: row.cumulativePrincipal,
      cumulativeInterest: row.cumulativeInterest,
    });
  }

  const yearlySchedule = buildYearlySchedule(actual.rows, input.paymentFrequency);

  return {
    currency: input.currency,
    loanAmount: input.loanAmount,
    termYears: input.termYears,
    termMonths: input.termMonths,
    annualInterestRate: input.interestRate,
    compoundingFrequency: input.compoundingFrequency,
    paymentFrequency: input.paymentFrequency,
    compoundingPeriodsPerYear,
    paymentPeriodsPerYear,
    periodicRate,
    effectiveAnnualRate,
    regularPayment,
    scheduledPaymentsCount,
    actualPaymentsCount,
    paymentsSaved,
    totalScheduledPaymentAmount,
    totalExtraPaymentAmount,
    totalInterestPaid,
    totalAmountPaid,
    baselineTotalInterest,
    baselineTotalAmountPaid,
    interestSavings,
    payoffDate,
    baselinePayoffDate,
    timeSavedDescription,
    principalRatioPercent,
    interestRatioPercent,
    schedule: actual.rows,
    yearlySchedule,
    chartPoints,
  };
}

export function buildAmortizationSummaryText(
  _input: AmortizationInput,
  result: AmortizationResult
): string {
  const fmt = (val: number) => formatCurrencyValue(val, result.currency);
  const lines = [
    '=== Amortization Calculator Summary ===',
    `Loan Amount: ${fmt(result.loanAmount)}`,
    `Term: ${result.termYears} years${result.termMonths > 0 ? ` ${result.termMonths} months` : ''}`,
    `Interest Rate: ${result.annualInterestRate}% (Compounded ${result.compoundingFrequency})`,
    `Payment Frequency: ${result.paymentFrequency}`,
    `Regular Payment: ${fmt(result.regularPayment)}`,
    `Total Scheduled Payments: ${result.scheduledPaymentsCount}`,
    `Total Interest Paid: ${fmt(result.totalInterestPaid)}`,
    `Total Amount Paid: ${fmt(result.totalAmountPaid)}`,
    `Payoff Date: ${formatDisplayDate(result.payoffDate)}`,
  ];

  if (result.totalExtraPaymentAmount > 0) {
    lines.push(
      `Total Extra Payments: ${fmt(result.totalExtraPaymentAmount)}`,
      `Interest Savings: ${fmt(result.interestSavings)}`,
      `Payments Saved: ${result.paymentsSaved} (${result.timeSavedDescription})`
    );
  }

  lines.push('Calculated at OmegaCalculators.com');
  return lines.join('\n');
}
