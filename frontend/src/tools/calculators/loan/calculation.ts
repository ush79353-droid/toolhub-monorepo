import {
  addMonthsToIsoDate,
  escapeCsvCell,
  formatCurrencyValue,
  formatDisplayDate,
  fromCents,
} from '../auto-loan/calculation';
import type {
  LoanBalancePoint,
  LoanInput,
  LoanResult,
  LoanScheduleRow,
  LoanYearlyRow,
  PaymentFrequency,
  SupportedCurrency,
} from './types';
import {
  getPaymentsPerYear,
  resolveInterestOnlyPeriods,
  resolveOriginationFeeCents,
  resolveScheduledPeriods,
  resolveTotalMonths,
  toCents,
  validateLoanInput,
} from './validation';

export { addMonthsToIsoDate, escapeCsvCell, formatCurrencyValue, formatDisplayDate, fromCents };

export function addDaysToIsoDate(isoDate: string, daysToAdd: number): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) {
    throw new Error(`Invalid ISO date "${isoDate}"`);
  }
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const utc = new Date(Date.UTC(year, monthIndex, day + daysToAdd));

  return `${String(utc.getUTCFullYear()).padStart(4, '0')}-${String(utc.getUTCMonth() + 1).padStart(2, '0')}-${String(utc.getUTCDate()).padStart(2, '0')}`;
}

export function getScheduledPaymentDate(
  startDate: string,
  periodNumber: number,
  frequency: PaymentFrequency
): string {
  if (frequency === 'weekly') {
    return addDaysToIsoDate(startDate, periodNumber * 7);
  }
  if (frequency === 'biweekly') {
    return addDaysToIsoDate(startDate, periodNumber * 14);
  }
  return addMonthsToIsoDate(startDate, periodNumber);
}

export function getFrequencyUnitSuffix(frequency: PaymentFrequency): string {
  if (frequency === 'biweekly') return '/ 2 wks';
  if (frequency === 'weekly') return '/ wk';
  return '/ mo';
}

export function getFrequencyPeriodLabel(frequency: PaymentFrequency): string {
  if (frequency === 'biweekly') return 'Biweekly';
  if (frequency === 'weekly') return 'Weekly';
  return 'Monthly';
}

function computeAmortizedPaymentCents(
  principalCents: number,
  periodicRate: number,
  periods: number
): number {
  if (principalCents <= 0 || periods <= 0) return 0;
  if (periodicRate === 0) {
    return Math.round(principalCents / periods);
  }
  const growthFactor = Math.pow(1 + periodicRate, periods);
  const exactDollars =
    ((principalCents / 100) * periodicRate * growthFactor) / (growthFactor - 1);
  return Math.round(exactDollars * 100);
}

interface LedgerRun {
  rows: LoanScheduleRow[];
  initialRegularPaymentCents: number;
  postInterestOnlyPaymentCents: number | null;
  finalPaymentCents: number;
  totalRegularCents: number;
  totalExtraCents: number;
  totalPaymentCents: number;
  totalPrincipalCents: number;
  totalInterestCents: number;
  remainingBalanceAfterIoCents: number | null;
  endingBalanceCents: number;
  endingBalanceByPeriod: number[];
}

function buildLoanLedger(
  principalCents: number,
  periodicRate: number,
  totalPeriods: number,
  ioPeriods: number,
  frequency: PaymentFrequency,
  startDate: string,
  recurringExtraCents: number,
  extraFrequency: LoanInput['extraPaymentFrequency'],
  oneTimeExtraCents: number,
  oneTimeExtraPeriod: number
): LedgerRun {
  const rows: LoanScheduleRow[] = [];
  const endingBalanceByPeriod: number[] = [];

  let balanceCents = principalCents;
  let initialRegularPaymentCents = 0;
  let postInterestOnlyPaymentCents: number | null = null;
  let activeAmortizedCents =
    ioPeriods === 0 ? computeAmortizedPaymentCents(principalCents, periodicRate, totalPeriods) : 0;

  if (ioPeriods === 0) {
    initialRegularPaymentCents = activeAmortizedCents;
  } else {
    initialRegularPaymentCents = Math.round(principalCents * periodicRate);
  }

  let totalRegularCents = 0;
  let totalExtraCents = 0;
  let totalPaymentCents = 0;
  let totalPrincipalCents = 0;
  let totalInterestCents = 0;
  let finalPaymentCents = 0;
  let remainingBalanceAfterIoCents: number | null = ioPeriods > 0 ? principalCents : null;

  let monthlyExtraCount = 0;
  let yearlyExtraCount = 0;

  for (let period = 1; period <= totalPeriods; period += 1) {
    if (balanceCents <= 0) {
      break;
    }

    const paymentDate = getScheduledPaymentDate(startDate, period, frequency);
    const beginningBalanceCents = balanceCents;
    const isIoPhase = period <= ioPeriods;
    const phase: 'interest-only' | 'amortized' = isIoPhase ? 'interest-only' : 'amortized';

    if (!isIoPhase && period === ioPeriods + 1 && ioPeriods > 0) {
      activeAmortizedCents = computeAmortizedPaymentCents(
        beginningBalanceCents,
        periodicRate,
        totalPeriods - ioPeriods
      );
      postInterestOnlyPaymentCents = activeAmortizedCents;
    }

    // Check extra payment eligibility for this period.
    let desiredExtraCents = 0;
    if (recurringExtraCents > 0) {
      if (extraFrequency === 'every-payment') {
        desiredExtraCents += recurringExtraCents;
      } else if (extraFrequency === 'monthly') {
        if (frequency === 'monthly') {
          desiredExtraCents += recurringExtraCents;
        } else {
          const nextMonthlyDate = addMonthsToIsoDate(startDate, monthlyExtraCount + 1);
          if (paymentDate >= nextMonthlyDate) {
            desiredExtraCents += recurringExtraCents;
            monthlyExtraCount += 1;
          }
        }
      } else if (extraFrequency === 'yearly') {
        if (frequency === 'monthly') {
          if (period % 12 === 0) {
            desiredExtraCents += recurringExtraCents;
          }
        } else {
          const nextYearlyDate = addMonthsToIsoDate(startDate, (yearlyExtraCount + 1) * 12);
          if (paymentDate >= nextYearlyDate) {
            desiredExtraCents += recurringExtraCents;
            yearlyExtraCount += 1;
          }
        }
      }
    }

    if (oneTimeExtraCents > 0 && period === oneTimeExtraPeriod) {
      desiredExtraCents += oneTimeExtraCents;
    }

    const interestPaidCents = Math.round(beginningBalanceCents * periodicRate);
    let regularPrincipalCents = 0;
    let regularPaymentCents = 0;
    let extraPrincipalCents = 0;
    let endingBalanceCents = beginningBalanceCents;

    if (isIoPhase) {
      regularPaymentCents = interestPaidCents;
      regularPrincipalCents = 0;
      extraPrincipalCents = Math.min(desiredExtraCents, beginningBalanceCents);
      endingBalanceCents = beginningBalanceCents - extraPrincipalCents;
    } else if (periodicRate === 0) {
      if (period === totalPeriods || activeAmortizedCents >= beginningBalanceCents) {
        regularPrincipalCents = beginningBalanceCents;
        regularPaymentCents = regularPrincipalCents;
        extraPrincipalCents = 0;
        endingBalanceCents = 0;
      } else {
        regularPrincipalCents = Math.min(beginningBalanceCents, activeAmortizedCents);
        regularPaymentCents = regularPrincipalCents;
        const afterRegularCents = beginningBalanceCents - regularPrincipalCents;
        extraPrincipalCents = Math.min(desiredExtraCents, afterRegularCents);
        endingBalanceCents = afterRegularCents - extraPrincipalCents;
      }
    } else if (
      period === totalPeriods ||
      activeAmortizedCents >= beginningBalanceCents + interestPaidCents
    ) {
      // Final payment or natural early payoff adjusts cleanly to zero ending balance.
      regularPrincipalCents = beginningBalanceCents;
      regularPaymentCents = regularPrincipalCents + interestPaidCents;
      extraPrincipalCents = 0;
      endingBalanceCents = 0;
    } else {
      regularPaymentCents = Math.max(activeAmortizedCents, interestPaidCents);
      regularPrincipalCents = regularPaymentCents - interestPaidCents;
      const afterRegularCents = beginningBalanceCents - regularPrincipalCents;
      extraPrincipalCents = Math.min(desiredExtraCents, afterRegularCents);
      endingBalanceCents = afterRegularCents - extraPrincipalCents;
    }

    const principalPaidCents = regularPrincipalCents + extraPrincipalCents;
    const paymentCents = regularPaymentCents + extraPrincipalCents;

    balanceCents = endingBalanceCents;
    if (isIoPhase && period === ioPeriods) {
      remainingBalanceAfterIoCents = endingBalanceCents;
    }
    if (endingBalanceCents === 0 && ioPeriods > 0 && period < ioPeriods) {
      remainingBalanceAfterIoCents = 0;
    }

    totalRegularCents += regularPaymentCents;
    totalExtraCents += extraPrincipalCents;
    totalPaymentCents += paymentCents;
    totalPrincipalCents += principalPaidCents;
    totalInterestCents += interestPaidCents;
    finalPaymentCents = paymentCents;
    endingBalanceByPeriod.push(endingBalanceCents);

    rows.push({
      periodNumber: period,
      paymentDate,
      phase,
      beginningBalance: fromCents(beginningBalanceCents),
      regularPayment: fromCents(regularPaymentCents),
      extraPayment: fromCents(extraPrincipalCents),
      totalPayment: fromCents(paymentCents),
      regularPrincipalPaid: fromCents(regularPrincipalCents),
      extraPrincipalPaid: fromCents(extraPrincipalCents),
      principalPaid: fromCents(principalPaidCents),
      interestPaid: fromCents(interestPaidCents),
      endingBalance: fromCents(endingBalanceCents),
    });
  }

  return {
    rows,
    initialRegularPaymentCents,
    postInterestOnlyPaymentCents,
    finalPaymentCents,
    totalRegularCents,
    totalExtraCents,
    totalPaymentCents,
    totalPrincipalCents,
    totalInterestCents,
    remainingBalanceAfterIoCents,
    endingBalanceCents: balanceCents,
    endingBalanceByPeriod,
  };
}

function summarizeByYear(rows: LoanScheduleRow[]): LoanYearlyRow[] {
  const byYear = new Map<
    number,
    {
      year: number;
      paymentsCount: number;
      beginningBalanceCents: number;
      regularCents: number;
      extraCents: number;
      totalCents: number;
      principalCents: number;
      interestCents: number;
      endingBalanceCents: number;
    }
  >();

  for (const row of rows) {
    const year = Number(row.paymentDate.slice(0, 4));
    const existing = byYear.get(year);
    const regCents = toCents(row.regularPayment);
    const extCents = toCents(row.extraPayment);
    const totCents = toCents(row.totalPayment);
    const prinCents = toCents(row.principalPaid);
    const intCents = toCents(row.interestPaid);
    const endCents = toCents(row.endingBalance);

    if (!existing) {
      byYear.set(year, {
        year,
        paymentsCount: 1,
        beginningBalanceCents: toCents(row.beginningBalance),
        regularCents: regCents,
        extraCents: extCents,
        totalCents: totCents,
        principalCents: prinCents,
        interestCents: intCents,
        endingBalanceCents: endCents,
      });
    } else {
      existing.paymentsCount += 1;
      existing.regularCents += regCents;
      existing.extraCents += extCents;
      existing.totalCents += totCents;
      existing.principalCents += prinCents;
      existing.interestCents += intCents;
      existing.endingBalanceCents = endCents;
    }
  }

  return Array.from(byYear.values()).map((item) => ({
    year: item.year,
    paymentsCount: item.paymentsCount,
    beginningBalance: fromCents(item.beginningBalanceCents),
    regularPayment: fromCents(item.regularCents),
    extraPayment: fromCents(item.extraCents),
    totalPayment: fromCents(item.totalCents),
    principalPaid: fromCents(item.principalCents),
    interestPaid: fromCents(item.interestCents),
    endingBalance: fromCents(item.endingBalanceCents),
  }));
}

function buildBalanceCurve(
  principalCents: number,
  actualRun: LedgerRun,
  baselineRun: LedgerRun
): LoanBalancePoint[] {
  const maxPeriod = Math.max(actualRun.rows.length, baselineRun.rows.length);
  const step = maxPeriod <= 60 ? 1 : Math.ceil(maxPeriod / 60);
  const points: LoanBalancePoint[] = [
    {
      period: 0,
      balance: fromCents(principalCents),
      baselineBalance: fromCents(principalCents),
    },
  ];

  for (let period = 1; period <= maxPeriod; period += 1) {
    if (period % step !== 0 && period !== maxPeriod) continue;
    const actualBalCents =
      period <= actualRun.endingBalanceByPeriod.length
        ? actualRun.endingBalanceByPeriod[period - 1]
        : actualRun.endingBalanceCents;
    const baselineBalCents =
      period <= baselineRun.endingBalanceByPeriod.length
        ? baselineRun.endingBalanceByPeriod[period - 1]
        : baselineRun.endingBalanceCents;

    points.push({
      period,
      balance: fromCents(actualBalCents),
      baselineBalance: fromCents(baselineBalCents),
    });
  }

  return points;
}

export function calculateLoan(input: LoanInput): LoanResult {
  const validation = validateLoanInput(input);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0] ?? 'Invalid loan input.';
    throw new Error(firstError);
  }

  const loanAmountCents = toCents(input.loanAmount);
  const originationFeeCents = resolveOriginationFeeCents(
    loanAmountCents,
    input.originationFeeValue,
    input.originationFeeMode
  );
  const financedFeeCents = input.feeInclusion === 'finance' ? originationFeeCents : 0;
  const upfrontFeeCents = input.feeInclusion === 'upfront' ? originationFeeCents : 0;
  const amountFinancedCents = loanAmountCents + financedFeeCents;

  const totalMonths = Math.round(resolveTotalMonths(input.loanTermValue, input.loanTermUnit));
  const paymentsPerYear = getPaymentsPerYear(input.paymentFrequency);
  const scheduledPaymentsCount = resolveScheduledPeriods(totalMonths, input.paymentFrequency);

  const interestOnlyMonths =
    input.loanMode === 'interest-only'
      ? Math.round(resolveTotalMonths(input.interestOnlyValue, input.interestOnlyUnit))
      : 0;
  const ioPeriods =
    input.loanMode === 'interest-only'
      ? resolveInterestOnlyPeriods(interestOnlyMonths, scheduledPaymentsCount, input.paymentFrequency)
      : 0;

  const periodicRate = input.annualInterestRate / 100 / paymentsPerYear;
  const recurringExtraCents = toCents(input.extraPaymentAmount);
  const oneTimeExtraCents = toCents(input.oneTimeExtraAmount);
  const hasExtraPayments = recurringExtraCents > 0 || oneTimeExtraCents > 0;

  const baselineRun = buildLoanLedger(
    amountFinancedCents,
    periodicRate,
    scheduledPaymentsCount,
    ioPeriods,
    input.paymentFrequency,
    input.startDate,
    0,
    input.extraPaymentFrequency,
    0,
    1
  );

  const actualRun = hasExtraPayments
    ? buildLoanLedger(
        amountFinancedCents,
        periodicRate,
        scheduledPaymentsCount,
        ioPeriods,
        input.paymentFrequency,
        input.startDate,
        recurringExtraCents,
        input.extraPaymentFrequency,
        oneTimeExtraCents,
        input.oneTimeExtraPeriod
      )
    : baselineRun;

  const totalPaidAndInterestNumerator =
    actualRun.totalPrincipalCents + actualRun.totalInterestCents;
  const principalRatioPercent =
    totalPaidAndInterestNumerator > 0
      ? Number(((actualRun.totalPrincipalCents / totalPaidAndInterestNumerator) * 100).toFixed(1))
      : 100;
  const interestRatioPercent = Number((100 - principalRatioPercent).toFixed(1));

  const interestSavingsCents = Math.max(
    0,
    baselineRun.totalInterestCents - actualRun.totalInterestCents
  );

  const payoffDate =
    actualRun.rows.length > 0
      ? actualRun.rows[actualRun.rows.length - 1].paymentDate
      : input.startDate;
  const baselinePayoffDate =
    baselineRun.rows.length > 0
      ? baselineRun.rows[baselineRun.rows.length - 1].paymentDate
      : input.startDate;

  return {
    currency: input.currency,
    loanMode: input.loanMode,
    paymentFrequency: input.paymentFrequency,
    paymentsPerYear,
    originalLoanAmount: fromCents(loanAmountCents),
    originationFeeAmount: fromCents(originationFeeCents),
    financedFeeAmount: fromCents(financedFeeCents),
    upfrontFeeAmount: fromCents(upfrontFeeCents),
    amountFinanced: fromCents(amountFinancedCents),
    annualInterestRate: input.annualInterestRate,
    periodicInterestRate: periodicRate,
    totalMonths,
    scheduledPaymentsCount,
    interestOnlyMonths,
    interestOnlyPeriods: ioPeriods,
    actualPaymentsCount: actualRun.rows.length,
    paymentsSaved: Math.max(0, baselineRun.rows.length - actualRun.rows.length),
    regularPayment: fromCents(actualRun.initialRegularPaymentCents),
    postInterestOnlyPayment:
      actualRun.postInterestOnlyPaymentCents !== null
        ? fromCents(actualRun.postInterestOnlyPaymentCents)
        : null,
    finalPayment: fromCents(actualRun.finalPaymentCents),
    totalRegularPayments: fromCents(actualRun.totalRegularCents),
    totalExtraPayments: fromCents(actualRun.totalExtraCents),
    totalPaid: fromCents(actualRun.totalPaymentCents),
    totalCostWithFees: fromCents(actualRun.totalPaymentCents + upfrontFeeCents),
    totalInterest: fromCents(actualRun.totalInterestCents),
    baselineTotalInterest: fromCents(baselineRun.totalInterestCents),
    interestSavings: fromCents(interestSavingsCents),
    hasExtraPayments,
    remainingBalanceAfterIo:
      actualRun.remainingBalanceAfterIoCents !== null
        ? fromCents(actualRun.remainingBalanceAfterIoCents)
        : null,
    remainingBalanceAtEnd: fromCents(actualRun.endingBalanceCents),
    startDate: input.startDate,
    payoffDate,
    baselinePayoffDate,
    principalRatioPercent,
    interestRatioPercent,
    schedule: actualRun.rows,
    yearlySchedule: summarizeByYear(actualRun.rows),
    scheduleTotals: {
      regularPayment: fromCents(actualRun.totalRegularCents),
      extraPayment: fromCents(actualRun.totalExtraCents),
      totalPayment: fromCents(actualRun.totalPaymentCents),
      totalPrincipal: fromCents(actualRun.totalPrincipalCents),
      totalInterest: fromCents(actualRun.totalInterestCents),
    },
    balanceCurve: buildBalanceCurve(amountFinancedCents, actualRun, baselineRun),
  };
}

export function buildLoanAmortizationCsv(
  result: LoanResult,
  view: 'period' | 'yearly',
  currency: SupportedCurrency
): string {
  const rows: string[] = [];
  const freqLabel = getFrequencyPeriodLabel(result.paymentFrequency);

  if (view === 'period') {
    rows.push(
      [
        'Payment #',
        'Payment Date',
        'Phase',
        `Beginning Balance (${currency})`,
        `Regular Payment (${currency})`,
        `Extra Payment (${currency})`,
        `Total Payment (${currency})`,
        `Principal Paid (${currency})`,
        `Interest Paid (${currency})`,
        `Ending Balance (${currency})`,
      ]
        .map(escapeCsvCell)
        .join(',')
    );

    for (const row of result.schedule) {
      rows.push(
        [
          row.periodNumber,
          row.paymentDate,
          row.phase === 'interest-only' ? 'Interest-Only' : 'Amortized',
          row.beginningBalance.toFixed(2),
          row.regularPayment.toFixed(2),
          row.extraPayment.toFixed(2),
          row.totalPayment.toFixed(2),
          row.principalPaid.toFixed(2),
          row.interestPaid.toFixed(2),
          row.endingBalance.toFixed(2),
        ]
          .map(escapeCsvCell)
          .join(',')
      );
    }

    rows.push(
      [
        'Total',
        `${result.actualPaymentsCount} ${freqLabel.toLowerCase()} payments`,
        '',
        '',
        result.scheduleTotals.regularPayment.toFixed(2),
        result.scheduleTotals.extraPayment.toFixed(2),
        result.scheduleTotals.totalPayment.toFixed(2),
        result.scheduleTotals.totalPrincipal.toFixed(2),
        result.scheduleTotals.totalInterest.toFixed(2),
        result.remainingBalanceAtEnd.toFixed(2),
      ]
        .map(escapeCsvCell)
        .join(',')
    );
  } else {
    rows.push(
      [
        'Year',
        'Payments',
        `Beginning Balance (${currency})`,
        `Regular Payments (${currency})`,
        `Extra Payments (${currency})`,
        `Total Payment (${currency})`,
        `Principal Paid (${currency})`,
        `Interest Paid (${currency})`,
        `Ending Balance (${currency})`,
      ]
        .map(escapeCsvCell)
        .join(',')
    );

    for (const row of result.yearlySchedule) {
      rows.push(
        [
          row.year,
          row.paymentsCount,
          row.beginningBalance.toFixed(2),
          row.regularPayment.toFixed(2),
          row.extraPayment.toFixed(2),
          row.totalPayment.toFixed(2),
          row.principalPaid.toFixed(2),
          row.interestPaid.toFixed(2),
          row.endingBalance.toFixed(2),
        ]
          .map(escapeCsvCell)
          .join(',')
      );
    }

    rows.push(
      [
        'Total',
        result.actualPaymentsCount,
        '',
        result.scheduleTotals.regularPayment.toFixed(2),
        result.scheduleTotals.extraPayment.toFixed(2),
        result.scheduleTotals.totalPayment.toFixed(2),
        result.scheduleTotals.totalPrincipal.toFixed(2),
        result.scheduleTotals.totalInterest.toFixed(2),
        result.remainingBalanceAtEnd.toFixed(2),
      ]
        .map(escapeCsvCell)
        .join(',')
    );
  }

  return rows.join('\r\n');
}

export function buildLoanSummaryText(input: LoanInput, result: LoanResult): string {
  const fmt = (val: number) => formatCurrencyValue(val, result.currency);
  const freqLabel = getFrequencyPeriodLabel(result.paymentFrequency);
  const suffix = getFrequencyUnitSuffix(result.paymentFrequency);

  const lines = [
    'Loan Estimate — Omega Calculators',
    `Loan Type: ${result.loanMode === 'interest-only' ? 'Interest-Only' : 'Amortized'}`,
    `Original Loan Amount: ${fmt(result.originalLoanAmount)}`,
    `APR & Schedule: ${result.annualInterestRate}% APR, ${result.actualPaymentsCount} ${freqLabel.toLowerCase()} payments`,
    `Amount Financed: ${fmt(result.amountFinanced)}`,
  ];

  if (result.originationFeeAmount > 0) {
    lines.push(
      `Origination Fee (${input.feeInclusion === 'finance' ? 'financed' : 'upfront'}): ${fmt(result.originationFeeAmount)}`
    );
  }

  lines.push('---');
  lines.push(
    result.loanMode === 'interest-only'
      ? `Interest-Only Payment: ${fmt(result.regularPayment)} ${suffix}`
      : `Estimated Regular Payment: ${fmt(result.regularPayment)} ${suffix}`
  );

  if (result.postInterestOnlyPayment !== null) {
    lines.push(`Post-I/O Amortized Payment: ${fmt(result.postInterestOnlyPayment)} ${suffix}`);
  }

  lines.push(`Total Interest: ${fmt(result.totalInterest)}`);
  lines.push(`Total Scheduled Payments: ${fmt(result.totalPaid)}`);
  lines.push(`Remaining Balance at End: ${fmt(result.remainingBalanceAtEnd)}`);

  if (result.interestSavings > 0) {
    lines.push(
      `Interest Savings from Extra Payments: ${fmt(result.interestSavings)} (${result.paymentsSaved} fewer payments)`
    );
  }

  lines.push(`Estimated Payoff / End Date: ${formatDisplayDate(result.payoffDate)}`);
  lines.push('Note: Estimate only, not a lender offer.');
  return lines.join('\n');
}
