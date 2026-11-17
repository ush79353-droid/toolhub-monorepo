import type {
  PaymentAnnualRow,
  PaymentChartPoint,
  PaymentMode,
  PaymentScheduleRow,
} from './types';

/** Display money as USD (screenshot has no currency selector). */
export function formatPaymentUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPaymentUsdPlain(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Monthly rate r = Annual% / 1200.
 * Payment = P × r / (1 − (1+r)^(-n)); r = 0 → P/n.
 */
export function computeMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  numberOfPayments: number
): number | null {
  if (!(principal > 0) || !(numberOfPayments > 0)) return null;
  if (!Number.isFinite(principal) || !Number.isFinite(annualRatePercent)) return null;
  if (!(annualRatePercent >= 0)) return null;

  const r = annualRatePercent / 1200;
  if (r === 0) return principal / numberOfPayments;

  const denom = 1 - Math.pow(1 + r, -numberOfPayments);
  if (!(denom > 0) || !Number.isFinite(denom)) return null;
  const pmt = (principal * r) / denom;
  return Number.isFinite(pmt) ? pmt : null;
}

/**
 * Solve period count for a fixed monthly payment.
 * n = log(PMT / (PMT − P·r)) / log(1+r); r = 0 → P/PMT.
 * Returns null when the payment cannot amortize the loan.
 */
export function solveNumberOfPayments(
  principal: number,
  annualRatePercent: number,
  monthlyPayment: number
): number | null {
  if (!(principal > 0) || !(monthlyPayment > 0)) return null;
  if (!Number.isFinite(principal) || !Number.isFinite(monthlyPayment)) return null;
  if (!(annualRatePercent >= 0) || !Number.isFinite(annualRatePercent)) return null;

  const r = annualRatePercent / 1200;
  if (r === 0) {
    const n = principal / monthlyPayment;
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  // Payment must exceed first-month interest.
  if (!(monthlyPayment > principal * r)) return null;

  const ratio = monthlyPayment / (monthlyPayment - principal * r);
  if (!(ratio > 1) || !Number.isFinite(ratio)) return null;
  const n = Math.log(ratio) / Math.log(1 + r);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Full-precision monthly amortization. Final installment is adjusted to clear
 * the remaining balance (handles partial last payments).
 */
export function buildMonthlySchedule(
  principal: number,
  annualRatePercent: number,
  monthlyPayment: number,
  maxPeriods: number
): {
  rows: PaymentScheduleRow[];
  totalRepayment: number;
  totalInterest: number;
} | null {
  if (!(principal > 0) || !(monthlyPayment > 0) || !(maxPeriods > 0)) return null;
  if (!(annualRatePercent >= 0)) return null;

  const r = annualRatePercent / 1200;
  const rows: PaymentScheduleRow[] = [];
  let balance = principal;
  let totalRepayment = 0;
  let totalInterest = 0;
  const periodCap = Math.min(Math.ceil(maxPeriods) + 2, 1200 * 10);

  for (let period = 1; period <= periodCap && balance > 1e-9; period += 1) {
    const interest = balance * r;
    let payment = monthlyPayment;
    let principalPaid = payment - interest;

    if (principalPaid >= balance || period === periodCap) {
      principalPaid = balance;
      payment = interest + principalPaid;
    }

    if (!(payment > 0) || !Number.isFinite(payment)) return null;

    balance = Math.max(0, balance - principalPaid);
    // Snap tiny residual to zero.
    if (balance < 1e-8) balance = 0;

    totalRepayment += payment;
    totalInterest += interest;

    rows.push({
      period,
      interest,
      principal: principalPaid,
      payment,
      endingBalance: balance,
    });
  }

  if (rows.length === 0) return null;
  if (
    !rows.every((row) =>
      [row.interest, row.principal, row.payment, row.endingBalance].every(Number.isFinite)
    )
  ) {
    return null;
  }

  return { rows, totalRepayment, totalInterest };
}

export function aggregateAnnualSchedule(
  monthly: PaymentScheduleRow[]
): PaymentAnnualRow[] {
  const byYear = new Map<number, PaymentAnnualRow>();
  for (const row of monthly) {
    const year = Math.ceil(row.period / 12);
    const existing = byYear.get(year);
    if (!existing) {
      byYear.set(year, {
        year,
        interest: row.interest,
        principal: row.principal,
        endingBalance: row.endingBalance,
      });
    } else {
      existing.interest += row.interest;
      existing.principal += row.principal;
      existing.endingBalance = row.endingBalance;
    }
  }
  return [...byYear.values()].sort((a, b) => a.year - b.year);
}

/** Year-end chart series: balance, cumulative interest, cumulative payment. */
export function buildChartPoints(
  principal: number,
  monthly: PaymentScheduleRow[]
): PaymentChartPoint[] {
  const points: PaymentChartPoint[] = [
    { year: 0, balance: principal, cumulativeInterest: 0, cumulativePayment: 0 },
  ];
  let cumInterest = 0;
  let cumPayment = 0;
  const maxYear = Math.ceil(monthly.length / 12);
  for (let year = 1; year <= maxYear; year += 1) {
    const endPeriod = Math.min(year * 12, monthly.length);
    for (let i = (year - 1) * 12; i < endPeriod; i += 1) {
      cumInterest += monthly[i].interest;
      cumPayment += monthly[i].payment;
    }
    const last = monthly[endPeriod - 1];
    points.push({
      year,
      balance: last.endingBalance,
      cumulativeInterest: cumInterest,
      cumulativePayment: cumPayment,
    });
  }
  return points;
}

export function calculatePayment(input: {
  mode: PaymentMode;
  principal: number;
  annualRatePercent: number;
  loanTermYears: number;
  fixedMonthlyPayment: number;
}): {
  monthlyPayment: number;
  numberOfPayments: number;
  totalRepayment: number;
  totalInterest: number;
  termYearsDisplay: number;
  monthlySchedule: PaymentScheduleRow[];
  annualSchedule: PaymentAnnualRow[];
  chartPoints: PaymentChartPoint[];
} | null {
  const { mode, principal, annualRatePercent } = input;
  if (!(principal > 0) || !(annualRatePercent >= 0)) return null;

  let monthlyPayment: number;
  let plannedPeriods: number;

  if (mode === 'fixed-term') {
    if (!(input.loanTermYears > 0)) return null;
    plannedPeriods = Math.round(input.loanTermYears * 12);
    if (!(plannedPeriods > 0)) return null;
    const pmt = computeMonthlyPayment(principal, annualRatePercent, plannedPeriods);
    if (pmt === null || !(pmt > 0)) return null;
    monthlyPayment = pmt;
  } else {
    if (!(input.fixedMonthlyPayment > 0)) return null;
    const nExact = solveNumberOfPayments(
      principal,
      annualRatePercent,
      input.fixedMonthlyPayment
    );
    if (nExact === null) return null;
    plannedPeriods = Math.ceil(nExact - 1e-12);
    if (!(plannedPeriods > 0)) return null;
    monthlyPayment = input.fixedMonthlyPayment;
  }

  const built = buildMonthlySchedule(
    principal,
    annualRatePercent,
    monthlyPayment,
    plannedPeriods
  );
  if (!built) return null;

  const numberOfPayments = built.rows.length;
  const termYearsDisplay = numberOfPayments / 12;

  return {
    monthlyPayment:
      mode === 'fixed-term'
        ? monthlyPayment
        : built.rows.length > 0
          ? // Display the contracted payment (last may be partial).
            monthlyPayment
          : monthlyPayment,
    numberOfPayments,
    totalRepayment: built.totalRepayment,
    totalInterest: built.totalInterest,
    termYearsDisplay,
    monthlySchedule: built.rows,
    annualSchedule: aggregateAnnualSchedule(built.rows),
    chartPoints: buildChartPoints(principal, built.rows),
  };
}
