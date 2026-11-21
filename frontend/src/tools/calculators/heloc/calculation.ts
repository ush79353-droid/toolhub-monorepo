import {
  calculateMonthlyMortgagePayment,
  monthlyInterestRate,
} from '@/tools/shared/mortgage';
import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type {
  HelocAdjustmentType,
  HelocChartPoint,
  HelocScheduleRow,
} from './types';

const BALANCE_TOL = 0.01;

export function yearsToMonths(years: number): number | null {
  if (!Number.isFinite(years) || years < 0) return null;
  const months = Math.round(years * 12);
  if (!Number.isFinite(months) || months < 0) return null;
  return months;
}

export function calculateUpfrontFees(
  balance: number,
  feePercent: number,
  feeFixed: number
): number | null {
  if (
    !Number.isFinite(balance) ||
    balance < 0 ||
    !Number.isFinite(feePercent) ||
    feePercent < 0 ||
    !Number.isFinite(feeFixed) ||
    feeFixed < 0
  ) {
    return null;
  }
  const total = balance * (feePercent / 100) + feeFixed;
  return Number.isFinite(total) ? total : null;
}

export function interestOnlyPayment(
  balance: number,
  annualRatePercent: number
): number | null {
  if (
    !Number.isFinite(balance) ||
    balance < 0 ||
    !Number.isFinite(annualRatePercent) ||
    annualRatePercent < 0
  ) {
    return null;
  }
  const payment = balance * monthlyInterestRate(annualRatePercent);
  return Number.isFinite(payment) ? payment : null;
}

/**
 * Annual rate for each month 1..totalMonths.
 * Months 1..firstAdjMonths keep initial rate; first change applies at month firstAdjMonths+1.
 */
export function generateRateSchedule(params: {
  totalMonths: number;
  initialRate: number;
  adjustmentType: HelocAdjustmentType;
  expectedAdjustment: number;
  firstAdjustmentAfterYears: number;
  adjustmentIntervalMonths: number;
  maximumInterestRate: number;
}): number[] | null {
  const {
    totalMonths,
    initialRate,
    adjustmentType,
    expectedAdjustment,
    firstAdjustmentAfterYears,
    adjustmentIntervalMonths,
    maximumInterestRate,
  } = params;

  if (
    !Number.isFinite(totalMonths) ||
    totalMonths <= 0 ||
    !Number.isFinite(initialRate) ||
    initialRate < 0
  ) {
    return null;
  }

  const rates: number[] = new Array(totalMonths);

  if (adjustmentType === 'none') {
    for (let i = 0; i < totalMonths; i++) rates[i] = initialRate;
    return rates;
  }

  if (
    !Number.isFinite(expectedAdjustment) ||
    !Number.isFinite(firstAdjustmentAfterYears) ||
    firstAdjustmentAfterYears < 0 ||
    !Number.isFinite(adjustmentIntervalMonths) ||
    adjustmentIntervalMonths <= 0 ||
    !Number.isInteger(adjustmentIntervalMonths) ||
    !Number.isFinite(maximumInterestRate) ||
    maximumInterestRate < 0
  ) {
    return null;
  }

  if (maximumInterestRate < initialRate && expectedAdjustment > 0) {
    return null;
  }

  const firstAdjMonths = yearsToMonths(firstAdjustmentAfterYears);
  if (firstAdjMonths === null) return null;

  let current = initialRate;
  for (let month = 1; month <= totalMonths; month++) {
    if (month > firstAdjMonths) {
      const monthsSinceFirst = month - firstAdjMonths - 1;
      if (monthsSinceFirst % adjustmentIntervalMonths === 0) {
        const uncapped = current + expectedAdjustment;
        current = Math.min(
          Math.max(0, uncapped),
          maximumInterestRate
        );
      }
    }
    rates[month - 1] = current;
  }
  return rates;
}

export interface HelocCanonicalInput {
  currentBalance: number;
  drawMonths: number;
  repaymentMonths: number;
  initialInterestRate: number;
  upfrontFeePercent: number;
  upfrontFeeFixed: number;
  annualFee: number;
  adjustmentType: HelocAdjustmentType;
  expectedRateAdjustment: number;
  firstAdjustmentAfterYears: number;
  adjustmentIntervalMonths: number;
  maximumInterestRate: number;
}

export interface HelocCanonicalResult {
  initialPrincipal: number;
  drawMonths: number;
  repaymentMonths: number;
  totalMonths: number;
  initialDrawPayment: number;
  initialRepaymentPayment: number;
  drawPeriodInterest: number;
  repaymentPeriodInterest: number;
  totalInterest: number;
  upfrontFees: number;
  recurringFees: number;
  totalFees: number;
  financingCost: number;
  principalRepaid: number;
  totalCashOutflow: number;
  schedule: HelocScheduleRow[];
  chartPoints: HelocChartPoint[];
}

export function calculateHeloc(
  input: HelocCanonicalInput
): HelocCanonicalResult | null {
  const {
    currentBalance,
    drawMonths,
    repaymentMonths,
    initialInterestRate,
    upfrontFeePercent,
    upfrontFeeFixed,
    annualFee,
    adjustmentType,
    expectedRateAdjustment,
    firstAdjustmentAfterYears,
    adjustmentIntervalMonths,
    maximumInterestRate,
  } = input;

  if (
    !Number.isFinite(currentBalance) ||
    currentBalance < 0 ||
    !Number.isFinite(drawMonths) ||
    drawMonths < 0 ||
    !Number.isInteger(drawMonths) ||
    !Number.isFinite(repaymentMonths) ||
    repaymentMonths <= 0 ||
    !Number.isInteger(repaymentMonths) ||
    !Number.isFinite(initialInterestRate) ||
    initialInterestRate < 0 ||
    !Number.isFinite(annualFee) ||
    annualFee < 0
  ) {
    return null;
  }

  const upfrontFees = calculateUpfrontFees(
    currentBalance,
    upfrontFeePercent,
    upfrontFeeFixed
  );
  if (upfrontFees === null) return null;

  const totalMonths = drawMonths + repaymentMonths;
  const rates = generateRateSchedule({
    totalMonths,
    initialRate: initialInterestRate,
    adjustmentType,
    expectedAdjustment: expectedRateAdjustment,
    firstAdjustmentAfterYears,
    adjustmentIntervalMonths,
    maximumInterestRate,
  });
  if (rates === null || rates.length !== totalMonths) return null;

  const schedule: HelocScheduleRow[] = [];
  let balance = currentBalance;
  let cumInterest = 0;
  let cumPrincipal = 0;
  let cumFees = upfrontFees;
  let drawPeriodInterest = 0;
  let repaymentPeriodInterest = 0;
  let recurringFees = 0;
  let repaymentPayment = 0;
  let initialRepaymentPayment = 0;

  const initialDrawPayment =
    drawMonths > 0
      ? interestOnlyPayment(currentBalance, rates[0]!) ?? 0
      : 0;

  for (let month = 1; month <= totalMonths; month++) {
    const phase = month <= drawMonths ? 'draw' : 'repayment';
    const annualRate = rates[month - 1]!;
    const beginningBalance = balance;
    const r = monthlyInterestRate(annualRate);
    const interest = beginningBalance * r;

    let principal = 0;
    let payment = 0;

    if (phase === 'draw') {
      payment = interest;
      principal = 0;
      drawPeriodInterest += interest;
    } else {
      const remainingMonths = totalMonths - month + 1;
      const prevRate = month > 1 ? rates[month - 2]! : annualRate;
      const enteringRepayment = month === drawMonths + 1;
      const rateChanged = month > 1 && annualRate !== prevRate;

      if (enteringRepayment || rateChanged || repaymentPayment === 0) {
        const nextPay = calculateMonthlyMortgagePayment(
          beginningBalance,
          annualRate,
          remainingMonths
        );
        if (nextPay === null) return null;
        repaymentPayment = nextPay;
        if (enteringRepayment) initialRepaymentPayment = nextPay;
      }

      if (remainingMonths === 1) {
        payment = beginningBalance + interest;
        principal = beginningBalance;
      } else {
        payment = repaymentPayment;
        principal = Math.min(beginningBalance, Math.max(0, payment - interest));
        // If payment < interest (shouldn't happen with proper amort), pay interest only
        if (payment < interest) {
          payment = interest;
          principal = 0;
        }
      }
      repaymentPeriodInterest += interest;
    }

    // Annual fee on anniversary months (12, 24, …) within the modeled term
    const fee = month % 12 === 0 ? annualFee : 0;
    if (fee > 0) {
      recurringFees += fee;
      cumFees += fee;
    }

    balance = Math.max(0, beginningBalance - principal);
    if (balance < BALANCE_TOL) balance = 0;

    cumInterest += interest;
    cumPrincipal += principal;

    schedule.push({
      month,
      phase,
      annualInterestRate: annualRate,
      beginningBalance,
      monthlyInterest: interest,
      monthlyPrincipal: principal,
      scheduledPayment: payment,
      fees: fee,
      totalCashOutflow: payment + fee,
      endingBalance: balance,
      cumulativeInterest: cumInterest,
      cumulativePrincipal: cumPrincipal,
      cumulativeFees: cumFees,
    });
  }

  // Force final balance cleanup for float drift
  const last = schedule[schedule.length - 1];
  if (last && last.endingBalance > 0 && last.endingBalance < 1) {
    last.monthlyPrincipal += last.endingBalance;
    last.scheduledPayment += last.endingBalance;
    last.totalCashOutflow += last.endingBalance;
    last.cumulativePrincipal += last.endingBalance;
    cumPrincipal += last.endingBalance;
    last.endingBalance = 0;
  }

  if (drawMonths === 0 && currentBalance > 0) {
    const firstRepay = calculateMonthlyMortgagePayment(
      currentBalance,
      rates[0]!,
      repaymentMonths
    );
    if (firstRepay === null) return null;
    initialRepaymentPayment = firstRepay;
  }

  const totalInterest = drawPeriodInterest + repaymentPeriodInterest;
  const totalFees = upfrontFees + recurringFees;
  const financingCost = totalInterest + totalFees;
  const principalRepaid = cumPrincipal;
  const totalCashOutflow = principalRepaid + totalInterest + totalFees;

  const chartPoints = buildChartPoints(schedule, drawMonths);

  return {
    initialPrincipal: currentBalance,
    drawMonths,
    repaymentMonths,
    totalMonths,
    initialDrawPayment,
    initialRepaymentPayment,
    drawPeriodInterest,
    repaymentPeriodInterest,
    totalInterest,
    upfrontFees,
    recurringFees,
    totalFees,
    financingCost,
    principalRepaid,
    totalCashOutflow,
    schedule,
    chartPoints,
  };
}

function buildChartPoints(
  schedule: HelocScheduleRow[],
  drawMonths: number
): HelocChartPoint[] {
  if (schedule.length === 0) {
    return [
      {
        year: 0,
        outstandingBalance: 0,
        cumulativeInterest: 0,
        cumulativePrincipal: 0,
      },
    ];
  }

  const points: HelocChartPoint[] = [
    {
      year: 0,
      outstandingBalance: schedule[0]!.beginningBalance,
      cumulativeInterest: 0,
      cumulativePrincipal: 0,
    },
  ];

  const totalMonths = schedule.length;
  const yearCount = Math.ceil(totalMonths / 12);
  for (let y = 1; y <= yearCount; y++) {
    const idx = Math.min(y * 12, totalMonths) - 1;
    const row = schedule[idx]!;
    points.push({
      year: y,
      outstandingBalance: row.endingBalance,
      cumulativeInterest: row.cumulativeInterest,
      cumulativePrincipal: row.cumulativePrincipal,
    });
  }

  // Ensure draw-boundary year is represented for chart marker consumers
  if (drawMonths > 0 && drawMonths % 12 !== 0) {
    const drawYear = drawMonths / 12;
    const row = schedule[drawMonths - 1]!;
    if (!points.some((p) => Math.abs(p.year - drawYear) < 1e-9)) {
      points.push({
        year: drawYear,
        outstandingBalance: row.endingBalance,
        cumulativeInterest: row.cumulativeInterest,
        cumulativePrincipal: row.cumulativePrincipal,
      });
      points.sort((a, b) => a.year - b.year);
    }
  }

  return points;
}

export function formatHelocMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatHelocRate(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rate);
}
