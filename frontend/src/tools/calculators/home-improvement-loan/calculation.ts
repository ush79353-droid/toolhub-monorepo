import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { AnnualChartPoint } from './types';

export function formatHomeImprovementMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Display APR with up to 3 decimals; trim trailing zeros. */
export function formatAprPercent(apr: number): string {
  if (!Number.isFinite(apr)) return '—';
  const rounded = Math.round(apr * 1000) / 1000;
  const text = String(rounded);
  return text.replace(/\.?0+$/, '') || '0';
}

export function formatLoanTermLabel(years: number, months: number): string {
  const y = Math.max(0, Math.floor(years));
  const m = Math.max(0, Math.floor(months));
  if (y === 0 && m === 0) return '0 months';
  if (m === 0) return `${y} year${y === 1 ? '' : 's'}`;
  if (y === 0) return `${m} month${m === 1 ? '' : 's'}`;
  return `${y} year${y === 1 ? '' : 's'} ${m} month${m === 1 ? '' : 's'}`;
}

/** n = Years × 12 + Months */
export function termToPaymentCount(
  termYears: number,
  termMonths: number
): number | null {
  if (![termYears, termMonths].every(Number.isFinite)) return null;
  if (termYears < 0 || termMonths < 0) return null;
  const n = Math.round(termYears * 12 + termMonths);
  return n > 0 ? n : null;
}

/** Application Fee = Loan Amount × Fee% / 100 */
export function applicationFeeFromPercent(
  loanAmount: number,
  feePercent: number
): number {
  return (loanAmount * feePercent) / 100;
}

export function applicationFeePercentFromAmount(
  loanAmount: number,
  feeAmount: number
): number | null {
  if (!(loanAmount > 0)) return null;
  return (feeAmount / loanAmount) * 100;
}

/**
 * r = Annual Interest Rate / 1200
 * Monthly Payment = P × r / (1 − (1+r)^(-n)); zero interest → P / n
 */
export function calculateMonthlyPayment(input: {
  principal: number;
  annualRatePercent: number;
  paymentCount: number;
}): number | null {
  const { principal, annualRatePercent, paymentCount } = input;
  if (![principal, annualRatePercent, paymentCount].every(Number.isFinite)) {
    return null;
  }
  if (!(principal > 0) || !(paymentCount > 0) || annualRatePercent < 0) {
    return null;
  }

  const r = annualRatePercent / 1200;
  if (r === 0) {
    const payment = principal / paymentCount;
    return Number.isFinite(payment) ? payment : null;
  }

  const denom = 1 - Math.pow(1 + r, -paymentCount);
  if (!(denom > 0)) return null;
  const payment = (principal * r) / denom;
  return Number.isFinite(payment) ? payment : null;
}

/**
 * Fee-adjusted APR via cash-flow IRR (bisection on monthly rate).
 * netProceeds = loan − applicationFee − homeLoanFees
 * monthlyCashflow = scheduled monthly payment on the note principal
 * Solve netProceeds = monthlyCashflow × annuity(i, n); APR = 12 × i × 100
 */
export function solveFeeAdjustedApr(input: {
  netProceeds: number;
  monthlyCashflow: number;
  paymentCount: number;
}): number | null {
  const { netProceeds, monthlyCashflow, paymentCount } = input;
  if (!(netProceeds > 0) || !(paymentCount > 0)) return null;
  if (!(monthlyCashflow > 0) || !Number.isFinite(monthlyCashflow)) return null;

  const totalPaid = monthlyCashflow * paymentCount;
  if (totalPaid <= netProceeds) return 0;

  const pv = (rate: number): number => {
    if (Math.abs(rate) < 1e-15) return monthlyCashflow * paymentCount;
    return (monthlyCashflow * (1 - Math.pow(1 + rate, -paymentCount))) / rate;
  };

  let low = 0;
  let high = 1;
  for (let i = 0; i < 24 && pv(high) > netProceeds; i += 1) {
    high *= 2;
  }

  for (let i = 0; i < 120; i += 1) {
    const mid = (low + high) / 2;
    if (pv(mid) > netProceeds) low = mid;
    else high = mid;
  }

  const monthlyRate = (low + high) / 2;
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) return null;
  const apr = monthlyRate * 12 * 100;
  return Number.isFinite(apr) ? apr : null;
}

export interface AmortizationTotals {
  totalInterest: number;
  chartPoints: AnnualChartPoint[];
}

/**
 * Full-precision amortization schedule → interest total + annual chart series
 * (loan balance, cumulative principal paid, cumulative interest paid).
 */
export function buildAmortizationTotals(input: {
  principal: number;
  monthlyPayment: number;
  annualRatePercent: number;
  paymentCount: number;
}): AmortizationTotals | null {
  const { principal, monthlyPayment, annualRatePercent, paymentCount } = input;
  if (
    ![principal, monthlyPayment, annualRatePercent, paymentCount].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(principal > 0) || !(paymentCount > 0) || !(monthlyPayment > 0)) {
    return null;
  }

  const r = annualRatePercent / 1200;
  const chartPoints: AnnualChartPoint[] = [
    {
      year: 0,
      loanBalance: principal,
      principalPaid: 0,
      interestPaid: 0,
    },
  ];

  let balance = principal;
  let cumPrincipal = 0;
  let cumInterest = 0;

  for (let period = 1; period <= paymentCount; period += 1) {
    if (!(balance > 1e-12)) break;

    const interest = balance * r;
    if (!Number.isFinite(interest)) return null;

    let principalPaid = monthlyPayment - interest;
    if (principalPaid < 0) principalPaid = 0;
    if (principalPaid > balance) principalPaid = balance;

    balance -= principalPaid;
    if (balance < 1e-10) balance = 0;

    cumPrincipal += principalPaid;
    cumInterest += interest;

    const yearEnd = period % 12 === 0 || period === paymentCount;
    if (yearEnd) {
      chartPoints.push({
        year: period / 12,
        loanBalance: balance,
        principalPaid: cumPrincipal,
        interestPaid: cumInterest,
      });
    }
  }

  return {
    totalInterest: cumInterest,
    chartPoints,
  };
}

export interface HomeImprovementLoanEngineInput {
  principal: number;
  termYears: number;
  termMonths: number;
  annualRatePercent: number;
  applicationFee: number;
  homeLoanFees: number;
}

export interface HomeImprovementLoanEngineResult {
  monthlyPayment: number;
  aprPercent: number;
  paymentCount: number;
  termYears: number;
  termMonths: number;
  loanPrincipal: number;
  totalInterest: number;
  loanFees: number;
  applicationFee: number;
  homeLoanFees: number;
  totalPayments: number;
  chartPoints: AnnualChartPoint[];
}

/**
 * Home improvement loan engine (loan-currency amounts, full precision).
 * Application fee and home loan fees are up-front costs — counted once in
 * loanFees / APR net proceeds / total payments (never double-counted with %).
 */
export function calculateHomeImprovementLoan(
  input: HomeImprovementLoanEngineInput
): HomeImprovementLoanEngineResult | null {
  const {
    principal,
    termYears,
    termMonths,
    annualRatePercent,
    applicationFee,
    homeLoanFees,
  } = input;

  if (
    ![
      principal,
      termYears,
      termMonths,
      annualRatePercent,
      applicationFee,
      homeLoanFees,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(principal > 0) || annualRatePercent < 0) return null;
  if (applicationFee < 0 || homeLoanFees < 0) return null;

  const paymentCount = termToPaymentCount(termYears, termMonths);
  if (paymentCount === null) return null;

  const monthlyPayment = calculateMonthlyPayment({
    principal,
    annualRatePercent,
    paymentCount,
  });
  if (monthlyPayment === null) return null;

  const loanFees = applicationFee + homeLoanFees;
  const netProceeds = principal - loanFees;
  if (!(netProceeds > 0)) return null;

  const aprPercent = solveFeeAdjustedApr({
    netProceeds,
    monthlyCashflow: monthlyPayment,
    paymentCount,
  });
  if (aprPercent === null) return null;

  const amort = buildAmortizationTotals({
    principal,
    monthlyPayment,
    annualRatePercent,
    paymentCount,
  });
  if (amort === null) return null;

  const totalPayments = monthlyPayment * paymentCount + loanFees;
  if (!Number.isFinite(totalPayments)) return null;

  return {
    monthlyPayment,
    aprPercent,
    paymentCount,
    termYears,
    termMonths,
    loanPrincipal: principal,
    totalInterest: amort.totalInterest,
    loanFees,
    applicationFee,
    homeLoanFees,
    totalPayments,
    chartPoints: amort.chartPoints,
  };
}
